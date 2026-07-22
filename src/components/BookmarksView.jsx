import React, { useState } from 'react';
import { Bookmark, ArrowLeft, Trash2, CheckCircle2, ZoomIn } from 'lucide-react';

export default function BookmarksView({ questions, userProgress, onToggleBookmark, onCancel, onOpenImageModal }) {
  const bookmarkIds = userProgress.bookmarks || [];
  const bookmarkedQuestions = questions.filter(q => bookmarkIds.includes(q.id));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  if (bookmarkedQuestions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
          <Bookmark className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white">尚無收藏的難題</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          在單元測驗或題庫瀏覽時，點擊右上角「書籤」按鈕，即可將棘手或常考題型收藏至此！
        </p>
        <button onClick={onCancel} className="btn-primary">
          返回單元關卡列表
        </button>
      </div>
    );
  }

  const currentQ = bookmarkedQuestions[currentIndex];
  const userAns = selectedAnswers[currentQ?.id];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          返回關卡列表
        </button>

        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400 fill-current" />
          <h2 className="font-extrabold text-white">收藏難題庫 ({bookmarkedQuestions.length} 題)</h2>
        </div>

        <button
          onClick={() => onToggleBookmark(currentQ.id)}
          className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          移除本題收藏
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>收藏第 {currentIndex + 1} / {bookmarkedQuestions.length} 題 (題號 #{currentQ?.id})</span>
        <span>{currentQ?.category}</span>
      </div>

      <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
        <h3 className="text-lg lg:text-xl font-bold text-white leading-relaxed">
          {currentQ?.question}
        </h3>

        {currentQ?.has_image && currentQ?.image_url && (
          <div className="rounded-2xl bg-white/95 p-5 border border-slate-700 flex flex-col items-center max-w-lg mx-auto shadow-lg">
            <img src={`/${currentQ.image_url}`} alt="收藏題圖示" className="max-h-56 object-contain" />
            <button
              onClick={() => onOpenImageModal(currentQ.image_url)}
              className="mt-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
              查看高清圖示
            </button>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {currentQ?.options.map((optText, idx) => {
            const optNum = idx + 1;
            const isCorrect = optNum === currentQ.answer;
            const isSelected = userAns === optNum;

            let cardState = '';
            if (userAns !== undefined) {
              if (isCorrect) cardState = 'correct';
              else if (isSelected) cardState = 'incorrect';
            }

            return (
              <div
                key={idx}
                onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optNum }))}
                className={`option-card ${cardState}`}
              >
                <div className="option-badge">{optNum}</div>
                <div className="text-sm sm:text-base font-medium flex-1">{optText}</div>
                {userAns !== undefined && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>
            );
          })}
        </div>

        {userAns !== undefined && (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold">
            標準答案為第 ({currentQ.answer}) 項：{currentQ.options[currentQ.answer - 1]}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="btn-secondary disabled:opacity-40"
        >
          上一題
        </button>

        <button
          onClick={() => setCurrentIndex(prev => Math.min(bookmarkedQuestions.length - 1, prev + 1))}
          disabled={currentIndex === bookmarkedQuestions.length - 1}
          className="btn-primary disabled:opacity-40"
        >
          下一題
        </button>
      </div>
    </div>
  );
}
