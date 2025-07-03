# Hospital Quiz - Multiplayer

Um quiz interativo sobre procedimentos hospitalares com funcionalidade multiplayer para competição entre dois jogadores.

## 🎮 Funcionalidades

### Modo Single Player
- Quiz individual com 4 perguntas sobre procedimentos hospitalares
- Timer de 30 segundos por pergunta
- Sistema de pontuação e ranking
- Animações e efeitos visuais

### Modo Multiplayer
- **Competição em tempo real** entre dois jogadores
- **Sincronização via localStorage** entre abas diferentes
- **Primeiro a responder todas as perguntas vence**
- **Visualização do progresso do oponente** em tempo real
- **Sistema de IDs únicos** para cada jogo

## 🚀 Como Jogar Multiplayer

### Para o Primeiro Jogador (Criador do Jogo):
1. Abra o quiz no navegador
2. Digite seu nome
3. Selecione "Multiplayer"
4. Clique em "Criar Novo Jogo"
5. Clique em "Criar Jogo Multiplayer"
6. **Copie o ID do jogo** que aparecerá na tela de espera
7. **Compartilhe o ID** com o segundo jogador

### Para o Segundo Jogador:
1. Abra o quiz em uma **nova aba** do navegador
2. Digite seu nome
3. Selecione "Multiplayer"
4. Clique em "Entrar em Jogo Existente"
5. **Cole o ID do jogo** fornecido pelo primeiro jogador
6. Clique em "Entrar no Jogo"

### Durante o Jogo:
- Ambos os jogadores verão o progresso um do outro em tempo real
- O primeiro a responder todas as 4 perguntas vence
- Se ambos terminarem com a mesma pontuação, é considerado empate
- O resultado final mostra quem venceu e as pontuações

## 🛠️ Tecnologias Utilizadas

- **React** - Framework principal
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **localStorage** - Sincronização multiplayer

## 📁 Estrutura do Projeto

```
Hospital-Quiz/
├── src/
│   ├── components/
│   │   ├── StartScreen.jsx      # Tela inicial com seleção de modo
│   │   ├── QuestionScreen.jsx   # Tela das perguntas
│   │   ├── Result.jsx          # Tela de resultado
│   │   └── ...                 # Outros componentes
│   ├── data/
│   │   └── questions.js        # Banco de perguntas
│   └── App.jsx                 # Componente principal com lógica multiplayer
├── public/
│   └── assets/                 # Imagens do quiz
└── package.json
```

## 🎯 Perguntas do Quiz

O quiz contém 4 perguntas sobre procedimentos hospitalares:

1. **Fase 1: Pré-operatório** - Preparo do paciente
2. **Fase 2: Transoperatório** - Transporte ao centro cirúrgico
3. **Fase 3: Intraoperatório** - Durante a cirurgia
4. **Fase 4: Pós-operatório** - Recuperação pós-anestésica

## 🔧 Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   npm run dev
   ```
4. Abra o navegador em `http://localhost:5173`

## 🎨 Características Visuais

- **Design responsivo** para diferentes tamanhos de tela
- **Animações suaves** com Framer Motion
- **Imagens de fundo** específicas para cada pergunta
- **Interface intuitiva** com feedback visual
- **Cores temáticas** relacionadas ao ambiente hospitalar

## 👥 Autores

- **Nayana Araújo**
- **Gabriele**
- **Maysa**

## 📝 Notas Técnicas

- O sistema multiplayer usa `localStorage` para sincronização
- Estados antigos são automaticamente limpos após 5 minutos
- Cada jogo tem um ID único para evitar conflitos
- O sistema detecta automaticamente quando um jogador termina primeiro

## 🎉 Divirta-se!

Agora você pode competir com amigos em tempo real no quiz hospitalar! Quem será o mais rápido e preciso?
