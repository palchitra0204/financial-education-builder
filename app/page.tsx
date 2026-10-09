'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFinEduStore } from '@/lib/store';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { CommandPalette } from '@/components/search/CommandPalette';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { ModulesView } from '@/components/modules/ModulesView';
import { CalculatorsView } from '@/components/calculators/CalculatorsView';
import { ModuleBuilder } from '@/components/builder/ModuleBuilder';
import { AchievementsView } from '@/components/achievements/AchievementsView';

const queryClient = new QueryClient();

export default function Home() {
  const { darkMode, activeTab } = useFinEduStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync dark mode class on html root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global keyboard listener for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 font-mono">
            Loading FinEdu Builder...
          </span>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        {/* Navigation Bar */}
        <Navbar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="flex-1 max-w-7xl w-full mx-auto flex">
          {/* Left Sidebar */}
          <Sidebar
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />

          {/* Main Workspace Content Area */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'modules' && <ModulesView />}
            {activeTab === 'calculators' && <CalculatorsView />}
            {activeTab === 'builder' && <ModuleBuilder />}
            {activeTab === 'achievements' && <AchievementsView />}
          </main>
        </div>

        {/* Command Palette Modal */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />

        {/* Global Toast Alerts */}
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
}
