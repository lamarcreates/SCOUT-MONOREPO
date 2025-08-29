import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert address string to coordinates using a simple geocoding provider (placeholder)
// In production, replace with a proper provider (e.g., Google, Mapbox) on the server.
export async function geocodeToCoords(address: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ScoutApp/1.0 (contact@example.com)' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const best = data[0];
    return { latitude: parseFloat(best.lat), longitude: parseFloat(best.lon) };
  } catch {
    return null;
  }
}

export function milesToMeters(miles: number): number {
  return miles * 1609.34;
}
