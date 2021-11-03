const io=require('socket.io')({
    cors: {
        origin: ['http://localhost:3000'],
    }
});

const {createGameState, gameLoop, getUpdatedVelocity} = require('./game');
const {FRAME_RATE} = require('./constants');

io.on('connection', (client) => {
    const state = createGameState();

    client.on('keydown',(keycode) => {
        if(keycode){
            const velocity=getUpdatedVelocity(keycode);

            if(velocity){
                state.player.vel.y=velocity;
            }
        }
    });

    client.on('keyup',(keycode) => {
        if(keycode == 38 && state.player.vel.y == -1){
            state.player.vel.y=0;
        }else if(keycode == 40 && state.player.vel.y == 1){
            state.player.vel.y=0;
        }
    });
    
    client.emit('init', {data: 'hello world'});
    
    startGameInterval(client,state);
});

const startGameInterval = (client,state) => {
    const intervalId = setInterval(() => {
        // console.log('gg');
        const win = gameLoop(state);
        
        if(win){
            client.emit('gameOver',win);
            clearInterval(intervalId);
        }else{
            client.emit('gameState',state);
        }

    }, 1000/FRAME_RATE);
}

io.listen(4000);