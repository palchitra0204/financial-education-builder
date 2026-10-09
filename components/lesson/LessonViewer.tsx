'use client';

import React, { useState, useEffect } from 'react';
import { useFinEduStore } from '@/lib/store';
import { QuizRunner } from '@/components/quiz/QuizRunner';
import { formatCurrency } from '@/lib/financialMath';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Sparkles,
  Award,
  Lightbulb,
  AlertTriangle,
  FileText,
  Sliders,
  Volume2,
  Share2,
} from 'lucide-react';

export const LessonViewer: React.FC = () => {
  const {
    modules,
    customModules,
    activeModuleId,
    activeLessonId,
    navigateToLesson,
    clearActiveLesson,
    markLessonComplete,
    progress,
    toggleBookmark,
    saveNote,
    addToast,
    setActiveTab,
  } = useFinEduStore();

  const [activeViewMode, setActiveViewMode] = useState<'content' | 'quiz'>('content');
  const [readingSpeed, setReadingSpeed] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [sandboxPrincipal, setSandboxPrincipal] = useState<number>(1000);
  const [sandboxRate, setSandboxRate] = useState<number>(10);
  const [sandboxYears, setSandboxYears] = useState<number>(10);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [localNote, setLocalNote] = useState<string>('');

  const allModules = [...modules, ...customModules];
  const activeModule = allModules.find((m) => m.id === activeModuleId);
  const activeLesson = activeModule?.lessons.find((l) => l.id === activeLessonId);

  // Sync notes
  useEffect(() => {
    if (activeLessonId && progress.notes[activeLessonId]) {
      setLocalNote(progress.notes[activeLessonId]);
    } else {
      setLocalNote('');
    }
    setActiveViewMode('content');
  }, [activeLessonId, progress.notes]);

  if (!activeModule || !activeLesson) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          No Lesson Selected
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please select a module and lesson from the curriculum list to start learning.
        </p>
        <button
          onClick={clearActiveLesson}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs"
        >
          View All Modules
        </button>
      </div>
    );
  }

  const isCompleted = progress.completedLessonIds.includes(activeLesson.id);
  const isBookmarked = progress.bookmarkedLessonIds.includes(activeLesson.id);

  // Next & Previous Lesson Navigation
  const currentLessonIndex = activeModule.lessons.findIndex((l) => l.id === activeLesson.id);
  const prevLesson = currentLessonIndex > 0 ? activeModule.lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < activeModule.lessons.length - 1
      ? activeModule.lessons[currentLessonIndex + 1]
      : null;

  // Sandbox calculations
  const sandboxFutureValue = Math.round(
    sandboxPrincipal * Math.pow(1 + sandboxRate / 100, sandboxYears)
  );

  const handleNoteSave = () => {
    if (activeLessonId) {
      saveNote(activeLessonId, localNote);
      addToast({
        type: 'success',
        title: 'Note Saved',
        message: 'Your personal lesson study note has been saved.',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Breadcrumb & Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={clearActiveLesson}
            className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            Modules
          </button>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[140px] sm:max-w-none">
            {activeModule.title}
          </span>
          <span>/</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[160px] sm:max-w-none">
            {activeLesson.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Note Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showNotes || localNote
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
            title="Lesson Notes"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Notes</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(activeLesson.id)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isBookmarked
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
            title="Bookmark this lesson"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Bookmark</span>
          </button>

          {/* Back button */}
          <button
            onClick={clearActiveLesson}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close Lesson
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              {activeModule.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-medium">
              {activeModule.level}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeLesson.estimatedMinutes} min study time</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {activeLesson.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeLesson.description}
          </p>

          {/* Tab Switcher: Lesson Content vs Quiz */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setActiveViewMode('content')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeViewMode === 'content'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Interactive Lesson</span>
            </button>

            <button
              onClick={() => setActiveViewMode('quiz')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeViewMode === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Take Quiz ({activeLesson.quizQuestions.length} Questions)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Note Drawer */}
      {showNotes && (
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2 animate-slide-up">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Personal Study Notes for this Lesson</span>
            </h4>
            <button
              onClick={handleNoteSave}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Save Note
            </button>
          </div>
          <textarea
            value={localNote}
            onChange={(e) => setLocalNote(e.target.value)}
            placeholder="Type your personal insights, formulas to remember, or questions here..."
            className="w-full h-24 p-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Main Content Area */}
      {activeViewMode === 'quiz' ? (
        <QuizRunner
          moduleId={activeModule.id}
          lessonId={activeLesson.id}
          questions={activeLesson.quizQuestions}
          onComplete={(passed) => {
            if (passed) {
              markLessonComplete(activeLesson.id, activeModule.id);
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Educational Sections */}
          <div className="lg:col-span-8 space-y-6">
            {activeLesson.sections.map((section, idx) => (
              <div
                key={section.id}
                id={`section-${idx}`}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                  {section.title}
                </h2>

                {/* Educational Content Text with Paragraphs */}
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                  {section.content}
                </div>

                {/* Inline Key Takeaway Callout */}
                {section.keyTakeaway && (
                  <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-blue-600 space-y-1">
                    <span className="font-bold text-xs text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Key Takeaway
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {section.keyTakeaway}
                    </p>
                  </div>
                )}

                {/* Pro Tip */}
                {section.proTip && (
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-emerald-600 space-y-1">
                    <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Pro Tip
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {section.proTip}
                    </p>
                  </div>
                )}

                {/* Warning Notice */}
                {section.warningNotice && (
                  <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border-l-4 border-amber-600 space-y-1">
                    <span className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Important Caveat
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {section.warningNotice}
                    </p>
                  </div>
                )}

                {/* Embedded Inline Interactive Sandbox */}
                {section.interactiveExample && (
                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-indigo-500" />
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {section.interactiveExample.title}
                        </h3>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                        Live Sandbox
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {section.interactiveExample.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <label htmlFor="sandbox-principal-input" className="text-slate-500">Principal</label>
                          <span className="font-bold font-mono">{formatCurrency(sandboxPrincipal)}</span>
                        </div>
                        <input
                          id="sandbox-principal-input"
                          type="range"
                          min="100"
                          max="20000"
                          step="100"
                          value={sandboxPrincipal}
                          onChange={(e) => setSandboxPrincipal(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                          aria-label="Sandbox Principal Slider"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <label htmlFor="sandbox-rate-input" className="text-slate-500">Return Rate</label>
                          <span className="font-bold font-mono text-indigo-600">{sandboxRate}%</span>
                        </div>
                        <input
                          id="sandbox-rate-input"
                          type="range"
                          min="1"
                          max="20"
                          step="1"
                          value={sandboxRate}
                          onChange={(e) => setSandboxRate(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                          aria-label="Sandbox Return Rate Slider"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <label htmlFor="sandbox-years-input" className="text-slate-500">Years</label>
                          <span className="font-bold font-mono">{sandboxYears} yrs</span>
                        </div>
                        <input
                          id="sandbox-years-input"
                          type="range"
                          min="1"
                          max="30"
                          step="1"
                          value={sandboxYears}
                          onChange={(e) => setSandboxYears(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                          aria-label="Sandbox Years Slider"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Compounded Future Value:</span>
                      <span className="text-sm font-extrabold text-emerald-600 font-mono">
                        {formatCurrency(sandboxFutureValue)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Bottom Actions & Completion */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isCompleted ? 'Lesson Completed! ✨' : 'Finished Reading?'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isCompleted
                    ? 'You have earned 50 XP for this lesson.'
                    : 'Mark as complete to record progress and earn XP.'}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => markLessonComplete(activeLesson.id, activeModule.id)}
                  disabled={isCompleted}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'Completed' : 'Mark as Complete (+50 XP)'}</span>
                </button>

                <button
                  onClick={() => setActiveViewMode('quiz')}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>Take Quiz</span>
                </button>
              </div>
            </div>

            {/* Previous & Next Navigation */}
            <div className="flex items-center justify-between gap-4 pt-2">
              {prevLesson ? (
                <button
                  onClick={() => navigateToLesson(activeModule.id, prevLesson.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 text-xs font-semibold transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <div className="text-left">
                    <span className="block text-[10px] text-slate-400">Previous</span>
                    <span className="truncate max-w-[120px] sm:max-w-xs">{prevLesson.title}</span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <button
                  onClick={() => navigateToLesson(activeModule.id, nextLesson.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold transition-all shadow-xs"
                >
                  <div className="text-right">
                    <span className="block text-[10px] text-blue-200">Next Lesson</span>
                    <span className="truncate max-w-[120px] sm:max-w-xs">{nextLesson.title}</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('modules')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-600 bg-emerald-600 text-white text-xs font-semibold shadow-xs"
                >
                  <span>Explore More Modules</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Sidebar: Table of Contents & Recommended Calculators */}
          <div className="lg:col-span-4 space-y-6">
            {/* Table of Contents */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 sticky top-24">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Table of Contents
              </h4>
              <nav className="space-y-1">
                {activeLesson.sections.map((section, sIdx) => (
                  <a
                    key={section.id}
                    href={`#section-${sIdx}`}
                    className="block p-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors truncate"
                  >
                    {sIdx + 1}. {section.title}
                  </a>
                ))}
              </nav>

              {/* Recommended Tool Widget */}
              {activeLesson.recommendedTool && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">
                    Recommended Calculator
                  </span>
                  <button
                    onClick={() => setActiveTab('calculators')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100/80 transition-colors"
                  >
                    <span>Open {activeLesson.recommendedTool.toUpperCase()} Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
