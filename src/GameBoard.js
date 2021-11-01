import { useRef } from "react";

const GameBoard = () => {

    const canvasRef=useRef(null);

    return (  
        <div>
            <canvas id="gameBoard" ref={canvasRef}></canvas>
        </div>
    );
}
 
export default GameBoard;