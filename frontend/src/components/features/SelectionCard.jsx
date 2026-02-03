import React from 'react'
import { Check } from 'lucide-react'

export default function SelectionCard({
  image,
  title,
  description,
  selected = false,
  onClick = () => {},
  className = ''
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl transition-all duration-200 group
        border-2 focus:outline-none focus:ring-4 focus:ring-primary-300
        ${selected ? 'border-primary-600 bg-primary-50' : 'border-secondary bg-white hover:border-primary-300'}
        ${className}
      `}
    >
      {/* Image container */}
      <div className="relative w-full aspect-square overflow-hidden bg-secondary">
        {image && (
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              selected ? 'scale-105' : 'group-hover:scale-105'
            }`}
          />
        )}
        
        {/* Overlay */}
        <div className={`
          absolute inset-0 transition-opacity duration-200
          ${selected ? 'bg-primary-600/20' : 'bg-black/0 group-hover:bg-black/10'}
        `} />
      </div>

      {/* Content */}
      <div className="p-md">
        <h3 className="text-body-md font-semibold text-primary-700 text-left">
          {title}
        </h3>
        {description && (
          <p className="text-body-sm text-neutral text-left mt-sm">
            {description}
          </p>
        )}
      </div>

      {/* Checkmark */}
      {selected && (
        <div className="absolute top-md right-md bg-success rounded-full p-sm shadow-card-lg animate-scale-in">
          <Check size={20} className="text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  )
}
