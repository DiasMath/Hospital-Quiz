const questions = [
  {
    phaseText: "Fase 1: Pré-operatório",
    question: "Qual é uma das atribuições do técnico de enfermagem no preparo do paciente para a cirurgia?",
    options: [
      "a) Realizar a punção venosa e solicitar exames laboratoriais",
      "b) Retirar adornos, auxiliar na higiene e verificar sinais vitais",
      "c) Prescrever medicamentos e garantir o jejum",
      "d) Realizar anestesia e posicionar o paciente na mesa cirúrgica"
    ],
    correctIndex: 1,
    imageUrl: "/assets/question_01.jpg",
  },
  {
    phaseText: "Fase 2: Transoperatório (transporte e chegada no centro cirúrgico)",
    question: "Durante o transporte do paciente ao centro cirúrgico, o técnico de enfermagem deve:",
    options: [
      "a) Levar o prontuário, aplicar anestesia e colocar avental cirúrgico",
      "b) Garantir a identificação do paciente, manter segurança e levar o prontuário",
      "c) Posicionar o paciente e realizar checagem do material cirúrgico",
      "d) Informar familiares sobre o tempo de cirurgia e aplicar medicação pré-anestésica"
    ],
    correctIndex: 1,
    imageUrl: "/assets/question_02.jpg",
  },
  {
    phaseText: "Fase 3: Intraoperatório/Transoperatório (durante a cirurgia)",
    question: "No centro cirúrgico, o técnico de enfermagem circulante é responsável por:",
    options: [
      "a) Passar os instrumentos diretamente ao cirurgião",
      "b) Manter o campo estéril e controlar os sinais vitais",
      "c) Monitorar o paciente e auxiliar no fechamento da incisão",
      "d) Abrir materiais estéreis e auxiliar a equipe mantendo a assepsia"
    ],
    correctIndex: 3,
    imageUrl: "/assets/question_03.jpg",
  },
  {
    phaseText: "Fase 4: Pós-operatório (sala de recuperação ou retorno à unidade)",
    question: "Na recuperação pós-anestésica, o técnico de enfermagem deve:",
    options: [
      "a) Liberar o paciente após 30 minutos e registrar a alta no prontuário",
      "b) Avaliar sinais vitais, nível de consciência e presença de dor",
      "c) Aplicar medicamentos e realizar curativo imediatamente",
      "d) Retirar o acesso venoso e oferecer alimentação sólida"
    ],
    correctIndex: 1,
    imageUrl: "/assets/question_04.jpg",
  },
];

export default questions;
