import React, { useEffect } from 'react';

/**
 * Componente que reproduz um som de hospital em loop.
 * Coloque o arquivo 'hospital.mp3' em 'public/assets/'.
 */
export default function HospitalSound() {
  useEffect(() => {
    const audio = new Audio('/assets/hospital.mp3');
    audio.loop = true;
    audio.volume = 0.3; // ajuste o volume entre 0.0 e 1.0
    audio.play().catch(err => console.warn('Não foi possível tocar o som:', err));
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return null;
}
