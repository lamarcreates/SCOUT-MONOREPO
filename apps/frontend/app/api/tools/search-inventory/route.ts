import { NextResponse } from 'next/server';
import type { InventoryResponse, VehicleSearchCriteria, Vehicle } from '@/lib/tools-types';
import { mockVehicles } from '@/lib/mock-data';

const AUTODEV_BASE = 'https://api.auto.dev';

async function fetchAutoDevListings(params: VehicleSearchCriteria & { limit?: number; offset?: number }) {
  const apiKey = process.env.AUTODEV_API_KEY;
  if (!apiKey) return null;

  const query: Record<string, string> = {};
  if (params.make) query.make = params.make;
  if (params.model) query.model = params.model;
  if (params.year) query.year = String(params.year);
  if (params.yearMin) query.year_min = String(params.yearMin);
  if (params.yearMax) query.year_max = String(params.yearMax);
  if (params.priceMin) query.price_min = String(params.priceMin);
  if (params.priceMax) query.price_max = String(params.priceMax);
  if (params.latitude && params.longitude) {
    query.lat = String(params.latitude);
    query.lon = String(params.longitude);
    if (params.radiusMiles) query.radius_miles = String(params.radiusMiles);
  }
  if (params.limit) query.limit = String(params.limit);
  if (params.offset) query.offset = String(params.offset);

  const url = new URL('/listings', AUTODEV_BASE);
  Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`Auto.dev error ${res.status}`);
  const data = await res.json();
  return data;
}

function pickPrice(item: any): number {
  const candidates = [
    item.retail?.price,
    item.retailPrice,
    item.listPrice,
    item.price,
    item.pricing?.retail,
    item.pricing?.list,
    item.priceUsd,
  ];
  const val = candidates.find((v) => typeof v === 'number' && isFinite(v) && v > 0);
  return typeof val === 'number' ? val : 0;
}

function mapAutoDevToVehicle(item: any): Vehicle {
  return {
    id: String(item.id ?? item.vin ?? crypto.randomUUID()),
    make: item.make ?? item.vehicle?.make ?? 'Unknown',
    model: item.model ?? item.vehicle?.model ?? 'Unknown',
    year: Number(item.year ?? item.vehicle?.year ?? 0),
    price: pickPrice(item),
    type: (item.bodyType ?? item.vehicle?.bodyType ?? 'Sedan') as Vehicle['type'],
    image: item.images?.[0]?.url || item.imageUrl || item.photoUrl || item.photos?.[0]?.url || '/placeholder.svg',
    latitude: item.location?.lat ?? item.latitude,
    longitude: item.location?.lon ?? item.longitude,
    dealerId: item.dealer?.id ? String(item.dealer.id) : (item.dealership?.id ? String(item.dealership.id) : (item.seller?.id ? String(item.seller.id) : undefined)),
    dealerName: item.dealer?.name || item.dealership?.name || item.seller?.name || item.store?.name,
    city: item.location?.city,
    state: item.location?.state,
    zip: item.location?.zip,
    features: Array.isArray(item.features) ? item.features : [],
    available: true,
    stock: Number(item.stock ?? 1),
    vin: item.vin,
    mileage: item.mileage ? Number(item.mileage) : undefined,
    transmission: item.transmission,
    drivetrain: item.drivetrain as Vehicle['drivetrain'] | undefined,
    engine: item.engine,
    condition: (item.condition ?? 'Used') as Vehicle['condition']
  };
}

export async function POST(req: Request) {
  try {
    const criteria: VehicleSearchCriteria = await req.json();

    // If API key present, fetch from Auto.dev, otherwise fallback to mock
    let filteredVehicles: Vehicle[] = [];
    const useAutoDev = !!process.env.AUTODEV_API_KEY;
    let source: 'auto.dev' | 'mock' = 'mock';

    if (useAutoDev) {
      try {
        const autoData = await fetchAutoDevListings({ ...criteria, limit: 50 });
        const items: any[] = Array.isArray(autoData?.data) ? autoData.data : (Array.isArray(autoData?.listings) ? autoData.listings : []);
        filteredVehicles = items.map(mapAutoDevToVehicle);
        if (filteredVehicles.length > 0) source = 'auto.dev';
      } catch (e) {
        console.error('Auto.dev fetch failed, falling back to mock:', e);
        filteredVehicles = [...mockVehicles];
        source = 'mock';
      }
    } else {
      filteredVehicles = [...mockVehicles];
      source = 'mock';
    }
    
    // Apply additional filters locally
    if (criteria.make) {
      filteredVehicles = filteredVehicles.filter(v => 
        v.make.toLowerCase().includes(criteria.make!.toLowerCase())
      );
    }
    
    if (criteria.model) {
      filteredVehicles = filteredVehicles.filter(v => 
        v.model.toLowerCase().includes(criteria.model!.toLowerCase())
      );
    }
    
    if (criteria.year) {
      filteredVehicles = filteredVehicles.filter(v => v.year === criteria.year);
    }
    
    if (criteria.yearMin) {
      filteredVehicles = filteredVehicles.filter(v => v.year >= criteria.yearMin!);
    }
    
    if (criteria.yearMax) {
      filteredVehicles = filteredVehicles.filter(v => v.year <= criteria.yearMax!);
    }
    
    if (criteria.priceMin) {
      filteredVehicles = filteredVehicles.filter(v => v.price >= criteria.priceMin!);
    }
    
    if (criteria.priceMax) {
      filteredVehicles = filteredVehicles.filter(v => v.price <= criteria.priceMax!);
    }
    
    if (criteria.type) {
      filteredVehicles = filteredVehicles.filter(v => v.type === criteria.type);
    }
    
    if (criteria.condition) {
      filteredVehicles = filteredVehicles.filter(v => v.condition === criteria.condition);
    }
    
    if (criteria.available !== undefined) {
      filteredVehicles = filteredVehicles.filter(v => v.available === criteria.available);
    }
    
    if (criteria.mpgMin) {
      filteredVehicles = filteredVehicles.filter(v => {
        if (!v.mpg) return false;
        const avgMpg = (v.mpg.city + v.mpg.highway) / 2;
        return avgMpg >= criteria.mpgMin!;
      });
    }
    
    if (criteria.mileageMax) {
      filteredVehicles = filteredVehicles.filter(v => 
        !v.mileage || v.mileage <= criteria.mileageMax!
      );
    }
    
    if (criteria.features && criteria.features.length > 0) {
      filteredVehicles = filteredVehicles.filter(v => 
        criteria.features!.some(feature => 
          v.features.some(vFeature => 
            vFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    // If location search provided, filter by radius if records have coordinates
    if (criteria.latitude && criteria.longitude && criteria.radiusMiles) {
      const toRad = (deg: number) => deg * Math.PI / 180;
      const R = 3958.8; // miles
      const { latitude: lat0, longitude: lon0 } = criteria;
      filteredVehicles = filteredVehicles.filter(v => {
        if (typeof v.latitude !== 'number' || typeof v.longitude !== 'number') return true;
        const dLat = toRad(v.latitude - lat0!);
        const dLon = toRad(v.longitude - lon0!);
        const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat0!)) * Math.cos(toRad(v.latitude)) * Math.sin(dLon/2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = R * c;
        return dist <= criteria.radiusMiles!;
      });
    }
    
    // Sort by relevance (price for now, but could be more sophisticated)
    filteredVehicles.sort((a, b) => {
      // Prioritize available vehicles
      if (a.available && !b.available) return -1;
      if (!a.available && b.available) return 1;
      
      // Then sort by stock
      if (a.stock > b.stock) return -1;
      if (a.stock < b.stock) return 1;
      
      // Finally by price (lower first)
      return a.price - b.price;
    });
    
    // Build response message
    let message = '';
    if (filteredVehicles.length === 0) {
      message = 'No vehicles found matching your criteria. Try adjusting your search parameters.';
    } else if (filteredVehicles.length === 1) {
      const v = filteredVehicles[0];
      message = `Found 1 vehicle: ${v.year} ${v.make} ${v.model} for $${v.price.toLocaleString()}`;
    } else {
      message = `Found ${filteredVehicles.length} vehicles matching your criteria`;
      
      // Add price range info
      const prices = filteredVehicles.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice !== maxPrice) {
        message += ` ranging from $${minPrice.toLocaleString()} to $${maxPrice.toLocaleString()}`;
      }
    }
    
    // Limit results for chat context (can paginate if needed)
    const limitedVehicles = filteredVehicles.slice(0, 10);
    
    return NextResponse.json(
      {
        vehicles: limitedVehicles,
        total: filteredVehicles.length,
        filters: {
          make: criteria.make,
          model: criteria.model,
          type: criteria.type,
          priceMin: criteria.priceMin,
          priceMax: criteria.priceMax,
          latitude: criteria.latitude,
          longitude: criteria.longitude,
          radiusMiles: criteria.radiusMiles
        },
        message,
        source
      } as InventoryResponse,
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error searching inventory:', error);
    return NextResponse.json(
      { 
        vehicles: [],
        total: 0,
        filters: {},
        message: 'Failed to search inventory'
      } as InventoryResponse,
      { status: 500 }
    );
  }
}
