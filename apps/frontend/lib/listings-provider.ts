import type { Vehicle, VehicleSearchCriteria } from '@/lib/tools-types';

export interface ListingsProviderResult {
  vehicles: Vehicle[];
  total?: number;
}

export interface ListingsProvider {
  search(criteria: VehicleSearchCriteria & { limit?: number }): Promise<ListingsProviderResult>;
}

export class MarketCheckProvider implements ListingsProvider {
  private readonly baseUrl = process.env.MARKETCHECK_BASE_URL || 'https://api.marketcheck.com';
  private readonly apiKey = process.env.MARKETCHECK_API_KEY || '';

  async search(criteria: VehicleSearchCriteria & { limit?: number }): Promise<ListingsProviderResult> {
    if (!this.apiKey) {
      return { vehicles: [] };
    }

    const url = new URL('/v2/search/car/active', this.baseUrl);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('rows', String(criteria.limit ?? 50));
    if (criteria.make) url.searchParams.set('make', criteria.make);
    if (criteria.model) url.searchParams.set('model', criteria.model);
    if (criteria.yearMin || criteria.yearMax) {
      const min = criteria.yearMin ?? criteria.year ?? '';
      const max = criteria.yearMax ?? '';
      if (min || max) url.searchParams.set('year_range', `${min || ''}-${max || ''}`);
    } else if (criteria.year) {
      url.searchParams.set('year', String(criteria.year));
    }
    if (criteria.latitude && criteria.longitude) {
      url.searchParams.set('latitude', String(criteria.latitude));
      url.searchParams.set('longitude', String(criteria.longitude));
      if (criteria.radiusMiles) url.searchParams.set('radius', String(criteria.radiusMiles));
    }
    if ((criteria as any).zip) {
      url.searchParams.set('zip', String((criteria as any).zip));
      if (criteria.radiusMiles) url.searchParams.set('radius', String(criteria.radiusMiles));
    }
    if (criteria.priceMin || criteria.priceMax) {
      const min = criteria.priceMin ?? '';
      const max = criteria.priceMax ?? '';
      url.searchParams.set('price_range', `${min || ''}-${max || ''}`);
    }

    const res = await fetch(url.toString(), { headers: { 'Accept': 'application/json' }, cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('MarketCheck error', res.status, text);
      return { vehicles: [] };
    }
    const data = await res.json();
    const listings: any[] = Array.isArray(data?.listings) ? data.listings : [];
    const vehicles: Vehicle[] = listings.map((it) => ({
      id: String(it.id || it.vin || crypto.randomUUID()),
      make: it.build?.make || it.make || 'Unknown',
      model: it.build?.model || it.model || 'Unknown',
      year: Number(it.build?.year || it.year || 0),
      price: Number(it.price || 0),
      type: (it.body_type || it.build?.body_type || 'Sedan') as Vehicle['type'],
      image: (it.media?.photo_links && it.media.photo_links[0]) || it.image_url || '/placeholder.svg',
      latitude: typeof it.dealer?.latitude === 'number' ? it.dealer.latitude : undefined,
      longitude: typeof it.dealer?.longitude === 'number' ? it.dealer.longitude : undefined,
      dealerId: it.dealer?.id ? String(it.dealer.id) : undefined,
      dealerName: it.dealer?.name,
      city: it.dealer?.city || it.city,
      state: it.dealer?.state || it.state,
      zip: it.dealer?.zip || it.zip,
      features: Array.isArray(it.extra?.options) ? it.extra.options : [],
      available: true,
      stock: 1,
      vin: it.vin,
      mileage: typeof it.miles === 'number' ? it.miles : undefined,
      transmission: it.transmission,
      drivetrain: it.drivetrain as Vehicle['drivetrain'] | undefined,
      engine: it.engine,
      condition: (it.inventory_type || it.seller_type || 'Used') as Vehicle['condition']
    }));

    return { vehicles, total: typeof data?.num_found === 'number' ? data.num_found : vehicles.length };
  }
}

export function getListingsProvider(): ListingsProvider {
  // Default to MarketCheck; can be extended to choose via env
  return new MarketCheckProvider();
}


