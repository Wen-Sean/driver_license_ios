import React from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function ImageModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-4 self-start">
          <ZoomIn className="w-4 h-4" />
          標誌/號誌原圖高清放大檢視
        </div>

        <div className="bg-white/95 rounded-xl p-6 max-h-[70vh] flex items-center justify-center overflow-auto shadow-inner w-full">
          <img
            src={`/${imageUrl}`}
            alt="高清考題圖示"
            className="max-h-[60vh] max-w-full object-contain filter drop-shadow-md"
          />
        </div>

        <p className="mt-4 text-xs text-slate-400 text-center">
          提示：點擊右上角關閉或點擊空白處可關閉預覽
        </p>
      </div>
    </div>
  );
}
