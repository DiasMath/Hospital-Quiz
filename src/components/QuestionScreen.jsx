import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import ClockAnimation from './ClockAnimation';
import './QuestionScreen.css'; // Vamos criar este arquivo CSS

/**
 * Tela para exibir uma única pergunta do quiz.
 * Gerencia sua própria imagem de fundo.
 *
 * Props:
 * - question: O objeto da pergunta atual (com imageUrl)
 * - onAnswer: Callback para quando o usuário responde
 * - step: O índice da pergunta atual (para ProgressBar etc.)
 * - totalQuestions: Número total de perguntas
 * - timeLeft: Tempo restante para a pergunta
 * - questionTime: Duração total da pergunta
 * - gameMode: Modo de jogo ('single' ou 'multiplayer')
 * - opponentData: Dados do oponente no modo multiplayer
 * - currentPlayerName: Nome do jogador atual
 * - score: Pontuação atual do jogador
 */
export default function QuestionScreen({
  question,
  onAnswer,
  step,
  totalQuestions,
  timeLeft,
  questionTime,
  gameMode,
  opponentData,
  currentPlayerName,
  score
}) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="question-screen-wrapper">
      {/* Imagem de fundo específica desta pergunta */}
      {question.imageUrl && (
        <img 
          src={question.imageUrl} 
          alt={`Background for question ${step + 1}`} 
          className="question-background-image"
        />
      )}

      {showContent && (
        <motion.div
          className="question-content-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="question-card-main">
            <div className="text-gray-500 text-2xl font-bold mb-2 text-center">
              {question.phaseText}
            </div>
            <div className="quiz-progress">
              <ProgressBar step={step} total={totalQuestions} />
              <ClockAnimation timeLeft={timeLeft} duration={questionTime} />
            </div>
            <div className="quiz-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestionCard
                    question={question}
                    onAnswer={onAnswer}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 