const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = [];
let gameStarted = false;

// Palabras para el juego
const words = [
  { cat: "Lugar", word: "Playa" }, { cat: "Lugar", word: "Cine" },
  { cat: "Comida", word: "Pizza" }, { cat: "Comida", word: "Tacos" },
  { cat: "Animal", word: "Perro" }, { cat: "Objeto", word: "Teléfono" },
  { cat: "Profesión", word: "Doctor" }, { cat: "Lugar", word: "Escuela" }
];

io.on("connection", (socket) => {
  // Alguien entra al juego
  socket.on("joinGame", (name) => {
    if (gameStarted) {
      socket.emit("errorMsg", "El juego ya empezó.");
      return;
    }
    const player = { id: socket.id, name: name, role: "citizen" };
    players.push(player);
    io.emit("updatePlayerList", players);
  });

  // El Host inicia la partida
  socket.on("startGame", () => {
    if (players.length < 3) return;
    gameStarted = true;

    const selected = words[Math.floor(Math.random() * words.length)];
    const imposterIndex = Math.floor(Math.random() * players.length);
    const startingPlayer = players[Math.floor(Math.random() * players.length)].name;

    players.forEach((p, index) => {
      if (index === imposterIndex) {
        io.to(p.id).emit("roleAssign", { role: "Impostor", category: selected.cat, start: startingPlayer });
      } else {
        io.to(p.id).emit("roleAssign", { role: "Ciudadano", category: selected.cat, word: selected.word, start: startingPlayer });
      }
    });

    io.emit("gameStartedMain", { category: selected.cat, start: startingPlayer });
  });

  socket.on("resetGame", () => {
    gameStarted = false;
    io.emit("resetClient");
  });

  socket.on("disconnect", () => {
    players = players.filter((p) => p.id !== socket.id);
    io.emit("updatePlayerList", players);
  });
});

// IMPORTANTE: Glitch nos asigna un puerto automáticamente
const listener = http.listen(process.env.PORT, () => {
  console.log("Tu app está lista en el puerto " + listener.address().port);
});