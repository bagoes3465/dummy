import React, { useEffect, useState } from 'react';
import '../styles/processing.css';

export default function Processing({ onProcess }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Menghapus background...');
  const [called, setCalled] = useState(false);

  // Call the actual processing API once
  useEffect(() => {
    if (called) return;
    setCalled(true);
    onProcess();
  }, [called, onProcess]);

  // Simulate visual progress (actual API call runs separately)
  useEffect(() => {
    const steps = [
      { at: 10, text: 'Menghapus background...' },
      { at: 30, text: 'Menyesuaikan pencahayaan...' },
      { at: 50, text: 'Menggabungkan dengan latar...' },
      { at: 70, text: 'Menambahkan maskot...' },
      { at: 85, text: 'AI Enhancement...' },
      { at: 95, text: 'Membuat QR Code...' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const next = prev + Math.random() * 8;
        const step = steps.find((s) => s.at > prev && s.at <= next);
        if (step) setStatus(step.text);
        return Math.min(next, 95);
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pb-page pb-processing">
      <header className="pb-header">
        <div className="pb-header-left">
          <div className="pb-logo-circle">M</div>
          <div className="pb-title-block">
            <div className="pb-appname">Kota Madiun</div>
            <div className="pb-subtitle">AI Photobooth</div>
          </div>
        </div>
      </header>

      <main className="pb-processing-main">
        <div className="pb-processing-center">
          <div className="pb-loading-animation">
            <div className="pb-pulse-ring" />
            <div className="pb-pulse-ring" />
            <div className="pb-pulse-ring" />
            <div className="pb-pulse-center">✨</div>
          </div>

          <h2 className="pb-processing-title">Sedang Memproses Foto...</h2>
          <p className="pb-processing-status">{status}</p>

          <div className="pb-progress-bar">
            <div className="pb-progress-fill" style={{ width: `${Math.floor(progress)}%` }} />
          </div>
          <p className="pb-progress-text">{Math.floor(progress)}%</p>
          <p className="pb-processing-note">
            Mohon tunggu, AI sedang memproses foto Anda.
          </p>
        </div>
      </main>
    </div>
  );
}
