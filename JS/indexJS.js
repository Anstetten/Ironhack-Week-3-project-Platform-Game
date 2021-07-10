import Player from './player';

// For representation sake the board:

// ------X---------------------->
// | 00 01 02 03 04 05 06 07 08 09 
// | 10 11 12 13 14 15 16 17 18 19 
// | 20 21 22 23 24 25 26 27 28 29 
// | 30 31 32 33 34 35 36 37 38 39 
// | 40 41 42 43 44 45 46 47 48 49 
// Y 50 51 52 53 54 55 56 57 58 59 
// | 60 61 62 63 64 65 66 67 68 69 
// | 70 71 72 73 74 75 76 77 78 79 
// | 80 81 82 83 84 85 86 87 88 89 
// | 90 91 92 93 94 95 96 97 98 99 
// |


const safePaths=[
    [40,41,42,43,44,45,46,47,48,49],
    []
]

let player = new Player('Zsolt');
let movesThisTurn =0;
let timePerRound=1000;
let gameIsOver = false;
let safePathindex=0;


//This I need to hook up to a button
startCountDown(){
    //
    //
    //
    startNewRound(timePerRound);

}


startNewRound(timePerRound){
    
    //We start at the first tile of the Path
    let stepInPath=0;
    let timePerThisTurn=timePerRound;
    //Set up game for first step of the path
    player.setStartingPosition(safePaths[safePathindex][0][0], safePaths[safePathindex][0][1]);
    updatePlayerOnBoard();
    shakeTiles(safePaths[safePathindex][stepInPath]);
    refreshTimeIndicator(timePerThisTurn);

    //Launch setInterval here in which !!!!!!!!!!
    ////////////////////////////////////////////////////////////////
    fallFakeTiles(safePaths[safePathindex][stepInPath]);
    movesThisTurn=0;

    if (stepInPath===9){
        //Game is won
        //break interval
        // COngrats it is won ETC do you wanna go on next level?

        //We shorten available time for next round
        timePerRound-=50;
        safePathindex+=1;
    }
    
    else {refreshTimeIndicator(timePerThisTurn);
    

    //Update the next safe tile
    stepInPath+=1;

    if (checkIfPlayerIsAlive(safePaths[safePathindex][stepInPath])){
        shakeTiles(safePaths[safePathindex][stepInPath]);
    }

    else{
        // We have to break TimeInterval and start new round (ask if we want new round)
        gameOver(lastSafeTileOfPath);
    }}



    /////////////////////////////

};




//Fnctions

//This is the count down that occurs at the beginning of each round
function startCountDown(){};

//Function to update the position of the grapihical representation of the player
function updatePlayerOnBoard(){};

//This is the function to shake the tiles aorund the player except the next safe one
function shakeTiles(currentSafeTile){};

//Restart the time indicator that shows how much time we have before the end of the turn
function refreshTimeIndicator(timerTime);

//This function falls the fake tiles 
function fallFakeTiles(lastSafeTile);

//FUnction to check if the player is alive
function checkIfPlayerIsAlive(currentSafeTile){

}

//Function to handle if game is gameOver
function gameOver(){}


function pressedForwardButton(){};
function pressedLeftdButton(){};
function pressedRightdButton(){};
function pressedBackdButton(){};