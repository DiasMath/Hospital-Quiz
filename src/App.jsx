import React, { useState, useEffect } from 'react';
import HospitalSound from './components/HospitalSound';
import { AnimatePresence, motion } from 'framer-motion';
import questions from './data/questions';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import Result from './components/Result';
import ProgressBar from './components/ProgressBar';
import ClockAnimation from './components/ClockAnimation';
import './App.css';

const QUESTION_TIME = 30; // segundos por pergunta

export default function App() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  const handleStart = () => setStarted(true);

  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
  }, [step]);

  useEffect(() => {
    if (!started || step >= questions.length) return;
    if (timeLeft <= 0) {
      handleAnswer(false);
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, step, started]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(prev => prev + 1);
    setStep(prev => prev + 1);
  };

  const restart = () => {
    setScore(0);
    setStep(0);
    setTimeLeft(QUESTION_TIME);
    setStarted(false);
  };

  return (
    <AnimatePresence mode="wait">
      {!started ? (
        <motion.div
          key="start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <StartScreen onStart={handleStart} />
        </motion.div>
      ) : (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
        <div className="quiz-wrapper">
          <div className="quiz-container">
            {step < questions.length && (
              <>
                {/* ALTERADO: exibe o texto da fase acima da progress bar */}
                <div className="text-gray-500 text-2xl font-bold mb-2 text-center">
                  {questions[step].phaseText}
                </div>
                <div className="quiz-progress">
                  <ProgressBar step={step} total={questions.length} />
                  <ClockAnimation timeLeft={timeLeft} duration={QUESTION_TIME} />
                </div>
              </>
            )}
              <div className="quiz-content">
                <AnimatePresence mode="wait">
                  {step < questions.length ? (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <QuestionCard
                        question={questions[step]}
                        onAnswer={handleAnswer}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Result
                        score={score}
                        total={questions.length}
                        onRestart={restart}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
