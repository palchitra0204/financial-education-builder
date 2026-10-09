import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Module, UserProgress, QuizAttempt, Lesson } from '@/types';
import { DEFAULT_MODULES } from './defaultModules';
import { ALL_BADGES } from './badges';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'badge' | 'xp';
  title: string;
  message: string;
  xpAmount?: number;
}

interface FinEduState {
  // Modules state
  modules: Module[];
  customModules: Module[];

  // Progress & Gamification state
  progress: UserProgress;

  // Active UI Navigation state
  darkMode: boolean;
  activeTab: 'dashboard' | 'modules' | 'calculators' | 'builder' | 'analytics' | 'achievements';
  searchQuery: string;
  selectedLevelFilter: string;
  selectedCategoryFilter: string;
  selectedCompletionFilter: string;
  activeModuleId: string | null;
  activeLessonId: string | null;
  builderDraftModule: Module | null;
  toasts: ToastMessage[];

  // Actions - Theme & UI Navigation
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
  setActiveTab: (tab: FinEduState['activeTab']) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLevelFilter: (level: string) => void;
  setSelectedCategoryFilter: (cat: string) => void;
  setSelectedCompletionFilter: (status: string) => void;
  navigateToLesson: (moduleId: string, lessonId: string) => void;
  clearActiveLesson: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Actions - Progress & Gamification
  markLessonComplete: (lessonId: string, moduleId: string) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  incrementStudyTime: (seconds: number) => void;
  recordDailyActivity: () => void;
  toggleBookmark: (lessonId: string) => void;
  saveNote: (lessonId: string, text: string) => void;
  setLastVisited: (moduleId: string, lessonId: string, moduleTitle: string, lessonTitle: string) => void;
  checkAndAwardBadges: () => void;
  resetUserProgress: () => void;

  // Actions - Module Builder & Authoring
  setBuilderDraft: (draft: Module | null) => void;
  saveModule: (moduleData: Module) => void;
  deleteModule: (moduleId: string) => void;
  reorderLessons: (moduleId: string, sourceIndex: number, destinationIndex: number) => void;
  resetToDefaultCuratedModules: () => void;
  importModulesFromJson: (jsonStr: string) => boolean;
  exportModulesToJson: () => string;
}

const initialProgress: UserProgress = {
  completedLessonIds: [],
  completedModuleIds: [],
  quizAttempts: {},
  bestQuizScores: {},
  xp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalStudyTimeSeconds: 0,
  lastVisitedLesson: null,
  unlockedBadgeIds: [],
  bookmarkedLessonIds: [],
  notes: {},
};

export const useFinEduStore = create<FinEduState>()(
  persist(
    (set, get) => ({
      modules: DEFAULT_MODULES,
      customModules: [],
      progress: initialProgress,
      darkMode: false,
      activeTab: 'dashboard',
      searchQuery: '',
      selectedLevelFilter: 'All',
      selectedCategoryFilter: 'All',
      selectedCompletionFilter: 'All',
      activeModuleId: null,
      activeLessonId: null,
      builderDraftModule: null,
      toasts: [],

      // UI Actions
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setActiveTab: (activeTab) => set({ activeTab }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedLevelFilter: (selectedLevelFilter) => set({ selectedLevelFilter }),
      setSelectedCategoryFilter: (selectedCategoryFilter) => set({ selectedCategoryFilter }),
      setSelectedCompletionFilter: (selectedCompletionFilter) => set({ selectedCompletionFilter }),

      navigateToLesson: (moduleId, lessonId) => {
        const { modules, customModules } = get();
        const all = [...modules, ...customModules];
        const mod = all.find((m) => m.id === moduleId);
        const les = mod?.lessons.find((l) => l.id === lessonId);

        if (mod && les) {
          get().setLastVisited(mod.id, les.id, mod.title, les.title);
        }

        set({
          activeModuleId: moduleId,
          activeLessonId: lessonId,
          activeTab: 'modules',
        });
      },

      clearActiveLesson: () => set({ activeLessonId: null }),

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastMessage = { ...toast, id };
        set((s) => ({ toasts: [...s.toasts, newToast] }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4500);
      },

      removeToast: (id) => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      },

      // Progress Actions
      markLessonComplete: (lessonId, moduleId) => {
        const state = get();
        if (state.progress.completedLessonIds.includes(lessonId)) return;

        const newCompleted = [...state.progress.completedLessonIds, lessonId];
        const earnedXp = 50;
        const newXp = state.progress.xp + earnedXp;

        // Check if full module is now complete
        const allModules = [...state.modules, ...state.customModules];
        const targetModule = allModules.find((m) => m.id === moduleId);
        let newCompletedModules = [...state.progress.completedModuleIds];

        if (targetModule) {
          const allLessonsDone = targetModule.lessons.every((l) =>
            newCompleted.includes(l.id)
          );
          if (allLessonsDone && !newCompletedModules.includes(moduleId)) {
            newCompletedModules.push(moduleId);
            state.addToast({
              type: 'success',
              title: 'Module Complete!',
              message: `Congratulations! You finished all lessons in "${targetModule.title}".`,
              xpAmount: 150,
            });
          }
        }

        set((s) => ({
          progress: {
            ...s.progress,
            completedLessonIds: newCompleted,
            completedModuleIds: newCompletedModules,
            xp: newXp,
          },
        }));

        get().addToast({
          type: 'xp',
          title: 'Lesson Completed!',
          message: '+50 XP earned for completing this lesson.',
          xpAmount: 50,
        });

        get().recordDailyActivity();
        get().checkAndAwardBadges();
      },

      recordQuizAttempt: (attempt) => {
        const state = get();
        const currentBest = state.progress.bestQuizScores[attempt.lessonId] || 0;
        const newBest = Math.max(currentBest, attempt.percentage);
        
        let earnedXp = 0;
        if (attempt.passed && currentBest < 70) {
          earnedXp += 75; // First time passing bonus
        }
        if (attempt.percentage === 100 && currentBest < 100) {
          earnedXp += 50; // Perfect score bonus
        }

        const newXp = state.progress.xp + earnedXp;

        set((s) => ({
          progress: {
            ...s.progress,
            quizAttempts: {
              ...s.progress.quizAttempts,
              [attempt.lessonId]: attempt,
            },
            bestQuizScores: {
              ...s.progress.bestQuizScores,
              [attempt.lessonId]: newBest,
            },
            xp: newXp,
          },
        }));

        if (earnedXp > 0) {
          get().addToast({
            type: 'xp',
            title: attempt.percentage === 100 ? 'Perfect Quiz Score!' : 'Quiz Passed!',
            message: `Score: ${attempt.score}/${attempt.totalPoints} (${attempt.percentage}%). +${earnedXp} XP earned!`,
            xpAmount: earnedXp,
          });
        }

        get().recordDailyActivity();
        get().checkAndAwardBadges();
      },

      incrementStudyTime: (seconds) => {
        set((s) => ({
          progress: {
            ...s.progress,
            totalStudyTimeSeconds: s.progress.totalStudyTimeSeconds + seconds,
          },
        }));
        get().checkAndAwardBadges();
      },

      recordDailyActivity: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        const lastActive = state.progress.lastActiveDate;

        if (lastActive === today) return;

        const lastDate = new Date(lastActive);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        let newStreak = state.progress.streakDays;
        if (diffDays === 1) {
          newStreak += 1;
          state.addToast({
            type: 'success',
            title: 'Streak Continued! 🔥',
            message: `You're on a ${newStreak}-day learning streak! Keep it up.`,
          });
        } else if (diffDays > 1) {
          newStreak = 1;
        }

        set((s) => ({
          progress: {
            ...s.progress,
            streakDays: newStreak,
            lastActiveDate: today,
          },
        }));
      },

      toggleBookmark: (lessonId) => {
        set((s) => {
          const exists = s.progress.bookmarkedLessonIds.includes(lessonId);
          return {
            progress: {
              ...s.progress,
              bookmarkedLessonIds: exists
                ? s.progress.bookmarkedLessonIds.filter((id) => id !== lessonId)
                : [...s.progress.bookmarkedLessonIds, lessonId],
            },
          };
        });
      },

      saveNote: (lessonId, text) => {
        set((s) => ({
          progress: {
            ...s.progress,
            notes: {
              ...s.progress.notes,
              [lessonId]: text,
            },
          },
        }));
      },

      setLastVisited: (moduleId, lessonId, moduleTitle, lessonTitle) => {
        set((s) => ({
          progress: {
            ...s.progress,
            lastVisitedLesson: {
              moduleId,
              lessonId,
              moduleTitle,
              lessonTitle,
              timestamp: new Date().toISOString(),
            },
          },
        }));
      },

      checkAndAwardBadges: () => {
        const state = get();
        const customCount = state.customModules.length;
        const currentUnlocked = new Set(state.progress.unlockedBadgeIds);
        const newlyUnlocked: string[] = [];
        let totalBonusXp = 0;

        for (const badge of ALL_BADGES) {
          if (!currentUnlocked.has(badge.id)) {
            if (badge.checkUnlocked(state.progress, customCount)) {
              newlyUnlocked.push(badge.id);
              currentUnlocked.add(badge.id);
              totalBonusXp += badge.xpReward;

              state.addToast({
                type: 'badge',
                title: `Badge Unlocked: ${badge.title}! 🏆`,
                message: `${badge.description} (+${badge.xpReward} XP)`,
                xpAmount: badge.xpReward,
              });
            }
          }
        }

        if (newlyUnlocked.length > 0) {
          set((s) => ({
            progress: {
              ...s.progress,
              unlockedBadgeIds: Array.from(currentUnlocked),
              xp: s.progress.xp + totalBonusXp,
            },
          }));
        }
      },

      resetUserProgress: () => {
        set({
          progress: {
            ...initialProgress,
            lastActiveDate: new Date().toISOString().split('T')[0],
          },
        });
        get().addToast({
          type: 'info',
          title: 'Progress Reset',
          message: 'All lesson completions and quiz records have been reset.',
        });
      },

      // Module Builder Actions
      setBuilderDraft: (draft) => set({ builderDraftModule: draft }),

      saveModule: (moduleData) => {
        const state = get();
        const existingCustomIndex = state.customModules.findIndex((m) => m.id === moduleData.id);
        const existingCuratedIndex = state.modules.findIndex((m) => m.id === moduleData.id);

        let newCustomModules = [...state.customModules];
        let newCuratedModules = [...state.modules];

        if (existingCustomIndex >= 0) {
          newCustomModules[existingCustomIndex] = {
            ...moduleData,
            updatedAt: new Date().toISOString(),
          };
        } else if (existingCuratedIndex >= 0) {
          newCuratedModules[existingCuratedIndex] = {
            ...moduleData,
            updatedAt: new Date().toISOString(),
          };
        } else {
          newCustomModules.push({
            ...moduleData,
            isCustom: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        set({
          modules: newCuratedModules,
          customModules: newCustomModules,
          builderDraftModule: null,
        });

        get().addToast({
          type: 'success',
          title: 'Module Saved & Published!',
          message: `"${moduleData.title}" is now live in your curriculum.`,
          xpAmount: 100,
        });

        get().checkAndAwardBadges();
      },

      deleteModule: (moduleId) => {
        set((s) => ({
          customModules: s.customModules.filter((m) => m.id !== moduleId),
          modules: s.modules.filter((m) => m.id !== moduleId),
        }));
        get().addToast({
          type: 'info',
          title: 'Module Deleted',
          message: 'The module was successfully removed.',
        });
      },

      reorderLessons: (moduleId, sourceIndex, destinationIndex) => {
        set((s) => {
          const updateList = (mods: Module[]) =>
            mods.map((mod) => {
              if (mod.id !== moduleId) return mod;
              const lessons = [...mod.lessons];
              const [moved] = lessons.splice(sourceIndex, 1);
              lessons.splice(destinationIndex, 0, moved);
              const reordered = lessons.map((l, idx) => ({ ...l, order: idx + 1 }));
              return { ...mod, lessons: reordered, updatedAt: new Date().toISOString() };
            });

          return {
            modules: updateList(s.modules),
            customModules: updateList(s.customModules),
          };
        });
      },

      resetToDefaultCuratedModules: () => {
        set({
          modules: DEFAULT_MODULES,
          customModules: [],
        });
        get().addToast({
          type: 'info',
          title: 'Modules Reset',
          message: 'Curriculum restored to standard 9 financial education modules.',
        });
      },

      importModulesFromJson: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && parsed[0].lessons) {
            set((s) => ({
              customModules: [...s.customModules, ...parsed.map((m: Module) => ({ ...m, isCustom: true }))],
            }));
            get().addToast({
              type: 'success',
              title: 'Modules Imported!',
              message: `Successfully imported ${parsed.length} module(s).`,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      exportModulesToJson: () => {
        const state = get();
        const all = [...state.modules, ...state.customModules];
        return JSON.stringify(all, null, 2);
      },
    }),
    {
      name: 'financial-education-store-v1',
      partialize: (state) => ({
        modules: state.modules,
        customModules: state.customModules,
        progress: state.progress,
        darkMode: state.darkMode,
      }),
    }
  )
);
