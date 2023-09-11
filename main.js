
import {

    boardDimensions,
    scaleFactor,
    gridWidth,
    gameboardColor,
    gridLineColor,

} from './constants.js'


class Environment {

    constructor(boardDimensions, scaleFactor) {
        this.dimensions = boardDimensions;
        this.scaleFactor = scaleFactor;
        this.boardArray = [];
        this.setCanvas();
        this.createGameboard();
        this.drawGameboard();
    }

    setCanvas() {
        this.canvasBoard = document.querySelector('.board');
        this.contextBoard = this.canvasBoard.getContext('2d');
        this.canvasBoard.width = boardDimensions * this.scaleFactor;
        this.canvasBoard.height = boardDimensions * this.scaleFactor;
        this.contextBoard.scale(this.scaleFactor, this.scaleFactor);
    }

    createGameboard() {
        for(let i = 0; i < this.dimensions; i++) {
            const rowArray = new Array(this.dimensions).fill(0);
            this.boardArray.push(rowArray);
        }
    }

    fillCanvasBackground() {
        this.contextBoard.fillStyle = gameboardColor;
        this.contextBoard.fillRect(0, 0, this.canvasBoard.width, this.canvasBoard.height);
    }
    
    drawGridLinesBox(x , y){
        this.contextBoard.strokeStyle = gridLineColor;
        this.contextBoard.lineWidth = gridWidth / this.scaleFactor;
        this.contextBoard.strokeRect(x, y, 1, 1);
    } 

    drawGridLinesBoard() {
        this.boardArray.forEach((row, indexY) => {
            row.forEach((square, indexX) => {
                this.drawGridLinesBox(indexX , indexY);
            })
        })
    }

    drawGameboard() {
        this.fillCanvasBackground();
        this.drawGridLinesBoard();
    }

}

const environment = new Environment(boardDimensions, scaleFactor);
