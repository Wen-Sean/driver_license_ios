import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, ArrowRight, Award, CheckCircle2, AlertTriangle, ShieldCheck, ZoomIn, Grid } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MockExamView({ questions, userProgress, onFinishExam, onCancel, onOpenImageModal }) {
  // Sample 40 random questions from all 1090 questions
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedOption }
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [showGridDrawer, setShowGridDrawer] = useState(false);

  // Initialize 40 random questions
  useEffect(() => {
    if (questions && questions.length > 0) {
      // Shuffle & pick 40
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 40);
      setExamQuestions(selected);
    }
  }, [questions]);

  // Countdown timer effect
  useEffect(() => {
    if (isSubmitted || examQuestions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, examQuestions]);

  const currentQ = examQuestions[currentIndex];

  const handleSelectOption = (optIndex) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  const handleSubmitExam = () => {
    if (isSubmitted) return;

    let correctCount = 0;
    const wrongList = [];

    examQuestions.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected === q.answer) {
        correctCount++;
      } else {
        wrongList.push(q.id);
      }
    });

    const score = Math.round(correctCount * 2.5); // 40 * 2.5 = 100
    const passed = score >= 85;
    const timeUsed = 1800 - timeLeft;

    const result = {
      total: 40,
      correctCount,
      score,
      passed,
      timeUsed,
      wrongList
    };

    setExamResult(result);
    setIsSubmitted(true);

    if (passed) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    onFinishExam(result);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (examQuestions.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Top Exam Header */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          離開考試
        </button>

        <div className="flex items-center gap-3">
          <span className="badge badge-primary font-num text-xs">公路局全真模擬筆試</span>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold font-num ${
            timeLeft < 300 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-slate-800 text-emerald-400 border border-slate-700'
          }`}>
            <Clock className="w-4 h-4" />
            倒數 {formatTime(timeLeft)}
          </div>
        </div>

        <button
          onClick={() => setShowGridDrawer(!showGridDrawer)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* Answer matrix drawer */}
      {showGridDrawer && (
        <div className="glass-panel p-5 rounded-2xl space-y-3 animate-fade-in border border-emerald-500/30">
          <div className="text-xs font-bold text-slate-300 flex justify-between items-center">
            <span>考試卡盤（已作答 {Object.keys(userAnswers).length} / 40 題）</span>
            <button onClick={() => setShowGridDrawer(false)} className="text-slate-400 hover:text-white">關閉</button>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
            {examQuestions.map((q, idx) => {
              const answered = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowGridDrawer(false);
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

      {/* Question Box */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs">
          <span className="text-slate-400">模擬考第 {currentIndex + 1} / 40 題</span>
          <span className="text-slate-400">{currentQ?.category}</span>
        </div>

        <h2 className="text-lg lg:text-xl font-bold text-white leading-relaxed">
          {currentQ?.question}
        </h2>

        {/* Image Preview */}
        {currentQ?.has_image && currentQ?.image_url && (
          <div className="relative rounded-2xl bg-white/95 p-5 border border-slate-700 flex flex-col items-center justify-center max-w-lg mx-auto shadow-lg">
            <img
              src={`/${currentQ.image_url}`}
              alt="模擬考圖片題"
              className="max-h-56 object-contain"
            />
            <button
              onClick={() => onOpenImageModal(currentQ.image_url)}
              className="mt-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
              查看大圖
            </button>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ?.options.map((optionText, optIdx) => {
            const optionNum = optIdx + 1;
            const isSelected = userAnswers[currentQ.id] === optionNum;

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optionNum)}
                className={`option-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="option-badge">
                  {optionNum}
                </div>
                <div className="text-sm sm:text-base font-medium leading-normal flex-1">
                  {optionText}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation & Submit */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="btn-secondary disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" />
          上一題
        </button>

        {currentIndex === 39 ? (
          <button
            onClick={handleSubmitExam}
            className="btn-primary bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700"
          >
            <ShieldCheck className="w-4 h-4" />
            交卷交卡結算
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(prev => Math.min(39, prev + 1))}
            className="btn-primary"
          >
            下一題
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result Certificate Overlay */}
      {isSubmitted && examResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="glass-panel p-8 rounded-3xl max-w-lg w-full text-center space-y-6 border-indigo-500/40 shadow-2xl">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center border shadow-xl ${
              examResult.passed ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
            }`}>
              {examResult.passed ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-white">
                {examResult.passed ? '🎉 筆試模擬考及格！' : '❌ 筆試模擬考未及格'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {examResult.passed ? '太讚了！已符合公路局 85 分考取駕照標準！' : '及格門檻為 85 分，請加強錯題練習再接再勵！'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-5xl font-extrabold font-num">
                <span className={examResult.passed ? 'text-emerald-400' : 'text-rose-400'}>
                  {examResult.score}
                </span>
                <span className="text-sm text-slate-400 font-normal"> / 100 分</span>
              </div>
              <div className="text-xs text-slate-400 pt-2 flex justify-center gap-4 border-t border-slate-800/80">
                <span>答對 {examResult.correctCount} / 40 題</span>
                <span>使用時間: {formatTime(examResult.timeUsed)}</span>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="btn-primary w-full py-3"
            >
              返回首頁單元選單
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
