'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFinEduStore } from '@/lib/store';
import {
  Search,
  BookOpen,
  Calculator,
  PlusCircle,
  X,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    modules,
    customModules,
    navigateToLesson,
    setActiveTab,
    progress,
  } = useFinEduStore();

  const allModules = [...modules, ...customModules];

  // Build searchable items list
  interface SearchItem {
    id: string;
    type: 'lesson' | 'module' | 'calculator' | 'navigation';
    title: string;
    subtitle: string;
    badge?: string;
    action: () => void;
  }

  const allItems: SearchItem[] = [];

  // 1. Navigation & Actions
  allItems.push({
    id: 'nav-dashboard',
    type: 'navigation',
    title: 'Dashboard',
    subtitle: 'View overall statistics, streak, and level overview',
    action: () => {
      setActiveTab('dashboard');
      onClose();
    },
  });

  allItems.push({
    id: 'nav-builder',
    type: 'navigation',
    title: 'Module Builder & Authoring Studio',
    subtitle: 'Create, edit, and publish custom financial curriculum',
    action: () => {
      setActiveTab('builder');
      onClose();
    },
  });

  allItems.push({
    id: 'nav-achievements',
    type: 'navigation',
    title: 'Badges & Achievements',
    subtitle: 'View your 12 unlocked badges, XP rankings, and streaks',
    action: () => {
      setActiveTab('achievements');
      onClose();
    },
  });

  // 2. Financial Calculators
  const calculators = [
    {
      id: 'calc-compound',
      title: 'Compound Interest Calculator',
      subtitle: 'Exponential growth simulation with monthly deposits & inflation toggle',
    },
    {
      id: 'calc-sip',
      title: 'SIP (Systematic Investment Plan) Calculator',
      subtitle: 'Calculate future wealth with annual step-up percentage',
    },
    {
      id: 'calc-emi',
      title: 'Loan EMI & Amortization Schedule',
      subtitle: 'Monthly EMI payment and full loan payoff schedule',
    },
    {
      id: 'calc-returns',
      title: 'Investment Returns & CAGR Calculator',
      subtitle: 'Compound Annual Growth Rate and Lump Sum vs SIP comparison',
    },
    {
      id: 'calc-risk',
      title: 'Portfolio Risk & Asset Allocation Profiler',
      subtitle: 'Sharpe ratio and multi-asset crash stress testing',
    },
  ];

  calculators.forEach((c) => {
    allItems.push({
      id: c.id,
      type: 'calculator',
      title: c.title,
      subtitle: c.subtitle,
      badge: 'Calculator',
      action: () => {
        setActiveTab('calculators');
        onClose();
      },
    });
  });

  // 3. Modules
  allModules.forEach((m) => {
    allItems.push({
      id: `mod-${m.id}`,
      type: 'module',
      title: m.title,
      subtitle: `${m.level} • ${m.category} • ${m.lessons.length} lessons`,
      badge: m.level,
      action: () => {
        if (m.lessons.length > 0) {
          navigateToLesson(m.id, m.lessons[0].id);
        } else {
          setActiveTab('modules');
        }
        onClose();
      },
    });

    // 4. Lessons
    m.lessons.forEach((l) => {
      const isCompleted = progress.completedLessonIds.includes(l.id);
      allItems.push({
        id: `les-${l.id}`,
        type: 'lesson',
        title: l.title,
        subtitle: `${m.title} • ${l.estimatedMinutes} min read`,
        badge: isCompleted ? 'Completed' : `${l.estimatedMinutes}m`,
        action: () => {
          navigateToLesson(m.id, l.id);
          onClose();
        },
      });
    });
  });

  // Filter items based on search query
  const filteredItems = allItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  }).slice(0, 10);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search financial lessons, tools, calculators, modules..."
            className="w-full bg-transparent border-none outline-hidden text-sm text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/50">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const getItemIcon = () => {
                switch (item.type) {
                  case 'lesson':
                    return <BookOpen className="w-4 h-4 text-blue-500" />;
                  case 'calculator':
                    return <Calculator className="w-4 h-4 text-emerald-500" />;
                  case 'module':
                    return <TrendingUp className="w-4 h-4 text-indigo-500" />;
                  default:
                    return <Sparkles className="w-4 h-4 text-purple-500" />;
                }
              };

              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-500/10 dark:bg-blue-400/10'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {getItemIcon()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          item.badge === 'Completed'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                ↑
              </kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                ↓
              </kbd>{' '}
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                ↵
              </kbd>{' '}
              to select
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
              ESC
            </kbd>{' '}
            to close
          </span>
        </div>
      </div>
    </div>
  );
};
