import React from 'react'
import usePhotoboothStore from '../../hooks/usePhotoboothStore'
import Header from '../../components/common/Header'
import Button from '../../components/common/Button'
import FeatureCard from '../../components/features/FeatureCard'
import Card from '../../components/common/Card'

export default function WelcomeScreen() {
  const setCurrentScreen = usePhotoboothStore(state => state.setCurrentScreen)

  const handleStartPhotobooth = () => {
    setCurrentScreen('camera')
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-lg overflow-y-auto">
        <div className="max-w-2xl w-full">
          <Card className="animate-fade-in">
            <div className="text-center space-y-2xl">
              {/* Title */}
              <div className="space-y-md">
                <h1 className="text-heading-xl font-black text-primary-700">
                  🏛️ AI Photobooth
                </h1>
                <p className="text-heading-md text-neutral">
                  Kota Madiun
                </p>
              </div>

              {/* Hero illustration area */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gradient-light mb-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-md">📸</div>
                    <p className="text-body-lg text-primary-600 font-semibold">
                      Ciptakan Momen Spesial Anda
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 right-0 text-6xl opacity-50">🎭</div>
                <div className="absolute top-0 left-0 text-6xl opacity-50">🌆</div>
              </div>

              {/* Features section */}
              <div className="grid grid-cols-3 gap-lg my-2xl">
                <FeatureCard
                  icon="🌆"
                  title="Landmark"
                  description="Background Kota Madiun"
                />
                <FeatureCard
                  icon="📸"
                  title="Realistic"
                  description="Foto berkualitas tinggi"
                />
                <FeatureCard
                  icon="✨"
                  title="AI Filter"
                  description="Filter canggih"
                />
              </div>

              {/* CTA Button */}
              <div className="pt-lg">
                <Button
                  size="xl"
                  onClick={handleStartPhotobooth}
                  className="w-full"
                >
                  📷 Ambil Foto
                </Button>
              </div>

              {/* Info text */}
              <p className="text-body-sm text-neutral pt-lg border-t border-secondary">
                Layanan gratis untuk warga Kota Madiun • Data Anda aman
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
