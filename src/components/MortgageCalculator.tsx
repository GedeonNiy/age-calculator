import { useState, useEffect, useMemo } from 'react';
import type { MortgageInputs } from '../utils/mortgageUtils';
import { calculateMortgage, formatCurrency, formatNumber } from '../utils/mortgageUtils';

interface MortgageCalculatorProps {
  className?: string;
}

export default function MortgageCalculator({ className = '' }: MortgageCalculatorProps) {
  const [inputs, setInputs] = useState<MortgageInputs>({
    homePrice: 350000,
    downPaymentType: 'percentage',
    downPaymentAmount: 70000,
    downPaymentPercentage: 20,
    loanTermYears: 30,
    annualInterestRate: 6.5,
    propertyTaxType: 'percent',
    propertyTaxPercent: 1.2,
    propertyTaxAmount: 4200,
    annualInsurance: 1200,
    pmiPercent: 0.5,
    includePMI: true,
    monthlyHOA: 0,
    extraPrincipalPayment: 0,
  });

  const [debouncedInputs, setDebouncedInputs] = useState<MortgageInputs>(inputs);
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  const [showExtraPayments, setShowExtraPayments] = useState(false);

  // Debounce inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInputs(inputs);
    }, 200);
    return () => clearTimeout(timer);
  }, [inputs]);

  // Calculate results
  const results = useMemo(() => {
    return calculateMortgage(debouncedInputs);
  }, [debouncedInputs]);

  const handleInputChange = (field: keyof MortgageInputs, value: number | string | boolean) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentSchedule = showExtraPayments ? results.extraAmortizationSchedule : results.amortizationSchedule;
  const currentYearlySummary = showExtraPayments ? results.extraYearlySummary : results.yearlySummary;

  return (
    <div className={`mortgage-calculator ${className}`}>
      <div className="mortgage-calculator-layout">
        {/* Input Form */}
        <div className="mortgage-inputs">
          <h2>Mortgage Details</h2>
          
          <div className="form-group">
            <label htmlFor="home-price">Home Price</label>
            <input
              type="number"
              id="home-price"
              value={inputs.homePrice}
              onChange={(e) => handleInputChange('homePrice', parseFloat(e.target.value) || 0)}
              min="0"
              step="1000"
            />
          </div>

          <div className="form-group">
            <label>Down Payment</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  checked={inputs.downPaymentType === 'amount'}
                  onChange={() => handleInputChange('downPaymentType', 'amount')}
                />
                Fixed Amount
              </label>
              <label>
                <input
                  type="radio"
                  checked={inputs.downPaymentType === 'percentage'}
                  onChange={() => handleInputChange('downPaymentType', 'percentage')}
                />
                Percentage
              </label>
            </div>
            {inputs.downPaymentType === 'amount' ? (
              <input
                type="number"
                value={inputs.downPaymentAmount}
                onChange={(e) => handleInputChange('downPaymentAmount', parseFloat(e.target.value) || 0)}
                min="0"
                step="1000"
              />
            ) : (
              <input
                type="number"
                value={inputs.downPaymentPercentage}
                onChange={(e) => handleInputChange('downPaymentPercentage', parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="loan-term">Loan Term (Years)</label>
            <select
              id="loan-term"
              value={inputs.loanTermYears}
              onChange={(e) => handleInputChange('loanTermYears', parseInt(e.target.value) || 30)}
            >
              <option value="10">10 years</option>
              <option value="15">15 years</option>
              <option value="20">20 years</option>
              <option value="25">25 years</option>
              <option value="30">30 years</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="interest-rate">Annual Interest Rate (APR %)</label>
            <input
              type="number"
              id="interest-rate"
              value={inputs.annualInterestRate}
              onChange={(e) => handleInputChange('annualInterestRate', parseFloat(e.target.value) || 0)}
              min="0"
              max="30"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Property Tax (Annual)</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  checked={inputs.propertyTaxType === 'percent'}
                  onChange={() => handleInputChange('propertyTaxType', 'percent')}
                />
                Percent of Home Price
              </label>
              <label>
                <input
                  type="radio"
                  checked={inputs.propertyTaxType === 'amount'}
                  onChange={() => handleInputChange('propertyTaxType', 'amount')}
                />
                Fixed Amount
              </label>
            </div>
            {inputs.propertyTaxType === 'percent' ? (
              <input
                type="number"
                value={inputs.propertyTaxPercent}
                onChange={(e) => handleInputChange('propertyTaxPercent', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
              />
            ) : (
              <input
                type="number"
                value={inputs.propertyTaxAmount}
                onChange={(e) => handleInputChange('propertyTaxAmount', parseFloat(e.target.value) || 0)}
                min="0"
                step="100"
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="insurance">Homeowner's Insurance (Annual)</label>
            <input
              type="number"
              id="insurance"
              value={inputs.annualInsurance}
              onChange={(e) => handleInputChange('annualInsurance', parseFloat(e.target.value) || 0)}
              min="0"
              step="100"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={inputs.includePMI}
                onChange={(e) => handleInputChange('includePMI', e.target.checked)}
              />
              Include PMI (Private Mortgage Insurance)
            </label>
            {inputs.includePMI && (
              <input
                type="number"
                value={inputs.pmiPercent}
                onChange={(e) => handleInputChange('pmiPercent', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
                placeholder="PMI % of loan amount per year"
              />
            )}
            <small>PMI applies when down payment is less than 20%</small>
          </div>

          <div className="form-group">
            <label htmlFor="hoa">HOA Fees (Monthly)</label>
            <input
              type="number"
              id="hoa"
              value={inputs.monthlyHOA}
              onChange={(e) => handleInputChange('monthlyHOA', parseFloat(e.target.value) || 0)}
              min="0"
              step="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="extra-payment">Extra Principal Payment (Monthly)</label>
            <input
              type="number"
              id="extra-payment"
              value={inputs.extraPrincipalPayment}
              onChange={(e) => handleInputChange('extraPrincipalPayment', parseFloat(e.target.value) || 0)}
              min="0"
              step="50"
            />
            <small>Additional amount paid toward principal each month</small>
          </div>
        </div>

        {/* Results Section */}
        <div className="mortgage-results">
          <h2>Results</h2>
          
          {/* Summary Cards */}
          <div className="results-cards">
            <div className="result-card">
              <h3>Monthly P&I Payment</h3>
              <p className="result-value">{formatCurrency(results.monthlyPI)}</p>
              <small>Principal + Interest only</small>
            </div>

            <div className="result-card">
              <h3>Total Monthly Payment</h3>
              <p className="result-value">{formatCurrency(results.totalMonthlyPayment)}</p>
              <small>Including taxes, insurance, PMI, and HOA</small>
            </div>

            <div className="result-card">
              <h3>Total Interest</h3>
              <p className="result-value">{formatCurrency(results.totalInterestPaid)}</p>
              <small>Over {inputs.loanTermYears} years</small>
            </div>

            <div className="result-card">
              <h3>Total Cost</h3>
              <p className="result-value">{formatCurrency(results.totalCost)}</p>
              <small>Principal + Interest</small>
            </div>
          </div>

          {/* Extra Payment Results */}
          {inputs.extraPrincipalPayment > 0 && (
            <div className="extra-payment-results">
              <h3>With Extra Payments</h3>
              <div className="extra-results-grid">
                <div>
                  <strong>Payoff Date:</strong> {results.monthsToPayoffWithExtra} months
                  <br />
                  <small>({formatNumber(results.monthsToPayoffWithExtra / 12, 1)} years)</small>
                </div>
                <div>
                  <strong>Months Saved:</strong> {results.monthsSaved}
                </div>
                <div>
                  <strong>Interest Saved:</strong> {formatCurrency(results.interestSaved)}
                </div>
                <div>
                  <strong>New Total Cost:</strong> {formatCurrency(results.extraTotalCost)}
                </div>
              </div>
            </div>
          )}

          {/* Amortization Schedule */}
          <div className="amortization-section">
            <div className="schedule-controls">
              <div className="tab-buttons">
                <button
                  className={activeTab === 'monthly' ? 'active' : ''}
                  onClick={() => setActiveTab('monthly')}
                >
                  Monthly Schedule
                </button>
                <button
                  className={activeTab === 'yearly' ? 'active' : ''}
                  onClick={() => setActiveTab('yearly')}
                >
                  Yearly Summary
                </button>
              </div>
              {inputs.extraPrincipalPayment > 0 && (
                <label className="toggle-extra">
                  <input
                    type="checkbox"
                    checked={showExtraPayments}
                    onChange={(e) => setShowExtraPayments(e.target.checked)}
                  />
                  Show with extra payments
                </label>
              )}
            </div>

            {activeTab === 'monthly' ? (
              <div className="schedule-table-container">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Payment</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSchedule.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{formatCurrency(row.payment)}</td>
                        <td>{formatCurrency(row.principal)}</td>
                        <td>{formatCurrency(row.interest)}</td>
                        <td>{formatCurrency(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="schedule-table-container">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Total Principal</th>
                      <th>Total Interest</th>
                      <th>Ending Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentYearlySummary.map((summary) => (
                      <tr key={summary.year}>
                        <td>{summary.year}</td>
                        <td>{formatCurrency(summary.totalPrincipal)}</td>
                        <td>{formatCurrency(summary.totalInterest)}</td>
                        <td>{formatCurrency(summary.endingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

