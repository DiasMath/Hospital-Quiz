import React, { useState, useEffect } from 'react';
import './StartScreen.css';

/**
 * Tela de boas-vindas antes de iniciar o quiz.
 *
 * Props:
 * - onStart: callback para iniciar o jogo (agora recebe o nome do jogador e modo)
 */
export default function StartScreen({ onStart }) {
  const [playerName, setPlayerName] = useState('');
  const [gameMode, setGameMode] = useState(''); // '' | 'single' | 'multiplayer'
  const [showError, setShowError] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false);
  const [gameId, setGameId] = useState('');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [step, setStep] = useState(1); // 1: nome, 2: modo, 3: opções
  const [multiplayerChoice, setMultiplayerChoice] = useState(''); // '' | 'create' | 'join'

  const handleInputChange = (event) => {
    setPlayerName(event.target.value);
    if (showError) setShowError(false);
  };

  const handleModeChange = (mode) => {
    setGameMode(mode);
    setShowJoinGame(false);
    setGameId('');
    if (mode === 'multiplayer') {
      setShowHowToPlay(true);
    }
  };

  const handleNextFromName = () => {
    if (playerName.trim() === '') {
      setShowError(true);
      return;
    }
    setShowError(false);
    setStep(2);
  };

  const handleNextFromMode = () => {
    if (!gameMode) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setStep(3);
  };

  const handleStartClick = () => {
    if (gameMode === 'multiplayer') {
      if (!multiplayerChoice) {
        setShowError('Por favor, selecione uma opção: Criar Novo Jogo ou Entrar em Jogo Existente.');
        return;
      }
      if (!gameId.trim()) {
        setShowError('Por favor, digite o ID da sala para entrar!');
        return;
      }
    }
    onStart(playerName.trim(), gameMode, gameId.trim());
  };

  const handleJoinGame = () => {
    setShowJoinGame(true);
    setMultiplayerChoice('join');
    setGameId('');
  };

  // Função para gerar código de sala de 5 letras
  function generateRoomCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return code;
  }

  const handleCreateGame = () => {
    setShowJoinGame(false);
    setMultiplayerChoice('create');
    setGameId(generateRoomCode());
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 2000);
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
      {/* Modal de instruções */}
      {showHowToPlay && (
        <div className="how-to-play-modal-overlay">
          <div className="how-to-play-modal">
            <h2>Como jogar</h2>
            <ul>
              <li>1. No modo <b>Jogador Único</b>:
                <ul>
                  <li>Responda todas as perguntas no menor tempo possível.</li>
                </ul>
              </li>
              <li>2. No modo <b>Multiplayer</b>:
                <ul>
                  <li>Crie um novo jogo ou entre em um existente usando o ID.</li>
                  <li>O primeiro a responder todas as perguntas vence!</li>
                </ul>
              </li>
            </ul>
            <button className="how-to-play-ok-btn" onClick={() => setShowHowToPlay(false)}>OK</button>
          </div>
        </div>
      )}
      <div className="start-screen-container">
        <h1 className="start-screen-title">Hospital Game</h1>
        {/* Etapa 1: Nome */}
        {step === 1 && (
          <>
            <div className="player-name-input-wrapper">
              <span className="player-name-icon">👤</span>
              <input
                type="text"
                placeholder="Digite seu nome"
                value={playerName}
                onChange={handleInputChange}
                className="player-name-input"
                onKeyDown={e => e.key === 'Enter' && handleNextFromName()}
              />
            </div>
            <button
              className="start-screen-button"
              onClick={handleNextFromName}
            >
              Avançar
            </button>
          </>
        )}
        {/* Etapa 2: Modo de jogo */}
        {step === 2 && (
          <>
            <div className="game-mode-selector">
              <h3>Escolha o modo de jogo:</h3>
              <div className="mode-buttons">
                <button
                  className={`mode-button ${gameMode === 'single' ? 'active' : ''}`}
                  onClick={() => handleModeChange('single')}
                >
                  <span className="mode-icon">👤</span>
                  <span className="mode-text">Jogador Único</span>
                </button>
                <button
                  className={`mode-button ${gameMode === 'multiplayer' ? 'active' : ''}`}
                  onClick={() => handleModeChange('multiplayer')}
                >
                  <span className="mode-icon">👥</span>
                  <span className="mode-text">Multiplayer</span>
                </button>
              </div>
            </div>
            <button
              className="start-screen-button"
              onClick={handleNextFromMode}
              disabled={!gameMode}
            >
              Avançar
            </button>
          </>
        )}
        {/* Etapa 3: Opções de multiplayer ou iniciar */}
        {step === 3 && (
          <>
            {gameMode === 'multiplayer' && (
              <>
                <div className="multiplayer-options">
                  <button
                    className={`multiplayer-option ${multiplayerChoice === 'create' ? 'active' : ''}`}
                    onClick={handleCreateGame}
                  >
                    🎮 Criar Novo Jogo
                  </button>
                  <button
                    className={`multiplayer-option ${multiplayerChoice === 'join' ? 'active' : ''}`}
                    onClick={handleJoinGame}
                  >
                    🔗 Entrar em Jogo Existente
                  </button>
                </div>
                <div className="multiplayer-options-spacer"></div>
                {multiplayerChoice === 'join' && (
                  <div className="join-game-section">
                    <input
                      type="text"
                      placeholder="Digite o ID da sala"
                      value={gameId}
                      onChange={(e) => setGameId(e.target.value)}
                      className="game-id-input"
                    />
                  </div>
                )}
              </>
            )}
            <button
              onClick={handleStartClick}
              className="start-screen-button"
            >
              {gameMode === 'multiplayer' 
                ? (multiplayerChoice === 'join' ? 'Entrar na Sala' : 'Criar Sala Multiplayer')
                : 'Iniciar Jogo'
              }
            </button>
          </>
        )}
      </div>
      {showError && (
        <div className="error-overlay">
          <div className="error-message">
            {typeof showError === 'string' ? showError : null}
            {showError === true && step === 1 && 'Por favor, digite seu nome para começar!'}
            {showError === true && step === 2 && 'Por favor, escolha o modo de jogo!'}
            <div className="error-progress-bar"></div>
          </div>
        </div>
      )}
    </div>
  );
}
