const {GRID_X, GRID_Y} = require('./constants');

const createGameState = () => {

    return {
        player: {
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

    const {player,ball}=state;

    // updating ball position
    ball.pos.x += ball.vel.x;
    ball.pos.y += ball.vel.y;

    // updating player position 
    
    if(player.vel.y > 0 && player.pos.y + player.dimensions.height < GRID_Y){
        player.pos.y += player.vel.y;
    }else if(player.vel.y < 0 && player.pos.y > 0){
        player.pos.y += player.vel.y;
    }

    // wallcollision

    if(ball.pos.x - player.dimensions.width - ball.radius <= 0){
        ball.vel.x *= -1;
    }

    if(ball.pos.y - ball.radius <= 0 || ball.pos.y + ball.radius >= GRID_Y){
        ball.vel.y *= -1;
    }

    // player's tile collision

    if(
        ball.pos.y < player.pos.y + player.dimensions.height &&
        ball.pos.y > player.pos.y &&
        ball.pos.x + ball.radius >= player.pos.x &&
        ball.pos.x + ball.radius < player.pos.x + player.dimensions.width
    ){

        let collisionPoint = ball.pos.y - (player.pos.y + player.dimensions.height/2);

        collisionPoint /= player.dimensions.height / 2;

        let angle= (collisionPoint * Math.PI) / 3;

        // console.log(angle);

        ball.vel.y = ball.vel.speed * Math.sin(angle);
        ball.vel.x = -ball.vel.speed * Math.cos(angle);
        
        return 0;
    }


    if(ball.pos.x + player.dimensions.width + ball.radius > GRID_X){
        return 1;
    }

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