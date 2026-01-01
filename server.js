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
// --- 2. DATOS: FRASE MALDITA (MEGA PACK 50) ---
const frases = [
    // 1-10: Relaciones y Citas
    "Lo peor que puedes decir en una primera cita es: ________.",
    "Mi ex me dejó porque me obsesioné con ________.",
    "El secreto para un matrimonio feliz es mucho ________.",
    "Nunca te acuestes con alguien que tenga ________.",
    "En mi perfil de Tinder puse que soy experto en ________.",
    "El amor es ciego, pero mi suegra es ________.",
    "Lo único que busco en una pareja es ________.",
    "Mi técnica de ligue infalible consiste en usar ________.",
    "Si mi vida amorosa fuera una película, se llamaría: '________'.",
    "Lo más sexy que alguien me ha dicho en el oído fue: ________.",

    // 11-20: Vida Laboral y Escolar
    "La razón real por la que me corrieron de mi trabajo fue: ________.",
    "En mi currículum mentí y dije que sabía hacer ________.",
    "Mi jefe no sabe que paso 4 horas al día viendo ________.",
    "Lo único que aprendí en la universidad fue a ________.",
    "Si fuera maestro, reprobaría a los alumnos que ________.",
    "En una entrevista de trabajo, nunca admitas que te gusta ________.",
    "Mi excusa para no ir a trabajar mañana será: ________.",
    "Lo peor de las juntas por Zoom es cuando se ve mi ________.",
    "Mi superpoder en la oficina es ________.",
    "Para ser millonario solo necesitas vender ________.",

    // 21-30: Secretos y Absurdos
    "Lo que realmente escondo bajo mi cama es: ________.",
    "Mi placer culposo más grande es comer ________ mientras lloro.",
    "No soy alcohólico, solo soy alérgico a ________.",
    "Si fuera invisible por un día, lo primero que haría sería ________.",
    "El título de mi película biográfica sería: '50 Sombras de ________'.",
    "Batman no usa armas, él combate el crimen usando ________.",
    "Para conquistar el mundo, solo necesito un ejército de ________.",
    "Lo único más peligroso que un tiburón es ________.",
    "En el futuro, usaremos ________ en lugar de dinero.",
    "Si me gano la lotería, lo primero que compro es ________.",

    // 31-40: Situaciones Incómodas
    "Nunca entres a un baño público sin llevar ________.",
    "En mi lápida quiero que escriban: 'Aquí yace alguien que amaba ________'.",
    "Lo más vergonzoso que he hecho borracho es ________.",
    "En el funeral, todos se quedaron callados cuando se cayó ________.",
    "El doctor me dijo que dejara de comer ________.",
    "Mi mamá siempre me regañaba por jugar con ________.",
    "Lo peor que te puede pasar en Año Nuevo es ________.",
    "Mi propósito de Año Nuevo es dejar de ________.",
    "Dios creó al hombre, pero el diablo creó a ________.",
    "Lo único que le falta a esta fiesta para ser perfecta es: ________.",

    // 41-50: Random
    "¿Por qué cruzó la gallina la calle? Para conseguir ________.",
    "El ingrediente secreto de la abuela en realidad era ________.",
    "Harry Potter y la cámara de ________.",
    "Lo único que salvaría de un incendio es mi colección de ________.",
    "Antes de morir, quiero probar ________.",
    "Mi religión me prohíbe ________.",
    "Si fuera un animal, sería un ________ con problemas de ira.",
    "No eres tú, es mi ________.",
    "Lo que nadie sabe de mí es que tengo un tercer ________.",
    "La contraseña de mi celular es ________."
];

// --- 3. DATOS: GUERRA DE CEREBROS (MEGA PACK 50) ---
const triviaQuestions = [
    // --- GEOGRAFÍA (1-8) ---
    { q: "¿Cuál es el planeta más grande?", ans: ["Júpiter", "Tierra", "Marte", "Sol"], correct: 0 }, 
    { q: "¿Capital de Francia?", ans: ["Madrid", "París", "Londres", "Roma"], correct: 1 },
    { q: "¿Cuál es el río más largo del mundo?", ans: ["Nilo", "Amazonas", "Misisipi", "Yangtsé"], correct: 1 },
    { q: "¿Qué país tiene forma de bota?", ans: ["España", "Grecia", "Italia", "Portugal"], correct: 2 },
    { q: "¿Dónde está la Torre Eiffel?", ans: ["Italia", "España", "Francia", "Inglaterra"], correct: 2 },
    { q: "¿Capital de Australia?", ans: ["Sídney", "Melbourne", "Canberra", "Perth"], correct: 2 },
    { q: "¿País más grande del mundo?", ans: ["China", "USA", "Rusia", "Canadá"], correct: 2 },
    { q: "¿En qué continente está Egipto?", ans: ["Asia", "Europa", "África", "América"], correct: 2 },

    // --- CIENCIA Y NATURALEZA (9-16) ---
    { q: "¿Cuántos huesos tiene un adulto?", ans: ["206", "300", "150", "250"], correct: 0 },
    { q: "¿Símbolo químico del oro?", ans: ["Ag", "Go", "Fe", "Au"], correct: 3 },
    { q: "¿Animal más rápido del mundo?", ans: ["León", "Águila", "Guepardo", "Halcón"], correct: 3 }, // Halcón peregrino
    { q: "¿Gas principal del aire?", ans: ["Oxígeno", "Nitrógeno", "CO2", "Helio"], correct: 1 },
    { q: "¿Cuántas patas tiene una araña?", ans: ["6", "8", "10", "12"], correct: 1 },
    { q: "¿Qué comen los pandas?", ans: ["Carne", "Bambú", "Pescado", "Insectos"], correct: 1 },
    { q: "¿El sol es...?", ans: ["Un Planeta", "Una Estrella", "Un Asteroide", "Un Satélite"], correct: 1 },
    { q: "¿Qué órgano bombea sangre?", ans: ["Cerebro", "Pulmón", "Hígado", "Corazón"], correct: 3 },

    // --- CINE Y TV (17-24) ---
    { q: "¿Quién vive en una piña?", ans: ["Patricio", "Calamardo", "Bob Esponja", "Arenita"], correct: 2 },
    { q: "¿Villano de Harry Potter?", ans: ["Voldemort", "Sauron", "Joker", "Thanos"], correct: 0 },
    { q: "¿Quién es Tony Stark?", ans: ["Capitán América", "Iron Man", "Batman", "Hulk"], correct: 1 },
    { q: "¿Color del sable de Luke Skywalker?", ans: ["Rojo", "Morado", "Verde/Azul", "Naranja"], correct: 2 }, // Aceptando azul/verde
    { q: "¿Película con más Oscars?", ans: ["Titanic", "Avatar", "Star Wars", "Matrix"], correct: 0 },
    { q: "¿Nombre del ogro verde?", ans: ["Fiona", "Burro", "Shrek", "Farquaad"], correct: 2 },
    { q: "¿De qué país es el Chavo del 8?", ans: ["Colombia", "México", "Argentina", "España"], correct: 1 },
    { q: "¿Quién es el padre de Simba?", ans: ["Scar", "Timón", "Mufasa", "Nala"], correct: 2 },

    // --- HISTORIA Y ARTE (25-32) ---
    { q: "¿Quién pintó la Mona Lisa?", ans: ["Van Gogh", "Picasso", "Da Vinci", "Dalí"], correct: 2 },
    { q: "¿Quién descubrió América?", ans: ["Colón", "Magallanes", "Vespucio", "Cortés"], correct: 0 },
    { q: "¿Año de llegada a la Luna?", ans: ["1959", "1969", "1975", "1980"], correct: 1 },
    { q: "¿Dónde están las pirámides famosas?", ans: ["México", "Perú", "Egipto", "China"], correct: 2 },
    { q: "¿Moneda de la Unión Europea?", ans: ["Dólar", "Libra", "Euro", "Franco"], correct: 2 },
    { q: "¿Quién fue Frida Kahlo?", ans: ["Cantante", "Escritora", "Pintora", "Actriz"], correct: 2 },
    { q: "¿Guerra de 1939 a 1945?", ans: ["1ra Guerra", "2da Guerra", "Vietnam", "Fría"], correct: 1 },
    { q: "¿Libro sagrado del Islam?", ans: ["Biblia", "Torá", "Corán", "Vedas"], correct: 2 },

    // --- DEPORTES (33-40) ---
    { q: "¿Duración partido de fútbol?", ans: ["45 min", "60 min", "90 min", "100 min"], correct: 2 },
    { q: "¿Rey de los deportes?", ans: ["Fútbol", "Béisbol", "Tenis", "Basket"], correct: 1 },
    { q: "¿Cuántos anillos olímpicos hay?", ans: ["4", "5", "6", "7"], correct: 1 },
    { q: "¿País origen del Karate?", ans: ["China", "Corea", "Japón", "Tailandia"], correct: 2 },
    { q: "¿Mejor basquetbolista (23)?", ans: ["LeBron", "Kobe", "Shaq", "Jordan"], correct: 3 },
    { q: "¿Mundial de fútbol cada cuánto?", ans: ["2 años", "3 años", "4 años", "5 años"], correct: 2 },
    { q: "¿En qué deporte se usa 'Touchdown'?", ans: ["Fútbol A.", "Rugby", "Golf", "Tenis"], correct: 0 },
    { q: "¿Quién ganó el mundial 2022?", ans: ["Francia", "Brasil", "Argentina", "Alemania"], correct: 2 },

    // --- TECNOLOGÍA Y CULTURA (41-50) ---
    { q: "¿Quién fundó Microsoft?", ans: ["Steve Jobs", "Bill Gates", "Musk", "Zuckerberg"], correct: 1 },
    { q: "¿Red social del pajarito?", ans: ["Facebook", "Instagram", "Twitter/X", "TikTok"], correct: 2 },
    { q: "¿Buscador más usado?", ans: ["Bing", "Yahoo", "Google", "DuckDuckGo"], correct: 2 },
    { q: "¿Compañía de la manzana?", ans: ["Samsung", "Apple", "LG", "Sony"], correct: 1 },
    { q: "¿Qué significa 'WWW'?", ans: ["World War Web", "World Wide Web", "Web Wide World", "Nada"], correct: 1 },
    { q: "¿Personaje de videojuegos fontanero?", ans: ["Sonic", "Link", "Mario", "Pacman"], correct: 2 },
    { q: "¿Plataforma de videos más famosa?", ans: ["Vimeo", "YouTube", "Twitch", "Netflix"], correct: 1 },
    { q: "¿Qué es un PDF?", ans: ["Imagen", "Video", "Documento", "Audio"], correct: 2 },
    { q: "¿Marca de autos eléctricos de Musk?", ans: ["Ford", "Toyota", "Tesla", "BMW"], correct: 2 },
    { q: "¿Qué inventó Graham Bell?", ans: ["Luz", "Teléfono", "Radio", "Avión"], correct: 1 }
];
function makeId(length) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for ( let i = 0; i < length; i++ ) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}

io.on("connection", (socket) => {
    
    // CREAR SALA
    socket.on("createGame", () => {
        const roomCode = makeId(4);
        games[roomCode] = { 
            players: [], started: false, votes: {}, 
            hostId: socket.id, 
            gameType: '', 
            gameData: {}  
        };
        socket.join(roomCode);
        socket.roomCode = roomCode;
        socket.emit("gameCreated", roomCode);
        console.log("Sala creada:", roomCode);
    });

    // UNIRSE
    socket.on("joinGame", ({ name, roomCode }) => {
        if (!name || !roomCode) return;
        const cleanName = name.trim();
        const cleanCode = roomCode.toUpperCase().trim();
        const room = games[cleanCode];

        if (!room) { socket.emit("errorMsg", "Sala no encontrada."); return; }

        const existing = room.players.find(p => p.name.toLowerCase() === cleanName.toLowerCase());
        
        if (existing) {
            // RECONEXIÓN
            existing.id = socket.id;
            existing.connected = true;
            socket.join(cleanCode);
            socket.roomCode = cleanCode;
            socket.username = cleanName;
            
            if (room.started) {
                if (room.gameType === 'impostor') {
                    if (existing.role === "Impostor") socket.emit("roleAssign", { role: "Impostor", category: room.gameData.cat, start: "..." });
                    else socket.emit("roleAssign", { role: "Ciudadano", category: room.gameData.cat, word: room.gameData.secret, start: "..." });
                }
            } else {
                socket.emit("forceWaitScreen");
            }
        } else {
            // NUEVO JUGADOR
            if (room.started) { socket.emit("errorMsg", "Partida iniciada."); return; }
            const player = { id: socket.id, name: cleanName, score: 0, connected: true };
            room.players.push(player);
            socket.join(cleanCode);
            socket.roomCode = cleanCode;
            socket.username = cleanName;
        }
        io.to(cleanCode).emit("updatePlayerList", room.players);
    });

    // --- SELECCIONAR JUEGO ---
    // El cliente corregido emitirá 'selectGame' con 'impostor'
    socket.on("selectGame", (gameType) => {
        console.log("Iniciando juego:", gameType);
        const code = socket.roomCode;
        const room = games[code];
        if (!room) return;
        
        room.gameType = gameType;
        room.started = true;
        room.votes = {};
        const active = room.players.filter(p => p.connected);

        // 1. IMPOSTOR
        if (gameType === 'impostor') {
            if(active.length < 1) { // Necesitas al menos 2 jugadores para probar, idealmente 3
                 // io.to(code).emit("errorMsg", "Se necesitan más jugadores"); 
                 // return;
            }
            
            // CORRECCIÓN PRINCIPAL: Usar impostorWords
            const selected = impostorWords[Math.floor(Math.random() * impostorWords.length)];
            room.gameData = { secret: selected.word, cat: selected.cat };
            
            const imposterIndex = Math.floor(Math.random() * active.length);
            const starter = active[Math.floor(Math.random() * active.length)].name;

            active.forEach((p, i) => {
                const original = room.players.find(pl => pl.name === p.name);
                if (i === imposterIndex) {
                    original.role = "Impostor";
                    io.to(p.id).emit("roleAssign", { role: "Impostor", category: selected.cat, start: starter });
                } else {
                    original.role = "Ciudadano";
                    io.to(p.id).emit("roleAssign", { role: "Ciudadano", category: selected.cat, word: selected.word, start: starter });
                }
            });
            // Enviamos el evento para que la TV cambie de pantalla
            io.to(code).emit("gameStartedMain", { category: selected.cat, start: starter });
        }
    });

    // --- VOTACIÓN GENERAL ---
    socket.on("startVoting", () => {
        const code = socket.roomCode;
        if(games[code]) {
             games[code].votes = {};
             io.to(code).emit("votingPhaseStarted", games[code].players);
        }
    });

    socket.on("castVote", (voteName) => {
        const code = socket.roomCode;
        const room = games[code];
        if(!room) return;

        room.votes[socket.username] = voteName; 
        
        const activeCount = room.players.filter(p => p.connected).length;
        const votesCount = Object.keys(room.votes).length;
        
        io.to(room.hostId).emit("updateVoteCount", { current: votesCount, total: activeCount });

        if (votesCount >= activeCount) {
            let counts = {};
            let maxVotes = 0;
            Object.values(room.votes).forEach(v => {
                counts[v] = (counts[v] || 0) + 1;
                if (counts[v] > maxVotes) maxVotes = counts[v];
            });
            
            let winners = Object.keys(counts).filter(k => counts[k] === maxVotes);
            let winner = winners[Math.floor(Math.random() * winners.length)]; 
            let isTie = winners.length > 1;

            if (room.gameType === 'impostor') {
                io.to(code).emit("votingCompleted", { expelled: winner, secret: room.gameData.secret, isTie: isTie, tiedPlayers: winners });
            }
        }
    });

    // REINICIAR
    socket.on("resetGame", () => {
        const code = socket.roomCode;
        const room = games[code];
        if(room) {
            room.started = false;
            room.votes = {};
            room.gameType = '';
            io.to(code).emit("resetClient");
            io.to(code).emit("updatePlayerList", room.players);
        }
    });

    socket.on("disconnect", () => {
        const code = socket.roomCode;
        if(code && games[code]) {
            if(games[code].hostId === socket.id) delete games[code];
            else {
                const p = games[code].players.find(pl => pl.id === socket.id);
                if(p) p.connected = false;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log(`Server corriendo en puerto ${PORT}`); });