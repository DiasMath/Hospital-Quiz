import React, { useState, useEffect } from 'react';
import './StartScreen.css';

/**
 * Tela de boas-vindas antes de iniciar o quiz.
 *
 * Props:
 * - onStart: callback para iniciar o jogo (agora recebe o nome do jogador)
 */
export default function StartScreen({ onStart }) {
  const [playerName, setPlayerName] = useState('');
  const [showError, setShowError] = useState(false);

  const handleInputChange = (event) => {
    setPlayerName(event.target.value);
    if (showError) {
      setShowError(false);
    }
  };

  const handleStartClick = () => {
    if (playerName.trim() === '') {
      setShowError(true);
    } else {
      setShowError(false);
      onStart(playerName.trim());
    }
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  return (
    <div className={`start-screen-wrapper ${showError ? 'blur-background' : ''}`}>
      <img 
        src="/assets/imagem_inicial_01.jpg" 
        alt="Imagem inicial do quiz" 
        className="start-screen-background-image"
      />
      
      <div className="start-screen-container">
        <h1 className="start-screen-title">
          Bem-vindo ao Quiz
        </h1>
        <input
          type="text"
          placeholder="Digite seu nome"
          value={playerName}
          onChange={handleInputChange}
          className="player-name-input"
        />
        <button
          onClick={handleStartClick}
          className="start-screen-button"
        >
          Iniciar Jogo
        </button>
      </div>

      {showError && (
        <div className="error-overlay">
          <div className="error-message">
            Por favor, digite seu nome para começar!
            <div className="error-progress-bar"></div>
          </div>
        </div>
      )}
    </div>
  );
}
