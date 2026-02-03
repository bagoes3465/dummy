import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import usePhotoboothStore from '../../hooks/usePhotoboothStore'
import useCamera from '../../hooks/useCamera'
import Header from '../../components/common/Header'
import Button from '../../components/common/Button'
import CountdownTimer from '../../components/features/CountdownTimer'
import Card from '../../components/common/Card'

export default function CameraScreen() {
  const setCurrentScreen = usePhotoboothStore(state => state.setCurrentScreen)
  const setOriginalPhoto = usePhotoboothStore(state => state.setOriginalPhoto)
  
  const { videoRef, canvasRef, isActive, error, startCamera, stopCamera, capturePhoto } = useCamera()
  const [showCountdown, setShowCountdown] = useState(false)
  const [facingMode, setFacingMode] = useState('user')

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const handleCapture = () => {
    setShowCountdown(true)
  }

  const handleCountdownComplete = () => {
    const photo = capturePhoto()
    if (photo) {
      setOriginalPhoto(photo)
      setShowCountdown(false)
      setCurrentScreen('customize')
    }
  }

  const handleBack = () => {
    setCurrentScreen('welcome')
  }

  const handleRetry = () => {
    setShowCountdown(false)
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Navigation bar */}
      <div className="bg-secondary px-lg py-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-md text-primary-600 hover:text-primary-700 font-semibold"
          >
            <ArrowLeft size={24} />
            Kembali
          </button>
          
          <h2 className="text-heading-md text-primary-700">
            Ambil Foto Anda
          </h2>

          {showCountdown && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-md text-primary-600 hover:text-primary-700 font-semibold"
            >
              Coba Ulang
              <ArrowRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-lg">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden">
            <div className="space-y-xl">
              {/* Camera preview */}
              <div className="relative rounded-lg overflow-hidden bg-black aspect-square">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <div className="text-center">
                      <p className="text-neutral font-semibold">Kamera tidak tersedia</p>
                      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    </div>
                  </div>
                )}

                {/* Countdown overlay */}
                {showCountdown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <CountdownTimer
                      initialSeconds={5}
                      onComplete={handleCountdownComplete}
                    />
                  </div>
                )}
              </div>

              {/* Instruction */}
              <div className="text-center space-y-md">
                <h3 className="text-heading-md text-primary-700">
                  Silahkan Berpose
                </h3>
                {!showCountdown && (
                  <p className="text-body-md text-neutral">
                    Pastikan wajah Anda berada di tengah layar
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-md">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBack}
                  className="flex-1"
                >
                  ← Batal
                </Button>
                {!showCountdown && (
                  <Button
                    size="lg"
                    onClick={handleCapture}
                    disabled={!isActive}
                    className="flex-1"
                  >
                    📸 Ambil Gambar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
