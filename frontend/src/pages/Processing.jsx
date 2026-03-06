import React, { useState, useEffect } from 'react';
import logoIcon from '../assets/icons/logo.svg';
import '../styles/processing.css';

export default function Processing({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate progress increment
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 800);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Panggil onComplete ketika processing benar-benar selesai
    if (isComplete) {
      const timer = setTimeout(() => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="pb-page pb-processing">
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

      <main className="pb-processing-main">
        <div className="pb-processing-center">
          {/* Animated circles */}
          <div className="pb-loading-container">
            <div className="pb-ripple-pulse"></div>
            <div className="pb-ripple-pulse"></div>
            <div className="pb-ripple-pulse"></div>
            <div className="pb-circle pb-circle-1"></div>
            <div className="pb-circle pb-circle-2"></div>
            <div className="pb-circle pb-circle-3"></div>
            <div className="pb-circle-center">
              <span className="pb-star-icon">✨</span>
            </div>
          </div>

          <h2 className="pb-processing-title">Sedang memproses foto...</h2>
          <p className="pb-processing-desc">Mohon tunggu sebentar, AI kami sedang melukis wajahmu dengan keajaiban digital.</p>

          <div className="pb-progress-section">
            <div className="pb-progress-header">
              <span className="pb-progress-label">GENERATING</span>
              <span className="pb-progress-percent">{Math.floor(progress)}%</span>
            </div>
            <div className="pb-progress-bar">
              <div className="pb-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="pb-progress-footer">
              {isComplete ? 'Selesai!' : `Estimasi waktu: ${timeLeft} detik`}
            </div>
          </div>
        </div>
      </main>

      <footer className="pb-footer">
        <div className="pb-footer-left">v2.0.4 • Pemerintah Kota Madiun</div>
        <div className="pb-footer-right">Perlu bantuan? Hubungi petugas di sekitar.</div>
      </footer>
    </div>
  );
}