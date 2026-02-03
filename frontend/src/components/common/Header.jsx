import React from 'react'
import { Clock, Settings, User } from 'lucide-react'

export default function Header() {
  const [time, setTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="w-full bg-white border-b border-secondary px-lg py-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo & App Name */}
        <div className="flex items-center gap-md">
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-white text-heading-md font-bold">📷</span>
          </div>
          <div>
            <h1 className="text-heading-md font-bold text-primary-700">
              AI Photobooth
            </h1>
            <p className="text-body-sm text-neutral">Kota Madiun</p>
          </div>
        </div>

        {/* Center: Date & Time */}
        <div className="flex flex-col items-center gap-sm">
          <div className="flex items-center gap-sm text-primary-600">
            <Clock size={16} />
            <span className="font-mono text-body-md font-semibold">
              {formatTime(time)}
            </span>
          </div>
          <p className="text-body-sm text-neutral">
            {formatDate(time)}
          </p>
        </div>

        {/* Right: Admin & Settings */}
        <div className="flex items-center gap-md">
          <button className="p-md hover:bg-secondary rounded-lg transition">
            <Settings size={24} className="text-neutral" />
          </button>
          <button className="p-md hover:bg-secondary rounded-lg transition">
            <User size={24} className="text-primary-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
