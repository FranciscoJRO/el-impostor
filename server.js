const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

// --- BASE DE DATOS DE SALAS ---
// Aquí guardamos todas las partidas activas
// Formato: { "ABCD": { players: [], started: false, ... } }
const games = {}; 

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

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

io.on("connection", (socket) => {
    
    // 1. CREAR SALA
    socket.on("createGame", () => {
        const roomCode = makeId(4);
        games[roomCode] = { 
            players: [], 
            started: false, 
            votes: {}, 
            secret: '', 
            hostId: socket.id 
        };
        socket.join(roomCode);
        socket.roomCode = roomCode;
        socket.emit("gameCreated", roomCode);
    });

    // 2. UNIRSE A SALA
    socket.on("joinGame", ({ name, roomCode }) => {
        roomCode = roomCode.toUpperCase();
        const room = games[roomCode];

        if (!room) {
            socket.emit("errorMsg", "Esa sala no existe.");
            return;
        }
        if (room.started) {
            socket.emit("errorMsg", "La partida ya empezó.");
            return;
        }

        const player = { id: socket.id, name: name, role: "citizen" };
        room.players.push(player);
        
        socket.join(roomCode);
        socket.roomCode = roomCode;

        io.to(roomCode).emit("updatePlayerList", room.players);
    });

    // 3. INICIAR JUEGO
    socket.on("startGameLogic", () => {
        const code = socket.roomCode;
        const room = games[code];
        if(!room) return;

        if (room.players.length < 1) return; // Mínimo 1 para pruebas

        room.started = true;
        
        const selected = words[Math.floor(Math.random() * words.length)];
        room.secret = selected.word;
        const imposterIndex = Math.floor(Math.random() * room.players.length);
        const startingPlayer = room.players[Math.floor(Math.random() * room.players.length)].name;

        room.players.forEach((p, index) => {
            if (index === imposterIndex) {
                io.to(p.id).emit("roleAssign", { role: "Impostor", category: selected.cat, start: startingPlayer });
            } else {
                io.to(p.id).emit("roleAssign", { role: "Ciudadano", category: selected.cat, word: selected.word, start: startingPlayer });
            }
        });

        io.to(code).emit("gameStartedMain", { category: selected.cat, start: startingPlayer });
    });

    // 4. VOTACIONES CON EMPATE
    socket.on("startVoting", () => {
        const code = socket.roomCode;
        if(games[code]) {
            games[code].votes = {};
            io.to(code).emit("votingPhaseStarted", games[code].players);
        }
    });

    socket.on("castVote", (voteForName) => {
        const code = socket.roomCode;
        const room = games[code];
        if(!room) return;

        room.votes[socket.id] = voteForName;

        const totalVotes = Object.keys(room.votes).length;
        
        io.to(room.hostId).emit("updateVoteCount", { 
            current: totalVotes, 
            total: room.players.length 
        });

        if (totalVotes === room.players.length) {
            // Contar votos
            let counts = {};
            let maxVotes = 0;

            Object.values(room.votes).forEach(name => {
                counts[name] = (counts[name] || 0) + 1;
                if (counts[name] > maxVotes) maxVotes = counts[name];
            });

            // Buscar quiénes empataron con el máximo de votos
            let candidates = Object.keys(counts).filter(name => counts[name] === maxVotes);

            let expelled = "";
            let isTie = false;

            if (candidates.length > 1) {
                // ¡EMPATE! Elegir uno al azar entre los empatados
                isTie = true;
                expelled = candidates[Math.floor(Math.random() * candidates.length)];
            } else {
                expelled = candidates[0];
            }
            
            // Enviamos la lista de candidatos (tiedPlayers) para la ruleta
            io.to(code).emit("votingCompleted", { 
                expelled: expelled, 
                secret: room.secret,
                isTie: isTie,
                tiedPlayers: candidates 
            });
        }
    });

    // 5. REINICIAR
    socket.on("resetGame", () => {
        const code = socket.roomCode;
        const room = games[code];
        if(room) {
            room.started = false;
            room.votes = {};
            io.to(code).emit("resetClient");
        }
    });

    socket.on("disconnect", () => {
        const code = socket.roomCode;
        if(code && games[code]) {
            games[code].players = games[code].players.filter(p => p.id !== socket.id);
            if(games[code].hostId === socket.id) {
                delete games[code];
            } else {
                io.to(code).emit("updatePlayerList", games[code].players);
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor listo en el puerto ${PORT}`);
});