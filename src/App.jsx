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
import UrgentQuestionScreen from './components/UrgentQuestionScreen';
import { listenRoom, updatePlayerProgress, updateQuizStep, finishPlayer, setPreGameStartTime } from './firebaseRooms';

const QUESTION_TIME = 30; // segundos por pergunta
const MULTIPLAYER_STORAGE_KEY = 'quizMultiplayer'; // Chave para dados multiplayer
const GAME_STATE_KEY = 'quizGameState'; // Chave para estado do jogo

function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleQuestionsOptions(questions) {
  return questions.map(q => {
    // Cria uma cópia das opções para evitar referência cruzada
    const optionsCopy = q.options.slice();
    const options = shuffleArray(optionsCopy);
    // Encontrar novo índice da resposta correta
    const correctOption = q.options[q.correctIndex];
    const newCorrectIndex = options.indexOf(correctOption);
    return { ...q, options, correctIndex: newCorrectIndex };
  });
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizEndTime, setQuizEndTime] = useState(null);
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [gameMode, setGameMode] = useState('single'); // 'single' ou 'multiplayer'
  const [gameId, setGameId] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // Estado ranking apenas para a partida atual
  const [ranking, setRanking] = useState([]);

  // Adicione um estado para as perguntas embaralhadas:
  const [quizQuestions, setQuizQuestions] = useState([]);

  // Estado para rastrear se acertou a pergunta urgente
  const [urgentQuestionCorrect, setUrgentQuestionCorrect] = useState(null);

  // Adicione o state para o pré-jogo
  const [preGameStartTime, setPreGameStartTimeState] = useState(null);
  const [preGameCountdown, setPreGameCountdown] = useState(null);

  // Adicione um estado para o snapshot da sala
  const [roomSnapshot, setRoomSnapshot] = useState(null);

  // Novo estado: finished (jogador terminou)
  const [finished, setFinished] = useState(false);

  // Função para gerar ID único do jogo
  const generateGameId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Função para salvar estado do jogo no localStorage
  const saveGameState = (state) => {
    try {
      const key = `${GAME_STATE_KEY}_${state.gameId}_${state.playerName}`;
      localStorage.setItem(key, JSON.stringify({
        ...state,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Could not save game state to localStorage', error);
    }
  };

  // Função para carregar estado do jogo do localStorage
  const loadGameState = (gameId, playerName) => {
    try {
      const key = `${GAME_STATE_KEY}_${gameId}_${playerName}`;
      const savedState = localStorage.getItem(key);
      return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
      console.error('Could not load game state from localStorage', error);
      return null;
    }
  };

  // Função para sincronizar dados multiplayer
  const syncMultiplayerData = () => {
    if (gameMode !== 'multiplayer' || !gameId) return;

    const currentState = {
      gameId,
      playerName: currentPlayerName,
      step,
      score,
      timeLeft,
      quizStartTime,
      quizEndTime,
      isFinished: currentScreen === 'result',
      isWaiting: currentScreen === 'waiting',
      gameStartTime: gameStartTime,
      countdown: countdown,
      urgentQuestionCorrect: urgentQuestionCorrect
    };

    saveGameState(currentState);

    // Limpar estados antigos (mais de 5 minutos)
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quizGameState_')) {
        try {
          const state = JSON.parse(localStorage.getItem(key));
          if (state && state.timestamp && state.timestamp < fiveMinutesAgo) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Se não conseguir fazer parse, remove o item
          localStorage.removeItem(key);
        }
      }
    }

    // Verificar dados do oponente
    const allGameStates = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quizGameState_')) {
        try {
          const state = JSON.parse(localStorage.getItem(key));
          if (state && state.gameId === gameId && state.playerName !== currentPlayerName) {
            allGameStates.push(state);
          }
        } catch (error) {
          console.error('Error parsing game state:', error);
        }
      }
    }

    if (allGameStates.length > 0) {
      const opponentState = allGameStates[0];
      setOpponentData(opponentState);
    }
  };

  // Efeito para sincronização multiplayer
  useEffect(() => {
    if (gameMode === 'multiplayer' && (isGameStarted || currentScreen === 'waiting' || currentScreen === 'result' || countdown !== null)) {
      const interval = setInterval(syncMultiplayerData, 500); // Sincronizar mais frequentemente
      return () => clearInterval(interval);
    }
  }, [gameMode, gameId, isGameStarted, currentScreen, countdown, step, score, timeLeft, quizEndTime]);

  // Efeito para detectar quando o segundo jogador entra na sala
  useEffect(() => {
    if (gameMode === 'multiplayer' && gameId && currentScreen === 'waiting') {
      const checkForOpponent = () => {
        // Verificar se há outro jogador no mesmo jogo
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('quizGameState_')) {
            try {
              const state = JSON.parse(localStorage.getItem(key));
              if (state && state.gameId === gameId && state.playerName !== currentPlayerName) {
                // Segundo jogador encontrado! Iniciar contagem regressiva
                if (!gameStartTime) {
                  const startTime = Date.now() + 3000; // 3 segundos a partir de agora
                  setGameStartTime(startTime);
                  setCountdown(3);
                }
                return;
              }
            } catch (error) {
              console.error('Error parsing game state:', error);
            }
          }
        }
      };

      const interval = setInterval(checkForOpponent, 500); // Verificar mais frequentemente
      return () => clearInterval(interval);
    }
  }, [gameMode, gameId, currentScreen, currentPlayerName, gameStartTime]);

  // Efeito para gerenciar contagem regressiva e sincronização
  useEffect(() => {
    if (gameMode === 'multiplayer' && countdown !== null) {
      // Sincronizar com o oponente se ele já definiu um horário de início
      if (opponentData && opponentData.gameStartTime && !gameStartTime) {
        setGameStartTime(opponentData.gameStartTime);
        setCountdown(3);
      }

      // Contagem regressiva
      if (gameStartTime) {
        const now = Date.now();
        const timeUntilStart = gameStartTime - now;
        
        if (timeUntilStart <= 0) {
          // Hora de começar!
          setCountdown(null);
          setIsGameStarted(true);
          setCurrentScreen('quiz');
        } else {
          // Atualizar contagem regressiva
          const secondsLeft = Math.ceil(timeUntilStart / 1000);
          setCountdown(secondsLeft);
        }
      }
    }
  }, [gameMode, countdown, gameStartTime, opponentData]);

  // Efeito para atualizar contagem regressiva em tempo real
  useEffect(() => {
    if (gameMode === 'multiplayer' && countdown !== null && gameStartTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeUntilStart = gameStartTime - now;
        
        if (timeUntilStart <= 0) {
          // Hora de começar!
          setCountdown(null);
          setIsGameStarted(true);
          setCurrentScreen('quiz');
        } else {
          // Atualizar contagem regressiva
          const secondsLeft = Math.ceil(timeUntilStart / 1000);
          setCountdown(secondsLeft);
        }
      }, 100); // Atualizar a cada 100ms para contagem mais suave

      return () => clearInterval(interval);
    }
  }, [gameMode, countdown, gameStartTime]);

  // Novo efeito: escutar sala multiplayer no Firebase
  useEffect(() => {
    if (gameMode === 'multiplayer' && gameId && currentPlayerName) {
      const unsubscribe = listenRoom(gameId, (room) => {
        setRoomSnapshot(room);
        // Se sala existe e tem 2 jogadores, inicia o jogo
        if (room && room.players && Object.keys(room.players).length >= 2 && currentScreen === 'waiting') {
          setCurrentScreen('quiz');
          setIsGameStarted(true);
        }
      });
      return () => {
        // Firebase não tem unsubscribe direto, mas onValue retorna a função para remover listener
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [gameMode, gameId, currentPlayerName, currentScreen]);

  // Novo efeito: sincronizar progresso do quiz multiplayer
  useEffect(() => {
    if (gameMode === 'multiplayer' && gameId && currentPlayerName) {
      const unsubscribe = listenRoom(gameId, (room) => {
        setRoomSnapshot(room);
        // Sincronizar step individual do jogador
        if (room && room.players && room.players[currentPlayerName] && typeof room.players[currentPlayerName].step === 'number' && step !== room.players[currentPlayerName].step) {
          setStep(room.players[currentPlayerName].step);
        }
        // Sincronizar score do oponente
        if (room && room.players) {
          const opponent = Object.keys(room.players).find(p => p !== currentPlayerName);
          if (opponent) {
            setOpponentData({
              ...room.players[opponent],
              playerName: opponent
            });
          }
        }
        // Iniciar quiz quando ambos presentes
        if (room && room.players && Object.keys(room.players).length >= 2 && currentScreen === 'waiting') {
          setCurrentScreen('quiz');
          setIsGameStarted(true);
        }
        // Substitua a lógica de transição de tela para resultado:
        if (room && room.players && room.players[currentPlayerName] && room.players[currentPlayerName].finished) {
          setFinished(true);
          // Debug: mostrar estado dos jogadores
          console.log('room.players:', room.players);
          console.log('currentPlayerName:', currentPlayerName);
          console.log('finished flags:', Object.values(room.players).map(p => p.finished));
          // Só mostra resultado se ambos terminaram
          const allFinished = Object.values(room.players).every(p => p.finished);
          if (allFinished) {
            setCurrentScreen('result');
          } else {
            setCurrentScreen('waiting_result');
          }
        }
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [gameMode, gameId, currentPlayerName, currentScreen, step]);

  // Efeito para iniciar contagem regressiva sincronizada quando ambos jogadores presentes
  useEffect(() => {
    if (
      gameMode === 'multiplayer' &&
      gameId &&
      roomSnapshot &&
      roomSnapshot.players &&
      Object.keys(roomSnapshot.players).length >= 2 &&
      currentScreen === 'waiting'
    ) {
      // Só o primeiro a detectar define o horário de início
      if (!roomSnapshot.preGameStartTime) {
        const startTime = Date.now() + 3000;
        updateQuizStep(gameId, roomSnapshot.quizStep || 0); // Garante quizStep
        setPreGameStartTimeState(startTime); // Corrigido para salvar no nó da sala
      }
    }
  }, [gameMode, gameId, roomSnapshot, currentScreen]);

  // Efeito para escutar o horário de início da contagem e exibir a tela
  useEffect(() => {
    if (
      gameMode === 'multiplayer' &&
      roomSnapshot &&
      roomSnapshot.preGameStartTime &&
      currentScreen === 'waiting'
    ) {
      setPreGameStartTimeState(roomSnapshot.preGameStartTime);
      setPreGameCountdown(3);
      setCurrentScreen('pre_game_countdown');
    }
  }, [gameMode, roomSnapshot, currentScreen]);

  // Efeito para atualizar a contagem regressiva
  useEffect(() => {
    if (currentScreen === 'pre_game_countdown' && preGameStartTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.ceil((preGameStartTime - now) / 1000);
        setPreGameCountdown(timeLeft > 0 ? timeLeft : 0);
        if (timeLeft <= 0) {
          setCurrentScreen('quiz');
          setIsGameStarted(true);
          setPreGameCountdown(null);
          setPreGameStartTimeState(null);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentScreen, preGameStartTime]);

  const handleStart = (playerName, mode = 'single', existingGameId = null) => {
    setStep(0);
    setScore(0);
    const startTime = Date.now();
    setTimeLeft(QUESTION_TIME);
    setQuizStartTime(startTime);
    setCurrentPlayerName(playerName);
    setGameMode(mode);
    setIsGameStarted(false);
    setUrgentQuestionCorrect(null); // Resetar estado da pergunta urgente
    // Embaralhar apenas as opções das perguntas, mantendo a ordem das perguntas
    const shuffled = shuffleQuestionsOptions(questions);
    setQuizQuestions(shuffled);

    if (mode === 'multiplayer') {
      if (existingGameId) {
        setGameId(existingGameId);
        setCurrentScreen('waiting');
        // Salvar quizStartTime no Firebase para o jogador
        updatePlayerProgress(existingGameId, playerName, { quizStartTime: startTime });
      } else {
        alert('Erro: Código da sala inválido. Tente novamente.');
        return;
      }
    } else {
      setCurrentScreen('quiz');
      setIsGameStarted(true);
    }
  };

  const handleMultiplayerStart = () => {
    setIsGameStarted(true);
    setCurrentScreen('quiz');
  };

  useEffect(() => {
    if (currentScreen === 'quiz' && step < quizQuestions.length - 1) {
      if (quizQuestions[step + 1].imageUrl) {
        const nextImage = new Image();
        nextImage.src = quizQuestions[step + 1].imageUrl;
      }
    }
  }, [currentScreen, step]);

  useEffect(() => {
    if (currentScreen !== 'quiz' || step >= quizQuestions.length) return;
    if (timeLeft <= 0) {
      handleAnswer(false);
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, currentScreen, step]);

  // Atualizar progresso do jogador e step global ao responder
  const handleAnswer = (isCorrect) => {
    if (gameMode === 'multiplayer' && gameId && currentPlayerName) {
      // Atualiza score e step do jogador
      const newScore = isCorrect ? score + 1 : score;
      // Se for a pergunta urgente, atualize urgentQuestionCorrect antes de finalizar
      let newUrgentQuestionCorrect = urgentQuestionCorrect;
      if (step === 2 && quizQuestions[step] && quizQuestions[step].isUrgent) {
        setUrgentQuestionCorrect(isCorrect);
        newUrgentQuestionCorrect = isCorrect;
      }
      updatePlayerProgress(gameId, currentPlayerName, { score: newScore, step: step + 1 });
      setScore(newScore);
      setStep(step + 1);
      setTimeLeft(QUESTION_TIME);
      // Se for última pergunta, marcar como finalizado
      if (step + 1 >= quizQuestions.length) {
        const endTime = Date.now();
        setQuizEndTime(endTime);
        setRanking(prevRanking => [
          ...prevRanking,
          {
            name: currentPlayerName,
            score: newScore,
            time: quizStartTime ? Math.round((endTime - quizStartTime) / 1000) : 0,
            gameMode: gameMode,
            gameId: gameId
          }
        ]);
        // Salvar quizEndTime e urgentQuestionCorrect no Firebase
        finishPlayer(gameId, currentPlayerName, { 
          score: newScore, 
          quizEndTime: endTime, 
          urgentQuestionCorrect: newUrgentQuestionCorrect 
        });
        setFinished(true);
        setCurrentScreen('waiting_result');
      }
    } else {
      // Fluxo single player
      if (step === 2 && quizQuestions[step] && quizQuestions[step].isUrgent) {
        setUrgentQuestionCorrect(isCorrect);
      }
      if (isCorrect) setScore(prev => prev + 1);
      const nextStep = step + 1;
      if (nextStep < quizQuestions.length) {
        setStep(nextStep);
        setTimeLeft(QUESTION_TIME);
      } else {
        const endTime = Date.now();
        const totalTime = Math.round((endTime - quizStartTime) / 1000);
        setQuizEndTime(endTime);
        setRanking(prevRanking => [
          ...prevRanking,
          { 
            name: currentPlayerName, 
            score: score + (isCorrect ? 1 : 0), 
            time: totalTime,
            gameMode: gameMode,
            gameId: gameId
          }
        ]);
        setCurrentScreen('result');
      }
    }
  };

  const restart = () => {
    setScore(0);
    setStep(0);
    setTimeLeft(QUESTION_TIME);
    setQuizStartTime(null);
    setQuizEndTime(null);
    setCurrentPlayerName('');
    setCurrentScreen('start');
    setGameMode('single');
    setGameId(null);
    setOpponentData(null);
    setIsGameStarted(false);
    setGameStartTime(null);
    setCountdown(null);
    setRanking([]); // Limpar ranking da partida atual
    setUrgentQuestionCorrect(null); // Resetar estado da pergunta urgente
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

      {currentScreen === 'waiting' && (
        <motion.div
          key="waiting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="waiting-screen"
        >
          <img 
            src="/assets/imagem_inicial_01.jpg" 
            alt="Aguardando segundo jogador" 
            className="waiting-background-image"
          />
          <div className="waiting-container">
            {countdown !== null ? (
              <>
                <h2>Preparando para iniciar...</h2>
                <div className="countdown-display">
                  <div className="countdown-number">{countdown}</div>
                  <p>O jogo começará em {countdown} segundo{countdown !== 1 ? 's' : ''}!</p>
                </div>
              </>
            ) : (
              <>
                {opponentData ? (
                  <>
                    <h2>Conectado ao jogo!</h2>
                    <p>Jogador encontrado: <strong>{opponentData.playerName}</strong></p>
                    <p className="waiting-status">Aguardando início do jogo...</p>
                    <div className="waiting-animation">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Aguardando segundo jogador...</h2>
                    <p>ID da sala: <strong>{gameId}</strong></p>
                    <p>Compartilhe este ID com o segundo jogador</p>
                    <p className="waiting-status">O jogo iniciará automaticamente quando o segundo jogador entrar!</p>
                    <div className="waiting-animation">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}

      {currentScreen === 'quiz' && step < quizQuestions.length && (
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
          {quizQuestions[step].isUrgent ? (
            <UrgentQuestionScreen
              question={quizQuestions[step]}
              onAnswer={handleAnswer}
              step={step}
              totalQuestions={quizQuestions.length}
              timeLeft={timeLeft}
              questionTime={QUESTION_TIME}
              gameMode={gameMode}
              opponentData={opponentData}
              currentPlayerName={currentPlayerName}
              score={score}
            />
          ) : (
            <QuestionScreen
              question={quizQuestions[step]}
              onAnswer={handleAnswer}
              step={step}
              totalQuestions={quizQuestions.length}
              timeLeft={timeLeft}
              questionTime={QUESTION_TIME}
              gameMode={gameMode}
              opponentData={opponentData}
              currentPlayerName={currentPlayerName}
              score={score}
            />
          )}
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
            total={quizQuestions.length}
            onRestart={restart}
            ranking={sortedRanking}
            gameMode={gameMode}
            opponentData={opponentData}
            currentPlayerName={currentPlayerName}
            quizStartTime={quizStartTime}
            quizEndTime={quizEndTime}
            urgentQuestionCorrect={urgentQuestionCorrect}
          />
        </motion.div>
      )}

      {currentScreen === 'pre_game_countdown' && (
        <motion.div
          key="pre_game_countdown"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="waiting-screen"
        >
          <img 
            src="/assets/imagem_inicial_01.jpg" 
            alt="Preparando para iniciar" 
            className="waiting-background-image"
          />
          <div className="waiting-container">
            {preGameStartTime ? (
              <>
                <h2>O jogo vai iniciar em...</h2>
                <div className="countdown-display">
                  <div className="countdown-number">{preGameCountdown}</div>
                  <p>O jogo começará em {preGameCountdown} segundo{preGameCountdown !== 1 ? 's' : ''}!</p>
                </div>
              </>
            ) : (
              <>
                <h2>Aguardando outro jogador...</h2>
              </>
            )}
          </div>
        </motion.div>
      )}

      {currentScreen === 'waiting_result' && (
        <motion.div
          key="waiting_result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="waiting-screen"
        >
          <img 
            src="/assets/imagem_inicial_01.jpg" 
            alt="Aguardando resultado" 
            className="waiting-background-image"
          />
          <div className="waiting-container">
            <h2>⏳ Aguardando o outro jogador terminar...</h2>
            <div className="waiting-animation">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
