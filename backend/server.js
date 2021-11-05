const io=require('socket.io')({
    cors: {
        origin: '*',
    }
});

const {createGameState, gameLoop, getUpdatedVelocity} = require('./game');
const {FRAME_RATE} = require('./constants');
const {makeId} = require('./utils');

const state = {};
const clientRooms = {};

io.on('connection', (client) => {

    // code for creating game
    client.on('createGame',() => {
        const roomName = makeId(6);
        clientRooms[client.id]=roomName;
        client.emit('gameCode', roomName);

        state[roomName] = createGameState();
        client.join(roomName);
        client.playerNo = 1;
        console.log(io.sockets.adapter.rooms);
        console.log(clientRooms)
        client.emit('init', 1);
    });

    // code for joining game
    client.on('joinGame', (gameCode) => {

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

        client.emit('init', 2);

        console.log(io.sockets.adapter.rooms);

        startGameInterval(gameCode);
    });

    client.on('keydown',(keycode) => {
        const roomName = clientRooms[client.id];

        if(!roomName){
            return;
        }

        if(! roomName){
            return;
        }

        if(keycode){
            const velocity=getUpdatedVelocity(keycode);

            if(velocity){
                state[roomName].players[client.playerNo - 1].vel.y=velocity;
            }
        }
    });

    client.on('keyup',(keycode) => {
        const roomName = clientRooms[client.id];

        if(! roomName){
            return;
        }

        if(keycode == 38 && state[roomName].players[client.playerNo - 1].vel.y == -1){
            state[roomName].players[client.playerNo - 1].vel.y=0;
        }else if(keycode == 40 && state[roomName].players[client.playerNo - 1].vel.y == 1){
            state[roomName].players[client.playerNo - 1].vel.y=0;
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