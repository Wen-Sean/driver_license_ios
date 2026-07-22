import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, XCircle, Grid, ZoomIn, Award, RotateCcw, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function UnitTestView({ unitId, questions, userProgress, onFinishUnit, onCancel, onToggleBookmark, onOpenImageModal }) {
  // Extract questions for this unit (e.g. unit 1 = index 0~19)
  const startIndex = (unitId - 1) * 20;
  const unitQuestions = questions.slice(startIndex, Math.min(startIndex + 20, 1090));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: optionIndex (1, 2, or 3) }
  const [showAnsweredSheet, setShowAnsweredSheet] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const currentQ = unitQuestions[currentIndex];
  const isBookmarked = (userProgress.bookmarks || []).includes(currentQ?.id);
  const totalCount = unitQuestions.length;

  // Answer selection handler
  const handleSelectOption = (optIndex) => {
    if (isFinished) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  // Finish unit test calculation
  const handleCompleteUnit = () => {
    let correctCount = 0;
    const wrongList = [];

    unitQuestions.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected === q.answer) {
        correctCount++;
      } else {
        wrongList.push(q.id);
      }
    });

    const scorePercentage = Math.round((correctCount / totalCount) * 100);
    const passed = scorePercentage >= 85;

    const result = {
      unitId,
      totalCount,
      correctCount,
      scorePercentage,
      passed,
      wrongList
    };

    setScoreResult(result);
    setIsFinished(true);

    if (passed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    onFinishUnit(result);
  };

  const currentAnswered = userAnswers[currentQ?.id];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Top Header Controls */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回單元列表
        </button>

        <div className="text-center">
          <div className="font-extrabold text-white text-base font-num">
            單元 {unitId < 10 ? `0${unitId}` : unitId} 測驗
          </div>
          <div className="text-xs text-slate-400">
            第 {currentIndex + 1} / {totalCount} 題 (題號 #{currentQ?.id})
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Jump Sheet Trigger */}
          <button
            onClick={() => setShowAnsweredSheet(!showAnsweredSheet)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="題目卡盤"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Bookmark toggle */}
          <button
            onClick={() => currentQ && onToggleBookmark(currentQ.id)}
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="收藏此題"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
        />
      </div>

      {/* Quick Jump Answer Sheet Drawer */}
      {showAnsweredSheet && (
        <div className="glass-panel p-5 rounded-2xl space-y-3 animate-fade-in border border-indigo-500/30">
          <div className="text-xs font-bold text-slate-300 flex justify-between items-center">
            <span>跳頁題號矩陣 (已回答 {Object.keys(userAnswers).length} / {totalCount})</span>
            <button onClick={() => setShowAnsweredSheet(false)} className="text-slate-400 hover:text-white">關閉</button>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {unitQuestions.map((q, idx) => {
              const answered = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowAnsweredSheet(false);
                  }}
                  className={`p-2 rounded-xl text-xs font-bold font-num transition-all ${
                    isCurrent 
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' 
                      : answered 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6 relative overflow-hidden">
        {/* Category & Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="badge badge-primary font-num">#{currentQ?.id}</span>
            <span className="text-xs text-slate-400 font-semibold">{currentQ?.category} • {currentQ?.subcategory}</span>
          </div>
          {currentQ?.has_image && (
            <span className="badge badge-warning text-[11px]">含有號誌/標線圖片</span>
          )}
        </div>

        {/* Question Stem */}
        <h2 className="text-lg lg:text-xl font-bold text-white leading-relaxed">
          {currentQ?.question}
        </h2>

        {/* Image Display */}
        {currentQ?.has_image && currentQ?.image_url && (
          <div className="relative group rounded-2xl bg-white/95 p-5 border border-slate-700 flex flex-col items-center justify-center max-w-lg mx-auto shadow-lg overflow-hidden">
            <img
              src={`/${currentQ.image_url}`}
              alt="考題號誌與圖示"
              className="max-h-56 object-contain filter drop-shadow"
            />
            <button
              onClick={() => onOpenImageModal(currentQ.image_url)}
              className="mt-3 px-3 py-1.5 rounded-lg bg-slate-900/80 text-white text-xs font-semibold hover:bg-slate-900 flex items-center gap-1.5 transition-all shadow"
            >
              <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
              點擊檢視放大高清原圖
            </button>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ?.options.map((optionText, optIdx) => {
            const optionNum = optIdx + 1;
            const isSelected = currentAnswered === optionNum;
            const isCorrect = optionNum === currentQ.answer;

            let cardState = '';
            if (currentAnswered !== undefined) {
              if (isCorrect) cardState = 'correct';
              else if (isSelected) cardState = 'incorrect';
            } else if (isSelected) {
              cardState = 'selected';
            }

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optionNum)}
                className={`option-card ${cardState}`}
              >
                <div className="option-badge">
                  {optionNum}
                </div>
                <div className="text-sm sm:text-base font-medium leading-normal flex-1">
                  {optionText}
                </div>
                {currentAnswered !== undefined && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Immediate Practice Feedback Box */}
        {currentAnswered !== undefined && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm animate-fade-in ${
            currentAnswered === currentQ.answer 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          }`}>
            <div className="font-bold flex items-center gap-2 mb-1">
              {currentAnswered === currentQ.answer ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  回答正確！標準答案為第 ({currentQ.answer}) 項
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  回答錯誤。正確標準答案應為第 ({currentQ.answer}) 項：{currentQ.options[currentQ.answer - 1]}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          上一題
        </button>

        {currentIndex === totalCount - 1 ? (
          <button
            onClick={handleCompleteUnit}
            className="btn-primary bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700"
          >
            <Award className="w-4 h-4" />
            完成提交測驗
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(prev => Math.min(totalCount - 1, prev + 1))}
            className="btn-primary"
          >
            下一題
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result Modal / Overlay when unit is completed */}
      {isFinished && scoreResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
          <div className="glass-panel p-8 rounded-3xl max-w-lg w-full text-center space-y-6 border-indigo-500/40 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-lg">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="badge badge-primary font-num text-xs mb-2">單元 {unitId} 測驗結算</span>
              <h2 className="text-2xl font-extrabold text-white">
                {scoreResult.passed ? '🎉 恭喜通過本關測驗！' : '💪 還差一點點，繼續加油！'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                公路局標準及格門檻為 85 分
              </p>
            </div>

            {/* Score Ring / Box */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-4xl font-extrabold font-num text-white">
                <span className={scoreResult.passed ? 'text-emerald-400' : 'text-rose-400'}>
                  {scoreResult.scorePercentage}
                </span>
                <span className="text-base text-slate-400 font-normal"> / 100分</span>
              </div>
              <div className="text-xs text-slate-400">
                答對 {scoreResult.correctCount} 題 / 共 {scoreResult.totalCount} 題
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setIsFinished(false);
                  setCurrentIndex(0);
                  setUserAnswers({});
                }}
                className="btn-secondary flex-1"
              >
                <RotateCcw className="w-4 h-4" />
                重新測驗本關
              </button>

              <button
                onClick={onCancel}
                className="btn-primary flex-1"
              >
                返回關卡選單
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
