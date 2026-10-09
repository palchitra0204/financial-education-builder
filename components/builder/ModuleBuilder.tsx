'use client';

import React, { useState, useEffect } from 'react';
import { useFinEduStore } from '@/lib/store';
import { Module, Lesson, LessonSection, QuizQuestion, DifficultyLevel, ModuleCategory } from '@/types';
import {
  PlusCircle,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Eye,
  FileDown,
  FileUp,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  Check,
  RotateCcw,
  Sliders,
  X,
  AlertCircle,
} from 'lucide-react';

export const ModuleBuilder: React.FC = () => {
  const {
    builderDraftModule,
    setBuilderDraft,
    saveModule,
    modules,
    customModules,
    deleteModule,
    exportModulesToJson,
    importModulesFromJson,
    resetToDefaultCuratedModules,
    addToast,
    navigateToLesson,
  } = useFinEduStore();

  // Active authoring module state
  const [currentMod, setCurrentMod] = useState<Module>(() => {
    if (builderDraftModule) return builderDraftModule;
    return {
      id: `custom-mod-${Date.now()}`,
      slug: 'custom-financial-module',
      title: 'Advanced Derivatives & Options Basics',
      description: 'Understand call and put options, strike prices, premiums, hedging strategies, and implied volatility.',
      category: 'Investing',
      level: 'Intermediate',
      icon: 'TrendingUp',
      colorGradient: 'from-blue-600 to-indigo-700',
      estimatedHours: 2.0,
      isPublished: true,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lessons: [
        {
          id: `custom-les-${Date.now()}-1`,
          title: 'Calls vs. Puts: The Mechanics',
          slug: 'calls-vs-puts-mechanics',
          description: 'Learn the fundamental difference between the right to buy (Call) and the right to sell (Put).',
          estimatedMinutes: 15,
          order: 1,
          sections: [
            {
              id: `sec-${Date.now()}-1`,
              title: '1. What is an Option Contract?',
              content: 'An options contract gives the buyer the right, but not the obligation, to buy or sell an underlying stock at a specified strike price before expiration date.',
              keyTakeaway: 'Options are derivative instruments used for both risk hedging and asymmetric speculation.',
            },
          ],
          quizQuestions: [
            {
              id: `q-${Date.now()}-1`,
              type: 'multiple-choice',
              question: 'A Call option gives the buyer the right to:',
              options: [
                'Buy the underlying stock at the strike price',
                'Sell the underlying stock at the strike price',
                'Force the company into bankruptcy',
                'Receive guaranteed quarterly dividends',
              ],
              correctAnswerIndex: 0,
              explanation: 'A Call option gives the holder the right to buy shares at the specified strike price.',
              points: 10,
            },
          ],
        },
      ],
    };
  });

  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'details' | 'lessons' | 'quizzes' | 'preview'>('details');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  // Sync draft if changed
  useEffect(() => {
    if (builderDraftModule) {
      setCurrentMod(builderDraftModule);
      setActiveLessonIdx(0);
    }
  }, [builderDraftModule]);

  const activeLesson = currentMod.lessons[activeLessonIdx] || currentMod.lessons[0];

  // Module Updates
  const updateModuleField = (field: keyof Module, value: any) => {
    setCurrentMod((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Lesson Updates
  const updateActiveLessonField = (field: keyof Lesson, value: any) => {
    setCurrentMod((prev) => {
      const updatedLessons = [...prev.lessons];
      updatedLessons[activeLessonIdx] = {
        ...updatedLessons[activeLessonIdx],
        [field]: value,
      };
      return { ...prev, lessons: updatedLessons };
    });
  };

  // Add Lesson
  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: `custom-les-${Date.now()}`,
      title: `New Lesson ${currentMod.lessons.length + 1}`,
      slug: `new-lesson-${currentMod.lessons.length + 1}`,
      description: 'Enter a concise summary of this lesson.',
      estimatedMinutes: 15,
      order: currentMod.lessons.length + 1,
      sections: [
        {
          id: `sec-${Date.now()}`,
          title: '1. Introduction',
          content: 'Add your educational text, formulas, and financial examples here.',
          keyTakeaway: 'Summarize the core takeaway here.',
        },
      ],
      quizQuestions: [
        {
          id: `q-${Date.now()}`,
          type: 'multiple-choice',
          question: 'Sample Question Title?',
          options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
          correctAnswerIndex: 0,
          explanation: 'Provide the reasoning for the correct answer.',
          points: 10,
        },
      ],
    };

    setCurrentMod((prev) => ({
      ...prev,
      lessons: [...prev.lessons, newLesson],
    }));
    setActiveLessonIdx(currentMod.lessons.length);
    addToast({
      type: 'info',
      title: 'Lesson Added',
      message: 'New lesson initialized in draft.',
    });
  };

  // Remove Lesson
  const handleRemoveLesson = (idx: number) => {
    if (currentMod.lessons.length <= 1) {
      alert('A module must contain at least 1 lesson.');
      return;
    }
    setCurrentMod((prev) => {
      const filtered = prev.lessons.filter((_, i) => i !== idx);
      const reordered = filtered.map((l, i) => ({ ...l, order: i + 1 }));
      return { ...prev, lessons: reordered };
    });
    setActiveLessonIdx(0);
  };

  // Move Lesson Up/Down
  const handleMoveLesson = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentMod.lessons.length) return;

    setCurrentMod((prev) => {
      const lessons = [...prev.lessons];
      const [item] = lessons.splice(index, 1);
      lessons.splice(newIndex, 0, item);
      return { ...prev, lessons: lessons.map((l, i) => ({ ...l, order: i + 1 })) };
    });
    setActiveLessonIdx(newIndex);
  };

  // Add Section to active lesson
  const handleAddSection = () => {
    const newSection: LessonSection = {
      id: `sec-${Date.now()}`,
      title: `${activeLesson.sections.length + 1}. New Topic`,
      content: 'Provide detailed financial explanation here...',
      keyTakeaway: 'Key summary takeaway.',
    };

    const updatedSections = [...activeLesson.sections, newSection];
    updateActiveLessonField('sections', updatedSections);
  };

  // Remove Section
  const handleRemoveSection = (secIdx: number) => {
    if (activeLesson.sections.length <= 1) {
      alert('A lesson must contain at least 1 section.');
      return;
    }
    const updatedSections = activeLesson.sections.filter((_, i) => i !== secIdx);
    updateActiveLessonField('sections', updatedSections);
  };

  // Add Quiz Question
  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      type: 'multiple-choice',
      question: 'Enter new question text...',
      options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
      correctAnswerIndex: 0,
      explanation: 'Explain why the correct answer is right.',
      points: 10,
    };
    const updatedQ = [...activeLesson.quizQuestions, newQ];
    updateActiveLessonField('quizQuestions', updatedQ);
  };

  // Remove Quiz Question
  const handleRemoveQuestion = (qIdx: number) => {
    const updatedQ = activeLesson.quizQuestions.filter((_, i) => i !== qIdx);
    updateActiveLessonField('quizQuestions', updatedQ);
  };

  // Save Module to Store
  const handleSaveAndPublish = () => {
    if (!currentMod.title.trim()) {
      alert('Please provide a module title.');
      return;
    }
    saveModule(currentMod);
  };

  // Export JSON
  const handleExportJson = () => {
    const json = exportModulesToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-curriculum-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'Curriculum Exported',
      message: 'Downloaded modules JSON file.',
    });
  };

  // Import JSON
  const handleImportJson = () => {
    if (!jsonInput.trim()) return;
    const success = importModulesFromJson(jsonInput);
    if (success) {
      setShowImportModal(false);
      setJsonInput('');
    } else {
      alert('Invalid module JSON format. Please ensure valid array of module objects.');
    }
  };

  const categories: ModuleCategory[] = [
    'Basics',
    'Investing',
    'Compounding',
    'Funds',
    'Risk & Portfolio',
    'Valuation',
    'Personal Finance',
    'Terminology',
  ];

  const levels: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              Creator Studio
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Module Builder & Authoring Interface
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Design custom curriculum, structure interactive lessons, embed calculation models, and author auto-graded quizzes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-slate-300 transition-colors"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-slate-300 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleSaveAndPublish}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {/* Builder Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2">
        {[
          { id: 'details', label: '1. Module Details', icon: Layers },
          { id: 'lessons', label: '2. Lessons & Sections', icon: BookOpen },
          { id: 'quizzes', label: '3. Quiz Builder', icon: Award },
          { id: 'preview', label: '4. Live Preview', icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MODULE DETAILS */}
      {activeTab === 'details' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            General Module Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mod-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Module Title *
              </label>
              <input
                id="mod-title-input"
                type="text"
                value={currentMod.title}
                onChange={(e) => updateModuleField('title', e.target.value)}
                placeholder="e.g. Real Estate Investment & REITs"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="mod-slug-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                URL Slug
              </label>
              <input
                id="mod-slug-input"
                type="text"
                value={currentMod.slug}
                onChange={(e) => updateModuleField('slug', e.target.value)}
                placeholder="e.g. real-estate-and-reits"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-mono outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="mod-desc-textarea" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Description & Learning Objectives
              </label>
              <textarea
                id="mod-desc-textarea"
                value={currentMod.description}
                onChange={(e) => updateModuleField('description', e.target.value)}
                rows={3}
                placeholder="What will students master after completing this module?"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="mod-category-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                id="mod-category-select"
                value={currentMod.category}
                onChange={(e) => updateModuleField('category', e.target.value as ModuleCategory)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="mod-level-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Difficulty Level
              </label>
              <select
                id="mod-level-select"
                value={currentMod.level}
                onChange={(e) => updateModuleField('level', e.target.value as DifficultyLevel)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="mod-hours-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Estimated Duration (Hours)
              </label>
              <input
                id="mod-hours-input"
                type="number"
                step="0.5"
                min="0.5"
                max="20"
                value={currentMod.estimatedHours}
                onChange={(e) => updateModuleField('estimatedHours', parseFloat(e.target.value))}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-mono outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="mod-icon-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Module Icon
              </label>
              <select
                id="mod-icon-select"
                value={currentMod.icon}
                onChange={(e) => updateModuleField('icon', e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                {['TrendingUp', 'Sparkles', 'Layers', 'PieChart', 'ShieldAlert', 'BarChart3', 'Wallet', 'BookOpen'].map(
                  (ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LESSONS & SECTIONS */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lessons List on Left */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Lessons ({currentMod.lessons.length})
              </h4>
              <button
                onClick={handleAddLesson}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Lesson</span>
              </button>
            </div>

            <div className="space-y-2">
              {currentMod.lessons.map((les, lIdx) => {
                const isSelected = lIdx === activeLessonIdx;
                return (
                  <div
                    key={les.id}
                    onClick={() => setActiveLessonIdx(lIdx)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-1 ring-purple-600'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {lIdx + 1}
                      </span>
                      <span className="font-semibold text-xs truncate">{les.title}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLesson(lIdx, 'up');
                        }}
                        disabled={lIdx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLesson(lIdx, 'down');
                        }}
                        disabled={lIdx === currentMod.lessons.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLesson(lIdx);
                        }}
                        className="p-1 text-rose-400 hover:text-rose-600"
                        title="Delete Lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Lesson Editor on Right */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            {activeLesson ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Editing Lesson #{activeLessonIdx + 1}: {activeLesson.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeLesson.sections.length} section(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="les-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Lesson Title
                    </label>
                    <input
                      id="les-title-input"
                      type="text"
                      value={activeLesson.title}
                      onChange={(e) => updateActiveLessonField('title', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="les-min-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Estimated Reading Time (Minutes)
                    </label>
                    <input
                      id="les-min-input"
                      type="number"
                      min="1"
                      max="60"
                      value={activeLesson.estimatedMinutes}
                      onChange={(e) => updateActiveLessonField('estimatedMinutes', parseInt(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="les-desc-textarea" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Short Summary
                    </label>
                    <textarea
                      id="les-desc-textarea"
                      value={activeLesson.description}
                      onChange={(e) => updateActiveLessonField('description', e.target.value)}
                      rows={2}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Sections Builder */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      Educational Sections ({activeLesson.sections.length})
                    </h4>
                    <button
                      onClick={handleAddSection}
                      className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {activeLesson.sections.map((section, sIdx) => (
                      <div
                        key={section.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                              const updated = [...activeLesson.sections];
                              updated[sIdx].title = e.target.value;
                              updateActiveLessonField('sections', updated);
                            }}
                            placeholder="Section Title"
                            className="font-bold text-xs bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white flex-1"
                          />
                          <button
                            onClick={() => handleRemoveSection(sIdx)}
                            className="p-1 text-rose-400 hover:text-rose-600"
                            title="Delete Section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label htmlFor={`sec-content-textarea-${sIdx}`} className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Educational Content Text
                          </label>
                          <textarea
                            id={`sec-content-textarea-${sIdx}`}
                            value={section.content}
                            onChange={(e) => {
                              const updated = [...activeLesson.sections];
                              updated[sIdx].content = e.target.value;
                              updateActiveLessonField('sections', updated);
                            }}
                            rows={4}
                            placeholder="Write the explanation, formula, or financial narrative..."
                            className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div>
                          <label htmlFor={`sec-takeaway-input-${sIdx}`} className="block text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1">
                            Key Takeaway Box (Optional)
                          </label>
                          <input
                            id={`sec-takeaway-input-${sIdx}`}
                            type="text"
                            value={section.keyTakeaway || ''}
                            onChange={(e) => {
                              const updated = [...activeLesson.sections];
                              updated[sIdx].keyTakeaway = e.target.value;
                              updateActiveLessonField('sections', updated);
                            }}
                            placeholder="e.g. Dollar cost averaging eliminates emotional timing."
                            className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ BUILDER */}
      {activeTab === 'quizzes' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Quiz Questions for: {activeLesson?.title}
              </h3>
              <p className="text-xs text-slate-500">
                Add multiple choice or true/false questions with correct answer designations and explanations.
              </p>
            </div>
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-6">
            {activeLesson?.quizQuestions.map((q, qIdx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    Question #{qIdx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <label htmlFor={`q-points-input-${qIdx}`} className="text-slate-500">Points:</label>
                      <input
                        id={`q-points-input-${qIdx}`}
                        type="number"
                        min="5"
                        max="50"
                        value={q.points}
                        onChange={(e) => {
                          const updated = [...activeLesson.quizQuestions];
                          updated[qIdx].points = parseInt(e.target.value) || 10;
                          updateActiveLessonField('quizQuestions', updated);
                        }}
                        className="w-14 p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-center"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor={`q-prompt-input-${qIdx}`} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Question Prompt
                  </label>
                  <input
                    id={`q-prompt-input-${qIdx}`}
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...activeLesson.quizQuestions];
                      updated[qIdx].question = e.target.value;
                      updateActiveLessonField('quizQuestions', updated);
                    }}
                    placeholder="e.g. Which metric measures price relative to earnings?"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Answer Options (Select the correct radio button)
                  </label>
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = q.correctAnswerIndex === optIdx;
                    return (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-answer-${q.id}`}
                          checked={isCorrect}
                          onChange={() => {
                            const updated = [...activeLesson.quizQuestions];
                            updated[qIdx].correctAnswerIndex = optIdx;
                            updateActiveLessonField('quizQuestions', updated);
                          }}
                          className="w-4 h-4 text-purple-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...activeLesson.quizQuestions];
                            const newOptions = [...updated[qIdx].options];
                            newOptions[optIdx] = e.target.value;
                            updated[qIdx].options = newOptions;
                            updateActiveLessonField('quizQuestions', updated);
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          className={`flex-1 p-2 rounded-lg text-xs bg-white dark:bg-slate-900 border ${
                            isCorrect
                              ? 'border-emerald-500 ring-1 ring-emerald-500 font-medium'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div>
                  <label htmlFor={`q-expl-textarea-${qIdx}`} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Educational Explanation (Shown to user after submitting)
                  </label>
                  <textarea
                    id={`q-expl-textarea-${qIdx}`}
                    value={q.explanation}
                    onChange={(e) => {
                      const updated = [...activeLesson.quizQuestions];
                      updated[qIdx].explanation = e.target.value;
                      updateActiveLessonField('quizQuestions', updated);
                    }}
                    rows={2}
                    placeholder="Explain why the selected option is correct and why other options are incorrect..."
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
              <Eye className="w-4 h-4" />
              <span>Student Live Preview Mode</span>
            </div>
            <button
              onClick={handleSaveAndPublish}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
            >
              Publish Module Now
            </button>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                {currentMod.category} • {currentMod.level}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {activeLesson.title}
              </h2>
              <p className="text-xs text-slate-500">{activeLesson.description}</p>
            </div>

            <div className="space-y-4">
              {activeLesson.sections.map((sec, idx) => (
                <div key={sec.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {idx + 1}. {sec.title}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                  {sec.keyTakeaway && (
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 text-xs text-blue-800 dark:text-blue-200">
                      💡 {sec.keyTakeaway}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Import Modules JSON
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON array of Module objects here..."
              rows={8}
              className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJson}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
              >
                Import Modules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
