/**
 * Currency Converter Page Logic
 */

import {
  fetchExchangeRates,
  convertCurrency,
  formatCurrency,
  formatDate,
  SUPPORTED_CURRENCIES,
  type ExchangeRates,
} from '../utils/currencyUtils';
import { showError, clearError } from '../utils/validationUtils';

/**
 * Initializes the Currency Converter page
 */
export function initCurrencyConverter(): void {
  const amountInput = document.getElementById('currency-amount') as HTMLInputElement;
  const fromCurrencySelect = document.getElementById('currency-from') as HTMLSelectElement;
  const toCurrencySelect = document.getElementById('currency-to') as HTMLSelectElement;
  const convertButton = document.getElementById('currency-convert-btn') as HTMLButtonElement;

  // Result elements
  const resultDiv = document.getElementById('currency-result') as HTMLDivElement;
  const inverseRateDiv = document.getElementById('currency-inverse-rate') as HTMLDivElement;
  const lastUpdatedDiv = document.getElementById('currency-last-updated') as HTMLDivElement;
  const loadingDiv = document.getElementById('currency-loading') as HTMLDivElement;
  const errorDiv = document.getElementById('currency-error') as HTMLDivElement;

  if (!convertButton) {
    console.warn('Currency Converter elements not found');
    return;
  }

  // Populate currency selects
  const currencyOptions = SUPPORTED_CURRENCIES.map(
    currency => `<option value="${currency.code}">${currency.code} - ${currency.name}</option>`
  ).join('');

  if (fromCurrencySelect) {
    fromCurrencySelect.innerHTML = currencyOptions;
    fromCurrencySelect.value = 'USD';
  }
  if (toCurrencySelect) {
    toCurrencySelect.innerHTML = currencyOptions;
    toCurrencySelect.value = 'EUR';
  }

  // State for exchange rates
  let cachedRates: ExchangeRates | null = null;
  let ratesFetchTime: number = 0;
  let hasError = false;
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Get exchange rates (with caching)
   * Always fetches with USD as base since API returns rates relative to base
   */
  async function getExchangeRates(): Promise<ExchangeRates> {
    const now = Date.now();
    
    // Use cached rates if available and not expired
    if (cachedRates && (now - ratesFetchTime) < CACHE_DURATION) {
      return cachedRates;
    }

    // Show loading state
    hasError = false;
    if (loadingDiv) {
      loadingDiv.style.display = 'block';
      loadingDiv.textContent = 'Loading latest rates...';
    }
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
    if (resultDiv) {
      resultDiv.textContent = '';
    }
    if (convertButton) {
      convertButton.disabled = true;
    }

    try {
      // Always fetch with USD as base
      const rates = await fetchExchangeRates('USD');
      cachedRates = rates;
      ratesFetchTime = now;
      hasError = false;
      
      if (loadingDiv) {
        loadingDiv.style.display = 'none';
      }
      if (convertButton) {
        convertButton.disabled = false;
      }
      
      return rates;
    } catch (error) {
      hasError = true;
      if (loadingDiv) {
        loadingDiv.style.display = 'none';
      }
      if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Failed to fetch exchange rates. Please try again later.';
      }
      if (convertButton) {
        convertButton.disabled = true;
      }
      throw error;
    }
  }

  // Fetch rates on page load
  getExchangeRates().catch(() => {
    // Error already handled in getExchangeRates
  });

  /**
   * Clear result when inputs change
   */
  function clearResult(): void {
    if (resultDiv) {
      resultDiv.textContent = '';
      resultDiv.className = 'result';
      resultDiv.style.display = 'none';
    }
    if (inverseRateDiv) {
      inverseRateDiv.textContent = '';
      inverseRateDiv.style.display = 'none';
    }
    if (lastUpdatedDiv) {
      lastUpdatedDiv.textContent = '';
      lastUpdatedDiv.style.display = 'none';
    }
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }

  // Convert button handler
  convertButton.addEventListener('click', async () => {
    // Clear previous errors
    clearError('currency-amount');
    clearResult();

    const amount = parseFloat(amountInput?.value || '0');
    const fromCurrency = fromCurrencySelect?.value || 'USD';
    const toCurrency = toCurrencySelect?.value || 'EUR';

    // Validation
    if (amount <= 0) {
      showError('currency-amount', 'Amount must be greater than 0');
      return;
    }

    if (hasError) {
      // Try to fetch rates again if there was an error
      try {
        await getExchangeRates();
      } catch {
        return; // Error already displayed
      }
    }

    if (fromCurrency === toCurrency) {
      if (resultDiv) {
        resultDiv.textContent = `${formatCurrency(amount, fromCurrency)} = ${formatCurrency(amount, toCurrency)}`;
        resultDiv.className = 'result success';
        resultDiv.style.display = 'block';
      }
      if (lastUpdatedDiv && cachedRates) {
        lastUpdatedDiv.textContent = `Rates updated: ${formatDate(cachedRates.date)}`;
        lastUpdatedDiv.style.display = 'block';
      }
      if (errorDiv) {
        errorDiv.style.display = 'none';
      }
      return;
    }

    try {
      // Get exchange rates (always uses USD as base)
      const rates = await getExchangeRates();

      // Perform conversion
      console.log('Converting:', { amount, fromCurrency, toCurrency, rates }); // Debug log
      const result = convertCurrency(amount, fromCurrency, toCurrency, rates);
      console.log('Conversion result:', result); // Debug log

      // Display results - ensure elements are visible
      if (resultDiv) {
        const resultText = `${formatCurrency(amount, fromCurrency)} = ${formatCurrency(result.convertedAmount, toCurrency)}`;
        console.log('Setting result text:', resultText); // Debug log
        resultDiv.textContent = resultText;
        resultDiv.className = 'result success';
        resultDiv.style.display = 'block';
      }

      if (inverseRateDiv) {
        inverseRateDiv.textContent = `1 ${toCurrency} = ${formatCurrency(result.inverseRate, fromCurrency)}`;
        inverseRateDiv.style.display = 'block';
      }

      if (lastUpdatedDiv) {
        lastUpdatedDiv.textContent = `Rates updated: ${formatDate(rates.date)}`;
        lastUpdatedDiv.style.display = 'block';
      }

      // Hide error div if it was showing
      if (errorDiv) {
        errorDiv.style.display = 'none';
      }
    } catch (error) {
      console.error('Currency conversion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `Error converting currency: ${errorMessage}. Please check your inputs and try again.`;
      }
      if (resultDiv) {
        resultDiv.style.display = 'none';
      }
    }
  });

  // Clear result when inputs change
  amountInput?.addEventListener('input', clearResult);
  fromCurrencySelect?.addEventListener('change', clearResult);
  toCurrencySelect?.addEventListener('change', clearResult);
}

