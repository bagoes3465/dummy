import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // IMPORT CSS - INI YANG KURANG!
import Home from './pages/Home';
import Camera from './pages/Camera';
import Customize from './pages/Customize';
import Processing from './pages/Processing';
import Result from './pages/Result';
import Error from './pages/Error';
import { api } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [capturedImage, setCapturedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [errorInfo, setErrorInfo] = useState({ message: '', detail: '' });
  const [sessionData, setSessionData] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [customizationData, setCustomizationData] = useState(null);

  const handleNavigateToCamera = async () => {
    try {
      // Create session when starting photobooth flow
      const session = await api.createSession();
      setSessionData(session);
      console.log('Session created:', session);
      setCurrentPage('camera');
    } catch (error) {
      console.error('Failed to create session:', error);
      handleError('Gagal membuat sesi', 'Silakan coba lagi atau hubungi petugas.');
    }
  };

  const handleCaptured = async (dataUrl) => {
    try {
      // Verify session exists before uploading
      if (!sessionData || !sessionData.session_id) {
        handleError('Sesi tidak valid', 'Silakan mulai lagi dari halaman utama.');
        return;
      }

      setCapturedImage(dataUrl);

      // Upload photo to backend
      const uploadResult = await api.uploadPhoto(sessionData.session_id, dataUrl);
      setPhotoData(uploadResult);
      console.log('Photo uploaded:', uploadResult);

      setCurrentPage('customize');
    } catch (error) {
      console.error('Failed to upload photo:', error);
      handleError('Gagal mengunggah foto', 'Silakan coba ambil foto lagi.');
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setCapturedImage(null);
    setProcessedImage(null);
    setErrorInfo({ message: '', detail: '' });
    setSessionData(null);
    setPhotoData(null);
    setCustomizationData(null);
  };

  const handleBackToCamera = () => {
    setCurrentPage('camera');
    setCapturedImage(null);
  };

  const handleProcessingComplete = async () => {
    try {
      // Process photo with backend
      const result = await api.processPhoto(
        photoData.photo_id,
        customizationData.backgroundId,
        customizationData.mascotId,
        customizationData.filters || []
      );

      // Store result in localStorage for Result page
      localStorage.setItem('photoResult', JSON.stringify({
        processedUrl: result.processed_url,
        qrCodeUrl: result.qr_code_url,
        downloadCode: result.download_code,
        downloadUrl: result.download_url,
        sessionId: sessionData.session_id,
        photoId: photoData.photo_id,
      }));

      console.log('Photo processed:', result);
      setCurrentPage('result');
    } catch (error) {
      console.error('Failed to process photo:', error);
      handleError('Gagal memproses foto', 'Silakan coba lagi atau hubungi petugas.');
    }
  };

  const handleError = (message, detail) => {
    setErrorInfo({ message, detail });
    setCurrentPage('error');
  };

  const handleRetryFromError = () => {
    // Go back to camera page to retry
    setCurrentPage('camera');
  };

  return (
    <>
      {currentPage === 'home' && <Home onNavigateCamera={handleNavigateToCamera} />}
      {currentPage === 'camera' && <Camera onBack={handleBackToHome} onCaptured={handleCaptured} />}
      {currentPage === 'customize' && (
        <Customize
          capturedImage={capturedImage}
          onBack={handleBackToCamera}
          onProcessing={(customization) => {
            setCustomizationData(customization);
            setCurrentPage('processing');
          }}
        />
      )}
      {currentPage === 'processing' && <Processing onComplete={handleProcessingComplete} />}
      {currentPage === 'result' && <Result processedImage={processedImage} onHome={handleBackToHome} />}
      {currentPage === 'error' && (
        <Error 
          errorMessage={errorInfo.message}
          errorDetail={errorInfo.detail}
          onRetry={handleRetryFromError}
          onHome={handleBackToHome}
        />
      )}
    </>
  );
}

const container = document.getElementById('root');
console.log('renderer loaded, root container:', container);
if (!container) {
  console.error('Root container #root not found.');
} else {
  const root = createRoot(container);
  root.render(<App />);
}