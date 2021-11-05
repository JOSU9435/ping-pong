const {GRID_X, GRID_Y} = require('./constants');

const makeId = (length) => {

    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const updatePlayerPos = (player) => {
    if(player.vel.y > 0 && player.pos.y + player.dimensions.height < GRID_Y){
        player.pos.y += player.vel.y;
    }else if(player.vel.y < 0 && player.pos.y > 0){
        player.pos.y += player.vel.y;
    }
}

const checkWallCollision = (ball) => {
    if(ball.pos.y - ball.radius <= 0 || ball.pos.y + ball.radius >= GRID_Y){
        ball.vel.y *= -1;
    }
}

const playerOneAndBallCollision = (player,ball) => {

    if(
        ball.pos.y < player.pos.y + player.dimensions.height &&
        ball.pos.y > player.pos.y &&
        ball.pos.x + ball.radius >= player.pos.x &&
        ball.pos.x + ball.radius < player.pos.x + player.dimensions.width
    ){

        let collisionPoint = ball.pos.y - (player.pos.y + player.dimensions.height/2);

        collisionPoint /= player.dimensions.height / 2;

        let angle= (collisionPoint * Math.PI) / 3;


        ball.vel.y = ball.vel.speed * Math.sin(angle);
        ball.vel.x = -ball.vel.speed * Math.cos(angle);
        
        return 1;
    }
}

const playeTworAndBallCollision = (player,ball) => {

    if(
        ball.pos.y < player.pos.y + player.dimensions.height &&
        ball.pos.y > player.pos.y &&
        ball.pos.x - ball.radius - player.dimensions.width <= player.pos.x &&
        ball.pos.x - ball.radius > player.pos.x
    ){

        let collisionPoint = ball.pos.y - (player.pos.y + player.dimensions.height/2);

        collisionPoint /= player.dimensions.height / 2;

        let angle= (collisionPoint * Math.PI) / 3;


        ball.vel.y = ball.vel.speed * Math.sin(angle);
        ball.vel.x = ball.vel.speed * Math.cos(angle);
        
        return 1;
    }
}

const checkGameOver = (width, ball) => {
    
    if(ball.pos.x + width + ball.radius >= GRID_X){
        return 2;
    }else if(ball.pos.x - width - ball.radius <= 0){
        return 1;
    }
}

module.exports = {
    makeId,
    updatePlayerPos,
    checkWallCollision,
    playerOneAndBallCollision,
    playeTworAndBallCollision,
    checkGameOver,
}