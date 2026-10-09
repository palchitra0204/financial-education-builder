'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion, QuizAttempt } from '@/types';
import { useFinEduStore } from '@/lib/store';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Check,
  X,
} from 'lucide-react';

interface QuizRunnerProps {
  moduleId: string;
  lessonId: string;
  questions: QuizQuestion[];
  onComplete?: (passed: boolean) => void;
  onRetry?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  moduleId,
  lessonId,
  questions,
  onComplete,
  onRetry,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);

  const { recordQuizAttempt, progress } = useFinEduStore();

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
        No quiz questions configured for this lesson.
      </div>
    );
  }

  const currentQuestion = questions[activeQuestionIdx];
  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    let earnedPoints = 0;
    let totalPoints = 0;

    questions.forEach((q) => {
      totalPoints += q.points;
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        earnedPoints += q.points;
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentage >= 70;

    const attempt: QuizAttempt = {
      lessonId,
      moduleId,
      score: earnedPoints,
      totalPoints,
      percentage,
      passed,
      completedAt: new Date().toISOString(),
      userAnswers: selectedAnswers,
    };

    recordQuizAttempt(attempt);
    setIsSubmitted(true);

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }

    if (onComplete) {
      onComplete(passed);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setActiveQuestionIdx(0);
    if (onRetry) onRetry();
  };

  // Score Calculations
  let currentScore = 0;
  let totalScore = 0;
  questions.forEach((q) => {
    totalScore += q.points;
    if (selectedAnswers[q.id] === q.correctAnswerIndex) {
      currentScore += q.points;
    }
  });
  const scorePercent = Math.round((currentScore / totalScore) * 100);
  const isPass = scorePercent >= 70;
  const bestScore = progress.bestQuizScores[lessonId];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Lesson Knowledge Check
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test your understanding of the concepts covered in this lesson (70% required to pass).
          </p>
        </div>

        {bestScore !== undefined && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono">
            <span className="text-slate-400">Best Score:</span>
            <span className={`font-bold ${bestScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {bestScore}%
            </span>
          </div>
        )}
      </div>

      {/* Submitted Result View */}
      {isSubmitted ? (
        <div className="space-y-6 animate-scale-in">
          <div
            className={`p-6 rounded-2xl border text-center space-y-3 ${
              isPass
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-rose-500/10 border-rose-500/30'
            }`}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-slate-900 shadow-md">
              {isPass ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-500" />
              )}
            </div>

            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isPass ? 'Congratulations! Quiz Passed! 🎉' : 'Keep Studying & Try Again! 💪'}
            </h4>

            <div className="flex items-center justify-center gap-6 font-mono text-sm">
              <div>
                <span className="text-xs text-slate-500 block">Score</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentScore} / {totalScore} pts
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Percentage</span>
                <span
                  className={`text-lg font-bold ${
                    isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                  }`}
                >
                  {scorePercent}%
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Result</span>
                <span
                  className={`text-xs uppercase font-extrabold px-2.5 py-1 rounded-full ${
                    isPass
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {isPass ? 'Passed' : 'Failed'}
                </span>
              </div>
            </div>

            <button
              onClick={handleRetry}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4 pt-2">
            <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Answer Review & Conceptual Explanations
            </h5>
            <div className="space-y-4">
              {questions.map((q, qIndex) => {
                const userAnswer = selectedAnswers[q.id];
                const isCorrect = userAnswer === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect
                        ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : 'border-rose-200 dark:border-rose-800/40 bg-rose-50/30 dark:bg-rose-950/20'
                    } space-y-3`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {qIndex + 1}. {q.question}
                      </span>
                      <span
                        className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-md ${
                          isCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {isCorrect ? `+${q.points} pts` : '0 pts'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswer === optIdx;
                        const isCorrectOption = optIdx === q.correctAnswerIndex;

                        let style = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400';
                        if (isCorrectOption) {
                          style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-medium';
                        } else if (isSelected && !isCorrect) {
                          style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${style}`}
                          >
                            <span>{opt}</span>
                            {isCorrectOption && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {isSelected && !isCorrect && (
                              <X className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Rich Explanation */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white block mb-1">
                        💡 Key Explanation:
                      </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Active Quiz Taking Interface */
        <div className="space-y-6">
          {/* Progress dots */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Question {activeQuestionIdx + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === activeQuestionIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-500/30'
                        : isAnswered
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Question Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {currentQuestion.question}
              </h4>
              <span className="shrink-0 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {currentQuestion.points} pts
              </span>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation & Submit */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setActiveQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={activeQuestionIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>

            {activeQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setActiveQuestionIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 disabled:opacity-40 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit & View Score</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
