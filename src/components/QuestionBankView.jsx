import React, { useState } from 'react';
import { Search, Image as ImageIcon, Bookmark, ArrowLeft, ZoomIn, CheckCircle2, Filter } from 'lucide-react';

export default function QuestionBankView({ questions, userProgress, onToggleBookmark, onCancel, onOpenImageModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyImages, setOnlyImages] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    if (onlyImages && !q.has_image) return false;

    if (categoryFilter === 'cat1' && !q.category.includes('架構一')) return false;
    if (categoryFilter === 'cat2' && !q.category.includes('架構二')) return false;
    if (categoryFilter === 'cat3' && !q.category.includes('架構三')) return false;

    if (searchTerm.strip?.() || searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchQ = q.question.toLowerCase().includes(term);
      const matchId = q.id.toString() === term;
      const matchOpt = q.options.some(o => o.toLowerCase().includes(term));
      const matchSub = q.subcategory.toLowerCase().includes(term);
      return matchQ || matchId || matchOpt || matchSub;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Top Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white self-start md:self-auto">
          <ArrowLeft className="w-4 h-4" />
          返回關卡選單
        </button>

        <div className="flex-1 w-full max-w-xl relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋關鍵字（例如：酒駕、行人、方向燈、超車、標線、題號#81...）"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <button
          onClick={() => setOnlyImages(!onlyImages)}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
            onlyImages 
              ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-indigo-400" />
          僅顯示號誌圖片題 ({questions.filter(q => q.has_image).length} 題)
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              categoryFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            全部題庫 (1090)
          </button>
          <button
            onClick={() => setCategoryFilter('cat1')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              categoryFilter === 'cat1' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            架構一：觀念與態度 (424)
          </button>
          <button
            onClick={() => setCategoryFilter('cat2')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              categoryFilter === 'cat2' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            架構二：停讓文化 (230)
          </button>
          <button
            onClick={() => setCategoryFilter('cat3')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              categoryFilter === 'cat3' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            架構三：安全駕駛 (436)
          </button>
        </div>

        <div className="text-slate-400 font-medium">
          找到 <span className="text-emerald-400 font-num font-bold">{filteredQuestions.length}</span> 筆相符題目
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.slice(0, 50).map((q) => {
          const isBookmarked = (userProgress.bookmarks || []).includes(q.id);

          return (
            <div key={q.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary font-num">#{q.id}</span>
                  <span className="text-slate-400 font-semibold">{q.category} • {q.subcategory}</span>
                </div>

                <button
                  onClick={() => onToggleBookmark(q.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isBookmarked ? 'text-amber-400 bg-amber-500/20' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h3 className="font-bold text-white text-base leading-relaxed">
                {q.question}
              </h3>

              {q.has_image && q.image_url && (
                <div className="bg-white/95 rounded-xl p-4 max-w-sm border border-slate-700 flex flex-col items-center">
                  <img src={`/${q.image_url}`} alt="圖片題" className="max-h-40 object-contain" />
                  <button
                    onClick={() => onOpenImageModal(q.image_url)}
                    className="mt-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    查看大圖
                  </button>
                </div>
              )}

              {/* Options & Answer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                {q.options.map((optText, optIdx) => {
                  const optNum = optIdx + 1;
                  const isCorrect = optNum === q.answer;

                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-xl border flex items-start gap-2 ${
                        isCorrect 
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold' 
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {optNum}
                      </span>
                      <span className="leading-snug">{optText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredQuestions.length > 50 && (
          <div className="text-center py-4 text-xs text-slate-500">
            基於效能考量目前展示前 50 筆結果，請輸入關鍵字精準搜尋
          </div>
        )}
      </div>
    </div>
  );
}
