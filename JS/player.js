// This class is representing the little figurine on the board.
//This is the player.
//This object knows nothing about the objects found in the main JS file.
//I seperated it entirely from it

class Player{
    constructor(name){
        this.name = name;
    }

    x=0;
    y=0;
    isAlive=true;
    
    //Moving towards X direction
    moveForward(){
        if(this.x<10) this.x+=1;
    }

    //Moving towards negative Y direction
    moveLeft(){
        if(this.y>0) this.y-=1;
    }

    //Moving towards positive Y direction
    moveRight(){
        if(this.y<9) this.y+=1;
    }

    //Moving towards negativ X direction
    moveBack(){
        if(this.x>0) this.x-=1;
    }

    //Set the starting position at the beginning of each round
    setStartingPosition(posY, posX){
        this.y=posY;
        this.x=posX;
    }

}

export default Player;