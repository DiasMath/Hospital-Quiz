import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import ClockAnimation from './ClockAnimation';
import './UrgentQuestionScreen.css';

/**
 * Tela especial para exibir a pergunta urgente com animação pulsante.
 */
export default function UrgentQuestionScreen({
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
    <div className="urgent-question-screen-wrapper">
      {/* Imagem de fundo específica desta pergunta */}
      {question.imageUrl && (
        <img 
          src={question.imageUrl} 
          alt={`Background for urgent question ${step + 1}`} 
          className="urgent-question-background-image"
        />
      )}

      {/* Overlay vermelho para dar sensação de urgência */}
      <div className="urgent-overlay"></div>

      {showContent && (
        <motion.div
          className="urgent-question-content-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="urgent-question-card-main">
            {/* Título com animação de emergência e ícone */}
            <div className="urgent-phase-row">
              {/* Ícone para telas grandes */}
              <span className="urgent-warning-container hide-on-mobile">
                <motion.div
                  className="urgent-warning-icon"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ⚠️
                </motion.div>
              </span>
              {/* Ícone para telas pequenas, na frente do texto */}
              <span className="urgent-warning-container show-on-mobile">
                <motion.div
                  className="urgent-warning-icon"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ⚠️
                </motion.div>
              </span>
              <span className="urgent-phase-text">
                {question.phaseText}
              </span>
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