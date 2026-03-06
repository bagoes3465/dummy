import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import logoIcon from '../assets/photos/logo.png';
import warningIcon from '../assets/icons/warning.svg';
import homeIcon from '../assets/icons/home.svg';
import cobaLagiIcon from '../assets/icons/cobalagi.svg';
import '../styles/error.css';

export default function Error({ 
  errorMessage = 'Foto belum berhasil diproses.',
  errorDetail = 'Silakan coba lagi.',
  onRetry, 
  onHome 
}) {
  return (
    <div className="pb-page pb-error">
      <header className="pb-header">
        <div className="pb-header-left">
          <img src={logoIcon} alt="Kota Madiun Logo" className="pb-logo" />
          <div className="pb-title-block">
            <div className="pb-appname">Kota Madiun</div>
            <div className="pb-subtitle">AI Photobooth Service</div>
          </div>
        </div>
        <div className="pb-status pb-status-error">
          <div className="pb-status-dot"></div>
          <span>Terjadi Kendala</span>
        </div>
      </header>

      <main className="pb-error-main">
        <div className="pb-error-center">
          <div className="pb-error-icon-container">
            <div className="pb-error-circle">
              <img src={warningIcon} alt="Warning" className="pb-error-icon" />
            </div>
          </div>

          <h2 className="pb-error-title">Terjadi Kendala</h2>
          <p className="pb-error-message">{errorMessage}</p>
          <p className="pb-error-detail">{errorDetail}</p>
        </div>
      </main>

      <div className="pb-bottom-action">
        <PrimaryButton icon={cobaLagiIcon} onClick={onRetry}>
          Coba Lagi
        </PrimaryButton>
        <PrimaryButton icon={homeIcon} onClick={onHome} secondary>
          Kembali ke Home
        </PrimaryButton>
      </div>

      <footer className="pb-footer">
        <div className="pb-footer-left">v2.0.4 • Pemerintah Kota Madiun</div>
        <div className="pb-footer-right">Perlu bantuan? Hubungi petugas di sekitar.</div>
      </footer>
    </div>
  );
}