import React, { useMemo } from 'react';
import { ChevronLeft, FileText, XCircle, Play, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function BrowserView({ 
  title, 
  emptyMsg, 
  questionIds = [], 
  questions = [],
  navigate, 
  onSelectQuestion, 
  onStartGroupQuiz,
  onRemove,
  onClearAll,
  onOpenImageModal 
}) {
  const matchingQuestions = useMemo(() => {
    const idsSet = new Set(questionIds.map(id => Number(id)));
    return questions.filter(q => idsSet.has(q.id));
  }, [questionIds, questions]);

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative pb-24 animate-fade-in">
      {/* Sticky Header */}
      <div className="px-4 pt-6 pb-4 flex justify-between items-center bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100 ios-safe-top">
        <button 
          onClick={() => navigate('home')} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-gray-800 text-lg">
          {title} ({matchingQuestions.length})
        </span>
        {onClearAll && matchingQuestions.length > 0 ? (
          <button 
            onClick={onClearAll}
            title="清空全部"
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
          >
            <Trash2 size={18} />
          </button>
        ) : (
          <div className="w-10"></div>
        )}
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        {matchingQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FileText size={48} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">{emptyMsg}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Batch Practice Button */}
            {onStartGroupQuiz && (
              <button 
                onClick={() => onStartGroupQuiz(matchingQuestions, `${title}專屬測驗`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
              >
                <Play size={18} fill="currentColor" /> 開始【{title}】專屬測驗 ({matchingQuestions.length}題)
              </button>
            )}

            <div className="flex flex-col gap-3">
              {matchingQuestions.map((q) => (
                <div key={q.id} className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm relative pr-12 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-num">
                      題號 #{q.id}
                    </span>
                    {q.category && (
                      <span className="text-[10px] text-gray-400 truncate max-w-[160px]">
                        {q.category}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-gray-800 leading-relaxed">
                    {q.question || q.text}
                  </p>

                  {/* Sign Image if present */}
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
                        <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                          <ImageIcon size={14} /> 查看高清原圖
                        </span>
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => onSelectQuestion(q)} 
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold py-2 px-4 rounded-xl flex-1 transition-colors flex items-center justify-center gap-1"
                    >
                      <Play size={12} fill="currentColor" /> 單題練習
                    </button>
                  </div>

                  {/* Remove icon button */}
                  <button 
                    onClick={() => onRemove(q.id)} 
                    title="移除紀錄"
                    className="absolute top-4 right-3 text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
