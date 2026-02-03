import React from 'react'

export default function Button({
  children,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const baseStyles = 'touch-friendly font-semibold rounded-lg transition-all duration-200 font-body-md'
  
  const variants = {
    primary: 'bg-gradient-primary text-white hover:shadow-card-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-secondary text-primary-700 hover:bg-accent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border-2 border-primary-600 text-primary-700 hover:bg-primary-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-primary-600 hover:bg-primary-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  }

  const sizes = {
    sm: 'px-md py-sm text-body-sm',
    md: 'px-lg py-md text-body-md',
    lg: 'px-2xl py-lg text-heading-md',
    xl: 'px-2xl py-2xl text-heading-md',
  }

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-md">
          <span className="animate-spin-slow">⚙️</span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
