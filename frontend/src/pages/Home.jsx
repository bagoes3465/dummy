import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import backgroundHero from '../assets/photos/background1.jpg';
import logoIcon from '../assets/photos/logo.png';
import cameraIcon from '../assets/icons/camera.svg';
import ambildotoIcon from '../assets/icons/ambilfoto.svg';
import '../styles/home.css';

export default function Home({ onNavigateCamera }) {
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

      <main className="pb-main">
        <div className="pb-hero">
          <img src={cameraIcon} alt="Camera" className="pb-camera-icon-img" />
          <h1 className="pb-hero-title">AI PHOTOBOOTH KOTA MADIUN</h1>
          <div className="pb-hero-image" role="img" aria-label="hero image" style={{ backgroundImage: `url(${backgroundHero})` }}>
          </div>
        </div>

        <section className="pb-features">
          <div className="pb-feature">
            <div className="pb-feature-icon">🖼️</div>
            <div className="pb-feature-title">Latar Kota Madiun</div>
            <div className="pb-feature-desc">Kota landmark kota</div>
          </div>
          <div className="pb-feature">
            <div className="pb-feature-icon">🎨</div>
            <div className="pb-feature-title">Tampilan Realistis</div>
            <div className="pb-feature-desc">Foto berkarier pengguna</div>
          </div>
          <div className="pb-feature">
            <div className="pb-feature-icon">✨</div>
            <div className="pb-feature-title">Filter & Efek AI</div>
            <div className="pb-feature-desc">Dimensionalitas gaya</div>
          </div>
        </section>
      </main>

      <footer className="pb-footer">
        <div className="pb-footer-left">v2.0.4 • Pemerintah Kota Madiun</div>
        <div className="pb-footer-right">Perlu bantuan? Hubungi petugas di sekitar.</div>
      </footer>

      <div className="pb-bottom-action">
        <PrimaryButton icon={ambildotoIcon} onClick={onNavigateCamera}>Ambil Foto</PrimaryButton>
      </div>
    </div>
  );
}
