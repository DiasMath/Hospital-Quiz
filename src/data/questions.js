const questions = [
  {
    phaseText: "Fase 1: Pré-operatório",
    question: "Qual é uma das atribuições do técnico de enfermagem no preparo do paciente para a cirurgia?",
    options: [
      "Realizar a punção venosa e solicitar exames laboratoriais",
      "Retirar adornos, auxiliar na higiene e verificar sinais vitais",
      "Prescrever medicamentos e garantir o jejum",
      "Realizar anestesia e posicionar o paciente na mesa cirúrgica"
    ],
    correctIndex: 1,
    imageUrl: "/assets/question_01.jpg",
  },
  {
    phaseText: "Fase 2: Transoperatório (transporte e chegada no centro cirúrgico)",
    question: "Durante o transporte do paciente ao centro cirúrgico, o técnico de enfermagem deve:",
    options: [
      "Levar o prontuário, aplicar anestesia e colocar avental cirúrgico",
      "Garantir a identificação do paciente, manter segurança e levar o prontuário",
      "Posicionar o paciente e realizar checagem do material cirúrgico",
      "Informar familiares sobre o tempo de cirurgia e aplicar medicação pré-anestésica"
    ],
    correctIndex: 1,
    imageUrl: "/assets/question_02.jpg",
  },
  {
    phaseText: "URGENTE: Pergunta Surpresa",
    question: "Durante o transplante pulmonar de Stella, ela desenvolveu uma trombose e precisou ser anticoagulada. No entanto, ela possui uma condição que a impede de usar qual anticoagulante que foi informado em sua ficha de pré-operatório?",
    options: [
      "Fondaparinux (Arixtra)",
      "Bivalirudina",
      "Heparina",
      "Argatroban"
    ],
    correctIndex: 2, // Heparina
    imageUrl: "/assets/question_03.jpg",
    isUrgent: true, // Marca esta pergunta como urgente
  },
  {
    phaseText: "Fase 3: Intraoperatório/Transoperatório (durante a cirurgia)",
    question: "No centro cirúrgico, o técnico de enfermagem circulante é responsável por:",
    options: [
      "Passar os instrumentos diretamente ao cirurgião",
      "Manter o campo estéril e controlar os sinais vitais",
      "Monitorar o paciente e auxiliar no fechamento da incisão",
      "Abrir materiais estéreis e auxiliar a equipe mantendo a assepsia"
    ],
    correctIndex: 3,
    imageUrl: "/assets/question_03.jpg",
  },
  {
    phaseText: "Fase 4: Pós-operatório (sala de recuperação ou retorno à unidade)",
    question: "Na recuperação pós-anestésica, o técnico de enfermagem deve:",
    options: [
      "Liberar o paciente após 30 minutos e registrar a alta no prontuário",
      "Avaliar sinais vitais, nível de consciência e presença de dor",
      "Aplicar medicamentos e realizar curativo imediatamente",
      "Retirar o acesso venoso e oferecer alimentação sólida"
    ],
    correctIndex: 1,
    imageUrl: "/assets/question_04.jpg",
  },
];

export default questions;
