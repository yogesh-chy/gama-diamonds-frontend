"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import {
  POPULAR_CURRENCIES,
  CURRENCY_LOCALE_MAP,
  formatIndianNumber,
  getCurrencyByCountry,
} from "@/lib/currencyConfig";

export interface CurrencyContextType {
  currency: string;
  symbol: string;
  locale: string;
  flag: string;
  countryName: string;
  rate: number;
  isLoaded: boolean;
  setCurrency: (currencyCode: string) => void;
  formatPrice: (amountGBP: number | null | undefined) => string;
  freeDeliveryThreshold: string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const CURRENCY_PREF_KEY = "gama_currency_v1";
const RATES_CACHE_KEY = "gama_exchange_rates_v1";
const GEO_CACHE_KEY = "gama_geo_country_v1";
const RATES_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const GEO_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Default fallback exchange rates against GBP (base 1 GBP)
const DEFAULT_RATES: Record<string, number> = {
  GBP: 1,
  EUR: 1.17,
  INR: 106.5,
  USD: 1.27,
  CHF: 1.13,
  SEK: 13.75,
  NOK: 13.95,
  DKK: 8.70,
  PLN: 5.10,
  AED: 4.67,
  AUD: 1.94,
  CAD: 1.73,
  SGD: 1.71,
  JPY: 191.0,
  PKR: 350.0,
  BDT: 150.0,
  NPR: 170.0,
};

const EXCHANGE_RATE_API = "https://open.er-api.com/v6/latest/GBP";

const DEFAULT_STATE = {
  currency: "GBP",
  symbol: "£",
  locale: "en-GB",
  flag: "🇬🇧",
  countryName: "United Kingdom",
  rate: 1,
  isLoaded: true,
};

function buildCurrencyState(currencyCode: string, rates: Record<string, number>) {
  const popular = POPULAR_CURRENCIES.find((c) => c.code === currencyCode);
  const rate = currencyCode === "GBP" ? 1 : (rates[currencyCode] ?? DEFAULT_RATES[currencyCode] ?? 1);
  const locale = CURRENCY_LOCALE_MAP[currencyCode] || "en-GB";

  return {
    currency: currencyCode,
    symbol: popular?.symbol || (currencyCode === "GBP" ? "£" : currencyCode),
    locale,
    flag: popular?.flag || "🌐",
    countryName: popular?.name?.split(" – ")[1] || currencyCode,
    rate,
    isLoaded: true,
  };
}

function computeFormatPrice(state: typeof DEFAULT_STATE) {
  return function formatPrice(amountGBP: number | null | undefined): string {
    if (amountGBP === null || amountGBP === undefined || isNaN(amountGBP)) return "";
    const converted = Math.round(amountGBP * state.rate);

    if (state.currency === "INR") {
      return `₹${formatIndianNumber(converted)}`;
    }
    if (state.currency === "NPR") {
      return `रू ${formatIndianNumber(converted)}`;
    }

    try {
      const fractionDigits = ["JPY", "KRW", "IDR", "VND", "CLP", "HUF"].includes(state.currency) ? 0 : 0;
      return new Intl.NumberFormat(state.locale, {
        style: "currency",
        currency: state.currency,
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
      }).format(converted);
    } catch {
      return `${state.symbol}${converted.toLocaleString(state.locale)}`;
    }
  };
}

function getCachedRates(): Record<string, number> | null {
  try {
    const cached = JSON.parse(localStorage.getItem(RATES_CACHE_KEY) || "null");
    if (cached?.rates && Date.now() - cached.timestamp < RATES_CACHE_TTL) {
      return cached.rates;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function setCachedRates(rates: Record<string, number>) {
  try {
    localStorage.setItem(
      RATES_CACHE_KEY,
      JSON.stringify({ rates, timestamp: Date.now() })
    );
  } catch {
    /* storage disabled */
  }
}

function getSavedCurrency(): string | null {
  try {
    const cached = JSON.parse(localStorage.getItem(CURRENCY_PREF_KEY) || "null");
    if (cached?.currency) {
      return cached.currency;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function saveCurrencyPref(currencyCode: string) {
  try {
    localStorage.setItem(
      CURRENCY_PREF_KEY,
      JSON.stringify({ currency: currencyCode, timestamp: Date.now() })
    );
  } catch {
    /* storage disabled */
  }
}

// ── Geo-IP Detection Helpers ──

function getCachedGeoCountry(): string | null {
  try {
    const cached = JSON.parse(localStorage.getItem(GEO_CACHE_KEY) || "null");
    if (cached?.country && Date.now() - cached.timestamp < GEO_CACHE_TTL) {
      return cached.country;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function cacheGeoCountry(countryCode: string) {
  try {
    localStorage.setItem(
      GEO_CACHE_KEY,
      JSON.stringify({ country: countryCode, timestamp: Date.now() })
    );
  } catch {
    /* storage disabled */
  }
}

async function detectCountryByIP(): Promise<string | null> {
  // Check cache first
  const cached = getCachedGeoCountry();
  if (cached) return cached;

  // Try multiple free geo-IP APIs with fallbacks
  const apis = [
    {
      url: "https://ip-api.com/json/?fields=countryCode",
      parse: (data: Record<string, string>) => data.countryCode,
    },
    {
      url: "https://ipapi.co/json/",
      parse: (data: Record<string, string>) => data.country_code,
    },
    {
      url: "https://api.country.is/",
      parse: (data: Record<string, string>) => data.country,
    },
  ];

  for (const api of apis) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(api.url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) continue;
      const data = await response.json();
      const country = api.parse(data);
      if (country && typeof country === "string" && country.length === 2) {
        cacheGeoCountry(country);
        return country;
      }
    } catch {
      continue; // Try next API
    }
  }

  // Fallback for local development or if adblockers block geo APIs: detect via Browser Timezone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    // South Asia
    if (tz.includes("Kathmandu")) return "NP";
    if (tz.includes("Kolkata") || tz.includes("Calcutta")) return "IN";
    if (tz.includes("Karachi")) return "PK";
    if (tz.includes("Dhaka")) return "BD";
    if (tz.includes("Colombo")) return "LK";
    // Europe
    if (tz.includes("London") || tz.includes("Belfast")) return "GB";
    if (tz.includes("Paris") || tz.includes("Berlin") || tz.includes("Rome") || tz.includes("Madrid") || tz.includes("Amsterdam") || tz.includes("Brussels") || tz.includes("Vienna") || tz.includes("Dublin")) return "DE";
    if (tz.includes("Zurich")) return "CH";
    if (tz.includes("Stockholm")) return "SE";
    if (tz.includes("Oslo")) return "NO";
    if (tz.includes("Copenhagen")) return "DK";
    if (tz.includes("Warsaw")) return "PL";
    // Americas
    if (tz.includes("New_York") || tz.includes("Los_Angeles") || tz.includes("Chicago") || tz.includes("Denver") || tz.includes("Phoenix")) return "US";
    if (tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Edmonton")) return "CA";
    if (tz.includes("Sao_Paulo")) return "BR";
    // Middle East
    if (tz.includes("Dubai")) return "AE";
    if (tz.includes("Riyadh")) return "SA";
    // Asia / Oceania
    if (tz.includes("Tokyo")) return "JP";
    if (tz.includes("Singapore")) return "SG";
    if (tz.includes("Sydney") || tz.includes("Melbourne") || tz.includes("Brisbane") || tz.includes("Perth")) return "AU";
    if (tz.includes("Auckland")) return "NZ";
    if (tz.includes("Bangkok")) return "TH";
    if (tz.includes("Hong_Kong")) return "HK";
    if (tz.includes("Seoul")) return "KR";
    if (tz.includes("Shanghai")) return "CN";
    if (tz.includes("Johannesburg")) return "ZA";
  } catch {
    /* ignore */
  }

  return null;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const ratesRef = useRef<Record<string, number>>(DEFAULT_RATES);
  const [state, setState] = useState(() => buildCurrencyState("GBP", DEFAULT_RATES));

  const fetchRates = useCallback(async () => {
    const cached = getCachedRates();
    if (cached) {
      ratesRef.current = { ...DEFAULT_RATES, ...cached };
      const savedCurrency = getSavedCurrency() || "GBP";
      setState(buildCurrencyState(savedCurrency, ratesRef.current));
      return;
    }

    try {
      const response = await fetch(EXCHANGE_RATE_API);
      const data = await response.json();
      if (data?.result === "success" && data?.rates) {
        const rates: Record<string, number> = { ...DEFAULT_RATES, ...data.rates };
        ratesRef.current = rates;
        setCachedRates(rates);
        
        // Update state with newly fetched live rates
        const savedCurrency = getSavedCurrency() || "GBP";
        setState(buildCurrencyState(savedCurrency, rates));
      }
    } catch {
      /* fallback to DEFAULT_RATES already in ratesRef.current */
    }
  }, []);

  useEffect(() => {
    const cached = getCachedRates();
    const savedCurrency = getSavedCurrency();

    if (savedCurrency) {
      // User has a saved preference — use it directly
      if (cached) ratesRef.current = { ...DEFAULT_RATES, ...cached };
      setState(buildCurrencyState(savedCurrency, ratesRef.current));
      fetchRates();
    } else {
      // No saved preference — auto-detect country and set currency
      if (cached) ratesRef.current = { ...DEFAULT_RATES, ...cached };
      fetchRates();

      detectCountryByIP().then((countryCode) => {
        // Only auto-set if the user hasn't manually picked a currency in the meantime
        if (!getSavedCurrency() && countryCode) {
          const geoInfo = getCurrencyByCountry(countryCode);
          const currencyCode = geoInfo.currency;
          const newState = buildCurrencyState(currencyCode, ratesRef.current);
          setState(newState);
          saveCurrencyPref(currencyCode);
        }
      });
    }
  }, [fetchRates]);

  const setCurrency = useCallback(
    (currencyCode: string) => {
      const newState = buildCurrencyState(currencyCode, ratesRef.current);
      setState(newState);
      saveCurrencyPref(currencyCode);
    },
    []
  );

  const formatPrice = computeFormatPrice(state);
  const freeDeliveryThreshold = formatPrice(40000 / (ratesRef.current["INR"] || 106.5));

  return (
    <CurrencyContext.Provider
      value={{ ...state, setCurrency, formatPrice, freeDeliveryThreshold }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
