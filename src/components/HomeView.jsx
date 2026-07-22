import React from 'react';
import { 
  Bell, Search, Trophy, LayoutList, XCircle, 
  FolderHeart, Play, ChevronRight, RotateCcw, Sparkles
} from 'lucide-react';
import CircularProgress from './CircularProgress';

export default function HomeView({ questions, userProgress, navigate, onStartMockExam, onResetProgress }) {
  const TOTAL_QUESTIONS = questions.length || 1090;
  const QUESTIONS_PER_SET = 20;
  const TOTAL_SETS = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_SET);

  // Calculate stats
  const unitProgressObj = userProgress.unitProgress || {};
  const passedUnitsCount = Object.values(unitProgressObj).filter(u => u.completed).length;
  
  const mistakesCount = Object.keys(userProgress.wrongQuestions || {}).length;
  const favoritesCount = (userProgress.bookmarks || []).length;
  const completedQuestionsCount = Math.min(TOTAL_QUESTIONS, passedUnitsCount * QUESTIONS_PER_SET);
  const overallPercentage = Math.min(100, Math.round((completedQuestionsCount / TOTAL_QUESTIONS) * 100));

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative pb-24 overflow-y-auto animate-fade-in">
      {/* Top Header with iOS safe area handling */}
      <div className="px-6 pt-8 pb-4 flex justify-between items-center bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100 ios-safe-top">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
              🚗
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
              準駕駛, 早安 <Sparkles size={12} className="text-amber-500" />
            </div>
            <div className="font-bold text-gray-800 text-sm">準備考取 2026 汽車駕照</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onResetProgress}
            title="重置進度" 
            className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
          <button className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 bg-red-500 w-2 h-2 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="px-5 pt-6 max-w-md mx-auto w-full space-y-6">
        {/* Main Learning Progress Card */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-60"></div>
          <h2 className="text-gray-800 font-bold mb-5 flex items-center gap-2 text-base">
            <Trophy size={18} className="text-amber-500" />
            總題庫學習進度
          </h2>
          <div className="flex items-center gap-6">
            <CircularProgress percentage={overallPercentage} color="text-blue-600" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-400 font-medium">已練習單元</span>
                <span className="text-sm font-bold text-blue-600 font-num">
                  {passedUnitsCount} <span className="text-gray-400 text-xs font-normal">/ {TOTAL_SETS} 回</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${overallPercentage}%` }}
                ></div>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 font-medium">
                {overallPercentage >= 80 ? '太棒了！已具備上考場實力！' : overallPercentage >= 40 ? '進度過半，繼續保持！' : '踏實練習，輕鬆通關！'}
              </span>
            </div>
          </div>
        </div>

        {/* Core Function 4-Grid Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          <button 
            onClick={() => navigate('sets')} 
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 text-white shadow-md shadow-blue-500/10 flex flex-col justify-between items-start h-32 relative overflow-hidden active:scale-95 transition-transform text-left"
          >
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
              <LayoutList size={22} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-base">分組練習</div>
              <div className="text-xs text-blue-100">共 {TOTAL_SETS} 回題組</div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('search')} 
            className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between items-start h-32 relative overflow-hidden active:scale-95 transition-transform text-left hover:border-indigo-200"
          >
            <div className="bg-indigo-50 p-2 rounded-xl">
              <Search size={22} className="text-indigo-500" />
            </div>
            <div>
              <div className="font-bold text-gray-800 text-base">全文檢索</div>
              <div className="text-xs text-gray-400">關鍵字找題</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('mistakes')} 
            className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between items-start h-32 relative overflow-hidden active:scale-95 transition-transform text-left hover:border-red-200"
          >
            <div className="bg-red-50 p-2 rounded-xl relative">
              <XCircle size={22} className="text-red-500" />
              {mistakesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {mistakesCount}
                </span>
              )}
            </div>
            <div>
              <div className="font-bold text-gray-800 text-base">錯題複習</div>
              <div className="text-xs text-gray-400">消滅易錯陷阱 ({mistakesCount}題)</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('favorites')} 
            className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between items-start h-32 relative overflow-hidden active:scale-95 transition-transform text-left hover:border-amber-200"
          >
            <div className="bg-amber-50 p-2 rounded-xl relative">
              <FolderHeart size={22} className="text-amber-500" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {favoritesCount}
                </span>
              )}
            </div>
            <div>
              <div className="font-bold text-gray-800 text-base">我的收藏</div>
              <div className="text-xs text-gray-400">必考重點標記 ({favoritesCount}題)</div>
            </div>
          </button>
        </div>

        {/* Big Formal Mock Test Card */}
        <button 
          onClick={onStartMockExam}
          className="w-full bg-gray-900 text-white rounded-[28px] p-1 shadow-lg shadow-gray-900/20 active:scale-95 transition-transform text-left"
        >
          <div className="border border-gray-700/80 rounded-[24px] p-4.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
                <Play size={22} className="text-white ml-0.5" fill="currentColor" />
              </div>
              <div>
                <div className="font-bold text-base flex items-center gap-2">
                  正式模擬測驗
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-400/30">
                    隨機40題
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">依據交通部官方考照標準與比例配題</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400 shrink-0" />
          </div>
        </button>
      </div>
    </div>
  );
}
