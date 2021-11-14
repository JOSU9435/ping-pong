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

        client.emit('init', 2);
        
        startGameInterval(gameCode);
    });

    client.on('keydown',(keycode) => {
        const roomName = clientRooms[client.id];

        if(!roomName){
            return;
        }

        const gameState = state[roomName];

        if(!gameState.isRoundActive && keycode == 32){
            if(client.playerNo == gameState.servingPlayer){
                HitBall(gameState.ball);
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
        const win = gameLoop(state[roomName]);
        
        if(win){
            emitGameOver(roomName,win);
            state[roomName] = null;
            clearInterval(intervalId);
        }else{
            emitGameState(roomName,state[roomName]);
        }

    }, 1000/FRAME_RATE);
}

io.listen(4000);