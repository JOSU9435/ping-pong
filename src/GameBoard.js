import { useEffect, useRef } from "react";

const GameBoard = () => {

    const GB_COLOR='#231F20';
    const PLAYER_COLOR='green';
    const BALL_COLOR='red';

    const gameState = {
        player: {
            pos: {
                x: 98.5,
                y: 30,
            },
            vel: {
                y: 1,
            }
        },

        ball: {
            x: 50,
            y: 30,
            radius: 1,
        },
        
        gridX: 100,
        gridY: 60,
    }

    const canvasRef=useRef(null);
    const contextRef=useRef(null);

    const init=() => {
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

    // document.addEventListener('keydown',(e) => {
    //     console.log(e.keyCode);
    // })
    
    useEffect(() => {
        init();
        renderGame(gameState);
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
        console.log(ball.x,ball.y,oneUnit);
        context.arc(ball.x * oneUnit,ball.y * oneUnit,ball.radius * oneUnit,0,2*Math.PI,0);
        context.fill();

        renderPlayer(player, oneUnit);
    }

    const renderPlayer = (player, oneUnit) => {
        const canvas=canvasRef.current;
        const context=contextRef.current;

        const {pos} = player;
        const playerDimensions = {
            width: 1.5,
            height: 10,
        }

        context.fillStyle=PLAYER_COLOR;
        context.fillRect(pos.x * oneUnit, pos.y * oneUnit, playerDimensions.width * oneUnit, playerDimensions.height * oneUnit);
    }

    return (  
        <div>
            <canvas id="gameBoard" ref={canvasRef}></canvas>
        </div>
    );
}
 
export default GameBoard;