import {GRID_X, GRID_Y} from './constants.js';
import {checkWallCollision, updatePlayerPos, playeTworAndBallCollision, playerOneAndBallCollision, checkGameOver, checkRoundOver, updateBallPosWithPlayer} from './utils.js';

const createGameState = () => {

    return {
        players: [{
            pos: {
                x: 98.5,
                y: 22.5,
            },
            vel: {
                y: 0,
            },
            dimensions: {
                width: 1.5,
                height: 15,
            },
            name: '',
            score: 0,
            rematch: false,
        },
        {
            pos: {
                x: 0,
                y: 22.5,
            },
            vel: {
                y: 0,
            },
            dimensions: {
                width: 1.5,
                height: 15,
            },
            name: '',
            score: 0,
            rematch: false,
        }],
        ball: {
            pos:{
                x: 97.5,
                y: 30,
            },
            vel:{
                x: 0,
                y: 0,
                speed: 0.7071,
            },
            radius: 1,
        },
        isRoundActive: false,
        servingPlayer: 1,
        gridX: GRID_X,
        gridY: GRID_Y,
    };
}

const gameLoop = (state) => {

    const {players,ball,isRoundActive}=state;

    // code to update state when round is not in progress
    
    if(!isRoundActive){
        updateBallPosWithPlayer(players, ball, state.servingPlayer);
        updatePlayerPos(players[0]);
        updatePlayerPos(players[1]);
        return 0;
    }
    
    // updating ball position
    ball.pos.x += ball.vel.x;
    ball.pos.y += ball.vel.y;

    // updating players positions 
    updatePlayerPos(players[0]);
    updatePlayerPos(players[1]);

    // players tile collision
    
    if(playerOneAndBallCollision(players[0],ball) ||
    playeTworAndBallCollision(players[1],ball)){
        return 0;
    }

    checkRoundOver(state);

    // check for gameover

    const isGameOver = checkGameOver(players);

    if(isGameOver){
        return isGameOver;
    }

    // wallcollision

    checkWallCollision(ball);

    return 0;
}

const getUpdatedVelocity = (key) => {
    if(key=='ArrowUp'){
        return -1;
    }else if(key=='ArrowDown'){
        return 1;
    }
    return 0;
}

export {
    createGameState,
    gameLoop,
    getUpdatedVelocity,
}