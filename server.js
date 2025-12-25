const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = [];
let gameStarted = false;

// Palabras para el juego (Más de 100 opciones)
const words = [
    // --- LUGARES ---
    { cat: "Lugar", word: "Aeropuerto" },
    { cat: "Lugar", word: "Cementerio" },
    { cat: "Lugar", word: "Cárcel" },
    { cat: "Lugar", word: "Hospital" },
    { cat: "Lugar", word: "Biblioteca" },
    { cat: "Lugar", word: "Gimnasio" },
    { cat: "Lugar", word: "Zoológico" },
    { cat: "Lugar", word: "Circo" },
    { cat: "Lugar", word: "Cine" },
    { cat: "Lugar", word: "Playa" },
    { cat: "Lugar", word: "Montaña" },
    { cat: "Lugar", word: "Desierto" },
    { cat: "Lugar", word: "Estadio de Fútbol" },
    { cat: "Lugar", word: "Supermercado" },
    { cat: "Lugar", word: "Iglesia" },
    { cat: "Lugar", word: "Escuela" },
    { cat: "Lugar", word: "Banco" },
    { cat: "Lugar", word: "Discoteca" },
    { cat: "Lugar", word: "Museo" },
    { cat: "Lugar", word: "Restaurante" },
    { cat: "Lugar", word: "Hotel" },
    { cat: "Lugar", word: "Peluquería" },
    { cat: "Lugar", word: "Estación de Policía" },
    { cat: "Lugar", word: "Espacio Exterior" },
    { cat: "Lugar", word: "Submarino" },

    // --- COMIDA ---
    { cat: "Comida", word: "Sushi" },
    { cat: "Comida", word: "Hamburguesa" },
    { cat: "Comida", word: "Pizza" },
    { cat: "Comida", word: "Tacos" },
    { cat: "Comida", word: "Helado" },
    { cat: "Comida", word: "Chocolate" },
    { cat: "Comida", word: "Huevo" },
    { cat: "Comida", word: "Sopa" },
    { cat: "Comida", word: "Ensalada" },
    { cat: "Comida", word: "Pollo Frito" },
    { cat: "Comida", word: "Pescado" },
    { cat: "Comida", word: "Espagueti" },
    { cat: "Comida", word: "Pastel" },
    { cat: "Comida", word: "Hot Dog" },
    { cat: "Comida", word: "Cereal" },
    { cat: "Comida", word: "Paella" },
    { cat: "Comida", word: "Queso" },
    { cat: "Comida", word: "Sandwich" },
    { cat: "Comida", word: "Palomitas" },
    { cat: "Comida", word: "Café" },

    // --- ANIMALES ---
    { cat: "Animal", word: "Elefante" },
    { cat: "Animal", word: "Jirafa" },
    { cat: "Animal", word: "León" },
    { cat: "Animal", word: "Tiburón" },
    { cat: "Animal", word: "Pingüino" },
    { cat: "Animal", word: "Serpiente" },
    { cat: "Animal", word: "Araña" },
    { cat: "Animal", word: "Perro" },
    { cat: "Animal", word: "Gato" },
    { cat: "Animal", word: "Ratón" },
    { cat: "Animal", word: "Caballo" },
    { cat: "Animal", word: "Vaca" },
    { cat: "Animal", word: "Cerdo" },
    { cat: "Animal", word: "Gallina" },
    { cat: "Animal", word: "Mono" },
    { cat: "Animal", word: "Delfín" },
    { cat: "Animal", word: "Águila" },
    { cat: "Animal", word: "Murciélago" },
    { cat: "Animal", word: "Oso" },
    { cat: "Animal", word: "Mosquito" },

    // --- OBJETOS ---
    { cat: "Objeto", word: "Teléfono" },
    { cat: "Objeto", word: "Computadora" },
    { cat: "Objeto", word: "Cama" },
    { cat: "Objeto", word: "Inodoro" },
    { cat: "Objeto", word: "Cepillo de Dientes" },
    { cat: "Objeto", word: "Zapatos" },
    { cat: "Objeto", word: "Gafas de Sol" },
    { cat: "Objeto", word: "Reloj" },
    { cat: "Objeto", word: "Llaves" },
    { cat: "Objeto", word: "Paraguas" },
    { cat: "Objeto", word: "Mochila" },
    { cat: "Objeto", word: "Guitarra" },
    { cat: "Objeto", word: "Pelota" },
    { cat: "Objeto", word: "Libro" },
    { cat: "Objeto", word: "Espejo" },
    { cat: "Objeto", word: "Cuchillo" },
    { cat: "Objeto", word: "Silla" },
    { cat: "Objeto", word: "Televisión" },
    { cat: "Objeto", word: "Cámara" },
    { cat: "Objeto", word: "Anillo" },

    // --- PROFESIONES ---
    { cat: "Profesión", word: "Doctor" },
    { cat: "Profesión", word: "Policía" },
    { cat: "Profesión", word: "Bombero" },
    { cat: "Profesión", word: "Maestro" },
    { cat: "Profesión", word: "Payaso" },
    { cat: "Profesión", word: "Astronauta" },
    { cat: "Profesión", word: "Futbolista" },
    { cat: "Profesión", word: "Presidente" },
    { cat: "Profesión", word: "Cocinero" },
    { cat: "Profesión", word: "Juez" },
    { cat: "Profesión", word: "Mecánico" },
    { cat: "Profesión", word: "Cantante" },
    { cat: "Profesión", word: "Ladrón" },
    { cat: "Profesión", word: "Mago" },
    { cat: "Profesión", word: "Granjero" },

    // --- TRANSPORTE ---
    { cat: "Transporte", word: "Avión" },
    { cat: "Transporte", word: "Helicóptero" },
    { cat: "Transporte", word: "Barco" },
    { cat: "Transporte", word: "Bicicleta" },
    { cat: "Transporte", word: "Tren" },
    { cat: "Transporte", word: "Autobús" },
    { cat: "Transporte", word: "Patines" },
    { cat: "Transporte", word: "Globo Aerostático" },
    { cat: "Transporte", word: "Caballo" },
    { cat: "Transporte", word: "Ambulancia" }
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