const {GRID_X, GRID_Y, WIN_SCORE} = require('./constants');

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

const checkRoundOver = (state) => {

    const {players, ball} = state;
    
    if(ball.pos.x + players[0].dimensions.width + ball.radius >= GRID_X){
        players[1].score = players[1].score + 1;
        ball.pos.x = 50;
        ball.pos.y = 30;
        ball.vel.x = 0.5;
        ball.vel.y = 0.5;
        ball.vel.speed = 0.7071;
    }else if(ball.pos.x - players[0].dimensions.width - ball.radius <= 0){
        players[0].score = players[0].score + 1;
        ball.pos.x = 50;
        ball.pos.y = 30;
        ball.vel.x = 0.5;
        ball.vel.y = 0.5;
        ball.vel.speed = 0.7071;
    }
}

const checkGameOver = (players) => {

    if(players[0].score == WIN_SCORE){
        return 1;
    }else if(players[1].score == WIN_SCORE){
        return 2;
    }
}

module.exports = {
    makeId,
    updatePlayerPos,
    checkWallCollision,
    playerOneAndBallCollision,
    playeTworAndBallCollision,
    checkRoundOver,
    checkGameOver,
}