import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, Play, Image as ImageIcon, ChevronRight } from 'lucide-react';

export default function SearchView({ navigate, onSelectQuestion, questions = [], onOpenImageModal }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return questions.filter(item => {
      const matchText = (item.question || item.text || '').toLowerCase().includes(q);
      const matchOptions = (item.options || []).some(opt => opt.toLowerCase().includes(q));
      const matchCategory = (item.category || '').toLowerCase().includes(q);
      return matchText || matchOptions || matchCategory;
    }).slice(0, 50);
  }, [query, questions]);

  return (
    <div className="flex flex-col min-h-screen min-h-dvh flex-1 bg-slate-50 relative pb-24 animate-fade-in">
      {/* Search Header */}
      <div className="px-4 pt-6 pb-3 bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100 ios-safe-top">
        <div className="flex items-center gap-2 mb-3">
          <button 
            onClick={() => navigate('home')} 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full -ml-2 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-gray-800 text-lg">全文檢索</span>
        </div>
        <div className="relative max-w-md mx-auto">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="輸入關鍵字 (如: 酒駕, 標線, 罰鍰, 平交道)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 text-sm rounded-full py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        {query.trim() === "" ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">請在搜尋框輸入關鍵字尋找考題</p>
            <p className="text-xs text-gray-400 mt-1">支援搜尋題目描述、選項答案或題庫分類</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={40} className="mb-3 opacity-30 text-red-400" />
            <p className="text-sm font-semibold text-gray-600">找不到符合 「{query}」 的題目</p>
            <p className="text-xs text-gray-400 mt-1">請嘗試縮短關鍵字或更換字詞</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="text-xs text-gray-500 font-medium px-1">
              找到 <span className="font-bold text-blue-600 font-num">{results.length}</span> 筆相關考題
            </div>
            {results.map((q) => (
              <div key={q.id} className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-num">
                      題號 #{q.id}
                    </span>
                    {q.category && (
                      <span className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">
                        {q.category}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => onSelectQuestion(q)} 
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5 bg-blue-50/80 px-2.5 py-1 rounded-full"
                  >
                    進入練習 <ChevronRight size={12} />
                  </button>
                </div>

                <p className="text-sm font-medium text-gray-800 leading-relaxed">
                  {q.question || q.text}
                </p>

                {/* Sign Image Thumbnail if present */}
                {q.has_image && q.image_url && (
                  <div className="pt-1">
                    <button 
                      onClick={() => onOpenImageModal && onOpenImageModal(q.image_url)}
                      className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 hover:bg-slate-100 transition-colors"
                    >
                      <img 
                        src={`/${q.image_url}`} 
                        alt={`題號 #${q.id} 標誌圖`} 
                        className="w-14 h-14 object-contain rounded-lg bg-white p-1 border border-gray-200" 
                      />
                      <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                        <ImageIcon size={14} /> 點擊放大查看考題原圖
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
