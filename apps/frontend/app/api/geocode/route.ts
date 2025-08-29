import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { address } = await req.json();
    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'address required' }, { status: 400 });
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ScoutApp/1.0 (contact@example.com)' }, cache: 'no-store' });
    if (!res.ok) throw new Error('geocode failed');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'no results' }, { status: 404 });
    }
    const best = data[0];
    return NextResponse.json({ latitude: parseFloat(best.lat), longitude: parseFloat(best.lon) });
  } catch (error) {
    console.error('Geocode error:', error);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

