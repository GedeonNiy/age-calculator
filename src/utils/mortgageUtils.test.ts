/**
 * Unit tests for mortgage calculation utilities
 */

import { calculateMonthlyPayment } from './mortgageUtils';

/**
 * Test mortgage calculation with standard scenario
 * 
 * Test case: principal = 350000, annualRate = 5, years = 30
 * Expected monthly payment ≈ 1878.88
 * Expected total paid ≈ 676395.24
 * Expected total interest ≈ 326395.24
 */
function testMortgageCalculation() {
  const principal = 350000;
  const annualRate = 5; // 5%
  const years = 30;
  const totalMonths = years * 12; // 360 months

  // Calculate monthly payment
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, totalMonths);
  
  // Round monthly payment to 2 decimals for display
  const monthlyPaymentRounded = Math.round(monthlyPayment * 100) / 100;
  
  // Calculate totals using unrounded monthly payment for accuracy, then round final results
  const totalPaid = monthlyPayment * totalMonths;
  const totalPaidRounded = Math.round(totalPaid * 100) / 100;
  const totalInterestRounded = Math.round((totalPaidRounded - principal) * 100) / 100;

  // Expected values
  const expectedMonthlyPayment = 1878.88;
  const expectedTotalPaid = 676395.24;
  const expectedTotalInterest = 326395.24;
  const tolerance = 0.01;

  // Assertions
  const monthlyPaymentPass = Math.abs(monthlyPaymentRounded - expectedMonthlyPayment) <= tolerance;
  const totalPaidPass = Math.abs(totalPaidRounded - expectedTotalPaid) <= tolerance;
  const totalInterestPass = Math.abs(totalInterestRounded - expectedTotalInterest) <= tolerance;

  console.log('=== Mortgage Calculation Test ===');
  console.log(`Principal: $${principal.toLocaleString()}`);
  console.log(`Annual Rate: ${annualRate}%`);
  console.log(`Term: ${years} years (${totalMonths} months)`);
  console.log('');
  console.log('Results:');
  console.log(`  Monthly Payment: $${monthlyPaymentRounded.toFixed(2)} (expected: $${expectedMonthlyPayment.toFixed(2)})`);
  console.log(`  Total Paid: $${totalPaidRounded.toFixed(2)} (expected: $${expectedTotalPaid.toFixed(2)})`);
  console.log(`  Total Interest: $${totalInterestRounded.toFixed(2)} (expected: $${expectedTotalInterest.toFixed(2)})`);
  console.log('');
  console.log('Test Results:');
  console.log(`  Monthly Payment: ${monthlyPaymentPass ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  Total Paid: ${totalPaidPass ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  Total Interest: ${totalInterestPass ? '✓ PASS' : '✗ FAIL'}`);
  console.log('');

  if (monthlyPaymentPass && totalPaidPass && totalInterestPass) {
    console.log('✅ All tests PASSED!');
    return true;
  } else {
    console.log('❌ Some tests FAILED!');
    return false;
  }
}

// Run test if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('mortgageUtils.test')) {
  const passed = testMortgageCalculation();
  process.exit(passed ? 0 : 1);
}

export { testMortgageCalculation };

