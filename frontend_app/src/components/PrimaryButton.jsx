import React from 'react';
import '../styles/components.css';

export default function PrimaryButton({ children, onClick, icon, disabled = false, variant = 'primary' }) {
  return (
    <button
      className={`pb-btn pb-btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <img src={icon} alt="" className="pb-btn-icon" />}
      <span>{children}</span>
    </button>
  );
}
