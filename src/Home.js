import { useState } from "react";
import { useRef } from "react/cjs/react.development";

const Home = ({socket,init}) => {

    const [gameCode,setGameCode] = useState('');
    const [playerName, setPlayerName] = useState('')
    const [gameTab, setGameTab] = useState(true);

    const handleCreateGame = (e) => {
        e.preventDefault();
        socket.emit('createGame', playerName);
        init();
    }

    const handleJoinGame = (e) => {
        e.preventDefault();
        socket.emit('joinGame', {gameCode, playerName});
        init();
    }

    const joinTabButton = useRef(null);
    const createTabButton = useRef(null);

    const handleToggleToJoinGame = () => {
        joinTabButton.current.className = 'activeTabStyles';
        createTabButton.current.className = '';
        
        setGameTab(true);
    }

    const handleToggleToCreateGame = () => {
        joinTabButton.current.className = '';
        createTabButton.current.className = 'activeTabStyles';
        
        setGameTab(false);
    }

    return ( 
        <div id="initialScreen">
            <div id="tabChange">
                <div onClick = {handleToggleToJoinGame} className ="activeTabStyles" id = "joinGame" ref = {joinTabButton}>JOIN GAME</div>
                
                <div onClick = {handleToggleToCreateGame} className = "" id = "createGame" ref = {createTabButton}>CREATE GAME</div>
            </div>
            {gameTab && <form onSubmit = {handleJoinGame} id = "startGame">
                <input type="text"
                value = {playerName}
                placeholder = "Enter Name"
                required
                onChange = {(e) => setPlayerName(e.target.value)}
                />
                <input type="text"
                    value = {gameCode}
                    placeholder = "Enter Game code"
                    required
                    id="gameCodeForm"
                    onChange = {(e) => setGameCode(e.target.value)}
                />
                <button  id = "joinGameButton">JOIN GAME</button>
            </form>}

            {!gameTab && <form onSubmit = {handleCreateGame} id = "startGame">
                <input type="text"
                value = {playerName}
                placeholder = "Enter Name"
                required
                onChange = {(e) => setPlayerName(e.target.value)}
                />
                <button id = "createGameButton">CREATE GAME</button>
            </form>}
        </div>
    );
}
 
export default Home;