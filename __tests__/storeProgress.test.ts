import { describe, it, expect, beforeEach } from 'vitest';
import { useFinEduStore } from '@/lib/store';
import { Module } from '@/types';

describe('Zustand Progress, Badges, and Module Builder Store', () => {
  beforeEach(() => {
    useFinEduStore.getState().resetUserProgress();
    useFinEduStore.getState().resetToDefaultCuratedModules();
  });

  it('marks lessons as complete and awards XP and milestone badge', () => {
    const store = useFinEduStore.getState();
    const initialXp = store.progress.xp;

    store.markLessonComplete('lesson-sm-1', 'mod-stock-basics');

    const updated = useFinEduStore.getState();
    expect(updated.progress.completedLessonIds).toContain('lesson-sm-1');
    // 50 XP for lesson completion + 50 XP for First Step to Wealth badge unlock
    expect(updated.progress.xp).toBe(initialXp + 50 + 50);
  });

  it('detects module completion when all module lessons are done', () => {
    const store = useFinEduStore.getState();

    // Module 'mod-compounding' has 2 lessons: 'lesson-comp-1' and 'lesson-comp-2'
    store.markLessonComplete('lesson-comp-1', 'mod-compounding');
    expect(useFinEduStore.getState().progress.completedModuleIds).not.toContain('mod-compounding');

    store.markLessonComplete('lesson-comp-2', 'mod-compounding');
    expect(useFinEduStore.getState().progress.completedModuleIds).toContain('mod-compounding');
  });

  it('awards badges on milestone achievements', () => {
    const store = useFinEduStore.getState();

    // Complete first lesson
    store.markLessonComplete('lesson-sm-1', 'mod-stock-basics');
    expect(useFinEduStore.getState().progress.unlockedBadgeIds).toContain('badge-first-lesson');

    // Complete compounding module -> unlocks Compounding Wizard badge
    store.markLessonComplete('lesson-comp-1', 'mod-compounding');
    store.markLessonComplete('lesson-comp-2', 'mod-compounding');
    expect(useFinEduStore.getState().progress.unlockedBadgeIds).toContain('badge-compounding-guru');
  });

  it('manages personal notes and bookmarks', () => {
    const store = useFinEduStore.getState();

    store.toggleBookmark('lesson-sm-1');
    expect(useFinEduStore.getState().progress.bookmarkedLessonIds).toContain('lesson-sm-1');

    store.toggleBookmark('lesson-sm-1');
    expect(useFinEduStore.getState().progress.bookmarkedLessonIds).not.toContain('lesson-sm-1');

    store.saveNote('lesson-sm-1', 'Remember: Primary market = company gets money, Secondary = investor to investor');
    expect(useFinEduStore.getState().progress.notes['lesson-sm-1']).toContain('Primary market');
  });

  it('supports creating, editing, and deleting custom modules in Builder', () => {
    const store = useFinEduStore.getState();

    const customMod: Module = {
      id: 'custom-real-estate-101',
      slug: 'real-estate-investing-101',
      title: 'Real Estate & REITs',
      description: 'Rental yields, capitalization rates, and public REIT investing.',
      category: 'Investing',
      level: 'Intermediate',
      icon: 'Layers',
      colorGradient: 'from-emerald-600 to-teal-700',
      estimatedHours: 2.0,
      isPublished: true,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lessons: [
        {
          id: 're-lesson-1',
          title: 'Understanding Cap Rates',
          slug: 'understanding-cap-rates',
          description: 'Net Operating Income divided by Property Asset Value.',
          estimatedMinutes: 15,
          order: 1,
          sections: [
            {
              id: 'sec-re-1',
              title: '1. Cap Rate Formula',
              content: 'Cap Rate = NOI / Property Purchase Price.',
            },
          ],
          quizQuestions: [],
        },
        {
          id: 're-lesson-2',
          title: 'Public REITs vs Physical Properties',
          slug: 'public-reits-vs-physical',
          description: 'Liquidity and 90% taxable income distribution requirements.',
          estimatedMinutes: 20,
          order: 2,
          sections: [],
          quizQuestions: [],
        },
      ],
    };

    // Save module
    store.saveModule(customMod);
    expect(useFinEduStore.getState().customModules).toHaveLength(1);
    expect(useFinEduStore.getState().customModules[0].title).toBe('Real Estate & REITs');

    // Reorder lessons
    store.reorderLessons('custom-real-estate-101', 0, 1);
    const reordered = useFinEduStore.getState().customModules[0].lessons;
    expect(reordered[0].id).toBe('re-lesson-2');
    expect(reordered[1].id).toBe('re-lesson-1');

    // Delete module
    store.deleteModule('custom-real-estate-101');
    expect(useFinEduStore.getState().customModules).toHaveLength(0);
  });

  it('exports and imports curriculum JSON correctly', () => {
    const store = useFinEduStore.getState();

    const jsonStr = store.exportModulesToJson();
    expect(jsonStr).toContain('Stock Market Basics');
    expect(jsonStr).toContain('Compounding & Time Value');

    const importedValid = store.importModulesFromJson(
      JSON.stringify([
        {
          id: 'imported-crypto-101',
          slug: 'crypto-blockchain-basics',
          title: 'Crypto & Blockchain Fundamentals',
          description: 'Decentralized ledger technology and digital asset risks.',
          category: 'Investing',
          level: 'Advanced',
          icon: 'Sparkles',
          colorGradient: 'from-purple-600 to-indigo-800',
          estimatedHours: 1.5,
          isPublished: true,
          lessons: [
            {
              id: 'cr-1',
              title: 'Proof of Work vs Proof of Stake',
              slug: 'pow-vs-pos',
              description: 'Consensus mechanisms.',
              estimatedMinutes: 10,
              order: 1,
              sections: [],
              quizQuestions: [],
            },
          ],
        },
      ])
    );

    expect(importedValid).toBe(true);
    expect(useFinEduStore.getState().customModules.some((m) => m.id === 'imported-crypto-101')).toBe(true);
  });
});
