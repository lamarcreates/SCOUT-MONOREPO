import { NextResponse } from 'next/server';
import type { VehicleSearchCriteria, InventoryResponse } from '@/lib/tools-types';
import { getListingsProvider } from '@/lib/listings-provider';

export async function POST(req: Request) {
  try {
    const criteria: (VehicleSearchCriteria & { limit?: number }) & { location?: string; zip?: string | number } = await req.json();

    // Geocode free-form location if provided and coords missing
    if ((!criteria.latitude || !criteria.longitude) && criteria.location) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(criteria.location)}`;
        const geoRes = await fetch(url, { headers: { 'User-Agent': 'ScoutApp/1.0 (contact@example.com)' }, cache: 'no-store' });
        if (geoRes.ok) {
          const arr = await geoRes.json();
          if (Array.isArray(arr) && arr.length > 0) {
            criteria.latitude = parseFloat(arr[0].lat);
            criteria.longitude = parseFloat(arr[0].lon);
          }
        }
      } catch {}
    }
    const provider = getListingsProvider();
    const { vehicles, total } = await provider.search(criteria);

    // Optional local radius filter if provider returned coords
    let filtered = vehicles;
    if (criteria.latitude && criteria.longitude && criteria.radiusMiles) {
      const toRad = (deg: number) => deg * Math.PI / 180;
      const R = 3958.8;
      const { latitude: lat0, longitude: lon0 } = criteria;
      const withCoords = vehicles
        .filter(v => typeof v.latitude === 'number' && typeof v.longitude === 'number')
        .map(v => {
          const dLat = toRad(v.latitude! - lat0!);
          const dLon = toRad(v.longitude! - lon0!);
          const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat0!)) * Math.cos(toRad(v.latitude!)) * Math.sin(dLon/2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const dist = R * c;
          return { v, dist };
        })
        .filter(({ dist }) => dist <= criteria.radiusMiles!)
        .sort((a, b) => a.dist - b.dist)
        .map(({ v }) => v);
      if (withCoords.length > 0) filtered = withCoords;
    }

    return NextResponse.json({
      vehicles: filtered,
      total: total ?? filtered.length,
      filters: {
        make: criteria.make,
        model: criteria.model,
        priceMin: criteria.priceMin,
        priceMax: criteria.priceMax,
        latitude: criteria.latitude,
        longitude: criteria.longitude,
        radiusMiles: criteria.radiusMiles
      },
      source: 'marketcheck'
    } as InventoryResponse);
  } catch (error) {
    console.error('Listings route error:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}


