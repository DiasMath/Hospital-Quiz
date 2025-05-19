import React from 'react';
import { motion } from 'framer-motion';

/**
 * Componente que exibe uma barra de progresso com animação e valor fixo no centro.
 * @param {number} step - Índice atual da pergunta respondida.
 * @param {number} total - Total de perguntas.
 */
export default function ProgressBar({ step, total }) {
  // Calcula a porcentagem de conclusão (integer entre 0 e 100)
  const percent = Math.round((step / total) * 100);

  return (
    // Container da barra com posição relativa para posicionar o texto centralizado
    <div className="w-full bg-gray-200 h-6 rounded-full  relative">
      {/* 
        Motion.div anima a largura da barra preenchida 
        initial: largura 0 no primeiro render
        animate: largura proporcional à percentagem
      */}
      <motion.div
        className="h-6 rounded-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5 }}
      />
      
      {/*
        Texto de porcentagem absoluto, centralizado sobre a barra.
        pointer-events-none garante que não interfira em cliques.
      */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-sm font-medium pointer-events-none">
        {percent}%
      </div>
    </div>
  );
}
