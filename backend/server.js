const io=require('socket.io')({
    cors: {
        origin: '*',
    }
});

const {createGameState, gameLoop, getUpdatedVelocity} = require('./game');
const {FRAME_RATE, GRID_X} = require('./constants');
const {makeId, HitBall} = require('./utils');

const state = {};
const clientRooms = {};

io.on('connection', (client) => {

    client.on('rematch',() => {

        const roomName =  clientRooms[client.id];

        if(!roomName) return;

        const gameState = state[roomName];

        if(!gameState) return;
        
        const {players} = gameState;
        players[client.playerNo - 1].rematch = true;

        const nameOne=players[0].name;
        const nameTwo=players[1].name;
        const room = io.sockets.adapter.rooms.get(roomName);

        if(players[0].rematch && players[1].rematch && room.size==2){
            state[roomName] = createGameState();
            state[roomName].players[0].name=nameOne;
            state[roomName].players[1].name=nameTwo;
            startGameInterval(roomName);
            io.sockets.in(roomName).emit('rematch');
        }
    })

    client.on('disconnect',() => {
        const roomName = clientRooms[client.id];

        if(!roomName) return ;

        io.sockets.in(roomName).emit('playerLeft');
        delete clientRooms[client.id];
        delete state[roomName];
    });

    // code for creating game
    client.on('createGame',(playerName) => {
        const roomName = makeId(6);
        clientRooms[client.id]=roomName;
        client.emit('gameCode', roomName);

        state[roomName] = createGameState();
        client.join(roomName);
        client.playerNo = 1;
        state[roomName].players[0].name = playerName;
        client.emit('init', 1);
    });

    // code for joining game
    client.on('joinGame', ({gameCode, playerName}) => {

        const room = io.sockets.adapter.rooms.get(gameCode);

        let numOfClients = 0;

        if(room){
            numOfClients = room.size;
        }

        if(numOfClients==0){
            client.emit('unknownGame');
            return;
        }else if(numOfClients > 1){
            client.emit('fullGame');
            return;
        }

        clientRooms[client.id]=gameCode;

        client.join(gameCode);
        client.playerNo = 2;
        state[gameCode].players[1].name = playerName;
        client.emit('gameCode', gameCode);
        client.emit('init', 2);
        
        startGameInterval(gameCode);
    });

    client.on('keydown',(keycode) => {
        const roomName = clientRooms[client.id];

        if(!roomName){
            return;
        }

        const gameState = state[roomName];

        if(!gameState){
            return;
        }

        if(!gameState.isRoundActive && keycode == 32){
            if(client.playerNo == gameState.servingPlayer){
                HitBall(gameState.ball, gameState.servingPlayer);
                gameState.isRoundActive = true;
            }
            
            return;
        }

        if(keycode){
            const velocity=getUpdatedVelocity(keycode);

            if(velocity){
                gameState.players[client.playerNo - 1].vel.y=velocity;
            }
        }
    });

    client.on('keyup',(keycode) => {
        const roomName = clientRooms[client.id];

        if(! roomName){
            return;
        }

        const gameState = state[roomName];

        if(!gameState){
            return;
        }

        if(keycode == 38 && gameState.players[client.playerNo - 1].vel.y == -1){
            gameState.players[client.playerNo - 1].vel.y=0;
        }else if(keycode == 40 && gameState.players[client.playerNo - 1].vel.y == 1){
            gameState.players[client.playerNo - 1].vel.y=0;
        }
    });    
});

const emitGameState = (roomName,state) => {
    io.sockets.in(roomName).emit('gameState', state);
}

const emitGameOver = (roomName, win) => {
    io.sockets.in(roomName).emit('gameOver', win);
}

const startGameInterval = (roomName) => {

    const intervalId = setInterval(() => {
        if(!state[roomName]){
            clearInterval(intervalId);
            return;
        }
        const win = gameLoop(state[roomName]);
        
        if(win){
            emitGameOver(roomName,win);
            clearInterval(intervalId);
        }else{
            emitGameState(roomName,state[roomName]);
        }

    }, 1000/FRAME_RATE);
}

io.listen(process.env.PORT || 4000);