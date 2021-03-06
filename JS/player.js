// This class is representing the little figure on the board.
//This is the player.
//This object knows nothing about the objects found in the main JS file.
//I seperated it entirely from it

class Player{
    constructor(name){
        this.name = name;
    }
    //Its coordinates
    x=0;
    y=0;

    
    //Moving towards X direction
    moveForward(){
        if(this.x<10) this.x+=1;
        if(this.x===10) {
            let victory = new Event('victory');
            dispatchEvent(victory);}
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

    //Get the tile on which the plaze is standing.
    //Returned variable is in string
    getTile(){
        let playerTile="";
        playerTile=""+this.y+this.x;

        return playerTile;
    }


}

export default Player;