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
const RANKING_STORAGE_KEY = 'quizRanking'; // Chave para o localStorage

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [currentPlayerName, setCurrentPlayerName] = useState('');

  // Estado ranking inicializado lendo do localStorage
  const [ranking, setRanking] = useState(() => {
    try {
      const savedRanking = localStorage.getItem(RANKING_STORAGE_KEY);
      return savedRanking ? JSON.parse(savedRanking) : [];
    } catch (error) {
      console.error('Could not load ranking from localStorage', error);
      return [];
    }
  });

  // Efeito para salvar o ranking no localStorage sempre que ele mudar
  useEffect(() => {
    try {
      localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(ranking));
    } catch (error) {
      console.error('Could not save ranking to localStorage', error);
    }
  }, [ranking]); // Depende do estado ranking

  const handleStart = (playerName) => {
    setStep(0);
    setScore(0);
    setTimeLeft(QUESTION_TIME);
    setQuizStartTime(Date.now());
    setCurrentPlayerName(playerName);
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
      const quizEndTime = Date.now();
      const totalTime = Math.round((quizEndTime - quizStartTime) / 1000);
      
      setRanking(prevRanking => [
        ...prevRanking,
        { name: currentPlayerName, score: score + (isCorrect ? 1 : 0), time: totalTime }
      ]);
      
      setCurrentScreen('result');
    }
  };

  const restart = () => {
    setScore(0);
    setStep(0);
    setTimeLeft(QUESTION_TIME);
    setQuizStartTime(null);
    setCurrentPlayerName('');
    setCurrentScreen('start');
  };

  const sortedRanking = [...ranking].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    } else {
      return a.time - b.time;
    }
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {currentScreen === 'start' && (
        <motion.div
          key="start"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.5
          }}
        >
          <StartScreen onStart={handleStart} />
        </motion.div>
      )}

      {currentScreen === 'quiz' && step < questions.length && (
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.4,
            ease: "easeInOut"
          }}
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
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.5
          }}
        >
          <Result
            score={score}
            total={questions.length}
            onRestart={restart}
            ranking={sortedRanking}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
