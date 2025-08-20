import { NextResponse } from 'next/server';
import type { InventoryResponse, VehicleSearchCriteria } from '@scout-workspace/types';
import { mockVehicles } from '@scout-workspace/utils';

export async function POST(req: Request) {
  try {
    const criteria: VehicleSearchCriteria = await req.json();
    
    // Start with all vehicles
    let filteredVehicles = [...mockVehicles];
    
    // Apply filters
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
          priceMax: criteria.priceMax
        },
        message
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