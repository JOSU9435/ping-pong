import { useState } from "react";

const GameOver = ({gameOverResult,socket}) => {

    const [isWaiting,setIsWaiting] = useState(false);

    const handleRematch = () => {
        socket.current.emit('rematch');
        setIsWaiting(true);
    }

    const handleLeave = () => {
        window.location.reload();
    }

    return (  
        <div  id = "gameOverScreen">
            <div id = "gameOverMessage">{gameOverResult}</div>
            {isWaiting && <div id="waiting">WAITING...</div>}
            <div id = "gameOverActions">
                <button onClick={handleRematch}>REMATCH</button>
                <button onClick={handleLeave}>LEAVE</button>
            </div>
        </div>
    );
}
 
export default GameOver;