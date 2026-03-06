import React from 'react';
import '../styles/home.css';
import { playClickSound, createRipple } from '../utils/ux';

export default function PrimaryButton({ children, onClick, icon, disabled = false, secondary = false }) {
  const handleMouseDown = (e) => {
    createRipple(e);
    playClickSound();
  };

  const handleClick = (e) => {
    if (disabled) return;
    if (typeof onClick === 'function') onClick(e);
  };

  const buttonClass = secondary 
    ? 'pb-primary-button pb-secondary-button' 
    : 'pb-primary-button';

  return (
    <button
      className={buttonClass}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={disabled ? 'true' : 'false'}
    >
      {icon ? <img src={icon} alt="" className="pb-button-icon" /> : <span className="pb-camera-icon">📷</span>}
      <span>{children}</span>
    </button>
  );
}