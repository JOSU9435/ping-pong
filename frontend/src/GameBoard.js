import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Home from "./Home";
import GameOver from "./GameOver";
import ScoreBoard from "./ScoreBoard";

// connection to server
const socket=io('https://immense-anchorage-52015.herokuapp.com/');
const GameBoard = () => {

    const GB_COLOR='#9A8C98';
    const PLAYER_ONE_COLOR='green';
    const PLAYER_TWO_COLOR='purple';
    const BALL_COLOR='red';

    const [gameStart,setGameStart] = useState(false);
    const [gameCode,setGameCode] = useState('');
    const [gameOverResult, setGameOverResult] = useState('');
    const [playerNames,setPlayerNames] = useState(null);
    const [playerScores,setPlayerScores] = useState({
        one: 0,
        two: 0,
    });
    
    const playerNum = useRef(null);

    let gamebegin=false;
    let isPlayerNameStored=false;
    let playerOneScore=0;
    let playerTwoScore=0;

    const canvasRef=useRef(null);
    const contextRef=useRef(null);

    const init=() => {
        setGameStart(true);
        setGameOverResult('');
        const canvas=canvasRef.current;
        canvas.height=600;
        canvas.width=1000;

        const oneUnit = canvas.width/100;
        
        const context=canvas.getContext('2d');
        context.fillStyle=GB_COLOR;
        context.fillRect(0,0,canvas.width,canvas.height);
        context.fillStyle='white';
        context.fillRect(oneUnit*49.5,0,1*oneUnit,canvas.height);
        contextRef.current=context;
        
        gamebegin=true;
    }

    const reset = () => {
        const canvas = canvasRef.current;
        canvas.height=0;
        canvas.width=0;
        setGameStart(false);
        gamebegin=false;
    }

    // sending key input to server;
    document.addEventListener('keydown',(e) => {
        if(e.keyCode==38 || e.keyCode==40 || e.keyCode == 32){
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
        
        if(!isPlayerNameStored){
            setPlayerNames({
                one: players[0].name,
                two: players[1].name,
            });
            isPlayerNameStored = true;
        }

        if(playerOneScore != players[0].score || playerTwoScore != players[1].score){
            setPlayerScores({
                one: players[0].score,
                two: players[1].score,
            });
            playerOneScore = players[0].score;
            playerTwoScore = players[1].score;
        }
    }

    const renderPlayer = (player, oneUnit, colour) => {
        const context=contextRef.current;

        const {pos, dimensions} = player;

        context.fillStyle=colour;
        context.fillRect(pos.x * oneUnit, pos.y * oneUnit, dimensions.width * oneUnit, dimensions.height * oneUnit);
    }

    const handleInit = (num) => {
        playerNum.current=num;
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
        if(playerNum.current==win){
            setGameOverResult('YOU WIN');
        }else{
            setGameOverResult('YOU LOSE');
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

    const handlePlayerLeft = () => {
        reset();
        alert('player left refresh the page');
    }

    const handleRematch = () => {
        init();
    }

    // listening to server for data
    socket.on('init',handleInit);
    socket.on('gameState', handleGameState);
    socket.on('gameOver', handleGameOver);
    socket.on('gameCode', handleGameCode);
    socket.on('unknownGame', handleUnknownGame);
    socket.on('fullGame', handleFullGame);
    socket.on('playerLeft',handlePlayerLeft);
    socket.on('rematch',handleRematch);

    return (
        <div>
            {gameStart && <ScoreBoard playerNames = {playerNames} playerScores = {playerScores}/>}
            <div id="gameBoard">
                {gameStart && <h1 id = "gameCode">GAMECODE : {gameCode}</h1>}
                <canvas ref={canvasRef}></canvas>
            </div>
            {gameOverResult && <GameOver gameOverResult = {gameOverResult} socket = {socket}/>}
            {!gameStart && <Home socket={socket} init={init}/>}
        </div>
    );
}
 
export default GameBoard;