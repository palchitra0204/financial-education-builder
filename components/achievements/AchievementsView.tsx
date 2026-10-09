'use client';

import React, { useState } from 'react';
import { useFinEduStore } from '@/lib/store';
import { ALL_BADGES, getUserLevel } from '@/lib/badges';
import { Badge } from '@/types';
import {
  Award,
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  Lock,
  Target,
  GraduationCap,
  Footprints,
  BookOpen,
  Zap,
  Edit3,
  Crown,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { progress, customModules, modules } = useFinEduStore();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const userLevel = getUserLevel(progress.xp);
  const totalLessons = [...modules, ...customModules].reduce((acc, m) => acc + m.lessons.length, 0);
  const studyMinutes = Math.floor(progress.totalStudyTimeSeconds / 60);

  // Quiz statistics
  const quizAttemptsList = Object.values(progress.quizAttempts);
  const totalQuizzesPassed = quizAttemptsList.filter((a) => a.passed).length;
  const avgQuizScore =
    quizAttemptsList.length > 0
      ? Math.round(
          quizAttemptsList.reduce((acc, a) => acc + a.percentage, 0) / quizAttemptsList.length
        )
      : 0;

  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: `w-6 h-6 ${isUnlocked ? 'text-amber-500' : 'text-slate-400'}` };
    switch (iconName) {
      case 'Footprints':
        return <Footprints {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'GraduationCap':
        return <GraduationCap {...props} />;
      case 'CheckCircle2':
        return <CheckCircle2 {...props} />;
      case 'Target':
        return <Target {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Clock':
        return <Clock {...props} />;
      case 'Edit3':
        return <Edit3 {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Level Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-lg shadow-indigo-500/30 shrink-0">
            {userLevel.level}
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 block mb-0.5">
              Rank Level {userLevel.level}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {userLevel.title}
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-1">
              {progress.xp} Total XP Accumulated
            </p>
          </div>
        </div>

        {/* Progress to Next Level */}
        <div className="w-full md:max-w-xs space-y-2 bg-white/10 p-4 rounded-2xl backdrop-blur-xs border border-white/10">
          <div className="flex justify-between text-xs font-semibold text-slate-200">
            <span>Next Level</span>
            <span className="font-mono">{userLevel.nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${userLevel.progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            {userLevel.nextLevelXp - progress.xp} XP to level up
          </div>
        </div>
      </div>

      {/* Analytics Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Learning Streak</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono block">
            {progress.streakDays} Day{progress.streakDays === 1 ? '' : 's'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Study Time</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono block">
            {studyMinutes} Min
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Lessons Finished</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono block">
            {progress.completedLessonIds.length} / {totalLessons}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Award className="w-4 h-4 text-purple-500" />
            <span>Quizzes Passed</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono block">
            {totalQuizzesPassed} ({avgQuizScore}% Avg)
          </span>
        </div>
      </div>

      {/* Badges Hub */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Badges & Milestones</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unlock special investor badges by completing lessons, passing quizzes, and authoring modules.
            </p>
          </div>
          <div className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            {progress.unlockedBadgeIds.length} / {ALL_BADGES.length} Unlocked
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);

            const getRarityBadge = () => {
              switch (badge.rarity) {
                case 'Legendary':
                  return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
                case 'Epic':
                  return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
                case 'Rare':
                  return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
                default:
                  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
              }
            };

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isUnlocked
                    ? 'border-amber-200/80 dark:border-amber-800/50 bg-amber-50/20 dark:bg-amber-950/10 hover:shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-100 dark:bg-amber-950/60 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isUnlocked ? (
                    getBadgeIcon(badge.icon, true)
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`font-bold text-xs sm:text-sm truncate ${
                        isUnlocked
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {badge.title}
                    </h4>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono ${getRarityBadge()}`}
                    >
                      {badge.rarity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {badge.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      +{badge.xpReward} XP
                    </span>
                    <span
                      className={`font-semibold ${
                        isUnlocked
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
