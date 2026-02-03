import React from 'react'
import { Loader2 } from 'lucide-react'

export default function LoadingAnimation({ message = "Sedang memproses foto…", progress = 0 }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2xl">
      {/* Radial pulse animation */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer pulse rings */}
        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className="absolute rounded-full border-2 border-transparent"
            style={{
              width: `${80 + ring * 30}px`,
              height: `${80 + ring * 30}px`,
              animation: `pulse-ring 2s ease-out infinite`,
              animationDelay: `${ring * 0.4}s`,
              borderTopColor: '#2563EB',
              borderRightColor: 'rgba(37, 99, 235, 0.3)',
              borderBottomColor: 'rgba(37, 99, 235, 0.1)',
              borderLeftColor: 'transparent',
            }}
          />
        ))}

        {/* Center icon with spin */}
        <div className="absolute flex items-center justify-center">
          <Loader2 size={48} className="text-primary-600 animate-spin-slow" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <h2 className="text-heading-lg text-primary-700 mb-md">
          {message}
        </h2>
      </div>

      {/* Progress bar */}
      <div className="w-64 max-w-full">
        <div className="flex items-end justify-between mb-md">
          <p className="text-body-sm text-neutral">Progress</p>
          <p className="text-body-md font-semibold text-primary-600">{progress}%</p>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-primary h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status message */}
      <div className="text-center animate-pulse">
        <p className="text-body-md text-primary-600 font-medium">
          ✨ Menambahkan efek AI...
        </p>
      </div>
    </div>
  )
}
