import { Badge } from '@/types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge-first-lesson',
    title: 'First Step to Wealth',
    description: 'Complete your very first financial education lesson.',
    icon: 'Footprints',
    category: 'progress',
    rarity: 'Common',
    xpReward: 50,
    checkUnlocked: (progress) => progress.completedLessonIds.length >= 1,
  },
  {
    id: 'badge-three-lessons',
    title: 'Knowledge Builder',
    description: 'Complete 3 educational lessons across any modules.',
    icon: 'BookOpen',
    category: 'progress',
    rarity: 'Common',
    xpReward: 100,
    checkUnlocked: (progress) => progress.completedLessonIds.length >= 3,
  },
  {
    id: 'badge-module-master',
    title: 'Module Graduate',
    description: 'Complete all lessons within any full module.',
    icon: 'GraduationCap',
    category: 'progress',
    rarity: 'Rare',
    xpReward: 250,
    checkUnlocked: (progress) => progress.completedModuleIds.length >= 1,
  },
  {
    id: 'badge-quiz-novice',
    title: 'Quiz Initiate',
    description: 'Pass your first financial quiz with a score of 70% or higher.',
    icon: 'CheckCircle2',
    category: 'quiz',
    rarity: 'Common',
    xpReward: 75,
    checkUnlocked: (progress) =>
      Object.values(progress.quizAttempts).some((attempt) => attempt.passed),
  },
  {
    id: 'badge-quiz-perfect',
    title: 'Bullseye 100%',
    description: 'Score a perfect 100% on any module or lesson quiz.',
    icon: 'Target',
    category: 'quiz',
    rarity: 'Rare',
    xpReward: 200,
    checkUnlocked: (progress) =>
      Object.values(progress.bestQuizScores).some((score) => score === 100),
  },
  {
    id: 'badge-quiz-master',
    title: 'Financial Scholar',
    description: 'Pass at least 5 different lesson quizzes.',
    icon: 'Award',
    category: 'quiz',
    rarity: 'Epic',
    xpReward: 400,
    checkUnlocked: (progress) =>
      Object.values(progress.quizAttempts).filter((a) => a.passed).length >= 5,
  },
  {
    id: 'badge-streak-3',
    title: 'Consistent Learner',
    description: 'Maintain a 3-day active learning streak.',
    icon: 'Flame',
    category: 'streak',
    rarity: 'Rare',
    xpReward: 150,
    checkUnlocked: (progress) => progress.streakDays >= 3,
  },
  {
    id: 'badge-streak-7',
    title: 'Unstoppable Momentum',
    description: 'Maintain a 7-day active learning streak.',
    icon: 'Zap',
    category: 'streak',
    rarity: 'Epic',
    xpReward: 500,
    checkUnlocked: (progress) => progress.streakDays >= 7,
  },
  {
    id: 'badge-study-time',
    title: 'Dedicated Analyst',
    description: 'Spend more than 15 total minutes actively studying concepts.',
    icon: 'Clock',
    category: 'progress',
    rarity: 'Common',
    xpReward: 100,
    checkUnlocked: (progress) => progress.totalStudyTimeSeconds >= 900,
  },
  {
    id: 'badge-creator-first',
    title: 'Curriculum Author',
    description: 'Create and publish a custom financial module in the Module Builder.',
    icon: 'Edit3',
    category: 'builder',
    rarity: 'Rare',
    xpReward: 300,
    checkUnlocked: (_progress, customModulesCount = 0) => customModulesCount >= 1,
  },
  {
    id: 'badge-compounding-guru',
    title: 'Compounding Wizard',
    description: 'Complete the entire Compounding & Time Value module.',
    icon: 'Sparkles',
    category: 'mastery',
    rarity: 'Epic',
    xpReward: 350,
    checkUnlocked: (progress) => progress.completedModuleIds.includes('mod-compounding'),
  },
  {
    id: 'badge-investor-elite',
    title: 'Master Investor',
    description: 'Accumulate 1,000+ XP across all lessons, quizzes, and modules.',
    icon: 'Crown',
    category: 'mastery',
    rarity: 'Legendary',
    xpReward: 1000,
    checkUnlocked: (progress) => progress.xp >= 1000,
  },
];

export function getUserLevel(xp: number): {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const levels = [
    { level: 1, title: 'Novice Investor', minXp: 0, maxXp: 200 },
    { level: 2, title: 'Finance Apprentice', minXp: 200, maxXp: 500 },
    { level: 3, title: 'Market Strategist', minXp: 500, maxXp: 1000 },
    { level: 4, title: 'Portfolio Architect', minXp: 1000, maxXp: 1800 },
    { level: 5, title: 'Chief Financial Officer', minXp: 1800, maxXp: 3000 },
    { level: 6, title: 'Legendary Fund Manager', minXp: 3000, maxXp: 5000 },
  ];

  const current = levels.find((l) => xp >= l.minXp && xp < l.maxXp) || levels[levels.length - 1];
  const levelSpan = current.maxXp - current.minXp;
  const xpIntoLevel = Math.max(0, xp - current.minXp);
  const progressPercent = Math.min(100, Math.round((xpIntoLevel / levelSpan) * 100));

  return {
    level: current.level,
    title: current.title,
    currentLevelXp: xp,
    nextLevelXp: current.maxXp,
    progressPercent,
  };
}
