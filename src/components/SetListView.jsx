import React from 'react';
import { ChevronLeft, Play, CheckCircle2 } from 'lucide-react';

export default function SetListView({ navigate, onSelectSet, userProgress, totalQuestions = 1090 }) {
  const QUESTIONS_PER_SET = 20;
  const TOTAL_SETS = Math.ceil(totalQuestions / QUESTIONS_PER_SET);
  const unitProgress = userProgress?.unitProgress || {};

  const sets = Array.from({ length: TOTAL_SETS }, (_, i) => {
    const setId = i + 1;
    const start = i * QUESTIONS_PER_SET + 1;
    const end = Math.min((i + 1) * QUESTIONS_PER_SET, totalQuestions);
    const progress = unitProgress[setId] || null;

    return { 
      id: setId, 
      start, 
      end,
      count: end - start + 1,
      bestScore: progress ? progress.bestScore : null,
      completed: progress ? progress.completed : false,
      wrongCount: progress ? progress.wrongCount : 0
    };
  });

  return (
    <div className="flex flex-col min-h-screen min-h-dvh flex-1 bg-slate-50 relative pb-24 animate-fade-in">
      {/* Sticky Header with iOS safe padding */}
      <div className="px-4 pt-6 pb-4 flex justify-between items-center bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100 ios-safe-top">
        <button 
          onClick={() => navigate('home')} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-gray-800 text-base">題組練習 (共 {TOTAL_SETS} 回)</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="grid grid-cols-2 gap-3">
          {sets.map((set) => {
            const isCompleted = set.completed;
            const hasAttempted = set.bestScore !== null;
            const isPassed = set.bestScore >= 85;

            return (
              <button
                key={set.id}
                onClick={() => onSelectSet(set)}
                className={`bg-white p-4 rounded-2xl border transition-all text-left shadow-sm active:scale-95 flex flex-col justify-between h-36 ${
                  isPassed 
                    ? 'border-emerald-200 hover:border-emerald-400 bg-gradient-to-b from-white to-emerald-50/30' 
                    : hasAttempted
                    ? 'border-amber-200 hover:border-amber-400'
                    : 'border-gray-100 hover:border-blue-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full font-num">
                      第 {set.id} 回
                    </span>
                    {isPassed ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-num">
                        <CheckCircle2 size={10} /> {set.bestScore}分
                      </span>
                    ) : hasAttempted ? (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full font-num">
                        {set.bestScore}分
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full">
                        未測驗
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-gray-800 text-sm font-num">
                    題號 {set.start} ~ {set.end}
                  </div>
                </div>

                <div className="text-xs text-gray-400 mt-2 flex items-center justify-between border-t border-gray-100/80 pt-2">
                  <span>共 {set.count} 題</span>
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Play size={12} className="ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
