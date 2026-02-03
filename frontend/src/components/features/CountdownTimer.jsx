import React, { useState, useEffect } from 'react'

export default function CountdownTimer({ initialSeconds = 5, onComplete = () => {} }) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (seconds <= 0) {
      onComplete()
      return
    }

    const timer = setInterval(() => {
      setSeconds(s => s - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [seconds, onComplete])

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Animated circles */}
      {[1, 2].map((ring) => (
        <div
          key={ring}
          className="absolute rounded-full border-4 border-primary-200"
          style={{
            width: `${100 + ring * 30}px`,
            height: `${100 + ring * 30}px`,
            animation: `pulse-ring 1s ease-out infinite`,
            animationDelay: `${ring * 0.3}s`,
            borderColor: ring === 1 ? '#2563EB' : 'rgba(37, 99, 235, 0.3)',
          }}
        />
      ))}

      {/* Countdown number */}
      <div className="relative z-10">
        <div className="text-7xl font-black text-primary-600 text-center animate-countdown">
          {seconds}
        </div>
      </div>
    </div>
  )
}
