import React, { useState, useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { api } from '../services/api';
import '../styles/customize.css';

export default function Customize({ capturedImage, previewNoBgUrl, onBack, onNext }) {
  const [backgrounds, setBackgrounds] = useState([]);
  const [mascots, setMascots] = useState([]);
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBg, setSelectedBg] = useState('');
  const [selectedMascot, setSelectedMascot] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);

  // Fetch assets
  useEffect(() => {
    Promise.all([api.getBackgrounds(), api.getMascots(), api.getFilters()])
      .then(([bg, ms, fl]) => {
        setBackgrounds(bg || []);
        setMascots(ms || []);
        setFilters(fl || []);
        if (bg?.length) setSelectedBg(bg[0].id);
        if (ms?.length) setSelectedMascot(ms[0].id);
        if (fl?.length) setSelectedFilter(fl[0].id);
      })
      .catch((err) => console.error('Failed to fetch assets:', err))
      .finally(() => setLoading(false));
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleSave = () => {
    onNext({
      backgroundId: selectedBg,
      mascotId: selectedMascot,
      filterId: selectedFilter || null,
    });
  };

  const currentBg = backgrounds.find((b) => b.id === selectedBg);
  const currentMascot = mascots.find((m) => m.id === selectedMascot);
  const currentFilter = filters.find((f) => f.id === selectedFilter);

  if (loading) {
    return (
      <div className="pb-page pb-center">
        <div className="pb-spinner" />
        <p>Memuat aset...</p>
      </div>
    );
  }

  return (
    <div className="pb-page pb-customize">
      <header className="pb-header">
        <div className="pb-header-left">
          <div className="pb-logo-circle">M</div>
          <div className="pb-title-block">
            <div className="pb-appname">Kota Madiun</div>
            <div className="pb-subtitle">AI Photobooth</div>
          </div>
        </div>
        <div className="pb-timer-badge">{formatTime(timeLeft)}</div>
      </header>

      <main className="pb-customize-main">
        <h2 className="pb-section-title">Kustomisasi Foto</h2>

        {/* Preview */}
        <section className="pb-preview">
          <div className="pb-preview-canvas">
            {currentBg && (
              <img src={currentBg.image_url} alt="bg" className="pb-preview-bg" />
            )}
            {(previewNoBgUrl || capturedImage) && (
              <img
                src={previewNoBgUrl || capturedImage}
                alt="foto"
                className="pb-preview-photo"
              />
            )}
            {currentMascot && (
              <img src={currentMascot.image_url} alt="maskot" className="pb-preview-mascot" />
            )}
            {currentFilter && (
              <div className="pb-preview-filter-label">{currentFilter.name}</div>
            )}
          </div>
          {previewNoBgUrl && (
            <p className="pb-preview-hint">* Preview — hasil akhir akan diproses oleh AI</p>
          )}
        </section>

        {/* Backgrounds */}
        <section className="pb-section">
          <h3>🖼️ Pilih Background</h3>
          <div className="pb-grid">
            {backgrounds.map((bg) => (
              <div
                key={bg.id}
                className={`pb-card ${selectedBg === bg.id ? 'selected' : ''}`}
                onClick={() => setSelectedBg(bg.id)}
              >
                <img src={bg.thumbnail_url || bg.image_url} alt={bg.name} />
                {selectedBg === bg.id && <div className="pb-card-check">✓</div>}
                <div className="pb-card-label">{bg.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mascots */}
        <section className="pb-section">
          <h3>🎨 Pilih Maskot</h3>
          <div className="pb-grid">
            {mascots.map((m) => (
              <div
                key={m.id}
                className={`pb-card pb-mascot-card ${selectedMascot === m.id ? 'selected' : ''}`}
                onClick={() => setSelectedMascot(m.id)}
              >
                <img src={m.thumbnail_url || m.image_url} alt={m.name} />
                {selectedMascot === m.id && <div className="pb-card-check">✓</div>}
                <div className="pb-card-label">{m.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="pb-section">
          <h3>✨ Pilih Filter</h3>
          <div className="pb-filter-list">
            {filters.map((f) => (
              <button
                key={f.id}
                className={`pb-filter-btn ${selectedFilter === f.id ? 'active' : ''}`}
                onClick={() => setSelectedFilter(f.id)}
              >
                {f.name}
              </button>
            ))}
          </div>
        </section>
      </main>

      <div className="pb-bottom-action pb-bottom-duo">
        <PrimaryButton variant="secondary" onClick={onBack}>← Kembali</PrimaryButton>
        <PrimaryButton onClick={handleSave}>Simpan & Proses ✨</PrimaryButton>
      </div>
    </div>
  );
}
