const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = [];
let gameStarted = false;
let votes = {}; // Almacenar votos

// --- BASE DE DATOS DE PALABRAS (EDICIÓN MEGA) ---
const words = [
    // --- MARCAS (NUEVO) ---
    { cat: "Marca", word: "Coca-Cola" }, { cat: "Marca", word: "McDonald's" },
    { cat: "Marca", word: "Nike" }, { cat: "Marca", word: "Adidas" },
    { cat: "Marca", word: "Apple" }, { cat: "Marca", word: "Samsung" },
    { cat: "Marca", word: "Disney" }, { cat: "Marca", word: "Netflix" },
    { cat: "Marca", word: "Google" }, { cat: "Marca", word: "Tesla" },
    { cat: "Marca", word: "Starbucks" }, { cat: "Marca", word: "Amazon" },
    { cat: "Marca", word: "Nintendo" }, { cat: "Marca", word: "PlayStation" },
    { cat: "Marca", word: "YouTube" }, { cat: "Marca", word: "Facebook" },
    { cat: "Marca", word: "Ferrari" }, { cat: "Marca", word: "Pepsi" },
    { cat: "Marca", word: "Zara" }, { cat: "Marca", word: "Oxxo" },

    // --- PERSONAJES (NUEVO) ---
    { cat: "Personaje", word: "Batman" }, { cat: "Personaje", word: "Spider-Man" },
    { cat: "Personaje", word: "Harry Potter" }, { cat: "Personaje", word: "Goku" },
    { cat: "Personaje", word: "Mickey Mouse" }, { cat: "Personaje", word: "Bob Esponja" },
    { cat: "Personaje", word: "Mario Bros" }, { cat: "Personaje", word: "Barbie" },
    { cat: "Personaje", word: "Shrek" }, { cat: "Personaje", word: "El Chavo del 8" },
    { cat: "Personaje", word: "Iron Man" }, { cat: "Personaje", word: "Darth Vader" },
    { cat: "Personaje", word: "Homero Simpson" }, { cat: "Personaje", word: "Pikachu" },
    { cat: "Personaje", word: "Superman" },

    // --- DEPORTES (NUEVO) ---
    { cat: "Deporte", word: "Fútbol" }, { cat: "Deporte", word: "Basquetbol" },
    { cat: "Deporte", word: "Tenis" }, { cat: "Deporte", word: "Boxeo" },
    { cat: "Deporte", word: "Natación" }, { cat: "Deporte", word: "Béisbol" },
    { cat: "Deporte", word: "Voleibol" }, { cat: "Deporte", word: "Fórmula 1" },
    { cat: "Deporte", word: "Karate" }, { cat: "Deporte", word: "Golf" },

    // --- LUGARES ---
    { cat: "Lugar", word: "Aeropuerto" }, { cat: "Lugar", word: "Cementerio" },
    { cat: "Lugar", word: "Cárcel" }, { cat: "Lugar", word: "Hospital" },
    { cat: "Lugar", word: "Biblioteca" }, { cat: "Lugar", word: "Gimnasio" },
    { cat: "Lugar", word: "Zoológico" }, { cat: "Lugar", word: "Circo" },
    { cat: "Lugar", word: "Cine" }, { cat: "Lugar", word: "Playa" },
    { cat: "Lugar", word: "Montaña" }, { cat: "Lugar", word: "Desierto" },
    { cat: "Lugar", word: "Estadio" }, { cat: "Lugar", word: "Supermercado" },
    { cat: "Lugar", word: "Iglesia" }, { cat: "Lugar", word: "Escuela" },
    { cat: "Lugar", word: "Banco" }, { cat: "Lugar", word: "Discoteca" },
    { cat: "Lugar", word: "Museo" }, { cat: "Lugar", word: "Restaurante" },
    { cat: "Lugar", word: "Hotel" }, { cat: "Lugar", word: "Estación de Policía" },
    { cat: "Lugar", word: "Espacio Exterior" }, { cat: "Lugar", word: "Submarino" },
    
    // --- COMIDA ---
    { cat: "Comida", word: "Sushi" }, { cat: "Comida", word: "Hamburguesa" },
    { cat: "Comida", word: "Pizza" }, { cat: "Comida", word: "Tacos" },
    { cat: "Comida", word: "Helado" }, { cat: "Comida", word: "Chocolate" },
    { cat: "Comida", word: "Huevo" }, { cat: "Comida", word: "Sopa" },
    { cat: "Comida", word: "Pollo Frito" }, { cat: "Comida", word: "Pescado" },
    { cat: "Comida", word: "Espagueti" }, { cat: "Comida", word: "Pastel" },
    { cat: "Comida", word: "Hot Dog" }, { cat: "Comida", word: "Cereal" },
    { cat: "Comida", word: "Paella" }, { cat: "Comida", word: "Queso" },
    { cat: "Comida", word: "Sandwich" }, { cat: "Comida", word: "Palomitas" },
    
    // --- ANIMALES ---
    { cat: "Animal", word: "Elefante" }, { cat: "Animal", word: "Jirafa" },
    { cat: "Animal", word: "León" }, { cat: "Animal", word: "Tiburón" },
    { cat: "Animal", word: "Pingüino" }, { cat: "Animal", word: "Serpiente" },
    { cat: "Animal", word: "Araña" }, { cat: "Animal", word: "Perro" },
    { cat: "Animal", word: "Gato" }, { cat: "Animal", word: "Ratón" },
    { cat: "Animal", word: "Caballo" }, { cat: "Animal", word: "Vaca" },
    { cat: "Animal", word: "Cerdo" }, { cat: "Animal", word: "Gallina" },
    { cat: "Animal", word: "Mono" }, { cat: "Animal", word: "Delfín" },
    
    // --- OBJETOS ---
    { cat: "Objeto", word: "Teléfono" }, { cat: "Objeto", word: "Computadora" },
    { cat: "Objeto", word: "Cama" }, { cat: "Objeto", word: "Inodoro" },
    { cat: "Objeto", word: "Zapatos" }, { cat: "Objeto", word: "Gafas de Sol" },
    { cat: "Objeto", word: "Reloj" }, { cat: "Objeto", word: "Llaves" },
    { cat: "Objeto", word: "Paraguas" }, { cat: "Objeto", word: "Mochila" },
    { cat: "Objeto", word: "Guitarra" }, { cat: "Objeto", word: "Pelota" },
    { cat: "Objeto", word: "Espejo" }, { cat: "Objeto", word: "Cuchillo" },
    { cat: "Objeto", word: "Televisión" }, { cat: "Objeto", word: "Cámara" },
    
    // --- PROFESIONES ---
    { cat: "Profesión", word: "Doctor" }, { cat: "Profesión", word: "Policía" },
    { cat: "Profesión", word: "Bombero" }, { cat: "Profesión", word: "Maestro" },
    { cat: "Profesión", word: "Payaso" }, { cat: "Profesión", word: "Astronauta" },
    { cat: "Profesión", word: "Futbolista" }, { cat: "Profesión", word: "Presidente" },
    { cat: "Profesión", word: "Cocinero" }, { cat: "Profesión", word: "Juez" },
    { cat: "Profesión", word: "Mecánico" }, { cat: "Profesión", word: "Cantante" },
    { cat: "Profesión", word: "Ladrón" }, { cat: "Profesión", word: "Youtuber" },

    // --- TRANSPORTE ---
    { cat: "Transporte", word: "Avión" }, { cat: "Transporte", word: "Helicóptero" },
    { cat: "Transporte", word: "Barco" }, { cat: "Transporte", word: "Bicicleta" },
    { cat: "Transporte", word: "Tren" }, { cat: "Transporte", word: "Autobús" },
    { cat: "Transporte", word: "Patines" }, { cat: "Transporte", word: "Globo Aerostático" },
    { cat: "Transporte", word: "Uber" }, { cat: "Transporte", word: "Moto" }
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

  // Identificar al Host
  socket.on("iAmHost", () => {
    socket.join("hostRoom");
  });

  // Iniciar la lógica del juego
  socket.on("startGameLogic", () => {
      if (players.length < 1) return; // Mínimo 3 jugadores
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

  // --- SISTEMA DE VOTACIÓN ---
  socket.on("startVoting", () => {
    votes = {}; // Reiniciar votos
    io.emit("votingPhaseStarted", players);
  });

  socket.on("castVote", (voteForName) => {
    votes[socket.id] = voteForName;
    
    const totalVotes = Object.keys(votes).length;
    // Enviar progreso al Host
    io.to("hostRoom").emit("updateVoteCount", { 
      current: totalVotes, 
      total: players.length 
    });

    // Si todos votaron
    if (totalVotes === players.length) {
      let counts = {};
      let maxVotes = 0;
      let expelled = "";
  
      Object.values(votes).forEach(name => {
        counts[name] = (counts[name] || 0) + 1;
        if (counts[name] > maxVotes) {
          maxVotes = counts[name];
          expelled = name;
        }
      });
      io.emit("votingCompleted", { expelled: expelled });
    }
  });

  socket.on("resetGame", () => {
    gameStarted = false;
    votes = {};
    io.emit("resetClient");
  });

  socket.on("disconnect", () => {
    players = players.filter((p) => p.id !== socket.id);
    io.emit("updatePlayerList", players);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor listo en el puerto ${PORT}`);
});