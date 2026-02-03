import React, { useEffect } from 'react'
import usePhotoboothStore from '../../hooks/usePhotoboothStore'
import { photoboothAPI } from '../../services/api'
import Header from '../../components/common/Header'
import LoadingAnimation from '../../components/common/LoadingAnimation'
import Card from '../../components/common/Card'

export default function ProcessingScreen() {
  const setCurrentScreen = usePhotoboothStore(state => state.setCurrentScreen)
  const originalPhoto = usePhotoboothStore(state => state.originalPhoto)
  const selectedBackground = usePhotoboothStore(state => state.selectedBackground)
  const selectedFilter = usePhotoboothStore(state => state.selectedFilter)
  const selectedMascot = usePhotoboothStore(state => state.selectedMascot)
  const progress = usePhotoboothStore(state => state.progress)
  const setProgress = usePhotoboothStore(state => state.setProgress)
  const setProcessedPhoto = usePhotoboothStore(state => state.setProcessedPhoto)
  const setQRCode = usePhotoboothStore(state => state.setQRCode)

  useEffect(() => {
    const processPhoto = async () => {
      try {
        setProgress(10)

        // Step 1: Upload original photo
        const uploadFormData = new FormData()
        uploadFormData.append('file', dataURLtoFile(originalPhoto, 'photo.jpg'))

        const uploadRes = await photoboothAPI.uploadPhoto(uploadFormData)
        const photoId = uploadRes.data.data.id

        setProgress(30)

        // Step 2: Process photo with effects
        const processPayload = {
          photo_id: photoId,
          background_id: selectedBackground?.id,
          filter_id: selectedFilter?.id,
          mascot_id: selectedMascot?.id,
          watermark_text: 'Kota Madiun AI Photobooth',
          watermark_position: 'bottom_right',
          frame_type: 'border',
          effects: ['blur_faces']
        }

        setProgress(60)

        const processRes = await photoboothAPI.processPhoto(processPayload)
        const processed = processRes.data.data

        setProgress(85)

        // Step 3: Generate QR code
        const qrRes = await photoboothAPI.generateQRCode({
          photo_id: photoId
        })
        const qrCode = qrRes.data.data.qr_code

        setProgress(100)

        // Move to result screen
        setTimeout(() => {
          setProcessedPhoto(processed)
          setQRCode(qrCode)
          setCurrentScreen('result')
        }, 500)
      } catch (error) {
        console.error('Processing error:', error)
        setProgress(0)
        // Handle error - could show error screen
        setTimeout(() => setCurrentScreen('welcome'), 2000)
      }
    }

    processPhoto()
  }, [])

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-lg">
        <div className="w-full max-w-lg">
          <Card className="animate-fade-in">
            <div className="flex items-center justify-center min-h-96">
              <LoadingAnimation 
                message="Sedang memproses foto…" 
                progress={progress}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
