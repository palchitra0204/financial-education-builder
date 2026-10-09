'use client';

import React, { useState } from 'react';
import {
  calculateCompoundInterest,
  calculateSIP,
  calculateLoanEMI,
  calculateCAGR,
  calculateAbsoluteReturn,
  calculateRuleOf72,
  calculateSharpeRatio,
  formatCurrency,
  formatPercent,
} from '@/lib/financialMath';
import { InteractiveGrowthChart } from '@/components/charts/InteractiveGrowthChart';
import { PortfolioDonutChart } from '@/components/charts/PortfolioDonutChart';
import {
  Sparkles,
  TrendingUp,
  Calculator,
  Percent,
  DollarSign,
  Calendar,
  ShieldAlert,
  ArrowRight,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const CalculatorsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compound' | 'sip' | 'emi' | 'cagr' | 'risk'>('compound');

  // 1. Compound Interest State
  const [ciPrincipal, setCiPrincipal] = useState<number>(10000);
  const [ciMonthlyDeposit, setCiMonthlyDeposit] = useState<number>(500);
  const [ciRate, setCiRate] = useState<number>(8.5);
  const [ciYears, setCiYears] = useState<number>(15);
  const [ciFrequency, setCiFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [ciInflation, setCiInflation] = useState<number>(3.0);
  const [showInflation, setShowInflation] = useState<boolean>(true);
  const [showTableCi, setShowTableCi] = useState<boolean>(false);

  // 2. SIP State
  const [sipMonthly, setSipMonthly] = useState<number>(500);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(15);
  const [sipStepUp, setSipStepUp] = useState<number>(5);

  // 3. EMI State
  const [emiPrincipal, setEmiPrincipal] = useState<number>(250000);
  const [emiRate, setEmiRate] = useState<number>(6.5);
  const [emiYears, setEmiYears] = useState<number>(20);
  const [showAmortizationTable, setShowAmortizationTable] = useState<boolean>(false);

  // 4. CAGR State
  const [cagrInitial, setCagrInitial] = useState<number>(10000);
  const [cagrFinal, setCagrFinal] = useState<number>(25000);
  const [cagrYears, setCagrYears] = useState<number>(7);

  // 5. Risk & Allocation State
  const [allocStocks, setAllocStocks] = useState<number>(60);
  const [allocBonds, setAllocBonds] = useState<number>(25);
  const [allocGold, setAllocGold] = useState<number>(10);
  const [allocCash, setAllocCash] = useState<number>(5);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(4.0);

  // Calculations
  const compoundResult = calculateCompoundInterest({
    principal: ciPrincipal,
    monthlyDeposit: ciMonthlyDeposit,
    annualRate: ciRate,
    years: ciYears,
    compoundingFrequency: ciFrequency,
    inflationRate: showInflation ? ciInflation : 0,
  });

  const sipResult = calculateSIP({
    monthlyInvestment: sipMonthly,
    expectedAnnualReturn: sipRate,
    years: sipYears,
    annualStepUpPercent: sipStepUp,
  });

  const emiResult = calculateLoanEMI({
    principal: emiPrincipal,
    annualInterestRate: emiRate,
    tenureYears: emiYears,
  });

  const cagrValue = calculateCAGR(cagrInitial, cagrFinal, cagrYears);
  const absReturnValue = calculateAbsoluteReturn(cagrInitial, cagrFinal);
  const doublingTimeYears = calculateRuleOf72(ciRate);

  // Portfolio Risk Model
  // Expected returns: Stocks ~10%, Bonds ~5%, Gold ~6%, Cash ~3.5%
  // Volatilities: Stocks ~16%, Bonds ~6%, Gold ~14%, Cash ~0.5%
  const totalAlloc = allocStocks + allocBonds + allocGold + allocCash;
  const normStocks = totalAlloc > 0 ? allocStocks / totalAlloc : 0;
  const normBonds = totalAlloc > 0 ? allocBonds / totalAlloc : 0;
  const normGold = totalAlloc > 0 ? allocGold / totalAlloc : 0;
  const normCash = totalAlloc > 0 ? allocCash / totalAlloc : 0;

  const expectedPortfolioReturn =
    normStocks * 10.5 + normBonds * 5.0 + normGold * 6.5 + normCash * 3.5;

  // Approximate portfolio standard deviation
  const portfolioVolatility = Math.sqrt(
    Math.pow(normStocks * 16, 2) +
      Math.pow(normBonds * 6, 2) +
      Math.pow(normGold * 14, 2) +
      Math.pow(normCash * 0.5, 2) +
      2 * normStocks * normBonds * (16 * 6 * 0.1) +
      2 * normStocks * normGold * (16 * 14 * 0.0)
  );

  const sharpeRatio = calculateSharpeRatio(
    expectedPortfolioReturn,
    riskFreeRate,
    portfolioVolatility
  );

  // Stress Test: 2008 Crash Scenario (-38% stocks, +5% bonds, +12% gold, +1% cash)
  const stressLossPct =
    normStocks * -38 + normBonds * 5.5 + normGold * 12 + normCash * 1.5;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interactive Financial Calculators
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time financial simulation engines with responsive charts, inflation modeling, and stress testing.
          </p>
        </div>
      </div>

      {/* Calculator Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'compound', label: 'Compound Interest', icon: Sparkles },
          { id: 'sip', label: 'SIP & Wealth Builder', icon: TrendingUp },
          { id: 'emi', label: 'Loan EMI & Payoff', icon: Calculator },
          { id: 'cagr', label: 'CAGR & Returns', icon: Percent },
          { id: 'risk', label: 'Risk & Asset Allocation', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. COMPOUND INTEREST CALCULATOR */}
      {activeTab === 'compound' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Parameters
              </h3>

              {/* Initial Principal */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="ci-principal-input" className="font-medium text-slate-700 dark:text-slate-300">
                    Initial Investment
                  </label>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(ciPrincipal)}
                  </span>
                </div>
                <input
                  id="ci-principal-input"
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={ciPrincipal}
                  onChange={(e) => setCiPrincipal(Number(e.target.value))}
                  className="w-full accent-blue-600"
                  aria-label="Initial Investment Slider"
                />
              </div>

              {/* Monthly Deposit */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="ci-monthly-input" className="font-medium text-slate-700 dark:text-slate-300">
                    Monthly Contribution
                  </label>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(ciMonthlyDeposit)}/mo
                  </span>
                </div>
                <input
                  id="ci-monthly-input"
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={ciMonthlyDeposit}
                  onChange={(e) => setCiMonthlyDeposit(Number(e.target.value))}
                  className="w-full accent-blue-600"
                  aria-label="Monthly Contribution Slider"
                />
              </div>

              {/* Annual Return % */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="ci-rate-input" className="font-medium text-slate-700 dark:text-slate-300">
                    Estimated Annual Return
                  </label>
                  <span className="font-bold font-mono text-blue-600 dark:text-blue-400">
                    {ciRate}%
                  </span>
                </div>
                <input
                  id="ci-rate-input"
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={ciRate}
                  onChange={(e) => setCiRate(Number(e.target.value))}
                  className="w-full accent-blue-600"
                  aria-label="Estimated Annual Return Slider"
                />
              </div>

              {/* Time Horizon (Years) */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="ci-years-input" className="font-medium text-slate-700 dark:text-slate-300">
                    Investment Period
                  </label>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {ciYears} Years
                  </span>
                </div>
                <input
                  id="ci-years-input"
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={ciYears}
                  onChange={(e) => setCiYears(Number(e.target.value))}
                  className="w-full accent-blue-600"
                  aria-label="Investment Period Slider"
                />
              </div>

              {/* Compounding Frequency */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Compounding Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['monthly', 'quarterly', 'annually'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setCiFrequency(freq)}
                      className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                        ciFrequency === freq
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inflation Adjustment Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label htmlFor="ci-inflation-toggle" className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span>Adjust for Inflation</span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                  <input
                    id="ci-inflation-toggle"
                    type="checkbox"
                    checked={showInflation}
                    onChange={(e) => setShowInflation(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
                {showInflation && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Inflation Rate Assumption</span>
                      <span className="font-bold text-amber-500">{ciInflation}%/yr</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={ciInflation}
                      onChange={(e) => setCiInflation(Number(e.target.value))}
                      className="w-full accent-amber-500"
                      aria-label="Inflation Rate Assumption Slider"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Output Visuals & Key Metrics */}
            <div className="lg:col-span-7 space-y-4">
              {/* Top Result Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-500 block">Total Invested</span>
                  <span className="text-base sm:text-lg font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                    {formatCurrency(compoundResult.totalDeposited)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-500 block">Total Interest</span>
                  <span className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatCurrency(compoundResult.totalInterest)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-500 block">Future Value</span>
                  <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                    {formatCurrency(compoundResult.futureValue)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40">
                  <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 block">
                    Inflation-Adjusted
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-amber-600 dark:text-amber-300 font-mono">
                    {formatCurrency(compoundResult.futureValueReal)}
                  </span>
                </div>
              </div>

              {/* Chart */}
              <InteractiveGrowthChart
                data={compoundResult.yearlyBreakdown.map((row) => ({
                  label: `Yr ${row.year}`,
                  value1: row.totalDeposited,
                  value2: row.futureValueNominal,
                  value3: showInflation ? row.futureValueReal : undefined,
                }))}
                series1Name="Total Invested"
                series2Name="Future Value (Nominal)"
                series3Name={showInflation ? "Real Purchasing Power" : undefined}
                title={`Growth Projection over ${ciYears} Years at ${ciRate}%`}
              />

              {/* Rule of 72 Callout */}
              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300">
                  💡 <strong>Rule of 72:</strong> At {ciRate}% annual return, your money doubles approximately every{' '}
                  <strong className="text-blue-600 dark:text-blue-400 font-mono">{doublingTimeYears} years</strong>.
                </span>
                <button
                  onClick={() => setShowTableCi(!showTableCi)}
                  className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                >
                  <span>{showTableCi ? 'Hide Table' : 'Yearly Table'}</span>
                  {showTableCi ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Yearly Breakdown Table */}
              {showTableCi && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 font-bold text-xs">
                    Yearly Compounding Breakdown
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <tr>
                          <th className="p-2.5">Year</th>
                          <th className="p-2.5">Invested</th>
                          <th className="p-2.5">Interest (Year)</th>
                          <th className="p-2.5">Total Interest</th>
                          <th className="p-2.5">End Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                        {compoundResult.yearlyBreakdown.map((row) => (
                          <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="p-2.5 font-bold">Yr {row.year}</td>
                            <td className="p-2.5">{formatCurrency(row.totalDeposited)}</td>
                            <td className="p-2.5 text-emerald-600">+{formatCurrency(row.interestEarnedYear)}</td>
                            <td className="p-2.5 text-emerald-600">{formatCurrency(row.totalInterestEarned)}</td>
                            <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                              {formatCurrency(row.futureValueNominal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. SIP (SYSTEMATIC INVESTMENT PLAN) CALCULATOR */}
      {activeTab === 'sip' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                SIP Parameters
              </h3>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="sip-monthly-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Monthly Installment
                  </label>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(sipMonthly)}/mo
                  </span>
                </div>
                <input
                  id="sip-monthly-slider"
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                  aria-label="Monthly Installment Slider"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="sip-rate-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Expected Annual Return
                  </label>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{sipRate}%</span>
                </div>
                <input
                  id="sip-rate-slider"
                  type="range"
                  min="4"
                  max="24"
                  step="0.5"
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                  aria-label="Expected Annual Return Slider"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="sip-tenure-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Tenure
                  </label>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{sipYears} Years</span>
                </div>
                <input
                  id="sip-tenure-slider"
                  type="range"
                  min="1"
                  max="35"
                  step="1"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                  aria-label="Tenure Slider"
                />
              </div>

              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Annual Step-Up (Salary Growth)
                  </span>
                  <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    +{sipStepUp}%/yr
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={sipStepUp}
                  onChange={(e) => setSipStepUp(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                  aria-label="Annual Step-Up Slider"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Increasing your monthly investment by {sipStepUp}% each year dramatically accelerates wealth creation.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Total Invested</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {formatCurrency(sipResult.totalInvested)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Estimated Capital Gains</span>
                  <span className="text-lg font-bold text-emerald-600 font-mono">
                    +{formatCurrency(sipResult.totalGains)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 block font-medium">
                    Total Future Corpus
                  </span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatCurrency(sipResult.futureValue)}
                  </span>
                </div>
              </div>

              {/* Donut Chart Component */}
              <PortfolioDonutChart
                title="Corpus Breakdown"
                centerLabel="Total Value"
                centerValue={sipResult.futureValue}
                segments={[
                  { label: 'Amount Invested', value: sipResult.totalInvested, color: '#3b82f6' },
                  { label: 'Wealth Gained', value: sipResult.totalGains, color: '#10b981' },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. LOAN EMI CALCULATOR */}
      {activeTab === 'emi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-500" />
                Loan Details
              </h3>

              {/* Presets */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Home Loan', amount: 300000, rate: 6.5, years: 25 },
                  { label: 'Auto Loan', amount: 35000, rate: 5.5, years: 5 },
                  { label: 'Personal Loan', amount: 15000, rate: 11.5, years: 3 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setEmiPrincipal(preset.amount);
                      setEmiRate(preset.rate);
                      setEmiYears(preset.years);
                    }}
                    className="p-2 text-center rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-xs transition-colors"
                  >
                    <span className="font-semibold block text-slate-800 dark:text-slate-200">{preset.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{preset.rate}% • {preset.years}y</span>
                  </button>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="emi-principal-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Loan Amount
                  </label>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(emiPrincipal)}
                  </span>
                </div>
                <input
                  id="emi-principal-slider"
                  type="range"
                  min="5000"
                  max="1000000"
                  step="5000"
                  value={emiPrincipal}
                  onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                  className="w-full accent-purple-600"
                  aria-label="Loan Amount Slider"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="emi-rate-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Interest Rate (Annual)
                  </label>
                  <span className="font-bold font-mono text-purple-600 dark:text-purple-400">{emiRate}%</span>
                </div>
                <input
                  id="emi-rate-slider"
                  type="range"
                  min="2"
                  max="24"
                  step="0.25"
                  value={emiRate}
                  onChange={(e) => setEmiRate(Number(e.target.value))}
                  className="w-full accent-purple-600"
                  aria-label="Interest Rate Slider"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="emi-tenure-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Loan Tenure
                  </label>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{emiYears} Years</span>
                </div>
                <input
                  id="emi-tenure-slider"
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={emiYears}
                  onChange={(e) => setEmiYears(Number(e.target.value))}
                  className="w-full accent-purple-600"
                  aria-label="Loan Tenure Slider"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50">
                  <span className="text-xs text-purple-700 dark:text-purple-300 block font-medium">
                    Monthly EMI
                  </span>
                  <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
                    {formatCurrency(emiResult.monthlyEMI)}/mo
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Total Interest</span>
                  <span className="text-lg font-bold text-rose-600 font-mono">
                    {formatCurrency(emiResult.totalInterest)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Total Repayment</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                    {formatCurrency(emiResult.totalPayment)}
                  </span>
                </div>
              </div>

              <PortfolioDonutChart
                title="Payment Composition"
                centerLabel="Total Payment"
                centerValue={emiResult.totalPayment}
                segments={[
                  { label: 'Principal Loan Amount', value: emiResult.totalPrincipal, color: '#6366f1' },
                  { label: 'Total Interest Payable', value: emiResult.totalInterest, color: '#f43f5e' },
                ]}
              />

              <button
                onClick={() => setShowAmortizationTable(!showAmortizationTable)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span>{showAmortizationTable ? 'Hide' : 'View'} Amortization Schedule</span>
                {showAmortizationTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAmortizationTable && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <tr>
                          <th className="p-2">Year</th>
                          <th className="p-2">Principal Paid</th>
                          <th className="p-2">Interest Paid</th>
                          <th className="p-2">Remaining Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                        {emiResult.amortizationSchedule.map((row) => (
                          <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="p-2 font-bold">Yr {row.year}</td>
                            <td className="p-2 text-indigo-600">{formatCurrency(row.principalPaid)}</td>
                            <td className="p-2 text-rose-600">{formatCurrency(row.interestPaid)}</td>
                            <td className="p-2">{formatCurrency(row.closingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. CAGR & INVESTMENT RETURN CALCULATOR */}
      {activeTab === 'cagr' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-500" />
                Return Metrics
              </h3>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="cagr-initial-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Beginning Value
                  </label>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(cagrInitial)}
                  </span>
                </div>
                <input
                  id="cagr-initial-slider"
                  type="range"
                  min="1000"
                  max="200000"
                  step="1000"
                  value={cagrInitial}
                  onChange={(e) => setCagrInitial(Number(e.target.value))}
                  className="w-full accent-blue-600"
                  aria-label="Beginning Value Slider"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="cagr-final-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Ending Value
                  </label>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(cagrFinal)}
                  </span>
                </div>
                <input
                  id="cagr-final-slider"
                  type="range"
                  min="1000"
                  max="1000000"
                  step="2000"
                  value={cagrFinal}
                  onChange={(e) => setCagrFinal(Number(e.target.value))}
                  className="w-full accent-blue-600"
                  aria-label="Ending Value Slider"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="cagr-years-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Duration
                  </label>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{cagrYears} Years</span>
                </div>
                <input
                  id="cagr-years-slider"
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={cagrYears}
                  onChange={(e) => setCagrYears(Number(e.target.value))}
                  className="w-full accent-blue-600"
                  aria-label="Duration Slider"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                    Compound Annual Growth Rate (CAGR)
                  </span>
                  <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                    {formatPercent(cagrValue)}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    The smoothed annual rate of return that would take your investment from {formatCurrency(cagrInitial)} to {formatCurrency(cagrFinal)} in {cagrYears} years.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                    Total Absolute Return
                  </span>
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatPercent(absReturnValue)}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    Net profit of {formatCurrency(cagrFinal - cagrInitial)} generated across the full holding period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. RISK & ASSET ALLOCATION PROFILER */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Asset Allocation Weights
              </h3>

              {/* Equities */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-blue-600 dark:text-blue-400">Equities / Stocks</span>
                  <span className="font-bold font-mono">{allocStocks}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocStocks}
                  onChange={(e) => setAllocStocks(Number(e.target.value))}
                  className="w-full accent-blue-600"
                  aria-label="Equities / Stocks Allocation Slider"
                />
              </div>

              {/* Bonds */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">Fixed Income / Bonds</span>
                  <span className="font-bold font-mono">{allocBonds}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocBonds}
                  onChange={(e) => setAllocBonds(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                  aria-label="Fixed Income / Bonds Allocation Slider"
                />
              </div>

              {/* Gold */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-amber-600 dark:text-amber-400">Gold & Commodities</span>
                  <span className="font-bold font-mono">{allocGold}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocGold}
                  onChange={(e) => setAllocGold(Number(e.target.value))}
                  className="w-full accent-amber-600"
                  aria-label="Gold & Commodities Allocation Slider"
                />
              </div>

              {/* Cash */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Cash / Treasury Bills</span>
                  <span className="font-bold font-mono">{allocCash}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocCash}
                  onChange={(e) => setAllocCash(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                  aria-label="Cash / Treasury Bills Allocation Slider"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs flex justify-between items-center font-mono">
                <span className="text-slate-500">Total Sum:</span>
                <span className={`font-bold ${totalAlloc === 100 ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {totalAlloc}% {totalAlloc !== 100 && '(Normalized automatically)'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Expected Annual Return</span>
                  <span className="text-xl font-bold text-emerald-600 font-mono">
                    {expectedPortfolioReturn.toFixed(1)}%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Portfolio Volatility (σ)</span>
                  <span className="text-xl font-bold text-amber-500 font-mono">
                    ±{portfolioVolatility.toFixed(1)}%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Sharpe Ratio</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                    {sharpeRatio.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Allocation Donut */}
              <PortfolioDonutChart
                title="Asset Allocation Model"
                centerLabel="Weights"
                centerValue="100%"
                segments={[
                  { label: 'Equities', value: normStocks * 100, color: '#3b82f6' },
                  { label: 'Bonds', value: normBonds * 100, color: '#6366f1' },
                  { label: 'Gold', value: normGold * 100, color: '#f59e0b' },
                  { label: 'Cash', value: normCash * 100, color: '#10b981' },
                ]}
              />

              {/* Stress Test Simulator Callout */}
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Historical Stress Test: 2008 Financial Crisis Simulation</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  During 2008, 100% Equities crashed by -37.0%. With your diversified allocation (Equities {allocStocks}%, Bonds {allocBonds}%, Gold {allocGold}%, Cash {allocCash}%), your simulated max portfolio drawdown would have been cushioned to{' '}
                  <strong className="text-rose-600 dark:text-rose-400 font-mono text-sm">
                    {stressLossPct.toFixed(1)}%
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
