import MortgageCalculator from '../components/MortgageCalculator';

export default function MortgageCalculatorPage() {
  return (
    <div className="mortgage-calculator-page">
      <div className="page-header">
        <h1>Mortgage Calculator</h1>
        <p className="page-description">
          Calculate your monthly mortgage payment, total interest, and see how extra payments can save you money.
        </p>
      </div>
      <MortgageCalculator />
    </div>
  );
}






