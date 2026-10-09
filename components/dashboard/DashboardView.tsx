'use client';

import React from 'react';
import { useFinEduStore } from '@/lib/store';
import { getUserLevel, ALL_BADGES } from '@/lib/badges';
import { InteractiveGrowthChart } from '@/components/charts/InteractiveGrowthChart';
import { calculateCompoundInterest } from '@/lib/financialMath';
import {
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Calculator,
  CheckCircle2,
  PieChart,
  PlusCircle,
  Play,
  Layers,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    progress,
    modules,
    customModules,
    navigateToLesson,
    setActiveTab,
    setBuilderDraft,
  } = useFinEduStore();

  const allModules = [...modules, ...customModules];
  const totalLessons = allModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessonsCount = progress.completedLessonIds.length;
  const progressPct =
    totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
  const userLevel = getUserLevel(progress.xp);
  const studyMinutes = Math.floor(progress.totalStudyTimeSeconds / 60);

  // Growth preview sample chart
  const sampleCompound = calculateCompoundInterest({
    principal: 5000,
    monthlyDeposit: 250,
    annualRate: 10,
    years: 10,
    inflationRate: 3,
  });

  // Find next recommended lesson (first uncompleted lesson)
  let nextLessonToStudy: { moduleId: string; moduleTitle: string; lesson: (typeof allModules)[0]['lessons'][0] } | null = null;
  for (const mod of allModules) {
    const uncompleted = mod.lessons.find((l) => !progress.completedLessonIds.includes(l.id));
    if (uncompleted) {
      nextLessonToStudy = {
        moduleId: mod.id,
        moduleTitle: mod.title,
        lesson: uncompleted,
      };
      break;
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Welcome & Level Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-semibold text-[11px] backdrop-blur-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Level {userLevel.level} • {userLevel.title}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[11px] font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {progress.streakDays}-Day Streak
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back to your Wealth Journey
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Master financial literacy, simulate portfolio growth, and test your acumen across {allModules.length} interactive modules.
            </p>
          </div>

          {/* Quick Level XP Pill */}
          <div className="w-full lg:w-72 bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-md space-y-2 shrink-0">
            <div className="flex justify-between text-xs font-semibold text-blue-100">
              <span>Level Progress</span>
              <span className="font-mono">{userLevel.progressPercent}%</span>
            </div>
            <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${userLevel.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-blue-200/80 font-mono">
              <span>{progress.xp} XP Earned</span>
              <span>{userLevel.nextLevelXp} XP Next</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Statistics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Curriculum Done</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {progressPct}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {completedLessonsCount}/{totalLessons} lessons
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Total Points (XP)</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {progress.xp}
            </span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Rank {userLevel.level}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Time Studying</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {studyMinutes}m
            </span>
            <span className="text-xs text-emerald-600 font-medium">Active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Badges Unlocked</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {progress.unlockedBadgeIds.length} / {ALL_BADGES.length}
            </span>
            <span className="text-xs text-amber-600 font-medium">Milestones</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Continue Learning / Next Lesson & Quick Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Continue Learning & Recommended Module */}
        <div className="lg:col-span-7 space-y-6">
          {/* Continue Learning / Next Lesson Card */}
          {progress.lastVisitedLesson ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Resume Your Study
                </span>
                <span className="text-xs text-slate-400">Last visited</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {progress.lastVisitedLesson.lessonTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Part of module: {progress.lastVisitedLesson.moduleTitle}
                </p>
              </div>

              <button
                onClick={() => {
                  if (progress.lastVisitedLesson) {
                    navigateToLesson(
                      progress.lastVisitedLesson.moduleId,
                      progress.lastVisitedLesson.lessonId
                    );
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continue Lesson</span>
              </button>
            </div>
          ) : nextLessonToStudy ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Recommended Next Lesson
                </span>
                <span className="text-xs text-slate-400">
                  {nextLessonToStudy.lesson.estimatedMinutes} min
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {nextLessonToStudy.lesson.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {nextLessonToStudy.moduleTitle}
                </p>
              </div>

              <button
                onClick={() => {
                  if (nextLessonToStudy) {
                    navigateToLesson(nextLessonToStudy.moduleId, nextLessonToStudy.lesson.id);
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Lesson</span>
              </button>
            </div>
          ) : null}

          {/* Featured Curriculum Modules Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Featured Modules</span>
              </h3>
              <button
                onClick={() => setActiveTab('modules')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View All ({allModules.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allModules.slice(0, 4).map((mod) => {
                const completed = mod.lessons.filter((l) =>
                  progress.completedLessonIds.includes(l.id)
                ).length;
                const pct =
                  mod.lessons.length > 0
                    ? Math.round((completed / mod.lessons.length) * 100)
                    : 0;

                return (
                  <div
                    key={mod.id}
                    onClick={() => {
                      if (mod.lessons.length > 0) {
                        navigateToLesson(mod.id, mod.lessons[0].id);
                      }
                    }}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md cursor-pointer transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            mod.level === 'Beginner'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : mod.level === 'Intermediate'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          }`}
                        >
                          {mod.level}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {mod.lessons.length} lessons
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {mod.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {mod.description}
                      </p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Progress</span>
                        <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Growth Visualizer & Interactive Calculators Launchpad */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Growth Visualizer Preview */}
          <InteractiveGrowthChart
            data={sampleCompound.yearlyBreakdown.map((row) => ({
              label: `Yr ${row.year}`,
              value1: row.totalDeposited,
              value2: row.futureValueNominal,
            }))}
            series1Name="Deposited"
            series2Name="Compounded"
            title="Sample 10-Yr Compounding Projection"
          />

          {/* Calculators Quick Launch Cards */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Financial Calculators
              </h4>
              <button
                onClick={() => setActiveTab('calculators')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Open Studio
              </button>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'compound',
                  title: 'Compound Interest Calculator',
                  desc: 'Simulate compounding with regular deposits & inflation.',
                  color: 'text-blue-500',
                },
                {
                  id: 'sip',
                  title: 'SIP & Wealth Builder',
                  desc: 'Systematic investment with salary step-up percent.',
                  color: 'text-emerald-500',
                },
                {
                  id: 'emi',
                  title: 'Loan EMI & Amortization',
                  desc: 'Calculate monthly payments and total interest costs.',
                  color: 'text-purple-500',
                },
              ].map((calc) => (
                <div
                  key={calc.id}
                  onClick={() => setActiveTab('calculators')}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                >
                  <div>
                    <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                      {calc.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 truncate">{calc.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
