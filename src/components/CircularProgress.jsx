import React from 'react';

export default function CircularProgress({ percentage, color = "text-blue-600" }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
        <circle
          cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          className={`${color} transition-all duration-1000 ease-in-out`} strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-lg font-bold text-gray-800 font-num">{Math.round(percentage)}%</span>
    </div>
  );
}
