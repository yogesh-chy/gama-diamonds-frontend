// Country code → currency metadata for geo-based detection
export interface CurrencyInfo {
  currency: string;
  symbol: string;
  locale: string;
  flag: string;
  name: string;
}

export interface PopularCurrency {
  code: string;
  symbol: string;
  flag: string;
  name: string;
}

const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  // South Asia
  IN: { currency: 'INR', symbol: '₹', locale: 'en-IN', flag: '🇮🇳', name: 'India' },
  PK: { currency: 'PKR', symbol: '₨', locale: 'en-PK', flag: '🇵🇰', name: 'Pakistan' },
  BD: { currency: 'BDT', symbol: '৳', locale: 'bn-BD', flag: '🇧🇩', name: 'Bangladesh' },
  LK: { currency: 'LKR', symbol: 'Rs', locale: 'si-LK', flag: '🇱🇰', name: 'Sri Lanka' },
  NP: { currency: 'NPR', symbol: 'रू', locale: 'ne-NP', flag: '🇳🇵', name: 'Nepal' },

  // UK / Ireland
  GB: { currency: 'GBP', symbol: '£', locale: 'en-GB', flag: '🇬🇧', name: 'United Kingdom' },
  IE: { currency: 'EUR', symbol: '€', locale: 'en-IE', flag: '🇮🇪', name: 'Ireland' },

  // Eurozone
  DE: { currency: 'EUR', symbol: '€', locale: 'de-DE', flag: '🇩🇪', name: 'Germany' },
  FR: { currency: 'EUR', symbol: '€', locale: 'fr-FR', flag: '🇫🇷', name: 'France' },
  IT: { currency: 'EUR', symbol: '€', locale: 'it-IT', flag: '🇮🇹', name: 'Italy' },
  ES: { currency: 'EUR', symbol: '€', locale: 'es-ES', flag: '🇪🇸', name: 'Spain' },
  NL: { currency: 'EUR', symbol: '€', locale: 'nl-NL', flag: '🇳🇱', name: 'Netherlands' },
  BE: { currency: 'EUR', symbol: '€', locale: 'fr-BE', flag: '🇧🇪', name: 'Belgium' },
  AT: { currency: 'EUR', symbol: '€', locale: 'de-AT', flag: '🇦🇹', name: 'Austria' },
  PT: { currency: 'EUR', symbol: '€', locale: 'pt-PT', flag: '🇵🇹', name: 'Portugal' },
  GR: { currency: 'EUR', symbol: '€', locale: 'el-GR', flag: '🇬🇷', name: 'Greece' },
  FI: { currency: 'EUR', symbol: '€', locale: 'fi-FI', flag: '🇫🇮', name: 'Finland' },
  LU: { currency: 'EUR', symbol: '€', locale: 'fr-LU', flag: '🇱🇺', name: 'Luxembourg' },

  // Non-euro Europe
  CH: { currency: 'CHF', symbol: 'Fr', locale: 'de-CH', flag: '🇨🇭', name: 'Switzerland' },
  SE: { currency: 'SEK', symbol: 'kr', locale: 'sv-SE', flag: '🇸🇪', name: 'Sweden' },
  NO: { currency: 'NOK', symbol: 'kr', locale: 'nb-NO', flag: '🇳🇴', name: 'Norway' },
  DK: { currency: 'DKK', symbol: 'kr', locale: 'da-DK', flag: '🇩🇰', name: 'Denmark' },
  PL: { currency: 'PLN', symbol: 'zł', locale: 'pl-PL', flag: '🇵🇱', name: 'Poland' },
  CZ: { currency: 'CZK', symbol: 'Kč', locale: 'cs-CZ', flag: '🇨🇿', name: 'Czechia' },
  HU: { currency: 'HUF', symbol: 'Ft', locale: 'hu-HU', flag: '🇭🇺', name: 'Hungary' },
  RO: { currency: 'RON', symbol: 'lei', locale: 'ro-RO', flag: '🇷🇴', name: 'Romania' },

  // North America
  US: { currency: 'USD', symbol: '$', locale: 'en-US', flag: '🇺🇸', name: 'United States' },
  CA: { currency: 'CAD', symbol: 'CA$', locale: 'en-CA', flag: '🇨🇦', name: 'Canada' },
  MX: { currency: 'MXN', symbol: 'MX$', locale: 'es-MX', flag: '🇲🇽', name: 'Mexico' },

  // Oceania
  AU: { currency: 'AUD', symbol: 'A$', locale: 'en-AU', flag: '🇦🇺', name: 'Australia' },
  NZ: { currency: 'NZD', symbol: 'NZ$', locale: 'en-NZ', flag: '🇳🇿', name: 'New Zealand' },

  // Middle East / Gulf
  AE: { currency: 'AED', symbol: 'AED', locale: 'ar-AE', flag: '🇦🇪', name: 'UAE' },
  SA: { currency: 'SAR', symbol: 'SR', locale: 'ar-SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  QA: { currency: 'QAR', symbol: 'QR', locale: 'ar-QA', flag: '🇶🇦', name: 'Qatar' },
  KW: { currency: 'KWD', symbol: 'KD', locale: 'ar-KW', flag: '🇰🇼', name: 'Kuwait' },
  BH: { currency: 'BHD', symbol: 'BD', locale: 'ar-BH', flag: '🇧🇭', name: 'Bahrain' },
  OM: { currency: 'OMR', symbol: 'OMR', locale: 'ar-OM', flag: '🇴🇲', name: 'Oman' },
  IL: { currency: 'ILS', symbol: '₪', locale: 'he-IL', flag: '🇮🇱', name: 'Israel' },
  TR: { currency: 'TRY', symbol: '₺', locale: 'tr-TR', flag: '🇹🇷', name: 'Turkey' },

  // East Asia
  JP: { currency: 'JPY', symbol: '¥', locale: 'ja-JP', flag: '🇯🇵', name: 'Japan' },
  CN: { currency: 'CNY', symbol: '¥', locale: 'zh-CN', flag: '🇨🇳', name: 'China' },
  KR: { currency: 'KRW', symbol: '₩', locale: 'ko-KR', flag: '🇰🇷', name: 'South Korea' },
  HK: { currency: 'HKD', symbol: 'HK$', locale: 'zh-HK', flag: '🇭🇰', name: 'Hong Kong' },
  TW: { currency: 'TWD', symbol: 'NT$', locale: 'zh-TW', flag: '🇹🇼', name: 'Taiwan' },

  // Southeast Asia
  SG: { currency: 'SGD', symbol: 'S$', locale: 'en-SG', flag: '🇸🇬', name: 'Singapore' },
  MY: { currency: 'MYR', symbol: 'RM', locale: 'ms-MY', flag: '🇲🇾', name: 'Malaysia' },
  TH: { currency: 'THB', symbol: '฿', locale: 'th-TH', flag: '🇹🇭', name: 'Thailand' },
  ID: { currency: 'IDR', symbol: 'Rp', locale: 'id-ID', flag: '🇮🇩', name: 'Indonesia' },
  PH: { currency: 'PHP', symbol: '₱', locale: 'fil-PH', flag: '🇵🇭', name: 'Philippines' },
  VN: { currency: 'VND', symbol: '₫', locale: 'vi-VN', flag: '🇻🇳', name: 'Vietnam' },

  // Africa
  ZA: { currency: 'ZAR', symbol: 'R', locale: 'en-ZA', flag: '🇿🇦', name: 'South Africa' },
  NG: { currency: 'NGN', symbol: '₦', locale: 'en-NG', flag: '🇳🇬', name: 'Nigeria' },
  EG: { currency: 'EGP', symbol: 'E£', locale: 'ar-EG', flag: '🇪🇬', name: 'Egypt' },
  KE: { currency: 'KES', symbol: 'KSh', locale: 'en-KE', flag: '🇰🇪', name: 'Kenya' },

  // Latin America
  BR: { currency: 'BRL', symbol: 'R$', locale: 'pt-BR', flag: '🇧🇷', name: 'Brazil' },
  AR: { currency: 'ARS', symbol: '$', locale: 'es-AR', flag: '🇦🇷', name: 'Argentina' },
  CL: { currency: 'CLP', symbol: '$', locale: 'es-CL', flag: '🇨🇱', name: 'Chile' },
  CO: { currency: 'COP', symbol: '$', locale: 'es-CO', flag: '🇨🇴', name: 'Colombia' },
};

// Fallback when country is unknown
export const DEFAULT_CURRENCY: CurrencyInfo = {
  currency: 'GBP',
  symbol: '£',
  locale: 'en-GB',
  flag: '🇬🇧',
  name: 'United Kingdom',
};

export function getCurrencyByCountry(countryCode?: string | null): CurrencyInfo {
  if (!countryCode) return DEFAULT_CURRENCY;
  return CURRENCY_MAP[countryCode.toUpperCase()] || DEFAULT_CURRENCY;
}

export function formatIndianNumber(n: number): string {
  const abs = Math.round(Math.abs(n));
  const s = String(abs);
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
}

// Major currencies available in the header selector
export const POPULAR_CURRENCIES: PopularCurrency[] = [
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'GBP – British Pound' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'USD – US Dollar' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'EUR – Euro' },
  { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'INR – Indian Rupee' },
  { code: 'AED', symbol: 'AED', flag: '🇦🇪', name: 'AED – UAE Dirham' },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', name: 'AUD – Australian Dollar' },
  { code: 'CAD', symbol: 'CA$', flag: '🇨🇦', name: 'CAD – Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: 'SGD – Singapore Dollar' },
  { code: 'JPY', symbol: '¥', flag: '🇯🇵', name: 'JPY – Japanese Yen' },
  { code: 'CHF', symbol: 'Fr', flag: '🇨🇭', name: 'CHF – Swiss Franc' },
];

export const CURRENCY_LOCALE_MAP: Record<string, string> = {
  GBP: 'en-GB', USD: 'en-US', EUR: 'de-DE', INR: 'en-IN',
  AED: 'ar-AE', AUD: 'en-AU', CAD: 'en-CA', SGD: 'en-SG',
  JPY: 'ja-JP', CHF: 'de-CH', CNY: 'zh-CN', KRW: 'ko-KR',
  HKD: 'zh-HK', SAR: 'ar-SA', QAR: 'ar-QA', MYR: 'ms-MY',
  THB: 'th-TH', ZAR: 'en-ZA', BRL: 'pt-BR', SEK: 'sv-SE',
  NOK: 'nb-NO', DKK: 'da-DK', PLN: 'pl-PL', NZD: 'en-NZ',
  PKR: 'en-PK', BDT: 'bn-BD', NPR: 'ne-NP',
  TWD: 'zh-TW', PHP: 'fil-PH', VND: 'vi-VN', IDR: 'id-ID',
  TRY: 'tr-TR', ILS: 'he-IL', MXN: 'es-MX',
};

export default CURRENCY_MAP;
