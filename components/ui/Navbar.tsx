'use client';

import React, { useEffect } from 'react';
import { useFinEduStore } from '@/lib/store';
import { getUserLevel } from '@/lib/badges';
import {
  Sparkles,
  Flame,
  Clock,
  Moon,
  Sun,
  Search,
  BookOpen,
  PlusCircle,
  Menu,
  X,
  Award,
  Calculator,
  LayoutDashboard,
} from 'lucide-react';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const {
    progress,
    darkMode,
    toggleDarkMode,
    activeTab,
    setActiveTab,
    incrementStudyTime,
    customModules,
  } = useFinEduStore();

  const userLevel = getUserLevel(progress.xp);

  // Auto-increment active study time every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // If user is actively on window
      if (!document.hidden) {
        incrementStudyTime(30);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [incrementStudyTime]);

  const studyMinutes = Math.floor(progress.totalStudyTimeSeconds / 60);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent block leading-tight">
                FinEdu Builder
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Interactive Financial Education
              </span>
            </div>
          </button>
        </div>

        {/* Global Quick Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all max-w-xs w-full"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Search lessons, calculators, modules...</span>
          <kbd className="ml-auto hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Right Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Study time badge */}
          <div
            title={`Total study time: ${studyMinutes} minutes`}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{studyMinutes}m</span>
          </div>

          {/* Daily Streak */}
          <div
            title={`Active learning streak: ${progress.streakDays} day(s)`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-xs font-semibold shadow-xs"
          >
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{progress.streakDays}d</span>
          </div>

          {/* XP & Level Pill */}
          <button
            onClick={() => setActiveTab('achievements')}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100/70 transition-all"
            title={`Level ${userLevel.level}: ${userLevel.title}. Click for Achievements.`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Lvl {userLevel.level}</span>
            <span className="font-mono text-[11px] font-bold">{progress.xp} XP</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
