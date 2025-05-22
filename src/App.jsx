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
import QuestionScreen from './components/QuestionScreen';

const QUESTION_TIME = 30; // segundos por pergunta

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  const handleStart = () => {
    setStep(0);
    setScore(0);
    setTimeLeft(QUESTION_TIME);
    setCurrentScreen('quiz');
  };

  useEffect(() => {
    if (currentScreen === 'quiz' && step < questions.length - 1) {
      if (questions[step + 1].imageUrl) {
        const nextImage = new Image();
        nextImage.src = questions[step + 1].imageUrl;
      }
    }
  }, [currentScreen, step]);

  useEffect(() => {
    if (currentScreen !== 'quiz' || step >= questions.length) return;
    if (timeLeft <= 0) {
      handleAnswer(false);
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, currentScreen, step]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(prev => prev + 1);
    
    const nextStep = step + 1;
    if (nextStep < questions.length) {
      setStep(nextStep);
      setTimeLeft(QUESTION_TIME);
    } else {
      setCurrentScreen('result');
    }
  };

  const restart = () => {
    setScore(0);
    setStep(0);
    setTimeLeft(QUESTION_TIME);
    setCurrentScreen('start');
  };

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'start' && (
        <motion.div
          key="start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <StartScreen onStart={handleStart} />
        </motion.div>
      )}

      {currentScreen === 'quiz' && step < questions.length && (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <QuestionScreen
            question={questions[step]}
            onAnswer={handleAnswer}
            step={step}
            totalQuestions={questions.length}
            timeLeft={timeLeft}
            questionTime={QUESTION_TIME}
          />
        </motion.div>
      )}

      {currentScreen === 'result' && (
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
  );
}
