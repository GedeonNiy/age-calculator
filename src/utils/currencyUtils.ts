/**
 * Currency conversion utility functions
 */

export interface ExchangeRatesResponse {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface CurrencyConversionResult {
  convertedAmount: number;
  inverseRate: number;
  rate: number;
  lastUpdated: string;
}

/**
 * Supported currency codes
 */
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'RWF', name: 'Rwandan Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'INR', name: 'Indian Rupee' },
];

/**
 * Fetch exchange rates from exchangerate-api.com (free, no auth required)
 * Falls back to exchangerate.host if needed
 */
export async function fetchExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
  try {
    // Try exchangerate-api.com first (more reliable, free, no auth)
    let response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    
    if (response.ok) {
      const data: any = await response.json();
      
      if (!data.rates || typeof data.rates !== 'object') {
        throw new Error('Invalid API response format');
      }
      
      // Ensure base currency rate is 1.0
      const rates = { ...data.rates };
      if (!rates[baseCurrency]) {
        rates[baseCurrency] = 1.0;
      }
      
      return {
        base: data.base || baseCurrency,
        date: data.date || new Date().toISOString().split('T')[0],
        rates: rates,
      };
    }
    
    // Fallback to exchangerate.host
    response = await fetch(`https://api.exchangerate.host/latest?base=${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }
    
    const data: any = await response.json();
    
    // exchangerate.host API response format
    if (data.success === false) {
      throw new Error('API returned unsuccessful response');
    }
    
    if (!data.rates || typeof data.rates !== 'object') {
      throw new Error('Invalid API response format: rates not found');
    }
    
    // Ensure USD is in rates (it should be 1.0 if base is USD)
    const rates = { ...data.rates };
    if (baseCurrency === 'USD' && !rates.USD) {
      rates.USD = 1.0;
    }
    
    return {
      base: data.base || baseCurrency,
      date: data.date || new Date().toISOString().split('T')[0],
      rates: rates,
    };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
}

/**
 * Convert currency amount
 * API returns rates relative to base (USD), so:
 * - If fromCurrency is USD: amountInUSD = amount
 * - If fromCurrency is not USD: amountInUSD = amount / rates[fromCurrency]
 * - convertedAmount = amountInUSD * rates[toCurrency] (or 1 if toCurrency is USD)
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): CurrencyConversionResult {
  if (fromCurrency === toCurrency) {
    return {
      convertedAmount: amount,
      inverseRate: 1,
      rate: 1,
      lastUpdated: rates.date,
    };
  }

  // Convert to USD first
  let amountInUSD: number;
  if (fromCurrency === 'USD') {
    amountInUSD = amount;
  } else {
    const fromRate = rates.rates[fromCurrency];
    if (!fromRate || fromRate === 0) {
      throw new Error(`Exchange rate not available for ${fromCurrency}`);
    }
    amountInUSD = amount / fromRate;
  }

  // Convert from USD to target currency
  let convertedAmount: number;
  let rate: number;
  if (toCurrency === 'USD') {
    convertedAmount = amountInUSD;
    rate = fromCurrency === 'USD' ? 1 : 1 / rates.rates[fromCurrency];
  } else {
    const toRate = rates.rates[toCurrency];
    if (!toRate || toRate === 0) {
      throw new Error(`Exchange rate not available for ${toCurrency}`);
    }
    convertedAmount = amountInUSD * toRate;
    rate = fromCurrency === 'USD' ? toRate : toRate / rates.rates[fromCurrency];
  }

  const inverseRate = 1 / rate;

  return {
    convertedAmount: Math.round(convertedAmount * 10000) / 10000, // Round to 4 decimal places
    inverseRate: Math.round(inverseRate * 10000) / 10000,
    rate: Math.round(rate * 10000) / 10000,
    lastUpdated: rates.date,
  };
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

