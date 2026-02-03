import React from 'react'

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center gap-md text-center">
      <div className="text-5xl animate-bounce" style={{ animationDelay: '0s' }}>
        {icon}
      </div>
      <div>
        <h3 className="text-body-lg font-semibold text-primary-700 mb-sm">
          {title}
        </h3>
        <p className="text-body-sm text-neutral">
          {description}
        </p>
      </div>
    </div>
  )
}
