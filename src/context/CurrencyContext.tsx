"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import {
  POPULAR_CURRENCIES,
  CURRENCY_LOCALE_MAP,
  formatIndianNumber,
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
const RATES_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

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

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const ratesRef = useRef<Record<string, number>>(DEFAULT_RATES);
  const [state, setState] = useState(() => {
    const cachedRates = typeof window !== "undefined" ? getCachedRates() : null;
    if (cachedRates) {
      ratesRef.current = { ...DEFAULT_RATES, ...cachedRates };
    }
    const savedCurrency = typeof window !== "undefined" ? (getSavedCurrency() || "GBP") : "GBP";
    return buildCurrencyState(savedCurrency, ratesRef.current);
  });

  const fetchRates = useCallback(async () => {
    const cached = getCachedRates();
    if (cached) {
      ratesRef.current = { ...DEFAULT_RATES, ...cached };
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
        const savedCurrency = getSavedCurrency() || state.currency || "GBP";
        setState(buildCurrencyState(savedCurrency, rates));
      }
    } catch {
      /* fallback to DEFAULT_RATES already in ratesRef.current */
    }
  }, [state.currency]);

  useEffect(() => {
    fetchRates();
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
