import { describe, it, expect } from 'vitest';
import {
  calculateCompoundInterest,
  calculateSIP,
  calculateLoanEMI,
  calculateCAGR,
  calculateAbsoluteReturn,
  calculateRuleOf72,
  calculatePE,
  calculatePEG,
  calculateDebtToEquity,
  calculateROE,
  calculateCurrentRatio,
  calculateSharpeRatio,
  formatCurrency,
  formatPercent,
} from '@/lib/financialMath';

describe('Financial Math Utilities', () => {
  describe('calculateCompoundInterest', () => {
    it('calculates compound interest correctly without monthly deposit', () => {
      const result = calculateCompoundInterest({
        principal: 10000,
        monthlyDeposit: 0,
        annualRate: 10,
        years: 1,
        compoundingFrequency: 'annually',
        inflationRate: 0,
      });

      expect(result.totalDeposited).toBe(10000);
      expect(result.futureValue).toBeGreaterThanOrEqual(11000);
      expect(result.totalInterest).toBeGreaterThanOrEqual(1000);
    });

    it('calculates compound interest with monthly deposit and inflation adjustment', () => {
      const result = calculateCompoundInterest({
        principal: 5000,
        monthlyDeposit: 200,
        annualRate: 8,
        years: 5,
        compoundingFrequency: 'monthly',
        inflationRate: 3,
      });

      expect(result.totalDeposited).toBe(5000 + 200 * 12 * 5); // 17000
      expect(result.futureValue).toBeGreaterThan(result.totalDeposited);
      expect(result.futureValueReal).toBeLessThan(result.futureValue);
      expect(result.yearlyBreakdown).toHaveLength(5);
    });
  });

  describe('calculateSIP', () => {
    it('calculates monthly SIP future value and step-up', () => {
      const result = calculateSIP({
        monthlyInvestment: 500,
        expectedAnnualReturn: 12,
        years: 10,
        annualStepUpPercent: 10,
      });

      expect(result.totalInvested).toBeGreaterThan(500 * 12 * 10);
      expect(result.futureValue).toBeGreaterThan(result.totalInvested);
      expect(Math.abs(result.totalGains - (result.futureValue - result.totalInvested))).toBeLessThanOrEqual(2);
      expect(result.yearlyBreakdown).toHaveLength(10);
    });
  });

  describe('calculateLoanEMI', () => {
    it('calculates monthly EMI and amortization correctly', () => {
      const result = calculateLoanEMI({
        principal: 100000,
        annualInterestRate: 10,
        tenureYears: 5,
      });

      expect(result.monthlyEMI).toBeGreaterThan(2000);
      expect(result.monthlyEMI).toBeLessThan(2300);
      expect(result.totalPrincipal).toBe(100000);
      expect(result.totalPayment).toBe(result.totalPrincipal + result.totalInterest);
      expect(result.amortizationSchedule).toHaveLength(5);
      expect(result.amortizationSchedule[4].closingBalance).toBe(0);
    });

    it('handles zero interest loan gracefully', () => {
      const result = calculateLoanEMI({
        principal: 12000,
        annualInterestRate: 0,
        tenureYears: 1,
      });

      expect(result.monthlyEMI).toBe(1000);
      expect(result.totalInterest).toBe(0);
    });
  });

  describe('calculateCAGR and calculateAbsoluteReturn', () => {
    it('calculates CAGR accurately', () => {
      const cagr = calculateCAGR(10000, 20000, 7.2);
      expect(cagr).toBeCloseTo(10.08, 0);
    });

    it('calculates absolute percentage return correctly', () => {
      const abs = calculateAbsoluteReturn(1000, 1500);
      expect(abs).toBe(50);
    });
  });

  describe('calculateRuleOf72', () => {
    it('calculates doubling time accurately', () => {
      expect(calculateRuleOf72(8)).toBe(9.0);
      expect(calculateRuleOf72(12)).toBe(6.0);
      expect(calculateRuleOf72(6)).toBe(12.0);
    });
  });

  describe('Financial Valuation Ratios', () => {
    it('calculates P/E, PEG, D/E, ROE, Current Ratio correctly', () => {
      expect(calculatePE(100, 5)).toBe(20.0);
      expect(calculatePEG(20, 20)).toBe(1.0);
      expect(calculateDebtToEquity(500000, 1000000)).toBe(0.5);
      expect(calculateROE(150000, 1000000)).toBe(15.0);
      expect(calculateCurrentRatio(200000, 100000)).toBe(2.0);
    });
  });

  describe('calculateSharpeRatio', () => {
    it('calculates risk-adjusted Sharpe ratio', () => {
      const sharpe = calculateSharpeRatio(12, 4, 16);
      expect(sharpe).toBe(0.5);
    });
  });

  describe('Formatters', () => {
    it('formats currency and percentages properly', () => {
      expect(formatCurrency(1500)).toContain('1,500');
      expect(formatPercent(12.5)).toBe('+12.5%');
      expect(formatPercent(-5.0)).toBe('-5.0%');
    });
  });
});
