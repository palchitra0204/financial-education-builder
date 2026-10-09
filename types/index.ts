export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ModuleCategory =
  | 'Basics'
  | 'Investing'
  | 'Funds'
  | 'Risk & Portfolio'
  | 'Valuation'
  | 'Compounding'
  | 'Personal Finance'
  | 'Terminology';

export interface InteractiveCalculationConfig {
  initialPrincipal?: number;
  monthlyDeposit?: number;
  annualRate?: number;
  years?: number;
  compoundingFrequency?: 'monthly' | 'quarterly' | 'annually';
  inflationRate?: number;
  showInflationToggle?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  unit?: string;
  variableLabel?: string;
  formula?: string;
}

export interface InteractiveExample {
  id: string;
  title: string;
  type: 'compound-calc' | 'sip-calc' | 'ratio-calc' | 'rule-72' | 'risk-simulator' | 'custom-slider';
  description: string;
  config?: InteractiveCalculationConfig;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string; // Markdown or rich formatted text
  keyTakeaway?: string;
  proTip?: string;
  warningNotice?: string;
  interactiveExample?: InteractiveExample;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options: string[]; // For multiple choice (2-4 items), or ['True', 'False']
  correctAnswerIndex: number; // 0-based index
  explanation: string;
  points: number;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  estimatedMinutes: number;
  order: number;
  sections: LessonSection[];
  quizQuestions: QuizQuestion[];
  recommendedTool?: 'compound' | 'sip' | 'loan' | 'returns' | 'risk';
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ModuleCategory;
  level: DifficultyLevel;
  icon: string; // Lucide icon name or emoji
  colorGradient: string; // CSS gradient classes
  estimatedHours: number;
  isPublished: boolean;
  isCustom?: boolean;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  lessonId: string;
  moduleId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean; // >= 70%
  completedAt: string;
  userAnswers: Record<string, number>; // questionId -> selectedIndex
}

export interface UserProgress {
  completedLessonIds: string[];
  completedModuleIds: string[];
  quizAttempts: Record<string, QuizAttempt>; // key: lessonId
  bestQuizScores: Record<string, number>; // key: lessonId -> best percentage
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  totalStudyTimeSeconds: number;
  lastVisitedLesson: {
    moduleId: string;
    lessonId: string;
    moduleTitle: string;
    lessonTitle: string;
    timestamp: string;
  } | null;
  unlockedBadgeIds: string[];
  bookmarkedLessonIds: string[];
  notes: Record<string, string>; // lessonId -> user note
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'quiz' | 'streak' | 'builder' | 'mastery';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpReward: number;
  checkUnlocked: (progress: UserProgress, customModulesCount?: number) => boolean;
}

export interface AmortizationRow {
  year: number;
  openingBalance: number;
  emiPaid: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}
