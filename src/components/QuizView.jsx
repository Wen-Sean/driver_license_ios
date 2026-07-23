import React, { useState } from 'react';
import { 
  ChevronLeft, Star, CheckCircle2, AlertCircle, 
  ZoomIn 
} from 'lucide-react';

export default function QuizView({ 
  questions = [], 
  title = "單元測驗", 
  unitId = null,
  navigate, 
  favorites = [], 
  toggleFavorite, 
  addMistake, 
  onFinish,
  onOpenImageModal 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col min-h-full bg-white items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-600 font-bold text-lg">無題目資料</p>
        <button 
          onClick={() => navigate('home')} 
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm"
        >
          返回首頁
        </button>
      </div>
    );
  }

  const question = questions[currentIndex];
  const isFavorite = favorites.includes(question.id);

  const handleSelectOption = (index) => {
    setUserAnswers(prev => ({ ...prev, [currentIndex]: index + 1 }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let scoreCount = 0;
    const wrongList = [];

    questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected === q.answer) {
        scoreCount++;
      } else {
        wrongList.push(q.id);
        if (addMistake) addMistake(q.id);
      }
    });

    const scorePercentage = Math.round((scoreCount / questions.length) * 100);

    onFinish({
      score: scoreCount,
      total: questions.length,
      scorePercentage,
      wrongList,
      userAnswers,
      questions,
      unitId
    });
  };

  const handleBackWithConfirm = () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount > 0 && answeredCount < questions.length) {
      if (window.confirm("測驗尚未完成，確定要退出嗎？（未交卷將不會儲存本次成績）")) {
        navigate('home');
      }
    } else {
      navigate('home');
    }
  };

  return (
    <div className="flex flex-col min-h-screen min-h-dvh flex-1 bg-slate-50 relative pb-28 animate-fade-in">
      {/* Top Sticky Bar with iOS safe area handling */}
      <div className="px-4 pt-6 pb-4 flex justify-between items-center bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20 ios-safe-top">
        <button 
          onClick={handleBackWithConfirm} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-gray-800 text-base max-w-[200px] truncate text-center">
          {title}
        </span>
        <button 
          onClick={() => toggleFavorite && toggleFavorite(question.id)} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Star 
            size={22} 
            fill={isFavorite ? "#f59e0b" : "none"} 
            className={isFavorite ? "text-amber-500" : "text-gray-400"} 
          />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 max-w-md mx-auto w-full">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-gray-500 font-num">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-5 relative space-y-4">
          <div className="flex justify-between items-center">
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
              單選題
            </span>
            <span className="text-gray-400 text-xs font-medium font-num">
              題號：#{question.id}
            </span>
          </div>

          <h2 className="text-[16px] font-bold text-gray-800 leading-relaxed">
            {question.question || question.text}
          </h2>

          {/* Sign image display */}
          {question.has_image && question.image_url && (
            <div className="pt-2">
              <button 
                onClick={() => onOpenImageModal && onOpenImageModal(question.image_url)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all group"
              >
                <img 
                  src={`/${question.image_url}`} 
                  alt={`題號 #${question.id} 考題標誌`} 
                  className="max-h-40 object-contain rounded-lg filter drop-shadow-sm group-hover:scale-105 transition-transform" 
                />
                <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                  <ZoomIn size={14} /> 點擊圖片檢視高清大圖
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3">
          {(question.options || []).map((option, index) => {
            const isSelected = userAnswers[currentIndex] === index + 1;

            let borderStyle = "border-gray-200 hover:border-blue-400 bg-white text-gray-700";
            if (isSelected) borderStyle = "border-blue-500 bg-blue-50 ring-2 ring-blue-100 text-blue-800";

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3 shadow-sm active:scale-[0.99] ${borderStyle}`}
              >
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 mt-0.5 font-num">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[15px] leading-relaxed">
                    {option}
                  </p>
                </div>
                {isSelected && <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md p-4 border-t border-gray-100 z-30 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] ios-safe-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex-1 font-bold py-3.5 rounded-2xl shadow-sm transition-all text-base flex items-center justify-center gap-1.5 ${
              currentIndex === 0
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95'
            }`}
          >
            <ChevronLeft size={18} /> 上一題
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-md transition-all active:scale-95 text-base flex items-center justify-center gap-1.5"
            >
              下一題 <ChevronLeft size={18} className="rotate-180" />
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-2xl shadow-md transition-all active:scale-95 text-base flex items-center justify-center gap-1.5"
            >
              交卷 <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
