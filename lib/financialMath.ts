import { AmortizationRow } from '@/types';

/**
 * Compound Interest Calculator with regular periodic additions
 * Formula: A = P(1 + r/n)^(nt) + PMT * [ ((1 + r/n)^(nt) - 1) / (r/n) ]
 */
export interface CompoundInterestInput {
  principal: number;
  monthlyDeposit: number;
  annualRate: number; // in percentage e.g. 8 for 8%
  years: number;
  compoundingFrequency?: 'monthly' | 'quarterly' | 'annually';
  inflationRate?: number; // in percentage e.g. 3 for 3%
}

export interface CompoundInterestYearlyData {
  year: number;
  totalDeposited: number;
  interestEarnedYear: number;
  totalInterestEarned: number;
  futureValueNominal: number;
  futureValueReal: number; // Inflation adjusted
}

export interface CompoundInterestResult {
  totalDeposited: number;
  totalInterest: number;
  futureValue: number;
  futureValueReal: number;
  yearlyBreakdown: CompoundInterestYearlyData[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const {
    principal = 0,
    monthlyDeposit = 0,
    annualRate = 0,
    years = 1,
    compoundingFrequency = 'monthly',
    inflationRate = 0,
  } = input;

  const n = compoundingFrequency === 'monthly' ? 12 : compoundingFrequency === 'quarterly' ? 4 : 1;
  const r = annualRate / 100;
  const inf = inflationRate / 100;

  let currentBalance = principal;
  let totalDeposited = principal;
  let totalInterest = 0;
  const yearlyBreakdown: CompoundInterestYearlyData[] = [];

  for (let yr = 1; yr <= years; yr++) {
    const startBalanceOfYear = currentBalance;
    let interestEarnedThisYear = 0;

    // Simulate month by month for exact compounding with deposits
    for (let m = 1; m <= 12; m++) {
      currentBalance += monthlyDeposit;
      totalDeposited += monthlyDeposit;
      
      const monthlyRate = r / 12;
      const monthInterest = currentBalance * monthlyRate;
      currentBalance += monthInterest;
      interestEarnedThisYear += monthInterest;
    }

    totalInterest += interestEarnedThisYear;
    const futureValueReal = currentBalance / Math.pow(1 + inf, yr);

    yearlyBreakdown.push({
      year: yr,
      totalDeposited: Math.round(totalDeposited),
      interestEarnedYear: Math.round(interestEarnedThisYear),
      totalInterestEarned: Math.round(totalInterest),
      futureValueNominal: Math.round(currentBalance),
      futureValueReal: Math.round(futureValueReal),
    });
  }

  return {
    totalDeposited: Math.round(totalDeposited),
    totalInterest: Math.round(totalInterest),
    futureValue: Math.round(currentBalance),
    futureValueReal: Math.round(currentBalance / Math.pow(1 + inf, years)),
    yearlyBreakdown,
  };
}

/**
 * SIP (Systematic Investment Plan) with Optional Step-Up %
 */
export interface SIPInput {
  monthlyInvestment: number;
  expectedAnnualReturn: number; // percentage
  years: number;
  annualStepUpPercent?: number; // annual percentage increase in monthly installment
}

export interface SIPResult {
  totalInvested: number;
  totalGains: number;
  futureValue: number;
  yearlyBreakdown: {
    year: number;
    monthlyContribution: number;
    investedAmount: number;
    totalValue: number;
    gains: number;
  }[];
}

export function calculateSIP(input: SIPInput): SIPResult {
  const {
    monthlyInvestment,
    expectedAnnualReturn,
    years,
    annualStepUpPercent = 0,
  } = input;

  const monthlyRate = expectedAnnualReturn / 100 / 12;
  let currentBalance = 0;
  let totalInvested = 0;
  let currentMonthly = monthlyInvestment;
  const yearlyBreakdown = [];

  for (let yr = 1; yr <= years; yr++) {
    for (let m = 1; m <= 12; m++) {
      totalInvested += currentMonthly;
      currentBalance = (currentBalance + currentMonthly) * (1 + monthlyRate);
    }

    yearlyBreakdown.push({
      year: yr,
      monthlyContribution: Math.round(currentMonthly),
      investedAmount: Math.round(totalInvested),
      totalValue: Math.round(currentBalance),
      gains: Math.round(currentBalance - totalInvested),
    });

    if (annualStepUpPercent > 0) {
      currentMonthly = currentMonthly * (1 + annualStepUpPercent / 100);
    }
  }

  return {
    totalInvested: Math.round(totalInvested),
    totalGains: Math.round(currentBalance - totalInvested),
    futureValue: Math.round(currentBalance),
    yearlyBreakdown,
  };
}

/**
 * Loan EMI & Amortization Schedule
 * Formula: EMI = [P * r * (1+r)^n] / [(1+r)^n - 1]
 */
export interface LoanEMIInput {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
}

export interface LoanEMIResult {
  monthlyEMI: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: AmortizationRow[];
}

export function calculateLoanEMI(input: LoanEMIInput): LoanEMIResult {
  const { principal, annualInterestRate, tenureYears } = input;
  const totalMonths = tenureYears * 12;
  const monthlyRate = annualInterestRate / 100 / 12;

  if (monthlyRate === 0) {
    const emi = principal / totalMonths;
    return {
      monthlyEMI: Math.round(emi),
      totalPrincipal: principal,
      totalInterest: 0,
      totalPayment: principal,
      amortizationSchedule: [],
    };
  }

  const emiNumerator = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths);
  const emiDenominator = Math.pow(1 + monthlyRate, totalMonths) - 1;
  const monthlyEMI = emiNumerator / emiDenominator;

  let balance = principal;
  let totalInterest = 0;
  const amortizationSchedule: AmortizationRow[] = [];

  for (let yr = 1; yr <= tenureYears; yr++) {
    const openingBalance = balance;
    let principalPaidYear = 0;
    let interestPaidYear = 0;

    for (let m = 1; m <= 12; m++) {
      const interestMonth = balance * monthlyRate;
      const principalMonth = monthlyEMI - interestMonth;

      interestPaidYear += interestMonth;
      principalPaidYear += principalMonth;
      balance = Math.max(0, balance - principalMonth);
    }

    totalInterest += interestPaidYear;

    amortizationSchedule.push({
      year: yr,
      openingBalance: Math.round(openingBalance),
      emiPaid: Math.round(monthlyEMI * 12),
      principalPaid: Math.round(principalPaidYear),
      interestPaid: Math.round(interestPaidYear),
      closingBalance: Math.round(balance),
    });
  }

  return {
    monthlyEMI: Math.round(monthlyEMI),
    totalPrincipal: Math.round(principal),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(principal + totalInterest),
    amortizationSchedule,
  };
}

/**
 * Investment Returns: CAGR & Absolute Return
 */
export function calculateCAGR(initialValue: number, finalValue: number, years: number): number {
  if (initialValue <= 0 || years <= 0) return 0;
  const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
  return Number(cagr.toFixed(2));
}

export function calculateAbsoluteReturn(initialValue: number, finalValue: number): number {
  if (initialValue <= 0) return 0;
  const abs = ((finalValue - initialValue) / initialValue) * 100;
  return Number(abs.toFixed(2));
}

/**
 * Rule of 72 Doubling Time
 * Doubling Time ≈ 72 / Rate
 */
export function calculateRuleOf72(interestRate: number): number {
  if (interestRate <= 0) return 0;
  return Number((72 / interestRate).toFixed(1));
}

/**
 * Financial Ratios
 */
export function calculatePE(sharePrice: number, earningsPerShare: number): number {
  if (earningsPerShare <= 0) return 0;
  return Number((sharePrice / earningsPerShare).toFixed(2));
}

export function calculatePEG(peRatio: number, annualEarningsGrowthPercent: number): number {
  if (annualEarningsGrowthPercent <= 0) return 0;
  return Number((peRatio / annualEarningsGrowthPercent).toFixed(2));
}

export function calculateDebtToEquity(totalDebt: number, totalEquity: number): number {
  if (totalEquity <= 0) return 0;
  return Number((totalDebt / totalEquity).toFixed(2));
}

export function calculateROE(netIncome: number, shareholderEquity: number): number {
  if (shareholderEquity <= 0) return 0;
  return Number(((netIncome / shareholderEquity) * 100).toFixed(2));
}

export function calculateCurrentRatio(currentAssets: number, currentLiabilities: number): number {
  if (currentLiabilities <= 0) return 0;
  return Number((currentAssets / currentLiabilities).toFixed(2));
}

/**
 * Portfolio Risk & Sharpe Ratio
 * Sharpe Ratio = (Portfolio Return - Risk Free Rate) / Portfolio Standard Deviation
 */
export function calculateSharpeRatio(
  portfolioReturnPercent: number,
  riskFreeRatePercent: number,
  standardDeviationPercent: number
): number {
  if (standardDeviationPercent <= 0) return 0;
  const sharpe = (portfolioReturnPercent - riskFreeRatePercent) / standardDeviationPercent;
  return Number(sharpe.toFixed(2));
}

/**
 * Format currency with locale formatting
 */
export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toLocaleString('en-US')}`;
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
