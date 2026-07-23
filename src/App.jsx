import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import SetListView from './components/SetListView';
import SearchView from './components/SearchView';
import BrowserView from './components/BrowserView';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';
import BottomNav from './components/BottomNav';
import ImageModal from './components/ImageModal';

const LOCAL_STORAGE_KEY = 'driver_license_ios_progress_2026';

const initialProgress = {
  unitProgress: {}, // { [unitId]: { bestScore, completed, wrongCount, lastAttemptAt } }
  wrongQuestions: {}, // { [qId]: { count, lastWrongAt } }
  bookmarks: [], // [qId1, qId2]
  mockHistory: []
};

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // home, sets, search, mistakes, favorites, quiz, result
  const [modalImageUrl, setModalImageUrl] = useState(null);

  // User learning progress state
  const [userProgress, setUserProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialProgress;
    } catch (e) {
      return initialProgress;
    }
  });

  // Quiz active states
  const [quizConfig, setQuizConfig] = useState({ questions: [], title: "", unitId: null });
  const [quizResult, setQuizResult] = useState({ score: 0, total: 0, userAnswers: {}, questions: [] });

  // Save to localStorage whenever userProgress changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userProgress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [userProgress]);

  // Load questions dataset from public/questions.json
  useEffect(() => {
    fetch('/questions.json')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load questions.json', err);
        setLoading(false);
      });
  }, []);

  const navigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite bookmark
  const toggleFavorite = (qId) => {
    setUserProgress(prev => {
      const bookmarks = prev.bookmarks || [];
      const exists = bookmarks.includes(qId);
      const updated = exists ? bookmarks.filter(id => id !== qId) : [...bookmarks, qId];
      return { ...prev, bookmarks: updated };
    });
  };

  // Add mistake record
  const addMistake = (qId) => {
    setUserProgress(prev => {
      const wrong = prev.wrongQuestions || {};
      const count = (wrong[qId]?.count || 0) + 1;
      return {
        ...prev,
        wrongQuestions: {
          ...wrong,
          [qId]: { count, lastWrongAt: Date.now() }
        }
      };
    });
  };

  // Remove mistake record
  const removeMistake = (qId) => {
    setUserProgress(prev => {
      const wrong = { ...(prev.wrongQuestions || {}) };
      delete wrong[qId];
      return { ...prev, wrongQuestions: wrong };
    });
  };

  // Clear all mistakes
  const handleClearAllMistakes = () => {
    if (window.confirm("確定要清空所有的錯題紀錄嗎？")) {
      setUserProgress(prev => ({ ...prev, wrongQuestions: {} }));
    }
  };

  // Start quiz session
  const startQuizSession = (questionsList, title, unitId = null) => {
    setQuizConfig({ questions: questionsList, title, unitId });
    setCurrentView('quiz');
  };

  // Handler for selecting a set from SetListView
  const handleSelectSet = (setObj) => {
    const setQuestions = questions.slice(setObj.start - 1, setObj.end);
    startQuizSession(setQuestions, `第 ${setObj.id} 回 (${setObj.start}-${setObj.end}題)`, setObj.id);
  };

  // Handler for starting a mock exam (40 random questions)
  const handleStartMockExam = () => {
    if (questions.length === 0) return;
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const mockQuestions = shuffled.slice(0, 40);
    startQuizSession(mockQuestions, "正式模擬測驗 (隨機40題)", null);
  };

  // Handler for single question practice
  const handleStartSingleQuestion = (question) => {
    startQuizSession([question], `單題練習 (題號: #${question.id})`, null);
  };

  // Handler for completing a quiz
  const handleFinishQuiz = (result) => {
    const { score, total, scorePercentage, wrongList, userAnswers, questions: testQs, unitId } = result;

    setUserProgress(prev => {
      const updatedWrong = { ...(prev.wrongQuestions || {}) };
      wrongList.forEach(qId => {
        const count = (updatedWrong[qId]?.count || 0) + 1;
        updatedWrong[qId] = { count, lastWrongAt: Date.now() };
      });

      let updatedUnitProgress = { ...(prev.unitProgress || {}) };
      if (unitId) {
        const currentUnit = updatedUnitProgress[unitId] || { bestScore: 0, completed: false, wrongCount: 0 };
        const newBest = Math.max(currentUnit.bestScore || 0, scorePercentage);
        updatedUnitProgress[unitId] = {
          bestScore: newBest,
          completed: newBest >= 85 || currentUnit.completed,
          wrongCount: wrongList.length,
          lastAttemptAt: Date.now()
        };
      }

      return {
        ...prev,
        unitProgress: updatedUnitProgress,
        wrongQuestions: updatedWrong,
        mockHistory: [
          { date: new Date().toISOString(), score, total, scorePercentage, passed: scorePercentage >= 85 },
          ...(prev.mockHistory || [])
        ]
      };
    });

    setQuizResult({ score, total, userAnswers, questions: testQs, unitId });
    setCurrentView('result');
  };

  // Reset progress handler
  const handleResetProgress = () => {
    if (window.confirm('確定要重置所有的學習進度與關卡紀錄嗎？此動作無法復原。')) {
      setUserProgress(initialProgress);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-300">正在載入 2026 最新 1090 題汽車筆試題庫 iOS 版...</p>
        </div>
      </div>
    );
  }

  const mistakeIds = Object.keys(userProgress.wrongQuestions || {}).map(Number);
  const favoriteIds = userProgress.bookmarks || [];

  return (
    <div className="w-full min-h-screen min-h-dvh flex-1 bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 relative flex flex-col overflow-x-hidden">
      {/* Native Full-Screen App Screen */}
      <div className="flex-1 w-full flex flex-col">
        {currentView === 'home' && (
          <HomeView 
            questions={questions}
            userProgress={userProgress}
            navigate={navigate}
            onStartMockExam={handleStartMockExam}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentView === 'sets' && (
          <SetListView 
            navigate={navigate}
            onSelectSet={handleSelectSet}
            userProgress={userProgress}
            totalQuestions={questions.length}
          />
        )}

        {currentView === 'search' && (
          <SearchView 
            navigate={navigate}
            onSelectQuestion={handleStartSingleQuestion}
            questions={questions}
            onOpenImageModal={setModalImageUrl}
          />
        )}

        {currentView === 'mistakes' && (
          <BrowserView 
            title="錯題複習"
            emptyMsg="太棒了！目前沒有待複習的錯題。"
            questionIds={mistakeIds}
            questions={questions}
            navigate={navigate}
            onSelectQuestion={handleStartSingleQuestion}
            onStartGroupQuiz={(qs, title) => startQuizSession(qs, title)}
            onRemove={removeMistake}
            onClearAll={handleClearAllMistakes}
            onOpenImageModal={setModalImageUrl}
          />
        )}

        {currentView === 'favorites' && (
          <BrowserView 
            title="我的收藏"
            emptyMsg="目前沒有收藏的題庫標記。"
            questionIds={favoriteIds}
            questions={questions}
            navigate={navigate}
            onSelectQuestion={handleStartSingleQuestion}
            onStartGroupQuiz={(qs, title) => startQuizSession(qs, title)}
            onRemove={toggleFavorite}
            onOpenImageModal={setModalImageUrl}
          />
        )}

        {currentView === 'quiz' && (
          <QuizView 
            questions={quizConfig.questions}
            title={quizConfig.title}
            unitId={quizConfig.unitId}
            navigate={navigate}
            favorites={favoriteIds}
            toggleFavorite={toggleFavorite}
            addMistake={addMistake}
            onFinish={handleFinishQuiz}
            onOpenImageModal={setModalImageUrl}
          />
        )}

        {currentView === 'result' && (
          <ResultView 
            score={quizResult.score}
            total={quizResult.total}
            userAnswers={quizResult.userAnswers}
            questions={quizResult.questions}
            navigate={navigate}
            onOpenImageModal={setModalImageUrl}
          />
        )}
      </div>

      {/* Native Bottom Navigation */}
      <BottomNav currentView={currentView} navigate={navigate} />

      {/* Fullscreen Image Zoom Modal */}
      <ImageModal 
        imageUrl={modalImageUrl}
        onClose={() => setModalImageUrl(null)}
      />
    </div>
  );
}
