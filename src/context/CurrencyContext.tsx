"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
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
  formatPrice: (amountINR: number | null | undefined) => string;
  freeDeliveryThreshold: string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const CACHE_KEY = "gama_currency_v1";
const CACHE_TTL = 24 * 60 * 60 * 1000;

const DEFAULT_STATE = {
  currency: "GBP",
  symbol: "£",
  locale: "en-GB",
  flag: "🇬🇧",
  countryName: "United Kingdom",
  rate: 1,
  isLoaded: true,
};

function buildCurrencyState(currencyCode: string, rates?: Record<string, number>) {
  const popular = POPULAR_CURRENCIES.find((c) => c.code === currencyCode);
  const rate = rates?.[currencyCode] ?? 1;
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
  return function formatPrice(amountINR: number | null | undefined): string {
    if (amountINR === null || amountINR === undefined) return "";
    const converted = Math.round(amountINR * state.rate);

    if (state.currency === "INR") {
      return `₹${formatIndianNumber(converted)}`;
    }

    try {
      const fractionDigits = ["JPY", "KRW", "IDR", "VND", "CLP"].includes(state.currency) ? 0 : 0;
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

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(DEFAULT_STATE);

  const applyState = useCallback((currencyCode: string, rates?: Record<string, number>) => {
    setState(buildCurrencyState(currencyCode, rates));
  }, []);

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached?.currency && Date.now() - cached.timestamp < CACHE_TTL) {
        applyState(cached.currency);
      }
    } catch {
      /* fallback */
    }
  }, [applyState]);

  const setCurrency = useCallback(
    (currencyCode: string) => {
      applyState(currencyCode);
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ currency: currencyCode, timestamp: Date.now() })
        );
      } catch {
        /* storage disabled */
      }
    },
    [applyState]
  );

  const formatPrice = computeFormatPrice(state);
  const freeDeliveryThreshold = formatPrice(40000);

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
