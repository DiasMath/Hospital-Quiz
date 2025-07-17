import { ref, set, update, onValue } from "firebase/database";
import { db } from "./firebase";

// Criar sala
export function createRoom(roomId, playerName) {
  set(ref(db, 'rooms/' + roomId), {
    players: { [playerName]: { ready: false, step: 0, score: 0, finished: false } },
    state: "waiting",
    quizStep: 0,
    quizState: "waiting"
  });
}

// Entrar na sala
export function joinRoom(roomId, playerName) {
  update(ref(db, 'rooms/' + roomId + '/players'), {
    [playerName]: { ready: false, step: 0, score: 0, finished: false }
  });
}

// Escutar mudanças na sala
export function listenRoom(roomId, callback) {
  onValue(ref(db, 'rooms/' + roomId), (snapshot) => {
    callback(snapshot.val());
  });
}

// Atualizar progresso do jogador
export function updatePlayerProgress(roomId, playerName, data) {
  return update(ref(db, `rooms/${roomId}/players/${playerName}`), data);
}

// Atualizar passo global do quiz
export function updateQuizStep(roomId, quizStep) {
  return update(ref(db, `rooms/${roomId}`), { quizStep });
}

// Marcar jogador como finalizado
export function finishPlayer(roomId, playerName, data) {
  return update(ref(db, `rooms/${roomId}/players/${playerName}`), { ...data, finished: true });
} 