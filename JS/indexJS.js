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
    [51,41,42,43,44,45,46,47,48,49],
    []
]

//Variables
let player = new Player('Zsolt');
let playerAvatar= document.getElementById('figure');
let movesThisTurn =0;
let timePerRound=5000;
let gameIsOver = false;
let safePathindex=0;
const displayArea=document.getElementById('display');
const blockTemplate2=document.getElementById('newBlock');
const indicatorBlock= document.getElementById('indicator');
const messageWindow=document.getElementById('control');
const readyButton=document.getElementById('readyButton');
const counterWindow=document.getElementById('counter');
//these help the jump animation
let playerXtranslate=-100;
let playerYtranslate=600;


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
window.onload=showMessageWindow;
readyButton.onclick=startCountDown;



//For setting up the visual board
GenerateTable();
setMovingAndGlowing();

//Show Message window
function showMessageWindow(){
    messageWindow.style.visibility="visible"

}


//This I need to hook up to a button
function startCountDown(){
    let counter=3;
    messageWindow.style.visibility='hidden';
    counterWindow.style.visibility='visible';
    counterWindow.innerHTML=counter;
    let counterTimer= setInterval(() => {
        counter--;
        if(counterWindow.innerHTML==="Go!!!!"){
            clearInterval(counterTimer);
            counterWindow.style.visibility="hidden";
            startNewRound(timePerRound);
            
        }
        
        else if(counter===0){
            counterWindow.innerHTML="Go!!!!"
            
        }

        else{
            counterWindow.innerHTML=counter;
        }

        
        
        
    }, 1000);
    

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
            colorBlock.id=coordinate;

    
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
    console.log(player.y +" " + player.x);
    //We start at the first tile of the Path
    let stepInPath=0;
    let timePerThisTurn=timePerRound;
    //Set up game for first step of the path
    player.setStartingPosition(Math.floor(safePaths[safePathindex][stepInPath]/10), safePaths[safePathindex][stepInPath]%10);
    
    updatePlayerOnBoard();

    shakeTiles(safePaths[safePathindex][stepInPath],stepInPath);
    
    refreshTimeIndicator(timePerThisTurn);

    //Launch setInterval here in which !!!!!!!!!!
    ////////////////////////////////////////////////////////////////
if (5>6){    fallFakeTiles(safePaths[safePathindex][stepInPath]);
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
}


    /////////////////////////////

};




//Fnctions

//This is the count down that occurs at the beginning of each round

//Function to update the position of the grapihical representation of the player
function updatePlayerOnBoard(){
    let placementY=player.y*116+33;
    
    let placementYmiddle= (placementY-playerYtranslate)/2+playerYtranslate;
    playerYtranslate=placementY;
    
    let placementX=player.x*116+33;
    let placementXmiddle= (placementX-playerXtranslate)/2+playerXtranslate;
    playerXtranslate=placementX;
    
    playerAvatar.style.transform=`translate3d(${placementXmiddle}px,${placementYmiddle}px,50px)`;
    setTimeout(function(){playerAvatar.style.transform=`translate3d(${placementX}px,${placementY}px,30px)`;},100)
    
};

//This is the function to shake the tiles aorund the player except the next safe one
function shakeTiles(currentSafeTile,stepInPath){
    console.log(currentSafeTile);
    
    let nextSafeTile=safePaths[safePathindex][stepInPath+1];
    let listOfAdjacentTiles=getAllAdjacentTile(currentSafeTile,nextSafeTile);
    
    listOfAdjacentTiles.forEach((tile) => {
        let tileBlock = document.getElementById(`${tile}`);
        tileBlock.classList.toggle("shaken");
        
    });

    console.log(listOfAdjacentTiles);


};

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

function getAllAdjacentTile(tileCoordinate,nextSafeTile){
    let currentY=Math.floor(tileCoordinate/10);
    let currentX=tileCoordinate%10;
    let tileList=[];
    let topLeft= (currentY>0 && currentX >0) ? (currentY-1)*10+(currentX-1) : null;
    if (topLeft!==null && topLeft!==nextSafeTile) tileList.push(topLeft);

    let middleLeft= (currentX >0) ? (currentY)*10+(currentX-1) : null;
    if (middleLeft!==null  && middleLeft!==nextSafeTile) tileList.push(middleLeft);

    let bottomLeft= (currentY<9 && currentX >0) ? (currentY+1)*10+(currentX-1) : null;
    if (bottomLeft!==null && bottomLeft!==nextSafeTile) tileList.push(bottomLeft);

    let topMiddle= (currentY>0) ? (currentY-1)*10+(currentX) : null;
    if (topMiddle!==null && topMiddle!==nextSafeTile) tileList.push(topMiddle);

    let bottomMiddle= (currentY<9) ? (currentY+1)*10+(currentX) : null;
    if (bottomMiddle!==null && bottomMiddle!==nextSafeTile) tileList.push(bottomMiddle);

    let topRight= (currentY>0 && currentX <9) ? (currentY-1)*10+(currentX+1) : null;
    if (topRight!==null && topRight!==nextSafeTile) tileList.push(topRight);

    let middleRight= (currentX <9) ? (currentY)*10+(currentX+1) : null;
    if (middleRight!==null && middleRight!==nextSafeTile) tileList.push(middleRight);

    let bottomRight= (currentY<9 && currentX <9) ? (currentY+1)*10+(currentX+1) : null;
    if (bottomRight!==null && bottomRight!==nextSafeTile) tileList.push(bottomRight);

    return tileList;
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
