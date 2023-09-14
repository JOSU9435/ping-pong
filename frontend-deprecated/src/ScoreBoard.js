const ScoreBoard = ({playerNames, playerScores}) => {
    
    let playerOneName='';
    let playerTwoName='';
    let playerOneScore=0;
    let playerTwoScore=0;

    if(playerNames){
        playerOneName = playerNames.one;
        playerTwoName = playerNames.two;
    }
    if(playerScores){
        playerOneScore = playerScores.one;
        playerTwoScore = playerScores.two;
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