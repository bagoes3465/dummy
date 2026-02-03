import { useEffect, useRef, useState } from 'react'

const useCamera = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState(null)
  const streamRef = useRef(null)

  const startCamera = async () => {
    try {
      console.log('Starting camera...')
      setError(null)
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1024 },
          height: { ideal: 1024 }
        },
        audio: false
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Stream obtained:', stream)
      streamRef.current = stream
      
      // Wait a tick to ensure ref is set
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (videoRef.current) {
        console.log('Setting video srcObject')
        videoRef.current.srcObject = stream
        
        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded, setting active')
          setIsActive(true)
        }
        
        const handleCanPlay = () => {
          console.log('Video can play')
        }
        
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
        videoRef.current.addEventListener('canplay', handleCanPlay)
        
        // Try to play immediately
        videoRef.current.play().catch(err => console.error('Play error:', err))
        
        // Cleanup listener
        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
            videoRef.current.removeEventListener('canplay', handleCanPlay)
          }
        }
      } else {
        console.warn('videoRef.current is not set, setting active anyway')
        setIsActive(true)
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError(err.message)
      setIsActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      streamRef.current = null
      setIsActive(false)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return null
    
    const context = canvasRef.current.getContext('2d')
    const video = videoRef.current
    
    // Set canvas size to match video
    canvasRef.current.width = video.videoWidth
    canvasRef.current.height = video.videoHeight
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0)
    
    // Return base64 image
    return canvasRef.current.toDataURL('image/jpeg', 0.95)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return {
    videoRef,
    canvasRef,
    isActive,
    error,
    startCamera,
    stopCamera,
    capturePhoto
  }
}

export default useCamera
