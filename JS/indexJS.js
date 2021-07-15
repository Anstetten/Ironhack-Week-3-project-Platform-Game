import Player from './player.js';

//FrameRequest version

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
let timePerRound=1500;
let gameIsOver = false;
let safePathindex=0;
let stepInPath=0;
let inTransition = false;
let globalPlacementY=0;
let globalPlacementX=0;
let deathCounter=0;
const displayArea=document.getElementById('display');
const blockTemplate2=document.getElementById('newBlock');
const indicatorBlock= document.getElementById('indicator');
const messageWindow=document.getElementById('control');
const gameOverWindow=document.getElementById('gameOver');
const gameWonWindow=document.getElementById('gameWon');
const readyButton=document.getElementById('readyButton');
const restartButton=document.getElementById('restartButton');
const counterWindow=document.getElementById('counter');
const counterText=document.getElementById('counterText');
const timeInfo=document.getElementById('timeInfo');
const level=document.getElementById('level');
const deaths=document.getElementById('deaths');
const time=document.getElementById('time');


//difficulties
const diffUpButton= document.getElementById('difficultyUp');
const diffDownButton= document.getElementById('difficultyDown');
const difficulty= document.getElementById('difficulty');
let difficultyLevel=[  ["Easy", 2000],
                       ["Medium", 1500],
                        ["Hard", 1000]];


let difficultyLevelChoosen =0;

//Difficulty events/handlers
diffUpButton.onclick=levelUp;
diffDownButton.onclick=levelDown;


//sounds
let soundJ=new Audio('sounds/jump1.mp3');
soundJ.volume=0.1;

let lose=new Audio('sounds/lose.mp3');
lose.volume=0.2;

let win=new Audio('sounds/win.mp3');


let click=new Audio('sounds/click.mp3');
click.volume=0.2;

let countDown=new Audio('sounds/countdown.mp3');
countDown.volume=0.2;

let goSound=new Audio('sounds/go.wav');
goSound.volume=0.2;

let background=new Audio('sounds/Skjalg-A-Skagen-Decades.mp3');
//document.getElementById('backgroundMusic');
let backgroundVolume=0.1;
background.volume=backgroundVolume;

//Audio controls

const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const volumeUpButton = document.getElementById('volumeUp');
const volumeDownButton = document.getElementById('volumeDown');
const volumeDisplay= document.getElementById('volumeScreen');

//Audio control events/eventhandlers
playButton.onclick=playMusic;
pauseButton.onclick=pauseMusic;
volumeUpButton.onclick=volumeUpMusic;
volumeDownButton.onclick=volumeDownMusic;



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

readyButton.onclick=function(){
    background.play();
    startCountDown();
}

restartButton.onclick=startCountDown;
gameWonWindow.onclick=onToNextLevel;
window.addEventListener("victory", function(event){
    playerAvatar.classList.add('victorious');
});





//For setting up the visual board
GenerateTable();



//Show Message window
function showMessageWindow(){
    messageWindow.style.visibility="visible"

}


//This I need to hook up to a button
function startCountDown(){
    isFirstPLaced=false;
    click.play();
    playerAvatar.classList.remove('victorious');
    playerXtranslate=-100;
    playerYtranslate=600;
    time.innerHTML=timePerRound/1000;
    level.innerHTML=safePathindex+1;
    GenerateTable();
    let counter=3;
    movesThisTurn=1;
    messageWindow.style.visibility='hidden';
    gameOverWindow.style.visibility='hidden';
    counterWindow.style.visibility='visible';
    counterText.innerHTML=counter;
    countDown.play();
    let counterTimer= setInterval(() => {
        counter--;
        if(counterText.innerHTML==="Go!"){
            clearInterval(counterTimer);
            counterWindow.style.visibility="hidden";
            startNewRound(timePerRound);
            
        }
        
        else if(counter===0){
            counterText.innerHTML="Go!"
            goSound.play();
            
        }

        else{
            countDown.play();
            counterText.innerHTML=counter;
        }

        
        
        
    }, 1000);
    

}

//function to generate table with coordinates as classes
function GenerateTable (){
    let blocks = document.querySelectorAll('.block:not(.green)');
    playerAvatar.classList.remove("fallen");
    playerAvatar.style.visibility="visible";
    playerAvatar.style.transform=' translate3d(-100px,600px,30px)';
    globalPlacementY=0;
    globalPlacementX=0;
    blocks.forEach((block)=>{block.remove()});
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
            

    //setMovingAndGlowing();
    }
    
function setMovingAndGlowing(){
    let blocks = document.querySelectorAll('.block:not(.green):not(.fallen)');
    setInterval(function(){
        for (let i=0; i<5;i++){
            let randomIndex= Math.floor(Math.random()*blocks.length);
            if(!blocks[randomIndex].classList.contains("fallen"))
            {blocks[randomIndex].classList.toggle('move');}

        
            let faces = blocks[randomIndex].querySelectorAll('.face');
            Array.from(faces).forEach((face)=>{
                face.classList.toggle('dull');
                
            })
        }
    },3000);

}

function startNewRound(timePerRound){

    let timePerThisTurn=timePerRound;
    areYouReady=true;
    
    //Set up game for first step of the path
    player.setStartingPosition(Math.floor(safePaths[safePathindex][stepInPath]/10), safePaths[safePathindex][stepInPath]%10);
    movesThisTurn=0;
    updatePlayerOnBoard();
    playerAvatar.style.transition="transform 0.15s ease-in-out";
    shakeTiles(safePaths[safePathindex][stepInPath],stepInPath);
    refreshTimeIndicator(timePerThisTurn);

    let timerThisTurn =setInterval(() => {
        
        movesThisTurn=0;
        fallFakeTiles(safePaths[safePathindex][stepInPath],safePaths[safePathindex][stepInPath+1]);
        stepInPath++;
        if(stepInPath===safePaths[safePathindex].length){
            clearInterval(timerThisTurn);
            setTimeout(()=>{
                win.play();
                gameWonWindow.style.visibility="visible";
                timeInfo.innerHTML=(timePerRound-50)/1000;
                            },800)
        }

        else{

        checkIfPlayerIsAlive(safePaths[safePathindex][stepInPath],timerThisTurn);
        refreshTimeIndicator(timePerThisTurn);
        
        shakeTiles(safePaths[safePathindex][stepInPath],stepInPath);

        }
        

    }, timePerThisTurn);
};

function onToNextLevel(){
    click.play();
    playerAvatar.style.visibility="hidden";
    gameWonWindow.style.visibility="hidden";
    playerAvatar.style.transition="none";
    playerAvatar.style.transform=`translate3d(-100px,600px,-200px)`;
    safePathindex++;
    player.x=0;
    player.y=0;
    stepInPath=0;
    timePerRound-=50;
    deathCounter=0;
    deaths.innerHTML=deathCounter;
    
    
    startCountDown();
}




//Fnctions

//This is the count down that occurs at the beginning of each round
let start;
let oldPlayerYtranslate;
let oldPlayerXtranslate;
let placementYmiddle;
let placementXmiddle;
let placementY;
let placementX;
let isFirstPLaced=false;
let jumphalFTime=50;
//Function to update the position of the grapihical representation of the player
function updatePlayerOnBoard(){
    soundJ.play();
    
    if (movesThisTurn===0){
    inTransition=true;
    placementY=player.y*116+33;
    placementYmiddle= (placementY-playerYtranslate)/2+playerYtranslate;

    oldPlayerYtranslate=playerYtranslate;
    playerYtranslate=placementY;
    
    placementX=player.x*116+33;
    placementXmiddle= (placementX-playerXtranslate)/2+playerXtranslate;
    oldPlayerXtranslate=playerXtranslate;
    playerXtranslate=placementX;

    globalPlacementX=placementX;
    globalPlacementY=placementY;

    if(isFirstPLaced===true){
        playerAvatar.style.transition=`transform 0.05s linear`;
        start= Date.now();
        window.requestAnimationFrame(moveFigureUp);
        setTimeout(function(){
        start= Date.now();
        window.requestAnimationFrame(moveFiguredown);
        playerAvatar.style.visibility="visible";},jumphalFTime);

    }

    else{
        playerAvatar.style.transition="none";
        playerAvatar.style.transform=`translate3d(${placementX}px,${placementY}px,30px)`;
        isFirstPLaced=true;
    }



    

}
    
};


function moveFigureUp(){
    let timestamp= Date.now();
    const elapsed = timestamp-start;
    playerAvatar.style.transform=`translate3d(${Math.min(oldPlayerXtranslate+116/jumphalFTime * elapsed, placementXmiddle)}px,${Math.min(oldPlayerYtranslate+116/jumphalFTime * elapsed, placementYmiddle)}px,${Math.min(30+20/jumphalFTime * elapsed, 50)}px)`;    

   
     if (elapsed<jumphalFTime){
        window.requestAnimationFrame(moveFigureUp);
    }
}
function moveFiguredown(){
    let timestamp= Date.now();
    const elapsed = timestamp-start;
    playerAvatar.style.transform=`translate3d(${Math.min(placementXmiddle+ 116/jumphalFTime * elapsed, placementX)}px,${Math.min(placementYmiddle+116/jumphalFTime * elapsed, placementY)}px,${Math.max(50-20/jumphalFTime * elapsed, 30)}px)`;
    
    if (elapsed<jumphalFTime){
        window.requestAnimationFrame(moveFiguredown);
    }

}

//This is the function to shake the tiles aorund the player except the next safe one
function shakeTiles(currentSafeTile,stepInPath){
    
    let allBlocks=document.querySelectorAll('.block:not(.green)');
    allBlocks.forEach((block)=>{
        
        if (block.classList.contains('shaken')){
            block.classList.remove("shaken");
            
        }
        
    })
    let nextSafeTile=(safePaths[safePathindex][stepInPath+1]);
   
    let listOfAdjacentTiles=getAllAdjacentTile(currentSafeTile,nextSafeTile);
    
    listOfAdjacentTiles.forEach((tile) => {
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
        },timerTime*0.92);
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
        if (tile<10) {finalTileList.push(tile="0"+tile)}
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
        if (tile<10) {finalTilesToFall.push(tile="0"+tile)}
        else{finalTilesToFall.push(tile)}
    })

    finalTilesToFall.forEach(tile => {
        let tileBlock = document.getElementById(`${tile}`);
        tileBlock.classList.remove("shaken");
        tileBlock.classList.remove("move");
        tileBlock.style.transform="transform:rotateZ(0deg)";
        tileBlock.classList.add("fallen");
        tileBlock.style.transition="none";
        ;
        setTimeout(()=>{    
            tileBlock.style.transition="transform 2s ease-in-out";        
            tileBlock.style.transform=`translate3d(0px,0px,-1200px) rotateZ(0deg) rotateY(-120deg) rotateX(-120deg)`;},50)
        
        
    });
    // console.log(`Last safe tile: ${lastSafeTile} next safe: ${nextSafeTileInt}`);
    // console.log(finalTilesToFall);
}

//FUnction to check if the player is alive
function checkIfPlayerIsAlive(currentSafeTile,timer){
    let playerTile=player.getTile();
    
    let safeTile= currentSafeTile+"";

    if(playerTile===safeTile){
        //Game can go on
    }

    else{
       gameOver(timer);

    }

}

//Function to handle if game is gameOver
function gameOver(timer){
    clearInterval(timer);
    movesThisTurn=1;
    deathCounter++;
    deaths.innerHTML=deathCounter;
    playerAvatar.style.transition="none";
    playerAvatar.style.transition="transform 2s ease-in-out";
    lose.play();
    playerAvatar.style.transform=`translate3d(${globalPlacementX}px,${globalPlacementY}px,-800px) rotateY(-120deg) rotateX(-120deg)`;
    setTimeout(()=>{
        player.x=0;
        player.y=0;
        gameOverWindow.style.visibility="visible";
        playerAvatar.style.visibility='hidden';
        playerAvatar.style.transition="none";
        playerAvatar.style.transform=`translate3d(-100px,600px,-200px)`;
        stepInPath=0;
    },1500)
}


//Arrow key eccent handlers
function pressedForwardButton(){
    if (movesThisTurn<1 && areYouReady!==false){
        player.moveForward();
        updatePlayerOnBoard();
        movesThisTurn=1;
    }
    
}
function pressedLeftdButton(){
    if (movesThisTurn<1 && areYouReady!==false){
        player.moveLeft();
        updatePlayerOnBoard();
        movesThisTurn=1;
    }
}
function pressedRightdButton(){
    if (movesThisTurn<1 && areYouReady!==false){
    player.moveRight();
    updatePlayerOnBoard();
    movesThisTurn=1;
}
}
function pressedBackButton(){
    if (movesThisTurn<1 && areYouReady!==false)
    {
    player.moveBack();
    updatePlayerOnBoard();
    movesThisTurn=1;
    }
}

//Level handling functions

function levelUp(){
    click.play();
    if(difficultyLevelChoosen<2){
        difficultyLevelChoosen++;
        difficulty.innerHTML=difficultyLevel[difficultyLevelChoosen][0];
        timePerRound=difficultyLevel[difficultyLevelChoosen][1];
    }

};

function levelDown(){
    click.play();
    if(difficultyLevelChoosen>0){
        difficultyLevelChoosen--;
        difficulty.innerHTML=difficultyLevel[difficultyLevelChoosen][0];
        timePerRound=difficultyLevel[difficultyLevelChoosen][1];
    }

};

//AudioControlFunctions

function playMusic(){
    click.play();
    background.play();
}

function pauseMusic(){
    click.play();
    background.pause();
}
    
function volumeUpMusic(){
    click.play();
    if (backgroundVolume<1){
        backgroundVolume+=0.05;
        background.volume=Number.parseFloat(backgroundVolume).toFixed(2);
        volumeDisplay.innerHTML=Number.parseFloat(backgroundVolume).toFixed(2);
    }
}
function volumeDownMusic(){
    click.play();
    if (backgroundVolume>0){
        backgroundVolume-=0.05;
        background.volume=Number.parseFloat(backgroundVolume).toFixed(2);
        volumeDisplay.innerHTML=Number.parseFloat(backgroundVolume).toFixed(2);
    }

}