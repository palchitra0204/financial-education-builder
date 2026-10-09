'use client';

import React from 'react';
import { useFinEduStore } from '@/lib/store';
import { getUserLevel } from '@/lib/badges';
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  PlusCircle,
  Award,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const {
    activeTab,
    setActiveTab,
    modules,
    customModules,
    progress,
    navigateToLesson,
    resetUserProgress,
  } = useFinEduStore();

  const allModules = [...modules, ...customModules];
  const totalLessons = allModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = progress.completedLessonIds.length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const userLevel = getUserLevel(progress.xp);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'modules',
      label: 'Modules & Lessons',
      icon: BookOpen,
      badge: `${completedCount}/${totalLessons}`,
    },
    {
      id: 'calculators',
      label: 'Financial Calculators',
      icon: Calculator,
      badge: '5 Tools',
    },
    {
      id: 'builder',
      label: 'Module Builder',
      icon: PlusCircle,
      badge: customModules.length > 0 ? `${customModules.length} Custom` : 'Creator',
    },
    {
      id: 'achievements',
      label: 'Badges & Analytics',
      icon: Award,
      badge: `${progress.unlockedBadgeIds.length}/12`,
    },
  ] as const;

  const handleNavClick = (tab: (typeof navItems)[number]['id']) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Main Navigation Menu */}
          <nav className="space-y-1.5" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Continue Learning Mini Widget */}
          {progress.lastVisitedLesson && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Continue Learning
              </span>
              <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                {progress.lastVisitedLesson.lessonTitle}
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-2">
                {progress.lastVisitedLesson.moduleTitle}
              </p>
              <button
                onClick={() => {
                  if (progress.lastVisitedLesson) {
                    navigateToLesson(
                      progress.lastVisitedLesson.moduleId,
                      progress.lastVisitedLesson.lessonId
                    );
                    setMobileMenuOpen(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Resume Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Overall Curriculum Progress Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Curriculum Progress
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                {progressPct}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              <span>{completedCount} of {totalLessons} lessons</span>
              <span>{progress.completedModuleIds.length}/{allModules.length} mods</span>
            </div>
          </div>
        </div>

        {/* Bottom Level Card & Reset progress */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              {userLevel.level}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                {userLevel.title}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {progress.xp} / {userLevel.nextLevelXp} XP
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${userLevel.progressPercent}%` }}
            />
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all lesson progress and quiz scores?')) {
                resetUserProgress();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-red-500 dark:hover:text-red-400 py-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset User Progress</span>
          </button>
        </div>
      </aside>
    </>
  );
};
