import React from 'react';
import { Car, Award, BookOpen, Bookmark, Search, RotateCcw, Flame } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, stats, onResetProgress }) {
  return (
    <>
      {/* iOS Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3.5 ios-safe-top">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-tight leading-none">2026 汽車筆試極速通關</h1>
              <span className="text-[10px] text-indigo-400 font-num font-semibold">1090 題單元測驗 iOS 版</span>
            </div>
          </div>

          {/* Top Quick Stats & Reset */}
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400 font-num">
              {stats.passedUnits} / 55 單元
            </div>

            <button
              onClick={onResetProgress}
              title="重置進度"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* iOS Native Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-2 ios-safe-bottom flex items-center justify-around">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentView === 'home' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px]">單元關卡</span>
        </button>

        <button
          onClick={() => setCurrentView('mock_exam')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentView === 'mock_exam' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px]">模擬考</span>
        </button>

        <button
          onClick={() => setCurrentView('wrong_notebook')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
            currentView === 'wrong_notebook' ? 'text-rose-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px]">錯題本</span>
          {stats.wrongCount > 0 && (
            <span className="absolute -top-1 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-rose-500 text-white shadow">
              {stats.wrongCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentView('bookmarks')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
            currentView === 'bookmarks' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px]">收藏夾</span>
          {stats.bookmarkCount > 0 && (
            <span className="absolute -top-1 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500 text-white shadow">
              {stats.bookmarkCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentView('question_bank')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentView === 'question_bank' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">題庫檢索</span>
        </button>
      </nav>
    </>
  );
}
