import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, FileText, ChevronLeft, Home } from 'lucide-react';

export default function ResultView({ 
  score = 0, 
  total = 20, 
  userAnswers = {}, 
  questions = [], 
  navigate,
  onRetake,
  onOpenImageModal
}) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const isPass = percentage >= 85;

  useEffect(() => {
    if (isPass) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isPass]);

  return (
    <div className="flex flex-col min-h-screen min-h-dvh flex-1 bg-slate-50 relative pb-28 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex justify-between items-center bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100 ios-safe-top">
        <button 
          onClick={() => navigate('home')} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-gray-800 text-lg">測驗結果</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 p-5 max-w-md mx-auto w-full space-y-6">
        {/* Pass / Fail Banner */}
        <div className="flex flex-col items-center justify-center text-center mt-2">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg transition-transform hover:scale-105" 
            style={{ backgroundColor: isPass ? '#10b981' : '#ef4444' }}
          >
            {isPass ? <CheckCircle2 size={52} className="text-white" /> : <XCircle size={52} className="text-white" />}
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
            {isPass ? '測驗合格！' : '再接再厲！'}
          </h2>
          <p className="text-gray-500 text-sm">
            本次得分：<span className={`font-extrabold text-2xl font-num ${isPass ? 'text-emerald-600' : 'text-rose-600'}`}>{percentage}</span> 分 
            <span className="text-xs text-gray-400 font-normal ml-1.5">(及格門檻: 85分)</span>
          </p>
        </div>

        {/* Score Stats Card */}
        <div className="bg-white rounded-3xl p-5 w-full shadow-sm border border-gray-100 flex justify-around text-center">
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">答對題數</div>
            <div className="text-2xl font-extrabold text-emerald-600 font-num">{score}</div>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">答錯題數</div>
            <div className="text-2xl font-extrabold text-rose-600 font-num">{total - score}</div>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
            <FileText size={18} className="text-blue-500"/> 測驗檢討 ({questions.length}題)
          </h3>

          <div className="flex flex-col gap-4">
            {questions.map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === q.answer;
              const isSkipped = userAnswer === undefined || userAnswer === null;

              return (
                <div key={q.id || idx} className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-num">
                      第 {idx + 1} 題 (題號 #{q.id})
                    </span>
                    {isCorrect ? (
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-bold">
                        <CheckCircle2 size={13}/> 答對
                      </span>
                    ) : (
                      <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-bold">
                        <XCircle size={13}/> {isSkipped ? '未作答' : '答錯'}
                      </span>
                    )}
                  </div>

                  <p className="text-[15px] font-bold text-gray-800 leading-relaxed">
                    {q.question || q.text}
                  </p>

                  {/* Sign Image Preview */}
                  {q.has_image && q.image_url && (
                    <div className="pt-1">
                      <button 
                        onClick={() => onOpenImageModal && onOpenImageModal(q.image_url)}
                        className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 hover:bg-slate-100 transition-colors"
                      >
                        <img 
                          src={`/${q.image_url}`} 
                          alt={`題號 #${q.id} 標誌圖`} 
                          className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-gray-200" 
                        />
                        <span className="text-xs text-blue-600 font-medium">查看原圖</span>
                      </button>
                    </div>
                  )}

                  {/* Options review */}
                  <div className="flex flex-col gap-2 pt-1">
                    {(q.options || []).map((opt, oIdx) => {
                      const optNum = oIdx + 1;
                      const isThisCorrectAnswer = q.answer === optNum;
                      const isThisUserAnswer = userAnswer === optNum;

                      let optStyle = "text-gray-600 text-[13px] p-3 rounded-xl border border-gray-100 bg-gray-50 flex justify-between items-center";

                      if (isThisCorrectAnswer) {
                        optStyle = "text-emerald-900 bg-emerald-50 border-emerald-300 font-bold text-[13px] p-3 rounded-xl border flex justify-between items-center shadow-xs";
                      } else if (isThisUserAnswer && !isCorrect) {
                        optStyle = "text-rose-900 bg-rose-50 border-rose-200 text-[13px] p-3 rounded-xl border flex justify-between items-center";
                      }

                      return (
                        <div key={oIdx} className={optStyle}>
                          <div className="flex items-start gap-2 flex-1">
                            <span className="w-5 h-5 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-xs font-bold shrink-0 font-num">
                              {optNum}
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {isThisCorrectAnswer && (
                              <span className="text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <CheckCircle2 size={12} /> 正確答案
                              </span>
                            )}
                            {isThisUserAnswer && !isCorrect && (
                              <span className="text-[11px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <XCircle size={12} /> 您的回答
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explicit Correct Answer Callout */}
                  <div className={`mt-2 p-3 rounded-xl border text-xs ${
                    isCorrect 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    {isCorrect ? (
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>回答正確！標準答案為第 ({q.answer}) 項</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-rose-700">
                          <XCircle size={15} className="text-rose-600" />
                          <span>{isSkipped ? '未作答' : '回答錯誤'}</span>
                        </div>
                        <div className="text-[13px] leading-relaxed">
                          正確標準答案為第 <span className="font-extrabold text-emerald-700 font-num">({q.answer})</span> 項：<span className="font-bold text-emerald-900">{q.options ? q.options[q.answer - 1] : ''}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Controls */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md p-4 border-t border-gray-100 z-30 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] ios-safe-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={() => navigate('mistakes')} 
            className="flex-1 bg-white text-gray-700 border border-gray-200 font-bold py-3 rounded-2xl active:scale-95 transition-all text-sm shadow-sm hover:bg-gray-50"
          >
            去錯題本
          </button>
          <button 
            onClick={() => navigate('home')} 
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-2xl shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-1"
          >
            <Home size={16} /> 返回首頁
          </button>
        </div>
      </div>
    </div>
  );
}
