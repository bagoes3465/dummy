import React from 'react'

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`
        bg-white rounded-xl p-lg shadow-card
        hover:shadow-card-lg transition-shadow duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
