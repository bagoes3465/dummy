import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import usePhotoboothStore from '../../hooks/usePhotoboothStore'
import { photoboothAPI } from '../../services/api'
import Header from '../../components/common/Header'
import Button from '../../components/common/Button'
import StepIndicator from '../../components/common/StepIndicator'
import SelectionCard from '../../components/features/SelectionCard'
import Card from '../../components/common/Card'

export default function CustomizeScreen() {
  const setCurrentScreen = usePhotoboothStore(state => state.setCurrentScreen)
  const selectedBackground = usePhotoboothStore(state => state.selectedBackground)
  const setSelectedBackground = usePhotoboothStore(state => state.setSelectedBackground)
  const selectedFilter = usePhotoboothStore(state => state.selectedFilter)
  const setSelectedFilter = usePhotoboothStore(state => state.setSelectedFilter)
  const selectedMascot = usePhotoboothStore(state => state.selectedMascot)
  const setSelectedMascot = usePhotoboothStore(state => state.setSelectedMascot)

  const [backgrounds, setBackgrounds] = useState([])
  const [filters, setFilters] = useState([])
  const [mascots, setMascots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bgRes, filterRes, mascotRes] = await Promise.all([
          photoboothAPI.getBackgrounds(),
          photoboothAPI.getFilters(),
          photoboothAPI.getMascots()
        ])

        setBackgrounds(bgRes.data.data || [])
        setFilters(filterRes.data.data || [])
        setMascots(mascotRes.data.data || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleBack = () => {
    setCurrentScreen('camera')
  }

  const handleNext = () => {
    if (selectedBackground && selectedFilter && selectedMascot) {
      setCurrentScreen('processing')
    }
  }

  const isComplete = selectedBackground && selectedFilter && selectedMascot

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
            Sesuaikan Foto Anda
          </h2>

          <div className="w-24" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-lg">
        <div className="max-w-7xl mx-auto">
          {/* Step indicator */}
          <div className="mb-2xl">
            <StepIndicator currentStep={3} totalSteps={5} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <p className="text-neutral">Memuat opsi...</p>
            </div>
          ) : (
            <div className="space-y-2xl">
              {/* Backgrounds */}
              <Card>
                <div className="space-y-lg">
                  <h3 className="text-heading-md text-primary-700">
                    📍 Pilih Background
                  </h3>
                  <div className="grid grid-cols-3 gap-lg">
                    {backgrounds.map((bg) => (
                      <SelectionCard
                        key={bg.id}
                        image={bg.thumbnail_url}
                        title={bg.name}
                        selected={selectedBackground?.id === bg.id}
                        onClick={() => setSelectedBackground(bg)}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Mascots */}
              <Card>
                <div className="space-y-lg">
                  <h3 className="text-heading-md text-primary-700">
                    🎭 Pilih Maskot
                  </h3>
                  <div className="grid grid-cols-3 gap-lg">
                    {mascots.map((mascot) => (
                      <SelectionCard
                        key={mascot.id}
                        image={mascot.image_url}
                        title={mascot.name}
                        selected={selectedMascot?.id === mascot.id}
                        onClick={() => setSelectedMascot(mascot)}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Filters */}
              <Card>
                <div className="space-y-lg">
                  <h3 className="text-heading-md text-primary-700">
                    🎨 Pilih Filter
                  </h3>
                  <div className="grid grid-cols-3 gap-lg">
                    {filters.map((filter) => (
                      <SelectionCard
                        key={filter.id}
                        image={filter.preview_url}
                        title={filter.name}
                        description={filter.description}
                        selected={selectedFilter?.id === filter.id}
                        onClick={() => setSelectedFilter(filter)}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-md mt-2xl sticky bottom-0 bg-white pt-lg border-t border-secondary">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleBack}
              className="flex-1"
            >
              ← Kembali
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!isComplete || loading}
              className="flex-1"
            >
              Lanjut →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
