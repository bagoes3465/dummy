import React, { useState, useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import '../styles/customize.css';
import logoIcon from '../assets/photos/logo.png';
import backIcon from '../assets/icons/back.svg';
import saveIcon from '../assets/icons/save.svg';
import { api } from '../services/api';
import bgSample from '../assets/photos/background1.jpg';
import reloMaskot from '../assets/photos/relo.png';
import madyaMaskot from '../assets/photos/madya.png';
import rasaMaskot from '../assets/photos/rasa.png';

const BACKGROUNDS = [
  { id: 'bg1', name: 'Tugu Pendekar', src: bgSample, category: 'Heritage' },
  { id: 'bg2', name: 'Balai Kota', src: bgSample, category: 'Heritage' },
  { id: 'bg3', name: 'Batik Dongkrek', src: bgSample, category: 'Modern' },
];

const MASKOTS = [
  { id: 'm1', name: 'Relo', src: reloMaskot },
  { id: 'm2', name: 'Madya', src: madyaMaskot },
  { id: 'm3', name: 'Rasa', src: rasaMaskot },
];

const EFFECTS = [
  { id: 'e1', name: 'Realistic' },
  { id: 'e2', name: 'Sketch' },
  { id: 'e3', name: 'Pop' },
];

export default function Customize({ capturedImage, onBack, onProcessing }) {
  const [backgrounds, setBackgrounds] = useState([]);
  const [mascots, setMascots] = useState([]);
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bg, setBg] = useState('');
  const [maskot, setMaskot] = useState('');
  const [effect, setEffect] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 menit = 300 detik

  // Fetch assets from API
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const [bgData, mascotData, filterData] = await Promise.all([
          api.getBackgrounds(),
          api.getMascots(),
          api.getFilters(),
        ]);

        setBackgrounds(bgData);
        setMascots(mascotData);
        setFilters(filterData);

        // Set defaults
        if (bgData.length > 0) setBg(bgData[0].id);
        if (mascotData.length > 0) setMaskot(mascotData[0].id);
        if (filterData.length > 0) setEffect(filterData[0].id);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
        // Fallback to dummy data if API fails
        setBackgrounds(BACKGROUNDS);
        setMascots(MASKOTS);
        setFilters(EFFECTS);
        setBg(BACKGROUNDS[0].id);
        setMaskot(MASKOTS[0].id);
        setEffect(EFFECTS[0].id);
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const selectedBg = backgrounds.find(b => b.id === bg);
  const selectedMaskot = mascots.find(m => m.id === maskot);
  const selectedFilter = filters.find(f => f.id === effect);

  const handleSave = () => {
    const customization = {
      backgroundId: bg,
      mascotId: maskot,
      filters: selectedFilter ? [selectedFilter.id] : [],
    };
    console.log('Selected customization:', customization);

    // Pass customization data to parent
    if (typeof onProcessing === 'function') {
      onProcessing(customization);
    }
  };

  return (
    <div className="pb-page pb-customize">
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

      <main className="pb-customize-main">
        <div className="pb-customize-head">
          <h2>Kustomisasi Foto</h2>
          <div className="pb-countdown-badge">Waktu Tersisa: {formatTime(timeLeft)}</div>
        </div>

        <section className="pb-preview pb-preview-top">
          <h3>Preview</h3>
          <div className="pb-preview-canvas">
            <div className="pb-preview-bg" style={{ backgroundImage: `url(${selectedBg.src})` }} />
            {capturedImage && <img src={capturedImage} alt="captured" className="pb-preview-photo" />}
            {selectedMaskot && <img src={selectedMaskot.src} alt="maskot" className="pb-preview-maskot" />}
            <div className="pb-preview-effect">{EFFECTS.find(x=>x.id===effect).name}</div>
          </div>
        </section>

        <section className="pb-section">
          <div className="pb-section-header">
            <span className="pb-section-icon">🖼️</span>
            <h3>Tambahkan Background</h3>
          </div>
          <div className="pb-categories">
            <button className="pb-chip active">Semua</button>
            <button className="pb-chip">Heritage</button>
            <button className="pb-chip">Batik</button>
            <button className="pb-chip">Modern</button>
          </div>

          <div className="pb-bg-grid">
            {BACKGROUNDS.map(b => (
              <div key={b.id} className={`pb-card ${bg === b.id ? 'selected' : ''}`} onClick={() => setBg(b.id)}>
                <div className="pb-card-image" style={{ backgroundImage: `url(${b.src})` }}>
                  {bg === b.id && <div className="pb-card-checkmark">✓</div>}
                </div>
                <div className="pb-card-title">{b.name}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-section">
          <div className="pb-section-header">
            <span className="pb-section-icon">🎨</span>
            <h3>Tambahkan Maskot</h3>
          </div>
          <div className="pb-maskot-grid">
            {mascots.map(m => (
              <div key={m.id} className={`pb-maskot ${maskot === m.id ? 'selected' : ''}`} onClick={() => setMaskot(m.id)}>
                <img src={m.image_url || m.src} alt={m.name} />
                <div className="pb-maskot-name">{m.name}</div>
                {maskot === m.id && <div className="pb-maskot-checkmark">✓</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="pb-section">
          <div className="pb-section-header">
            <span className="pb-section-icon">✨</span>
            <h3>Effect & Filter</h3>
          </div>
          <div className="pb-effect-list">
            {filters.map(e => (
              <button key={e.id} className={`pb-effect ${effect === e.id ? 'active' : ''}`} onClick={() => setEffect(e.id)}>{e.name}</button>
            ))}
          </div>
        </section>

      </main>

      <footer className="pb-footer">
        <div className="pb-footer-left">v2.0.4 • Pemerintah Kota Madiun</div>
        <div className="pb-footer-right">Perlu bantuan? Hubungi petugas di sekitar.</div>
      </footer>

      <div className="pb-bottom-action">
        <PrimaryButton icon={backIcon} onClick={onBack}>Kembali</PrimaryButton>
        <PrimaryButton icon={saveIcon} onClick={handleSave}>Simpan & Lanjut</PrimaryButton>
      </div>
    </div>
  );
}
