import React, { useEffect, useState } from 'react'
import { Download, RotateCcw, CheckCircle } from 'lucide-react'
import QRCode from 'qrcode'
import usePhotoboothStore from '../../hooks/usePhotoboothStore'
import Header from '../../components/common/Header'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function ResultScreen() {
  const setCurrentScreen = usePhotoboothStore(state => state.setCurrentScreen)
  const processedPhoto = usePhotoboothStore(state => state.processedPhoto)
  const qrCode = usePhotoboothStore(state => state.qrCode)
  const reset = usePhotoboothStore(state => state.reset)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    // Generate QR code when component mounts
    if (qrCode) {
      const container = document.getElementById('qrcode-container')
      if (container) {
        container.innerHTML = ''
        QRCode.toCanvas(qrCode, {
          width: 200,
          margin: 1,
          color: {
            dark: '#2563EB',
            light: '#FFFFFF'
          }
        }, (err, canvas) => {
          if (err) {
            console.error('QR Code error:', err)
          } else {
            container.appendChild(canvas)
          }
        })
      }
    }
  }, [qrCode])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Download photo
      const link = document.createElement('a')
      link.href = processedPhoto.url || processedPhoto
      link.download = `photobooth-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setDownloading(false)
    }
  }

  const handleNewPhoto = () => {
    reset()
    setCurrentScreen('welcome')
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-lg">
        <div className="max-w-2xl mx-auto">
          {/* Success badge */}
          <div className="flex justify-center mb-2xl">
            <div className="flex items-center gap-md bg-success/10 text-success px-xl py-lg rounded-full animate-fade-in">
              <CheckCircle size={24} />
              <span className="text-body-lg font-semibold">Selesai!</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2xl">
            {/* Photo result */}
            <Card className="animate-slide-up">
              <div className="space-y-lg">
                <h3 className="text-heading-md text-primary-700">
                  📸 Hasil Foto
                </h3>
                
                <div className="relative rounded-lg overflow-hidden bg-secondary aspect-square">
                  {processedPhoto && (
                    <img
                      src={typeof processedPhoto === 'string' ? processedPhoto : processedPhoto.url}
                      alt="Hasil fotobooth"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <Button
                  size="lg"
                  onClick={handleDownload}
                  loading={downloading}
                  className="w-full"
                >
                  <Download className="inline mr-md" size={20} />
                  Unduh Foto
                </Button>
              </div>
            </Card>

            {/* QR Code & Actions */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="space-y-lg h-full flex flex-col">
                <h3 className="text-heading-md text-primary-700">
                  📱 Unduh di HP
                </h3>

                {/* QR Code */}
                <div className="flex-1 flex flex-col items-center justify-center bg-secondary rounded-lg p-lg">
                  {qrCode && (
                    <div className="flex flex-col items-center gap-md">
                      <div 
                        id="qrcode-container"
                        className="bg-white p-md rounded-lg"
                      />
                      <p className="text-body-sm text-neutral text-center">
                        Scan dengan HP untuk download
                      </p>
                    </div>
                  )}
                  {!qrCode && (
                    <p className="text-neutral text-center">
                      Generating QR code...
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="space-y-md pt-lg border-t border-secondary">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleNewPhoto}
                    className="w-full"
                  >
                    <RotateCcw className="inline mr-md" size={20} />
                    Ambil Foto Lagi
                  </Button>
                  
                  <p className="text-body-sm text-neutral text-center">
                    Terima kasih telah menggunakan AI Photobooth Kota Madiun
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
