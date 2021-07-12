import Player from './player.js';

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

//Variables
let player = new Player('Zsolt');
let playerAvatar= document.getElementById('figure');
let movesThisTurn =0;
let timePerRound=1000;
let gameIsOver = false;
let safePathindex=0;
const displayArea=document.getElementById('display');
const blockTemplate2=document.getElementById('newBlock');
const indicatorBlock= document.getElementById('indicator');
//these help the jump animation
let playerXtranslate=32;
let playerYtranslate=32;


//Events and eventhandlers
window.addEventListener("keydown", function (event){
    switch (event.key){
        case "ArrowUp":
            pressedForwardButton();
            break;
        case "ArrowLeft":
            pressedLeftdButton();
            break;
        case "ArrowRight":
            pressedRightdButton();
            break;
        case "ArrowDown":
            pressedBackButton();
            break;
        }
});


//For testing

GenerateTable();
setMovingAndGlowing();
refreshTimeIndicator(5000);




//startCountDown();

//This I need to hook up to a button
function startCountDown(){
    //
    //
    //
    startNewRound(timePerRound);

}

//function to generate table with coordinates as classes
function GenerateTable (){
    let numberOfBlocksToCreate=100
    for (let i=0; i<numberOfBlocksToCreate; i++)
        {
            let cloneBlock = blockTemplate2.content.cloneNode(true);
 
            let colorBlock = cloneBlock.querySelector('.block')
            //this to be deleted later
            colorBlock.onclick= function (event){
            event.target.parentElement.classList.add("selected");
            console.log('writter');
            }

            //add coordinates
            let coordinate= (i>9) ? ''+i : "0"+i;
            colorBlock.classList.add(coordinate);

    
            displayArea.appendChild(cloneBlock);}
    }
    
function setMovingAndGlowing(){
    let blocks = document.querySelectorAll('.block:not(.green)');
    setInterval(function(){
        for (let i=0; i<10;i++){
            let randomIndex= Math.floor(Math.random()*blocks.length);
            blocks[randomIndex].classList.toggle('up');
            setTimeout(function(){
                blocks[randomIndex].classList.toggle('up');
                blocks[randomIndex].classList.toggle('down');
                setTimeout(function(){
                    blocks[randomIndex].classList.toggle('down');
                    },1500);

                },1500);
        
            let faces = blocks[randomIndex].querySelectorAll('.face');
            Array.from(faces).forEach((face)=>{
                face.classList.toggle('dull');
                setTimeout(function(){face.classList.toggle('dull');},1500);
            })
        }
    },2000);

}

function startNewRound(timePerRound){
    
    //We start at the first tile of the Path
    let stepInPath=0;
    let timePerThisTurn=timePerRound;
    //Set up the jumping animation transition time:
    playerAvatar.style.transition=`transform ${timePerRound/1000/2}s linear`;
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

//Function to update the position of the grapihical representation of the player
function updatePlayerOnBoard(){
    let placementY=player.y*116+33;
    console.log(placementY);
    console.log(playerYtranslate);
    let placementYmiddle= (placementY-playerYtranslate)/2+playerYtranslate;
    console.log(placementYmiddle);
    playerYtranslate=placementY;
    
    let placementX=player.x*116+33;
    let placementXmiddle= (placementX-playerXtranslate)/2+playerXtranslate;
    playerXtranslate=placementX;
    
    playerAvatar.style.transform=`translate3d(${placementXmiddle}px,${placementYmiddle}px,50px)`;
    setTimeout(function(){playerAvatar.style.transform=`translate3d(${placementX}px,${placementY}px,30px)`;},100)
    
};

//This is the function to shake the tiles aorund the player except the next safe one
function shakeTiles(currentSafeTile){};

//Restart the time indicator that shows how much time we have before the end of the turn
function refreshTimeIndicator(timerTime){
        let sheet = document.styleSheets[0];
        let rules = sheet.cssRules;
        let transitionRule;

        for (let i=0; i<rules.length;i++){

            if (rules[i].selectorText===".blockIndicatorShrinking") {transitionRule=rules[i]};

        }
        transitionRule.style.transition=`transform ${timerTime/1000}s linear`;


        indicatorBlock.classList.add("blockIndicatorShrinking");
        indicatorBlock.classList.toggle("shrunk");
        setTimeout(function(){
            indicatorBlock.classList.remove("blockIndicatorShrinking");
            indicatorBlock.classList.toggle("shrunk");
        },timerTime);
}

//This function falls the fake tiles 
function fallFakeTiles(lastSafeTile){}

//FUnction to check if the player is alive
function checkIfPlayerIsAlive(currentSafeTile){

}

//Function to handle if game is gameOver
function gameOver(){}


//Arrow key eccent handlers
function pressedForwardButton(){
    console.log(playerAvatar.style);
    console.log(player.x + " " + player.y);
    player.moveForward();
    console.log(player.x + " " + player.y);
    updatePlayerOnBoard()
}
function pressedLeftdButton(){
    console.log("Left");
    console.log(player.x + " " + player.y);
    player.moveLeft();
    console.log(player.x + " " + player.y);
    updatePlayerOnBoard()
}
function pressedRightdButton(){
    console.log("Right");
    console.log(player.x + " " + player.y);
    player.moveRight();
    console.log(player.x + " " + player.y);
    updatePlayerOnBoard()
}
function pressedBackButton(){
    console.log("BAck");
    console.log(player.x + " " + player.y);
    player.moveBack();
    console.log(player.x + " " + player.y);
    updatePlayerOnBoard()
}
