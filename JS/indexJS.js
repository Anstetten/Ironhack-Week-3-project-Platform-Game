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
    [30,31,32,33,34,35,36,37,38,39],
    [60,61,62,63,53,43,33,23,24,25,26,27,28,29],
    [80,81,82,72,62,63,64,65,75,85,86,87,88,89],
    ['00','01','02','03','04',14,24,25,26,27,17,18,19],
    [80,70,71,72,73,63,53,43,33,34,35,36,46,47,48,49],
    [60,61,62,63,64,65,66,67,68,58,48,38,28,29],
    [40,50,60,70,80,81,82,83,84,85,75,65,66,67,77,78,79],
    [10,11,12,22,23,33,34,44,45,55,56,66,67,68,58,48,49],
    [70,60,61,62,52,53,54,44,45,46,47,48,49],
    ['00','01','02',12,13,23,33,43,53,63,64,65,66,67,68,69],
    [70,71,72,73,63,53,54,55,45,35,25,26,27,28,29],
    [30,31,32,33,34,24,14,15,16,26,36,46,56,66,67,68,69],
    [90,91,92,93,94,84,74,75,65,55,45,46,36,26,25,24,14,"04","05","06","07","08","09"],
    [50,51,61,62,63,53,43,33,23,24,25,26,36,46,47,48,49]
]

//Variables
let player = new Player('Zsolt');
let playerAvatar= document.getElementById('figure');
let movesThisTurn =0;
let timePerRound=1000;
let gameIsOver = false;
let safePathindex=6;
const displayArea=document.getElementById('display');
const blockTemplate2=document.getElementById('newBlock');
const indicatorBlock= document.getElementById('indicator');
const messageWindow=document.getElementById('control');
const readyButton=document.getElementById('readyButton');
const counterWindow=document.getElementById('counter');
//these help the jump animation
let playerXtranslate=-100;
let playerYtranslate=600;
let areYouReady=false;


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

    //We start at the first tile of the Path
    let stepInPath=0;
    let timePerThisTurn=timePerRound;
    areYouReady=true;
    //Set up game for first step of the path
    player.setStartingPosition(Math.floor(safePaths[safePathindex][stepInPath]/10), safePaths[safePathindex][stepInPath]%10);
    
    updatePlayerOnBoard();

    shakeTiles(safePaths[safePathindex][stepInPath],stepInPath);
    
    refreshTimeIndicator(timePerThisTurn);

    //Launch setInterval here in which !!!!!!!!!!
    ////////////////////////////////////////////////////////////////
    let timerThisTurn =setInterval(() => {
        refreshTimeIndicator(timePerThisTurn);
        fallFakeTiles(safePaths[safePathindex][stepInPath],safePaths[safePathindex][stepInPath+1]);
        movesThisTurn=0;
        stepInPath++;
        shakeTiles(safePaths[safePathindex][stepInPath],stepInPath);



    }, timePerThisTurn);


if (5>6){
    if (stepInPath===9){
        //Game is won
        //break interval
        // COngrats it is won ETC do you wanna go on next level?

        //We shorten available time for next rounds
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

    let allBlocks=document.querySelectorAll('.block:not(.green)');
    allBlocks.forEach((block)=>{
        block.classList.remove("shaken");
    })
    let nextSafeTile=(safePaths[safePathindex][stepInPath+1]);
   // console.log(`Next safe tile`, nextSafeTile)
    let listOfAdjacentTiles=getAllAdjacentTile(currentSafeTile,nextSafeTile);
    //console.log(listOfAdjacentTiles);
    listOfAdjacentTiles.forEach((tile) => {
        //console.log(tile);
        let tileBlock = document.getElementById(`${tile}`);
        if (!tileBlock.classList.contains("fallen")) {
            
            tileBlock.classList.remove("up");
            tileBlock.classList.remove("down");
            tileBlock.classList.add("shaken");}
        
    });




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
        indicatorBlock.classList.add("shrunk");
        setTimeout(function(){
            indicatorBlock.classList.remove("blockIndicatorShrinking");
            indicatorBlock.classList.remove("shrunk");
        },timerTime*0.99);
}

function getAllAdjacentTile(tileCoordinate,nextSafeTile){
    let tileCoordinateInt=0;
    let nextSafeTileInt=0;
    //console.log("Current tile: " + tileCoordinate + ' Next one: '+ nextSafeTile);
    if (typeof(tileCoordinate)==='string'){
        tileCoordinateInt=parseInt(tileCoordinate[0]*10)+parseInt(tileCoordinate[1]);
    }

    else{tileCoordinateInt=tileCoordinate;}

    if (typeof(nextSafeTile)==='string'){
        nextSafeTileInt=parseInt(nextSafeTile[0]*10)+parseInt(nextSafeTile[1]);
    }

    else{nextSafeTileInt=nextSafeTile;}


    let currentY=Math.floor(tileCoordinateInt/10);
    let currentX=tileCoordinateInt%10;
    //console.log(currentY +' '+currentX);
    let tileList=[];
    
    let topLeft= (currentY>0 && currentX >0) ? (currentY-1)*10+(currentX-1) : null;
    if (topLeft!==null && topLeft!==nextSafeTileInt) tileList.push(topLeft);

    let middleLeft= (currentX >0) ? (currentY)*10+(currentX-1) : null;
    if (middleLeft!==null  && middleLeft!==nextSafeTileInt) tileList.push(middleLeft);

    let bottomLeft= (currentY<9 && currentX >0) ? (currentY+1)*10+(currentX-1) : null;
    if (bottomLeft!==null && bottomLeft!==nextSafeTileInt) tileList.push(bottomLeft);

    let topMiddle= (currentY>0) ? (currentY-1)*10+(currentX) : null;
    if (topMiddle!==null && topMiddle!==nextSafeTileInt) tileList.push(topMiddle);

    let bottomMiddle= (currentY<9) ? (currentY+1)*10+(currentX) : null;
    if (bottomMiddle!==null && bottomMiddle!==nextSafeTileInt) tileList.push(bottomMiddle);

    let topRight= (currentY>0 && currentX <9) ? (currentY-1)*10+(currentX+1) : null;
    if (topRight!==null && topRight!==nextSafeTileInt) tileList.push(topRight);

    let middleRight= (currentX <9) ? (currentY)*10+(currentX+1) : null;
    if (middleRight!==null && middleRight!==nextSafeTileInt) tileList.push(middleRight);

    let bottomRight= (currentY<9 && currentX <9) ? (currentY+1)*10+(currentX+1) : null;
    if (bottomRight!==null && bottomRight!==nextSafeTileInt) tileList.push(bottomRight);
    
    let finalTileList=[];

    finalTileList.push(tileCoordinate);
    tileList.forEach((tile)=>{
        if (tile<9) {finalTileList.push(tile="0"+tile)}
        else{finalTileList.push(tile)}
    })

    return finalTileList;
}

//This function falls the fake tiles 
function fallFakeTiles(lastSafeTile,nextSafeTile){
    //We have to fall the last safe tile plus the direct adjacent tiles

    let lastSafeTileInt=0;
    let nextSafeTileInt=0;

    if (typeof(lastSafeTile)==='string'){
        lastSafeTileInt=parseInt(lastSafeTile[0]*10)+parseInt(lastSafeTile[1]);
    }

    else{lastSafeTileInt=lastSafeTile;}

    if (typeof(nextSafeTile)==='string'){
        nextSafeTileInt=parseInt(nextSafeTile[0]*10)+parseInt(nextSafeTile[1]);
    }

    else{nextSafeTileInt=nextSafeTile;}

    let currentY=Math.floor(lastSafeTileInt/10);
    let currentX=lastSafeTileInt%10;

    //console.log(`lastsafeTile: ${lastSafeTile} lastSafeTileInt: ${lastSafeTileInt} y: ${currentY} x: ${currentX}`);


    let tilesToFall =[];

    let middleLeft= (currentX >0) ? (currentY)*10+(currentX-1) : null;
    if (middleLeft!==null  && middleLeft!==nextSafeTileInt && !safePaths[safePathindex].includes(middleLeft)) tilesToFall.push(middleLeft);

    let topMiddle= (currentY>0) ? (currentY-1)*10+(currentX) : null;
    if (topMiddle!==null && topMiddle!==nextSafeTileInt && !safePaths[safePathindex].includes(topMiddle)) tilesToFall.push(topMiddle);

    let bottomMiddle= (currentY<9) ? (currentY+1)*10+(currentX) : null;
    if (bottomMiddle!==null && bottomMiddle!==nextSafeTileInt  && !safePaths[safePathindex].includes(bottomMiddle)) tilesToFall.push(bottomMiddle);

    let middleRight= (currentX <9) ? (currentY)*10+(currentX+1) : null;
    if (middleRight!==null && middleRight!==nextSafeTileInt && !safePaths[safePathindex].includes(middleRight)) tilesToFall.push(middleRight);
    
    let finalTilesToFall=[];
    finalTilesToFall.push(lastSafeTile);

    tilesToFall.forEach((tile)=>{
        if (tile<9) {finalTilesToFall.push(tile="0"+tile)}
        else{finalTilesToFall.push(tile)}
    })

    finalTilesToFall.forEach(tile => {
        let tileBlock = document.getElementById(`${tile}`);
        tileBlock.classList.remove("shaken");
        tileBlock.classList.remove("up");
        tileBlock.classList.remove("down");
        
        tileBlock.classList.add("fallen");
        
    });
    // console.log(`Last safe tile: ${lastSafeTile} next safe: ${nextSafeTileInt}`);
    // console.log(finalTilesToFall);
}

//FUnction to check if the player is alive
function checkIfPlayerIsAlive(currentSafeTile){

}

//Function to handle if game is gameOver
function gameOver(){}


//Arrow key eccent handlers
function pressedForwardButton(){
    if (movesThisTurn<1 && areYouReady!==false){
        player.moveForward();
        updatePlayerOnBoard();
        movesThisTurn++;
    }
    
}
function pressedLeftdButton(){
    if (movesThisTurn<1 && areYouReady!==false){
        player.moveLeft();
        updatePlayerOnBoard();
        movesThisTurn++;
    }
}
function pressedRightdButton(){
    if (movesThisTurn<1 && areYouReady!==false){
    player.moveRight();
    updatePlayerOnBoard();
    movesThisTurn++;
}
}
function pressedBackButton(){
    if (movesThisTurn<1 && areYouReady!==false)
    {
    player.moveBack();
    updatePlayerOnBoard();
    movesThisTurn++;
    }
}
