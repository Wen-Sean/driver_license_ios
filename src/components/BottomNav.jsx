import React from 'react';
import { Home, LayoutList, XCircle, Star } from 'lucide-react';

export default function BottomNav({ currentView, navigate }) {
  const allowedViews = ['home', 'sets', 'search', 'mistakes', 'favorites'];
  if (!allowedViews.includes(currentView)) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-2 pb-6 flex justify-between items-center z-30 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] ios-safe-bottom">
      <div className="max-w-md mx-auto w-full flex justify-around items-center">
        <button 
          onClick={() => navigate('home')} 
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors py-1 px-3 ${
            currentView === 'home' ? 'text-blue-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home size={22} className={currentView === 'home' ? 'fill-blue-100' : ''} />
          <span className="text-[10px] font-bold">首頁</span>
        </button>

        <button 
          onClick={() => navigate('sets')} 
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors py-1 px-3 ${
            currentView === 'sets' ? 'text-blue-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <LayoutList size={22} className={currentView === 'sets' ? 'fill-blue-100' : ''}/>
          <span className="text-[10px] font-bold">題組</span>
        </button>

        <button 
          onClick={() => navigate('mistakes')} 
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors py-1 px-3 ${
            currentView === 'mistakes' ? 'text-blue-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <XCircle size={22} className={currentView === 'mistakes' ? 'fill-blue-100' : ''} />
          <span className="text-[10px] font-bold">錯題</span>
        </button>

        <button 
          onClick={() => navigate('favorites')} 
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors py-1 px-3 ${
            currentView === 'favorites' ? 'text-blue-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Star size={22} className={currentView === 'favorites' ? 'fill-blue-100' : ''} />
          <span className="text-[10px] font-bold">收藏</span>
        </button>
      </div>
    </div>
  );
}
