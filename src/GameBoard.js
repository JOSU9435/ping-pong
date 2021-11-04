import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Home from "./Home";

const GameBoard = () => {

    const GB_COLOR='#231F20';
    const PLAYER_COLOR='green';
    const BALL_COLOR='red';

    const [gameStart,setGameStart] = useState(false);

    // connection to server
    const socket=io('http://localhost:4000');

    // state of the current game
    const gameState = {
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
                height: 10,
            },
        },

        ball: {
            pos:{
                x: 50,
                y: 30,
            },
            vel:{
                x: 0.5,
                y: 0,
                speed: 0.7071,
            },
            radius: 1,
        },
        
        gridX: 100,
        gridY: 60,
    }

    const canvasRef=useRef(null);
    const contextRef=useRef(null);

    const init=() => {
        setGameStart(true);
        const canvas=canvasRef.current;
        canvas.height=600;
        canvas.width=1000;
        canvas.style.width='1000px';
        canvas.style.height='600px'

        const context=canvas.getContext('2d');
        context.fillStyle=GB_COLOR;
        context.fillRect(0,0,canvas.width,canvas.height);
        context.fillStyle='white';
        context.fillRect(495,0,10,canvas.height);
        contextRef.current=context;
    }


    // sending key input to server;
    document.addEventListener('keydown',(e) => {
        if(e.keyCode==38 || e.keyCode==40){
            socket.emit('keydown',e.keyCode);
        }
    });

    document.addEventListener('keyup',(e) => {
        if(e.keyCode==38 || e.keyCode==40){
            socket.emit('keyup',e.keyCode);
        }
    });
    
    useEffect(() => {
        // init();
        // renderGame(gameState);
    },[]);

    const renderGame = (state) => {
        const canvas=canvasRef.current;
        const context=contextRef.current;

        context.fillStyle=GB_COLOR;
        context.fillRect(0,0,canvas.width,canvas.height);
        
        const {player,ball,gridX,gridY} = state;
        const oneUnit=canvas.width/gridX;

        context.fillStyle='white';
        context.fillRect(49.5 * oneUnit,0,oneUnit,canvas.height);
        
        context.fillStyle=BALL_COLOR;
        context.beginPath();
        context.arc(ball.pos.x * oneUnit,ball.pos.y * oneUnit,ball.radius * oneUnit,0,2*Math.PI,0);
        context.fill();

        renderPlayer(player, oneUnit);
    }

    const renderPlayer = (player, oneUnit) => {
        const context=contextRef.current;

        const {pos, dimensions} = player;

        context.fillStyle=PLAYER_COLOR;
        context.fillRect(pos.x * oneUnit, pos.y * oneUnit, dimensions.width * oneUnit, dimensions.height * oneUnit);
    }

    const handleInit = (data) => {
        console.log(data);
    }

    const handleGameState = (gameState) => {
        // gameState=JSON.parse(gameState);
        if(!gameStart){
            return;
        }
        requestAnimationFrame(() => renderGame(gameState));
    }

    const handleGameOver = (win) => {
        // if(playerNo==win){

        // }
        // alert('gameover');
        console.log('gameover');
    }

    // listening to server for data
    socket.on('init',handleInit);
    socket.on('gameState', handleGameState);
    socket.on('gameOver', handleGameOver);

    return (
        <div>
            {!gameStart && <Home socket={socket} init={init}/>}
            <canvas id="gameBoard" ref={canvasRef}></canvas>
        </div>
    );
}
 
export default GameBoard;