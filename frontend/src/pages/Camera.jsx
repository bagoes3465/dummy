import React, { useEffect, useRef, useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import logoIcon from '../assets/photos/logo.png';
import ambilfotoIcon from '../assets/icons/ambilfoto.svg';
import backIcon from '../assets/icons/back.svg';
import '../styles/camera.css';
import { playClickSound, createRipple } from '../utils/ux';

export default function Camera({ onBack, onCaptured }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        
        if (isMounted) {
          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } else {
          mediaStream.getTracks().forEach(track => track.stop());
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleCapture = () => {
    setIsCapturing(true);
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null || countdown < 0) return;

    if (countdown === 0) {
      if (canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        console.log('Photo captured:', dataUrl);
        
        stopCamera();
        
        if (typeof onCaptured === 'function') {
          onCaptured(dataUrl);
        }
      }
      setIsCapturing(false);
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onCaptured]);

  const handleBack = () => {
    stopCamera();
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  return (
    <div className="pb-page">
      <header className="pb-header">
        <div className="pb-header-left">
          <img src={logoIcon} alt="Kota Madiun Logo" className="pb-logo" />
          <div className="pb-title-block">
            <div className="pb-appname">Kota Madiun</div>
            <div className="pb-subtitle">AI Photobooth Service</div>
          </div>
        </div>
        <div className="pb-status">
          <div className="pb-status-dot"></div>
          <span>Siap Digunakan</span>
        </div>
      </header>

      <main className="pb-camera-main">
        <h2 className="pb-camera-title">Silahkan Berpose</h2>

        <div className="pb-camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="pb-camera-preview"
          />
          
          {isCapturing && countdown !== null && (
            <div className="pb-countdown">
              <div className="pb-countdown-circle">{countdown}</div>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </main>

      <footer className="pb-footer">
        <div className="pb-footer-left">v2.0.4 • Pemerintah Kota Madiun</div>
        <div className="pb-footer-right">Perlu bantuan? Hubungi petugas di sekitar.</div>
      </footer>

      <div className="pb-camera-actions">
        <button onMouseDown={(e)=>{ createRipple(e); playClickSound(); }} onClick={handleBack} className="pb-back-button">
          <img src={backIcon} alt="Kembali" className="pb-back-icon" />
          Kembali
        </button>
        <PrimaryButton
          icon={ambilfotoIcon}
          onClick={handleCapture}
          disabled={isCapturing}
        >
          {isCapturing ? `Siap dalam ${countdown}...` : 'Ambil Foto'}
        </PrimaryButton>
      </div>
    </div>
  );
}
