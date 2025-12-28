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
            hostId: socket.id,
            category: '' // Guardamos la categoría actual
        };
        socket.join(roomCode);
        socket.roomCode = roomCode;
        socket.emit("gameCreated", roomCode);
    });

    // 2. UNIRSE O RE-CONECTARSE
    socket.on("joinGame", ({ name, roomCode }) => {
        roomCode = roomCode.toUpperCase();
        const room = games[roomCode];

        if (!room) {
            socket.emit("errorMsg", "Esa sala no existe.");
            return;
        }

        // Buscar si el jugador ya existía (por nombre)
        const existingPlayer = room.players.find(p => p.name === name);

        if (existingPlayer) {
            // --- LÓGICA DE RECONEXIÓN ---
            // Actualizamos su ID de socket porque el viejo ya murió
            existingPlayer.id = socket.id;
            existingPlayer.connected = true;
            
            socket.join(roomCode);
            socket.roomCode = roomCode;
            socket.username = name; // Guardar nombre en el socket para desconexiones futuras

            // Si el juego ya empezó, le devolvemos su rol
            if (room.started) {
                if (existingPlayer.role === "Impostor") {
                    socket.emit("roleAssign", { role: "Impostor", category: room.category, start: "..." });
                } else {
                    socket.emit("roleAssign", { role: "Ciudadano", category: room.category, word: room.secret, start: "..." });
                }
            } else {
                // Si estamos en el lobby, avisar que volvió
                socket.emit("updatePlayerList", room.players);
            }
        } else {
            // --- JUGADOR NUEVO ---
            if (room.started) {
                socket.emit("errorMsg", "La partida ya empezó.");
                return;
            }

            const player = { 
                id: socket.id, 
                name: name, 
                role: "citizen", 
                connected: true 
            };
            room.players.push(player);
            
            socket.join(roomCode);
            socket.roomCode = roomCode;
            socket.username = name;
        }

        io.to(roomCode).emit("updatePlayerList", room.players);
    });

    // 3. INICIAR JUEGO
    socket.on("startGameLogic", () => {
        const code = socket.roomCode;
        const room = games[code];
        if(!room) return;

        // Filtrar solo jugadores conectados para asignar roles
        const activePlayers = room.players.filter(p => p.connected);
        
        if (activePlayers.length < 1) return; // Mínimo 1 para pruebas

        room.started = true;
        
        const selected = words[Math.floor(Math.random() * words.length)];
        room.secret = selected.word;
        room.category = selected.cat; // Guardar para reconexiones

        const imposterIndex = Math.floor(Math.random() * activePlayers.length);
        const startingPlayer = activePlayers[Math.floor(Math.random() * activePlayers.length)].name;

        activePlayers.forEach((p, index) => {
            // Actualizamos el objeto jugador original en la lista general
            const originalPlayer = room.players.find(pl => pl.name === p.name);
            
            if (index === imposterIndex) {
                originalPlayer.role = "Impostor";
                io.to(p.id).emit("roleAssign", { role: "Impostor", category: selected.cat, start: startingPlayer });
            } else {
                originalPlayer.role = "Ciudadano";
                io.to(p.id).emit("roleAssign", { role: "Ciudadano", category: selected.cat, word: selected.word, start: startingPlayer });
            }
        });

        io.to(code).emit("gameStartedMain", { category: selected.cat, start: startingPlayer });
    });

    // 4. VOTACIONES
    socket.on("startVoting", () => {
        const code = socket.roomCode;
        if(games[code]) {
            games[code].votes = {};
            // Enviamos la lista completa, incluso desconectados, por si vuelven justo a tiempo
            io.to(code).emit("votingPhaseStarted", games[code].players);
        }
    });

    socket.on("castVote", (voteForName) => {
        const code = socket.roomCode;
        const room = games[code];
        if(!room) return;

        // Verificar que el jugador tenga rol (que sea parte del juego)
        const player = room.players.find(p => p.id === socket.id);
        if(!player) return;

        room.votes[player.name] = voteForName; // Usamos nombre como clave para evitar problemas de ID

        // Contamos cuántos jugadores *activos* hay vs votos recibidos
        const activeCount = room.players.filter(p => p.connected).length;
        const votesCount = Object.keys(room.votes).length;
        
        io.to(room.hostId).emit("updateVoteCount", { 
            current: votesCount, 
            total: activeCount 
        });

        // Si ya votaron todos los conectados
        if (votesCount >= activeCount) {
            let counts = {};
            let maxVotes = 0;

            Object.values(room.votes).forEach(name => {
                counts[name] = (counts[name] || 0) + 1;
                if (counts[name] > maxVotes) maxVotes = counts[name];
            });

            let candidates = Object.keys(counts).filter(name => counts[name] === maxVotes);
            let expelled = "";
            let isTie = false;

            if (candidates.length > 1) {
                isTie = true;
                expelled = candidates[Math.floor(Math.random() * candidates.length)];
            } else {
                expelled = candidates[0];
            }
            
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
            // Limpiar roles
            room.players.forEach(p => p.role = "citizen");
            io.to(code).emit("resetClient");
        }
    });

    // 6. DESCONEXIÓN SUAVE
    socket.on("disconnect", () => {
        const code = socket.roomCode;
        if(code && games[code]) {
            // Si es el HOST, borramos la sala
            if(games[code].hostId === socket.id) {
                delete games[code];
                return;
            }

            // Si es un JUGADOR, solo marcamos como desconectado
            const player = games[code].players.find(p => p.id === socket.id);
            if (player) {
                player.connected = false;
                
                // Opción: Si quieres borrarlos del lobby pero NO de la partida iniciada:
                if (!games[code].started) {
                    // Si no ha empezado, lo borramos tras 5 segundos si no vuelve
                    setTimeout(() => {
                        const currentRoom = games[code];
                        // Verificar si sigue existiendo y si sigue desconectado
                        if (currentRoom) {
                           const p = currentRoom.players.find(pl => pl.name === player.name);
                           if (p && !p.connected && !currentRoom.started) {
                               currentRoom.players = currentRoom.players.filter(pl => pl.name !== player.name);
                               io.to(code).emit("updatePlayerList", currentRoom.players);
                           }
                        }
                    }, 5000);
                }
                
                // Avisamos visualmente que alguien se fue (opcional, pero ayuda al Host)
                // io.to(code).emit("playerDisconnected", player.name); 
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor listo en el puerto ${PORT}`);
});