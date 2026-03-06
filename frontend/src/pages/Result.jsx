import React, { useState, useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import logoIcon from '../assets/photos/logo.png';
import ambilfotoIcon from '../assets/icons/ambilfoto.svg';
import QR1 from '../assets/photos/QR1.jpg';
import background1 from '../assets/photos/background1.jpg';
import '../styles/result.css';

export default function Result({ processedImage, onHome }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds countdown

  // Load result from localStorage
  useEffect(() => {
    try {
      const resultData = localStorage.getItem('photoResult');
      if (resultData) {
        const parsed = JSON.parse(resultData);
        setResult(parsed);
        console.log('✅ Result loaded:', parsed);
      } else {
        console.error('❌ No result data found');
        alert('Data hasil tidak ditemukan');
      }
      setLoading(false);
    } catch (error) {
      console.error('❌ Failed to load result:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto navigate to home when timer reaches 0
      if (typeof onHome === 'function') {
        onHome();
      }
    }
  }, [timeLeft, onHome]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Use dummy image if no processed image
  const displayImage = processedImage || background1;

  return (
    <div className="pb-page">
      <header className="pb-header">
        <div className="pb-header-left">
          <img src={logoIcon} alt="Kota Madiun Logo" className="pb-logo" />
          <div className="pb-title-block">
            <div className="pb-appname">Kota Madiun</div>
            <div className="pb-subtitle">AI Photobooth</div>
          </div>
        </div>
        <div className="pb-result-header-right">
        <div className="pb-result-session">
            <div className="pb-result-session-label">Kode: {result.download_code}</div>
            <div className="pb-result-session-date">
              {new Date().toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>
      </header>

      <main className="pb-result-main">
        {/* Timer in top right corner of body */}
        <div className="pb-result-timer">
          {formatTime(timeLeft)}
        </div>

        <div className="pb-result-success">
          <span className="pb-result-check">✓</span>
          <span className="pb-result-text">SELESAI</span>
        </div>

        <h1 className="pb-result-title">Hasil Foto Anda</h1>
        <p className="pb-result-desc">Foto AI Anda telah berhasil dibuat. Silakan scan QR Code untuk mengunduh foto.</p>

        <section className="pb-result-photo-section">
          <div className="pb-result-photo-container">
            <img src={result.processed_url} alt="Processed Photo" className="pb-result-photo" />
          </div>
        </section>

        <section className="pb-result-qr-section">
          <div className="pb-result-qr-container">
            <div className="pb-result-qr-box">
              <img src={result.qrCodeUrl} alt="QR Code" className="pb-result-qr-image" />
              <h3 className="pb-result-qr-title">Scan untuk Unduh</h3>
              <p className="pb-result-qr-desc">Arahkan kamera HP Anda ke QR Code ini untuk menyimpan foto digital.</p>
            </div>
          </div>
        </section>

        {/* Download Info */}
        <section className="pb-result-download-info">
          <div className="pb-info-item">
            <div className="pb-info-label">Kode Download:</div>
            <div className="pb-info-value pb-download-code">
              {result.download_code}
            </div>
          </div>

          <div className="pb-info-item">
            <div className="pb-info-label">Link Download:</div>
            <div className="pb-info-value pb-download-link">
              {result.download_url}
            </div>
          </div>

          <div className="pb-info-note">
            💡 Link berlaku selama 24 jam
          </div>
        </section>

        {/* Countdown */}
        <div className="pb-result-countdown">
          <p>Layar akan reset otomatis dalam {timeLeft} detik</p>
          <div className="pb-countdown-bar">
            <div
              className="pb-countdown-progress"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            ></div>
          </div>
        </div>
      </main>

      <footer className="pb-footer">
        <div className="pb-footer-left">v2.0.0 • Pemerintah Kota Madiun</div>
        <div className="pb-footer-right">
          Terima kasih telah menggunakan AI Photobooth
        </div>
      </footer>

      <div className="pb-result-actions">
        <PrimaryButton icon={ambilfotoIcon} onClick={onHome}>Foto Baru</PrimaryButton>
      </div>
    </div>
  );
}
