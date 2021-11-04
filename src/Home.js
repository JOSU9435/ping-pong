import { useState } from "react";

const Home = ({socket,init}) => {

    const [gameCode,setGameCode] = useState('');

    const handleCreateGame = () => {
        socket.emit('createGame');
        init();
    }

    const handleJoinGame = (e) => {
        e.preventDefault();
        socket.emit('joinGame', gameCode);
        init();
    }

    return ( 
        <div id="initialScreen">
            <form onSubmit = {handleJoinGame}>
                <input type="text"
                    value = {gameCode}
                    required
                    onChange = {(e) => setGameCode(e.target.value)}
                />
                <button id = "joinGame">JOIN GAME</button>
            </form>
            <button onClick = {handleCreateGame} id = "createGame">CREATE GAME</button>
        </div>
    );
}
 
export default Home;