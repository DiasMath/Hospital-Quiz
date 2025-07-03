import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Result.css';

/**
 * Componente de resultado final com ranking.
 *
 * Props:
 * - score: número de acertos da tentativa atual
 * - total: total de perguntas
 * - onRestart: callback para reiniciar o quiz
 * - ranking: Array de objetos com { name, score, time } de todos os resultados
 * - gameMode: Modo de jogo ('single' ou 'multiplayer')
 * - opponentData: Dados do oponente no modo multiplayer
 * - currentPlayerName: Nome do jogador atual
 */
export default function Result({ 
  score, 
  total, 
  onRestart, 
  ranking, 
  gameMode, 
  opponentData, 
  currentPlayerName,
  quizStartTime,
  quizEndTime
}) {
  // Calcula a porcentagem de acertos (arredondada para inteiro) da tentativa atual
  const percent = Math.round((score / total) * 100);

  // Determina o resultado do multiplayer
  const getMultiplayerResult = () => {
    if (gameMode !== 'multiplayer' || !opponentData) return null;
    // Se o oponente não terminou, mostrar mensagem de aguardo
    if (!opponentData.quizEndTime) {
      return { type: 'waiting', message: '⏳ Aguardando o outro jogador terminar...' };
    }
    // Ambos terminaram, mostrar resultado real
    const currentScore = score;
    const opponentScore = opponentData.score;
    const currentTime = quizEndTime && quizStartTime ? Math.round((quizEndTime - quizStartTime) / 1000) : 0;
    const opponentTime = opponentData.quizEndTime && opponentData.quizStartTime ? 
      Math.round((opponentData.quizEndTime - opponentData.quizStartTime) / 1000) : 0;
    let isWinner = false;
    if (currentScore > opponentScore) {
      isWinner = true;
    } else if (currentScore === opponentScore) {
      isWinner = currentTime < opponentTime;
    }
    if (isWinner) {
      return { type: 'winner', message: '🎉 Parabéns! Você venceu!' };
    } else if (currentScore === opponentScore && currentTime === opponentTime) {
      return { type: 'tie', message: '🤝 Empate! Ambos tiveram a mesma pontuação e tempo!' };
    } else {
      return { type: 'loser', message: '😔 Que pena! Você perdeu!' };
    }
  };

  const multiplayerResult = getMultiplayerResult();

  // Calcular tempo do oponente para o ranking
  let opponentTime = null;
  if (gameMode === 'multiplayer' && opponentData) {
    if (opponentData.quizEndTime && opponentData.quizStartTime) {
      opponentTime = Math.round((opponentData.quizEndTime - opponentData.quizStartTime) / 1000);
    }
  }

  // Calcular tempo do jogador atual
  const currentPlayerTime = quizEndTime && quizStartTime ? Math.round((quizEndTime - quizStartTime) / 1000) : 0;

  // Adicione o estado para o tempo em tempo real do oponente:
  const [opponentLiveTime, setOpponentLiveTime] = useState(null);

  // Atualize o tempo em tempo real do oponente se ele ainda não terminou
  useEffect(() => {
    if (
      gameMode === 'multiplayer' &&
      opponentData &&
      opponentData.quizStartTime &&
      !opponentData.quizEndTime
    ) {
      // Atualiza a cada segundo
      const interval = setInterval(() => {
        setOpponentLiveTime(Math.round((Date.now() - opponentData.quizStartTime) / 1000));
      }, 1000);
      // Inicializa imediatamente
      setOpponentLiveTime(Math.round((Date.now() - opponentData.quizStartTime) / 1000));
      return () => clearInterval(interval);
    } else {
      setOpponentLiveTime(null);
    }
  }, [gameMode, opponentData]);

  // Ordenar jogadores por ranking (mais acertos em menos tempo)
  const getRankedPlayers = () => {
    if (gameMode !== 'multiplayer' || !opponentData) {
      return [
        { name: currentPlayerName, score, time: currentPlayerTime, isCurrent: true }
      ];
    }
    let opponentDisplayTime = opponentTime;
    if (opponentTime === null && opponentLiveTime !== null) {
      opponentDisplayTime = opponentLiveTime;
    }
    const players = [
      { name: currentPlayerName, score, time: currentPlayerTime, isCurrent: true },
      { name: opponentData.playerName, score: opponentData.score, time: opponentTime === null && opponentLiveTime === null ? null : opponentDisplayTime, isCurrent: false, isInProgress: opponentTime === null }
    ];

    // Ordenar por score (maior primeiro) e depois por tempo (menor primeiro)
    return players.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      } else {
        // Se tempo for null, considera como infinito (ainda em andamento)
        if (a.time === null) return 1;
        if (b.time === null) return -1;
        return a.time - b.time;
      }
    });
  };

  const rankedPlayers = getRankedPlayers();

  // Lista com 25 frases de motivação
  const phrases = [
    "Continue se esforçando, grandes conquistas estão por vir!",
    "Cada passo conta, continue avançando!",
    "Você está mais perto do seu objetivo a cada tentativa!",
    "Nunca desista: a próxima vitória pode estar bem ali!",
    "Acredite em si mesmo e siga em frente!",
    "O importante não é vencer sempre, mas nunca desistir!",
    "A jornada é tão importante quanto o destino.",
    "Todo esforço te aproxima do sucesso!",
    "Aprender é crescer — mantenha a chama acesa!",
    "Com determinação, nada é impossível!",
    "Desafios são oportunidades de crescimento.",
    "Valorize cada conquista, por menor que seja.",
    "Sua dedicação faz toda a diferença.",
    "Permaneça focado e você alcançará seus sonhos.",
    "Persistência transforma objetivos em realidade.",
    "Acredite no seu potencial ilimitado.",
    "Pequenas vitórias diárias constroem grandes legados.",
    "Seja a melhor versão de si mesmo hoje.",
    "Sucesso é a soma de pequenos esforços repetidos.",
    "Não tema falhar, tema não tentar.",
    "Coragem é dar o primeiro passo, mesmo com medo.",
    "Cada erro traz uma lição valiosa.",
    "Cultive a positividade e colha resultados incríveis.",
    "Pratique a gratidão e veja sua motivação crescer.",
    "Tenha fé no processo e desfrute cada etapa."
  ];

  // Estado para frase motivacional animada
  const [phraseIndex, setPhraseIndex] = useState(Math.floor(Math.random() * phrases.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000); // 2 segundos
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="result-container">
      {/* Imagem de fundo */}
      <img 
        src="/assets/imagem_final.jpg" 
        alt="Imagem de fundo do resultado" 
        className="result-background-image"
      />

      {/* Conteúdo com overlay para melhor legibilidade */}
      <div className="result-content">
        {/* Caixa com blur */}
        <div className="result-blur-box">
          
          {/* Resultado do multiplayer */}
          {multiplayerResult && (
            <div className={`multiplayer-result ${multiplayerResult.type}`} style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>{multiplayerResult.message}</h3>
            </div>
          )}

          {/* Só mostra o resultado e ranking se ambos terminaram */}
          {(gameMode === 'single' || (multiplayerResult && multiplayerResult.type !== 'waiting')) && (
            <>
              {/* Título com a porcentagem da tentativa atual */}
              <h2 className="result-title">
                Você acertou {percent}% das questões!
              </h2>
              {/* Ranking Table com scroll */}
              <div className="result-table-container">
                <table className="result-table">
                  <thead className="result-table-header">
                    <tr className="result-table-header-row">
                      <th className="result-table-header-cell result-table-cell-center">Ranking</th>
                      <th className="result-table-header-cell">Jogador</th>
                      <th className="result-table-header-cell result-table-cell-center">Acertos</th>
                      <th className="result-table-header-cell result-table-cell-right">Tempo</th>
                      {gameMode === 'multiplayer' && (
                        <th className="result-table-header-cell result-table-cell-center">Modo</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rankedPlayers.map((player, index) => (
                      <tr key={player.name} className={`result-table-row ${index === 0 ? 'result-table-row-first' : 'result-table-row-second'}`}>
                        <td className="result-table-cell result-table-cell-center">
                          <span className={index === 0 ? 'result-rank-first' : 'result-rank-second'}>
                            {index + 1}º
                          </span>
                        </td>
                        <td className="result-table-cell">{player.name}</td>
                        <td className="result-table-cell result-table-cell-center">{player.score}</td>
                        <td className="result-table-cell result-table-cell-right">
                          {`${player.time}s`}
                        </td>
                        {gameMode === 'multiplayer' && (
                          <td className="result-table-cell result-table-cell-center">
                            {gameMode === 'multiplayer' ? '🏆' : '👤'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mensagem de agradecimento maior */}
              <p className="result-thank-you">
                Obrigado por participar!
              </p>
              {/* Frase de motivação aleatória */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={phraseIndex}
                  className="result-motivation"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
                  style={{ position: 'relative' }}
                >
                  "{phrases[phraseIndex]}"
                </motion.p>
              </AnimatePresence>
              {/* Créditos */}
              <p className="result-credits">
                ❤️ Feito por: Nayana Araújo, Gabriele e Maysa.
              </p>
              {/* Botão para reiniciar o quiz */}
              <button
                onClick={onRestart}
                className="result-button"
              >
                Reiniciar Quiz
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
