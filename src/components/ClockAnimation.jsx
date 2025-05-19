import React from 'react';
import './ClockAnimation.css';

/**
 * Relógio analógico com preenchimento interno amarelo que diminui
 * conforme timeLeft diminui, e que pulsa em vermelho nos últimos 10s.
 *
 * Props:
 * - timeLeft: segundos restantes
 * - duration: tempo total em segundos
 */
export default function ClockAnimation({ timeLeft, duration }) {
  const angle = (timeLeft / duration) * 360;
  const isWarning = timeLeft <= 10;

  return (
    <div className={`clock ${isWarning ? 'warning' : ''}`}>
      <div
        className="clock-fill"
        style={{
          background: `conic-gradient(${
            isWarning ? '#E53E3E' : '#ECC94B'
          } 0deg ${angle}deg, transparent ${angle}deg 360deg)`,
        }}
      />
      <div
        className="clock-hand"
        style={{ transform: `rotate(${angle}deg)` }}
      />
    </div>
  );
}
