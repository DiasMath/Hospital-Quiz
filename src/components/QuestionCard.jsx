import React from 'react';
import { motion } from 'framer-motion';

/**
 * Componente de pergunta.
 *
 * Props:
 * - question.phaseText: texto da fase customizado
 * - question.question: enunciado da pergunta
 * - question.options: array de opções
 * - question.correctIndex: índice da opção correta
 * - onAnswer: callback passando true/false
 */
export default function QuestionCard({ question, onAnswer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="
        bg-white p-6 rounded-2xl shadow-lg
        w-full h-full flex flex-col overflow-auto
      "
    >


      {/* Pergunta principal centralizada */}
      <h2 className="text-3xl font-semibold mb-6 text-center">
        {question.question}
      </h2>

      {/* Opções de resposta */}
      <div className="space-y-4 flex-grow">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(idx === question.correctIndex)}
            className="
              w-full text-left p-5 text-lg
              bg-gray-100 hover:bg-gray-200
              rounded-lg transition
            "
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
