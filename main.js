
/*
TODO:
-create a session class that can create instances of the other relevant classes
-allow a user to click on a square and move piece

*/

import {

    //board
    boardDimensions,
    scaleFactor,
    gridWidth,
    gameboardColor,
    selectedSquareColor,
    gridLineColor,
    gridLineCursor,
    mousePositionOffset,

    //pieces
    pieceHeight,
    pieceWidth,
    startingPosition,
    moves,
    pieceImages,
    pieceNamesArray,
    pieceCountArray,

} from './constants.js';


class Board {

    constructor(boardDimensions, scaleFactor) {
        this.dimensions = boardDimensions;
        this.scaleFactor = scaleFactor;
        this.boardArray = this.createArray();
        this.possibleMovesArray = this.createArray();
        this.mouseGridPosition = {x: null, y: null};
        this.mouseSquareSelected = {x: null, y: null};
        this.pieceSelected = null;
        this.desiredPieceSquare = {x: null, y: null};
        this.setCanvas();
        this.drawGameboard();
    }

    setCanvas() {
        this.canvasBoard = document.querySelector('.board');
        this.contextBoard = this.canvasBoard.getContext('2d');
        this.canvasBoard.width = boardDimensions * this.scaleFactor;
        this.canvasBoard.height = boardDimensions * this.scaleFactor;
        this.contextBoard.scale(this.scaleFactor, this.scaleFactor);
    }

    createArray() {
        
        let twoDimensionalArray = []
        
        for(let i = 0; i < this.dimensions; i++) {
            const rowArray = new Array(this.dimensions).fill(0);
            twoDimensionalArray.push(rowArray);
        }

        return twoDimensionalArray
    }

    fillCanvasBackground() {
        this.contextBoard.fillStyle = gameboardColor;
        this.contextBoard.fillRect(0, 0, this.canvasBoard.width, this.canvasBoard.height);
    }
    
    drawGridLinesBox(coordinateX , coordinateY, gridLineColor) {
        this.contextBoard.strokeStyle = gridLineColor;
        this.contextBoard.lineWidth = gridWidth / this.scaleFactor;
        this.contextBoard.strokeRect(coordinateX, coordinateY, gridWidth, gridWidth);
    } 

    drawGridLinesBoard() {
        this.boardArray.forEach((row, indexY) => {
            row.forEach((square, indexX) => {
                this.drawGridLinesBox(indexX , indexY, gridLineColor);
            })
        })
    }

    drawGameboard() {
        this.fillCanvasBackground();
        this.drawGridLinesBoard();
    }

    drawSquare(indexX, indexY, color) {
        this.fillSquareBackground(indexX, indexY, color);
        this.pieceSelected.drawPiece();

    }

    fillSquareBackground(indexX, indexY, color) {
        this.contextBoard.fillStyle = color;
        this.contextBoard.fillRect(indexX, indexY, gridWidth, gridWidth);
    }

    mapMousePositionToGrid(x, y) {
        this.drawGridLinesBoard();

        if ((x > mousePositionOffset.x && x < scaleFactor * boardDimensions) && 
            (y > mousePositionOffset.y && y < scaleFactor * boardDimensions)) {
                this.mouseGridPosition.x = Math.floor( x / scaleFactor); 
                this.mouseGridPosition.y = Math.floor( y / scaleFactor);
                this.drawGridLinesBox(this.mouseGridPosition.x , this.mouseGridPosition.y, gridLineCursor);
        } else {
            this.mouseGridPosition.x = null;
            this.mouseGridPosition.y = null;
        }
    }

    
    unidirectionalFactor() {

        if(this.pieceSelected.moves.unidirectional && this.pieceSelected.color.charAt(0) == 'w') {
            return -1
        }
        return 1

    }



    possibleMoves() {

        let coordinatesArray = this.pieceSelected.moves.coordinates;
        let canJump = this.pieceSelected.moves.jump;
        let currentPosition = this.pieceSelected.position;
        let unidirectionalFactor = this.unidirectionalFactor();
        


        if(canJump) {

            coordinatesArray.forEach((element) => {
                //console.log(coordinatesArray);
          
                let xCoordinate = currentPosition[0];
                let yCoordinate = currentPosition[1];
                let occupiedSamePlayer = this.pieceSelected.color.charAt(0);

                    //console.log(yCoordinate, xCoordinate)

                    xCoordinate = xCoordinate + element[0];
                    yCoordinate = yCoordinate + element[1];

                    //console.log("-------");
                    //console.log(yCoordinate, xCoordinate);

                    if(xCoordinate < 0 || xCoordinate >= boardDimensions || 
                        yCoordinate < 0 || yCoordinate >= boardDimensions) {
                            return;
                    } 

                    if(this.boardArray[yCoordinate][xCoordinate] != occupiedSamePlayer) {
                        this.possibleMovesArray[yCoordinate][xCoordinate] = 1;
                    } 

            });

            //console.table(this.possibleMovesArray);

        } else {

            coordinatesArray.forEach((element) => {
               
                console.log(element)
                console.log("unidirectionalFactor:", unidirectionalFactor);
                let yMove  = element[1] * unidirectionalFactor;
                console.log(element)
                
                let exitFlag = 0;
                let xDirection = element[0] == 0 ? 0 : element[0] / Math.abs(element[0]);
                let yDirection = yMove == 0 ? 0 : yMove / Math.abs(yMove);
                let xCoordinate = currentPosition[0];
                let yCoordinate = currentPosition[1];
                
                let occupiedSamePlayer = this.pieceSelected.color.charAt(0);
                let occupiedOtherPlayerCounter = 0;

                let xMax = element[0] == 0 ? boardDimensions - 1 : Math.abs(element[0]);
                let yMax = yMove == 0 ? boardDimensions - 1 : Math.abs(yMove);
                let xCounter = 0;
                let yCounter = 0;

                do {

                    console.log("x:", xCoordinate, "y:", yCoordinate)
                    console.log(element)
                    console.log("x:", element[0], "y:", yMove)
                    console.log("-------")
                    
                    xCoordinate = xCoordinate + xDirection;
                    yCoordinate = yCoordinate + yDirection;

                    console.log("x:", xCoordinate, "y:", yCoordinate)

                    if(xCoordinate < 0 || xCoordinate >= boardDimensions || 
                        yCoordinate < 0 || yCoordinate >= boardDimensions) {
                            console.log('offboard')
                            return;
                    } 
                    
                    if(this.boardArray[yCoordinate][xCoordinate] == occupiedSamePlayer ||
                        occupiedOtherPlayerCounter > 1 || xCounter >= xMax || yCounter >= yMax) {
                            console.log('occupiedSamePlayer: ', this.boardArray[yCoordinate][xCoordinate], yCoordinate, xCoordinate, this.boardArray[yCoordinate][xCoordinate] == occupiedSamePlayer)
                            console.log('occupiedOtherPlayerCounter: ', occupiedOtherPlayerCounter)
                            console.log('xCounter > xMax: ', xCounter, xMax)
                            console.log('yCounter > yMax: ', yCounter, yMax)
                            exitFlag = 1;
                    } else {

                        if(this.possibleMovesArray[yCoordinate][xCoordinate] &&
                            this.possibleMovesArray[yCoordinate][xCoordinate] != occupiedSamePlayer) {
                                occupiedOtherPlayerCounter++;
                        }
                        
                       this.possibleMovesArray[yCoordinate][xCoordinate] = 1;
                    }

                    xCounter++;
                    yCounter++;

                } while (!exitFlag);

            });

            console.table(this.possibleMovesArray);

        } 
    }


    clickListener() {
        if(this.mouseGridPosition.x != null && this.mouseGridPosition.y != null) {   
                this.mouseSquareSelected.x = this.mouseGridPosition.x;
                this.mouseSquareSelected.y = this.mouseGridPosition.y;
            
            if(!this.pieceSelected) {
                this.findPieceSelected(whitePlayer);
                //console.log(this.pieceSelected);
                this.possibleMoves();
            
            } else if (this.pieceSelected.position[0] == this.mouseSquareSelected.x &&
                this.pieceSelected.position[1] == this.mouseSquareSelected.y) {
                    this.drawSquare(this.pieceSelected.position[0], this.pieceSelected.position[1], gameboardColor);
                    this.pieceSelected = null;
                    
                    if(this.desiredPieceSquare.x != null && this.desiredPieceSquare.y != null) {
                        this.fillSquareBackground(this.desiredPieceSquare.x, this.desiredPieceSquare.y, gameboardColor);
                        this.drawGridLinesBox(this.desiredPieceSquare.x, this.desiredPieceSquare.y, gridLineColor);
                    }
                    
                    this.desiredPieceSquare.x = null;
                    this.desiredPieceSquare.y = null;
                    this.possibleMovesArray = this.createArray();
            
            } else if (this.pieceSelected) {
                
                if (this.desiredPieceSquare.x != null && this.desiredPieceSquare.y != null) {
                    this.fillSquareBackground(this.desiredPieceSquare.x, this.desiredPieceSquare.y, gameboardColor);
                    this.drawGridLinesBox(this.desiredPieceSquare.x, this.desiredPieceSquare.y, gridLineColor);
                }
                
                if(this.boardArray[this.mouseSquareSelected.y][this.mouseSquareSelected.x] == 0) {
                    if(this.desiredPieceSquare.x == this.mouseSquareSelected.x && 
                        this.desiredPieceSquare.y == this.mouseSquareSelected.y) {
                            this.fillSquareBackground(this.pieceSelected.position[0], this.pieceSelected.position[1], gameboardColor);
                            this.boardArray[this.pieceSelected.position[1]][this.pieceSelected.position[0]] = 0;
                            this.pieceSelected.position[0] = this.desiredPieceSquare.x;
                            this.pieceSelected.position[1] = this.desiredPieceSquare.y;
                            this.boardArray[this.pieceSelected.position[1]][this.pieceSelected.position[0]] = this.pieceSelected.color.charAt(0);
                            this.drawSquare(this.pieceSelected.position[0], this.pieceSelected.position[1], gameboardColor);
                            this.desiredPieceSquare.x = null;
                            this.desiredPieceSquare.y = null;
                            this.pieceSelected = null;
                            this.possibleMovesArray = this.createArray();
                    } else { 
                            this.desiredPieceSquare.x = this.mouseSquareSelected.x;
                            this.desiredPieceSquare.y = this.mouseSquareSelected.y;
                            this.fillSquareBackground(this.desiredPieceSquare.x, this.desiredPieceSquare.y, selectedSquareColor);
                    }
                }
            }
        }
    }

    findPieceSelected(player) {
        player.pieces.forEach((element) => {
            if(element.position[0] == this.mouseSquareSelected.x && element.position[1] == this.mouseSquareSelected.y) {
                this.pieceSelected = element;
                console.log(element)
                this.drawSquare(element.position[0],element.position[1], selectedSquareColor);
            }
       })
    }

 
}


class Players {
    constructor(color, turn = false) {
        this.color = color;
        this.score = 0;
        this.turn = turn;
        this.pieces = null;
        this.takenPieces = [];
    }
}


class Pieces {
    constructor(type, moves, color, imagePath, position) {
        this.type = type;
        this.moves = moves;
        this.color = color;
        this.imagePath = imagePath;
        this.position = position;
        this.active = true;
        this.drawPiece();
    }

    drawPiece() {
        let img = new Image();
        img.src = this.imagePath;
        img.onload = () => {
            board.contextBoard.drawImage(img, this.position[0], this.position[1], pieceWidth, pieceHeight);
        }
        this.updateBoardArray();
    }

    updateBoardArray() {
        board.boardArray[this.position[1]][this.position[0]] = this.color.charAt(0);
        //console.log(board.boardArray);
    }



    
}


const board = new Board(boardDimensions, scaleFactor);
const blackPlayer = new Players('black');
const whitePlayer = new Players('white', true);


function setupPieces(color) {

    let pieceInstanceArray = [];

    pieceNamesArray.forEach((element, index) => {
        for(let i = 0; i < pieceCountArray[index]; i++) {
            const piece = new Pieces(element, moves[element], color, pieceImages[element][color], startingPosition[element][color][i]);
            pieceInstanceArray.push(piece);
        }
    });

    return pieceInstanceArray;
}

blackPlayer.pieces = setupPieces('black');
whitePlayer.pieces = setupPieces('white');

window.addEventListener('mousemove', function(e) {
    board.mapMousePositionToGrid(e.x, e.y);
});

window.addEventListener('click', function() {
    board.clickListener();
});