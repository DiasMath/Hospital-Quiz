import React from 'react';
import './Result.css';

/**
 * Componente de resultado final com ranking.
 *
 * Props:
 * - score: número de acertos da tentativa atual
 * - total: total de perguntas
 * - onRestart: callback para reiniciar o quiz
 * - ranking: Array de objetos com { name, score, time } de todos os resultados
 */
export default function Result({ score, total, onRestart, ranking }) {
  // Calcula a porcentagem de acertos (arredondada para inteiro) da tentativa atual
  const percent = Math.round((score / total) * 100);

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

  // Seleciona uma frase aleatória
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

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
          {/* Título com a porcentagem da tentativa atual */}
          <h2 className="result-title">
            Você acertou {percent}% das questões!
          </h2>

          {/* Ranking Table com scroll */}
          <div className="result-table-container">
            {ranking.length > 0 ? (
              <table className="result-table">
                <thead className="result-table-header">
                  <tr className="result-table-header-row">
                    <th className="result-table-header-cell result-table-cell-center">Ranking</th>
                    <th className="result-table-header-cell">Jogador</th>
                    <th className="result-table-header-cell result-table-cell-center">Acertos</th>
                    <th className="result-table-header-cell result-table-cell-right">Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((entry, index) => (
                    <tr 
                      key={index} 
                      className={`
                        result-table-row
                        ${index === 0 ? 'result-table-row-first' : ''}
                        ${index === 1 ? 'result-table-row-second' : ''}
                        ${index === 2 ? 'result-table-row-third' : ''}
                      `}
                    >
                      <td className="result-table-cell result-table-cell-center">
                        <span className={`
                          ${index === 0 ? 'result-rank-first' : ''}
                          ${index === 1 ? 'result-rank-second' : ''}
                          ${index === 2 ? 'result-rank-third' : ''}
                          ${index > 2 ? 'result-rank-other' : ''}
                        `}>
                          {index + 1}º
                        </span>
                      </td>
                      <td className="result-table-cell">{entry.name}</td>
                      <td className="result-table-cell result-table-cell-center">{entry.score}</td>
                      <td className="result-table-cell result-table-cell-right">{entry.time}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600 py-8">Nenhum resultado registrado ainda.</p>
            )}
          </div>

          {/* Mensagem de agradecimento maior */}
          <p className="result-thank-you">
            Obrigado por participar!
          </p>

          {/* Frase de motivação aleatória */}
          <p className="result-motivation">
            "{randomPhrase}"
          </p>

          {/* Créditos */}
          <p className="result-credits">
            Feito por: Nayana Ramos, ...
          </p>

          {/* Botão para reiniciar o quiz */}
          <button
            onClick={onRestart}
            className="result-button"
          >
            Reiniciar Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
