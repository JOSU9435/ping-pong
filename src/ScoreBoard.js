const ScoreBoard = ({playersState}) => {
    
    let playerOneName='';
    let playerTwoName='';
    let playerOneScore=0;
    let playerTwoScore=0;

    if(playersState){
        playerOneName = playersState[0].name;
        playerTwoName = playersState[1].name;
        playerOneScore = playersState[0].score;
        playerTwoScore = playersState[1].score;
    }

    return ( 
        <div id="scoreBoard">
            <div id="player1">
                <div>{playerTwoName}</div>
                <div>{playerTwoScore}/5</div>
            </div>
            <div id="player2">
                <div>{playerOneName}</div>
                <div>{playerOneScore}/5</div>
            </div>
        </div>
    );
}
 
export default ScoreBoard;