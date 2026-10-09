import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalculatorsView } from '@/components/calculators/CalculatorsView';
import { CommandPalette } from '@/components/search/CommandPalette';
import { useFinEduStore } from '@/lib/store';

describe('UI Components and Interactive Tools', () => {
  beforeEach(() => {
    useFinEduStore.getState().resetUserProgress();
    useFinEduStore.getState().resetToDefaultCuratedModules();
  });

  it('renders CalculatorsView and allows switching between tools', () => {
    render(<CalculatorsView />);

    // Verify default Compound Interest calculator is visible
    expect(screen.getByText(/Interactive Financial Calculators/i)).toBeInTheDocument();
    expect(screen.getByText(/Initial Investment/i)).toBeInTheDocument();

    // Click on SIP tab
    const sipTab = screen.getByRole('button', { name: /SIP & Wealth Builder/i });
    fireEvent.click(sipTab);

    expect(screen.getByText(/SIP Parameters/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Installment/i)).toBeInTheDocument();

    // Click on Loan EMI tab
    const emiTab = screen.getByRole('button', { name: /Loan EMI & Payoff/i });
    fireEvent.click(emiTab);

    expect(screen.getByText(/Loan Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument();
  });

  it('renders CommandPalette and filters items based on query input', () => {
    const handleClose = () => {};
    render(<CommandPalette isOpen={true} onClose={handleClose} />);

    const searchInput = screen.getByPlaceholderText(/Search financial lessons/i);
    expect(searchInput).toBeInTheDocument();

    // Search for "Stock"
    fireEvent.change(searchInput, { target: { value: 'Stock' } });

    const matches = screen.getAllByText(/Stock Market Basics/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0]).toBeInTheDocument();
  });
});
