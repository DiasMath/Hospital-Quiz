import React from 'react';
import './StartScreen.css';

/**
 * Tela de boas-vindas antes de iniciar o quiz.
 *
 * Props:
 * - onStart: callback para iniciar o jogo
 */
export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen-wrapper">
      <img 
        src="/assets/imagem_inicial_02.jpg" 
        alt="Imagem inicial do quiz" 
        className="start-screen-background-image"
      />
      <div className="start-screen-container">
        {/* Título principal estilizado */}
        <h1 className="start-screen-title">
          Bem-vindo ao Quiz
        </h1>
        {/* Botão customizado */}
        <button
          onClick={onStart}
          className="start-screen-button"
        >
          Iniciar Jogo
        </button>
      </div>
    </div>
  );
}
