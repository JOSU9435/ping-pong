import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Home from "./Home";
import ScoreBoard from "./ScoreBoard";

const GameBoard = () => {

    const GB_COLOR='#9A8C98';
    const PLAYER_ONE_COLOR='green';
    const PLAYER_TWO_COLOR='purple';
    const BALL_COLOR='red';

    const [gameStart,setGameStart] = useState(false);
    const [gameCode,setGameCode] = useState('');
    const [playersState,setPlayerState] = useState(null);
    
    let gamebegin=false;
    let playerNum;

    // connection to server
    const socket=io('http://localhost:4000');

    // state of the current game
    const gameState = {
        players:[{
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
            name: '',
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
            name: '',
        }],

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
        canvas.style.height='600px';
        
        const context=canvas.getContext('2d');
        context.fillStyle=GB_COLOR;
        context.fillRect(0,0,canvas.width,canvas.height);
        context.fillStyle='white';
        context.fillRect(495,0,10,canvas.height);
        contextRef.current=context;
        
        gamebegin=true;
    }

    const reset = () => {
        const canvas = canvasRef.current;
        canvas.height=0;
        canvas.width=0;
        // setGameCode('');
        setGameStart(false);
        gamebegin=false;
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

    const renderGame = (state) => {
        const canvas=canvasRef.current;
        const context=contextRef.current;

        context.fillStyle=GB_COLOR;
        context.fillRect(0,0,canvas.width,canvas.height);
        
        const {players,ball,gridX,gridY} = state;
        const oneUnit=canvas.width/gridX;

        context.fillStyle='white';
        context.fillRect(49.5 * oneUnit,0,oneUnit,canvas.height);
        
        context.fillStyle=BALL_COLOR;
        context.beginPath();
        context.arc(ball.pos.x * oneUnit,ball.pos.y * oneUnit,ball.radius * oneUnit,0,2*Math.PI,0);
        context.fill();

        renderPlayer(players[0], oneUnit, PLAYER_ONE_COLOR);
        renderPlayer(players[1], oneUnit, PLAYER_TWO_COLOR);
        
        // if(!playersState){
            setPlayerState(players);
        // }
    }

    const renderPlayer = (player, oneUnit, colour) => {
        const context=contextRef.current;

        const {pos, dimensions} = player;

        context.fillStyle=colour;
        context.fillRect(pos.x * oneUnit, pos.y * oneUnit, dimensions.width * oneUnit, dimensions.height * oneUnit);
    }

    const handleInit = (num) => {
        playerNum=num;
    }

    const handleGameState = (gameState) => {
        if(!gamebegin){
            return;
        }
        requestAnimationFrame(() => renderGame(gameState));
    }

    const handleGameOver = (win) => {

        if(!gamebegin){
            return;
        }

        if(playerNum==win){
            alert('you win');
        }else{
            alert('you lose');
        }
        reset();
    }

    const handleGameCode = (code) => {
        setGameCode(code);
    }

    const handleUnknownGame = () => {
        reset();
        alert('unknown game code');
    }

    const handleFullGame = () => {
        reset();
        alert('game is full');
    }

    // listening to server for data
    socket.on('init',handleInit);
    socket.on('gameState', handleGameState);
    socket.on('gameOver', handleGameOver);
    socket.on('gameCode', handleGameCode);
    socket.on('unknownGame', handleUnknownGame);
    socket.on('fullGame', handleFullGame);

    return (
        <div>
            <ScoreBoard playersState = {playersState}/>
            <div id="gameBoard">
                {gameStart && <h1 id = "gameCode">GAMECODE : {gameCode}</h1>}
                <canvas ref={canvasRef}></canvas>
            </div>
            {!gameStart && <Home socket={socket} init={init}/>}
        </div>
    );
}
 
export default GameBoard;