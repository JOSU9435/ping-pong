const {GRID_X, GRID_Y} = require('./constants');
const {checkWallCollision, updatePlayerPos, playeTworAndBallCollision, playerOneAndBallCollision, checkGameOver} = require('./utils');

const createGameState = () => {

    return {
        players: [{
            pos: {
                x: 98.5,
                y: 30,
            },
            vel: {
                y: 0,
            },
            dimensions: {
                width: 1.5,
                height: 15,
            },
        },
        {
            pos: {
                x: 0,
                y: 30,
            },
            vel: {
                y: 0,
            },
            dimensions: {
                width: 1.5,
                height: 15,
            },
        }],
        ball: {
            pos:{
                x: 50,
                y: 30,
            },
            vel:{
                x: 0.5,
                y: 0.5,
                speed: 0.7071,
            },
            radius: 1,
        },
        
        gridX: GRID_X,
        gridY: GRID_Y,
    };
}

const gameLoop = (state) => {

    const {players,ball}=state;
    
    // updating ball position
    ball.pos.x += ball.vel.x;
    ball.pos.y += ball.vel.y;

    // updating players positions 

    updatePlayerPos(players[0]);
    updatePlayerPos(players[1]);
    // player 1 tile collision
    
    if(playerOneAndBallCollision(players[0],ball) ||
    playeTworAndBallCollision(players[1],ball)){
        return 0;
    }
   
    // player 2 tile collsion
    
   

    // check for gameover

    const isGameOver = checkGameOver(players[0].dimensions.width, ball);

    if(isGameOver){
        return isGameOver;
    }

    // wallcollision

    checkWallCollision(ball);

    return 0;
}

const getUpdatedVelocity = (keycode) => {
    if(keycode==38){
        return -1;
    }else if(keycode==40){
        return 1;
    }
    return 0;
}

module.exports = {
    createGameState,
    gameLoop,
    getUpdatedVelocity,
}