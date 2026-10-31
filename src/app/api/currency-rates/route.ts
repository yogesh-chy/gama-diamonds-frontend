import { NextResponse } from "next/server";

// Cache in memory for 15 minutes on server
let cachedRates: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_DURATION_MS = 15 * 60 * 1000;

export async function GET() {
  const now = Date.now();
  if (cachedRates && now - cachedRates.timestamp < CACHE_DURATION_MS) {
    return NextResponse.json({
      success: true,
      rates: cachedRates.rates,
      source: "cache",
      timestamp: cachedRates.timestamp,
    });
  }

  const endpoints = [
    "https://open.er-api.com/v6/latest/USD",
    "https://api.exchangerate-api.com/v4/latest/USD",
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(endpoint, {
        signal: controller.signal,
        next: { revalidate: 900 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.rates && typeof data.rates === "object") {
          cachedRates = {
            rates: data.rates,
            timestamp: now,
          };
          return NextResponse.json({
            success: true,
            rates: data.rates,
            source: "live",
            timestamp: now,
          });
        }
      }
    } catch {
      continue;
    }
  }

  // Fallback to cached even if expired
  if (cachedRates) {
    return NextResponse.json({
      success: true,
      rates: cachedRates.rates,
      source: "stale-cache",
      timestamp: cachedRates.timestamp,
    });
  }

  return NextResponse.json(
    { success: false, error: "Failed to fetch live exchange rates" },
    { status: 502 }
  );
}
