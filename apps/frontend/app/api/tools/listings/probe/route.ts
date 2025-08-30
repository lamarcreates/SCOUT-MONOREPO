import { NextResponse } from 'next/server';
import { getListingsProvider } from '@/lib/listings-provider';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const make = url.searchParams.get('make') || undefined;
    const model = url.searchParams.get('model') || undefined;
    const location = url.searchParams.get('location') || undefined;
    const zip = url.searchParams.get('zip') || undefined;
    const priceMax = url.searchParams.get('priceMax');
    const priceMin = url.searchParams.get('priceMin');
    const radiusMiles = url.searchParams.get('radiusMiles');

    const criteria: any = {
      make,
      model,
      priceMax: priceMax != null ? Number(priceMax) : undefined,
      priceMin: priceMin != null ? Number(priceMin) : undefined,
      radiusMiles: radiusMiles != null ? Number(radiusMiles) : 25,
      limit: 15,
    };

    if (zip) criteria.zip = zip;

    if (!zip && location) {
      try {
        const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
        const geoRes = await fetch(geoUrl, { headers: { 'User-Agent': 'ScoutApp/1.0 (contact@example.com)' }, cache: 'no-store' });
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

    return NextResponse.json({
      ok: true,
      total: total ?? vehicles.length,
      sample: vehicles.slice(0, 5).map(v => ({
        id: v.id,
        year: v.year,
        make: v.make,
        model: v.model,
        price: v.price,
        city: v.city,
        state: v.state,
        zip: v.zip,
        dealerName: v.dealerName
      })),
      criteria
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'probe failed' }, { status: 500 });
  }
}


