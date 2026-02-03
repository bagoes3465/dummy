import React from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

export default function StepIndicator({ currentStep = 1, totalSteps = 5 }) {
  return (
    <div className="w-full">
      {/* Step counter */}
      <div className="text-center mb-lg">
        <p className="text-body-md text-neutral">
          Langkah <span className="font-bold text-primary-600">{currentStep}</span> dari <span className="font-bold">{totalSteps}</span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-primary h-full transition-all duration-300 ease-out"
          style={{
            width: `${(currentStep / totalSteps) * 100}%`
          }}
        />
      </div>

      {/* Step indicator dots */}
      <div className="flex justify-between mt-lg">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1
          const isActive = stepNum === currentStep
          const isCompleted = stepNum < currentStep

          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-200 font-semibold
                  ${isCompleted ? 'bg-success text-white' : ''}
                  ${isActive ? 'bg-gradient-primary text-white ring-4 ring-primary-100' : ''}
                  ${!isCompleted && !isActive ? 'bg-secondary text-neutral' : ''}
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              {isActive && (
                <div className="mt-md w-full h-1 bg-gradient-primary rounded-full animate-pulse"></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
