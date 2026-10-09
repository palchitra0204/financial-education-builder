'use client';

import React, { useState } from 'react';
import { useFinEduStore } from '@/lib/store';
import { LessonViewer } from '@/components/lesson/LessonViewer';
import { DifficultyLevel, ModuleCategory, Module } from '@/types';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  PieChart,
  ShieldAlert,
  BarChart3,
  Wallet,
  Layers,
  Edit3,
  PlusCircle,
  Play,
  Check,
} from 'lucide-react';

export const ModulesView: React.FC = () => {
  const {
    modules,
    customModules,
    activeLessonId,
    navigateToLesson,
    progress,
    searchQuery,
    setSearchQuery,
    selectedLevelFilter,
    setSelectedLevelFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedCompletionFilter,
    setSelectedCompletionFilter,
    setActiveTab,
    setBuilderDraft,
  } = useFinEduStore();

  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // If a lesson is active, render the dedicated LessonViewer
  if (activeLessonId) {
    return <LessonViewer />;
  }

  const allModules = [...modules, ...customModules];

  // Categories list
  const categories: (ModuleCategory | 'All')[] = [
    'All',
    'Basics',
    'Investing',
    'Compounding',
    'Funds',
    'Risk & Portfolio',
    'Valuation',
    'Personal Finance',
    'Terminology',
  ];

  // Levels list
  const levels: (DifficultyLevel | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Completion statuses
  const completionStatuses = ['All', 'In Progress', 'Completed', 'Not Started'];

  // Filter modules
  const filteredModules = allModules.filter((m) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMod =
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);
      const matchLesson = m.lessons.some(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      );
      if (!matchMod && !matchLesson) return false;
    }

    // 2. Level
    if (selectedLevelFilter !== 'All' && m.level !== selectedLevelFilter) {
      return false;
    }

    // 3. Category
    if (selectedCategoryFilter !== 'All' && m.category !== selectedCategoryFilter) {
      return false;
    }

    // 4. Completion Status
    const completedLessonsCount = m.lessons.filter((l) =>
      progress.completedLessonIds.includes(l.id)
    ).length;
    const isCompleted = m.lessons.length > 0 && completedLessonsCount === m.lessons.length;
    const isStarted = completedLessonsCount > 0;

    if (selectedCompletionFilter === 'Completed' && !isCompleted) return false;
    if (selectedCompletionFilter === 'In Progress' && (!isStarted || isCompleted)) return false;
    if (selectedCompletionFilter === 'Not Started' && isStarted) return false;

    return true;
  });

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-white" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-white" />;
      case 'PieChart':
        return <PieChart className="w-5 h-5 text-white" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-white" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-white" />;
      case 'Wallet':
        return <Wallet className="w-5 h-5 text-white" />;
      default:
        return <BookOpen className="w-5 h-5 text-white" />;
    }
  };

  const handleEditModule = (mod: Module, e: React.MouseEvent) => {
    e.stopPropagation();
    setBuilderDraft(mod);
    setActiveTab('builder');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Financial Curriculum
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Explore {allModules.length} structured modules covering essential financial concepts, valuation, and wealth frameworks.
          </p>
        </div>

        <button
          onClick={() => {
            setBuilderDraft(null);
            setActiveTab('builder');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Module</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        {/* Search & Level Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, lesson titles, formulas..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Level:</span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                  selectedLevelFilter === lvl
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedCategoryFilter === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      {filteredModules.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No matching modules found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or filters above to find relevant lessons.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLevelFilter('All');
              setSelectedCategoryFilter('All');
              setSelectedCompletionFilter('All');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => {
            const completedCount = mod.lessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;
            const progressPercent =
              mod.lessons.length > 0
                ? Math.round((completedCount / mod.lessons.length) * 100)
                : 0;
            const isAllCompleted = mod.lessons.length > 0 && completedCount === mod.lessons.length;
            const isExpanded = expandedModuleId === mod.id;

            return (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Module Top Banner */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mod.colorGradient || 'from-blue-600 to-indigo-700'} flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform`}
                    >
                      {getModuleIcon(mod.icon)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {mod.isCustom && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                          Custom
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          mod.level === 'Beginner'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                            : mod.level === 'Intermediate'
                            ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {mod.level}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                      {mod.category}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  {/* Progress Bar & Stats */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {completedCount} of {mod.lessons.length} completed
                      </span>
                      <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isAllCompleted
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Lessons list accordion */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <span>{mod.lessons.length} Lessons in Module</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {isExpanded ? 'Hide' : 'View Lessons'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-1.5 animate-slide-up">
                        {mod.lessons.map((les, lIdx) => {
                          const isLesDone = progress.completedLessonIds.includes(les.id);
                          return (
                            <div
                              key={les.id}
                              onClick={() => navigateToLesson(mod.id, les.id)}
                              className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer flex items-center justify-between gap-2 text-xs transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                    isLesDone
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 text-[10px]'
                                  }`}
                                >
                                  {isLesDone ? <Check className="w-3 h-3" /> : lIdx + 1}
                                </div>
                                <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                  {les.title}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                {les.estimatedMinutes}m
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{mod.estimatedHours}h</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {mod.isCustom && (
                      <button
                        onClick={(e) => handleEditModule(mod, e)}
                        className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="Edit Module in Builder"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (mod.lessons.length > 0) {
                          // Pick first uncompleted lesson, or first lesson
                          const firstUncompleted =
                            mod.lessons.find(
                              (l) => !progress.completedLessonIds.includes(l.id)
                            ) || mod.lessons[0];
                          navigateToLesson(mod.id, firstUncompleted.id);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isAllCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      <span>{isAllCompleted ? 'Review' : completedCount > 0 ? 'Continue' : 'Start'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
