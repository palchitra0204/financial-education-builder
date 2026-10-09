import { describe, it, expect, beforeEach } from 'vitest';
import { useFinEduStore } from '@/lib/store';
import { QuizQuestion, QuizAttempt } from '@/types';

describe('Quiz Scoring and Answer Validation', () => {
  beforeEach(() => {
    useFinEduStore.getState().resetUserProgress();
  });

  const sampleQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What is a stock?',
      options: ['A debt loan', 'A share of company ownership', 'A tax form', 'A currency'],
      correctAnswerIndex: 1,
      explanation: 'Stock represents equity ownership.',
      points: 10,
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'Compounding generates interest on interest.',
      options: ['True', 'False'],
      correctAnswerIndex: 0,
      explanation: 'Compounding is exponential.',
      points: 10,
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      question: 'Which asset is considered fixed income?',
      options: ['Common Stock', 'Bonds', 'Real Estate', 'Crypto'],
      correctAnswerIndex: 1,
      explanation: 'Bonds provide contractual fixed interest.',
      points: 10,
    },
  ];

  it('evaluates answers and calculates passing score (100%)', () => {
    const userAnswers: Record<string, number> = {
      q1: 1, // correct
      q2: 0, // correct
      q3: 1, // correct
    };

    let earned = 0;
    let total = 0;
    sampleQuestions.forEach((q) => {
      total += q.points;
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        earned += q.points;
      }
    });

    const percentage = Math.round((earned / total) * 100);
    const passed = percentage >= 70;

    expect(earned).toBe(30);
    expect(total).toBe(30);
    expect(percentage).toBe(100);
    expect(passed).toBe(true);

    // Record in store
    const attempt: QuizAttempt = {
      lessonId: 'lesson-1',
      moduleId: 'mod-1',
      score: earned,
      totalPoints: total,
      percentage,
      passed,
      completedAt: new Date().toISOString(),
      userAnswers,
    };

    useFinEduStore.getState().recordQuizAttempt(attempt);

    const progress = useFinEduStore.getState().progress;
    expect(progress.bestQuizScores['lesson-1']).toBe(100);
    expect(progress.quizAttempts['lesson-1'].passed).toBe(true);
    expect(progress.xp).toBeGreaterThan(0);
  });

  it('evaluates failing score correctly (<70%)', () => {
    const userAnswers: Record<string, number> = {
      q1: 0, // incorrect
      q2: 1, // incorrect
      q3: 1, // correct (10/30 = 33%)
    };

    let earned = 0;
    let total = 0;
    sampleQuestions.forEach((q) => {
      total += q.points;
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        earned += q.points;
      }
    });

    const percentage = Math.round((earned / total) * 100);
    const passed = percentage >= 70;

    expect(earned).toBe(10);
    expect(percentage).toBe(33);
    expect(passed).toBe(false);

    const attempt: QuizAttempt = {
      lessonId: 'lesson-fail',
      moduleId: 'mod-1',
      score: earned,
      totalPoints: total,
      percentage,
      passed,
      completedAt: new Date().toISOString(),
      userAnswers,
    };

    useFinEduStore.getState().recordQuizAttempt(attempt);

    const progress = useFinEduStore.getState().progress;
    expect(progress.bestQuizScores['lesson-fail']).toBe(33);
    expect(progress.quizAttempts['lesson-fail'].passed).toBe(false);
  });

  it('updates best score on retry', () => {
    // Attempt 1: 33%
    useFinEduStore.getState().recordQuizAttempt({
      lessonId: 'lesson-retry',
      moduleId: 'mod-1',
      score: 10,
      totalPoints: 30,
      percentage: 33,
      passed: false,
      completedAt: new Date().toISOString(),
      userAnswers: { q1: 0, q2: 1, q3: 1 },
    });

    expect(useFinEduStore.getState().progress.bestQuizScores['lesson-retry']).toBe(33);

    // Attempt 2: 100%
    useFinEduStore.getState().recordQuizAttempt({
      lessonId: 'lesson-retry',
      moduleId: 'mod-1',
      score: 30,
      totalPoints: 30,
      percentage: 100,
      passed: true,
      completedAt: new Date().toISOString(),
      userAnswers: { q1: 1, q2: 0, q3: 1 },
    });

    expect(useFinEduStore.getState().progress.bestQuizScores['lesson-retry']).toBe(100);
  });
});
