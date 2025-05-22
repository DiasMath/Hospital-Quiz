import React from 'react';

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
    <div className="w-full flex flex-col items-center">
      {/* Título com a porcentagem da tentativa atual */}
      <h2 className="text-5xl font-bold mb-6 text-center">
        Você acertou {percent}% das questões!
      </h2>

      {/* Ranking Title */}
      <h3 className="text-3xl font-bold mb-4 mt-8">Ranking</h3>

      {/* Ranking List */}
      <div className="w-full max-w-sm">
        {ranking.length > 0 ? (
          <ol className="list-decimal list-inside text-xl text-gray-800">
            {ranking.map((entry, index) => (
              <li key={index} className="mb-2">
                <strong>{entry.name}:</strong> {entry.score} acerto(s) em {entry.time} segundos
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-gray-600">Nenhum resultado registrado ainda.</p>
        )}
      </div>

      {/* Mensagem de agradecimento maior */}
      <p className="text-2xl font-semibold text-gray-800 mb-8 mt-8 text-center">
        Obrigado por participar!
      </p>

      {/* Frase de motivação aleatória */}
      <p className="text-xl text-gray-700 mb-10 italic text-center">
        “{randomPhrase}”
      </p>

      {/* Créditos */}
      <p className="text-lg text-gray-600 mb-8 text-center">
        Feito por: Maria, Clara.
      </p>

      {/* Botão para reiniciar o quiz */}
      <button
        onClick={onRestart}
        className="
          px-6 py-3 
          bg-blue-600 text-white 
          rounded-lg text-lg 
          hover:bg-blue-700 
          transition duration-300
        "
      >
        Reiniciar Quiz
      </button>
    </div>
  );
}
