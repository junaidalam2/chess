
/*
TODO:
-create a session class that can create instances of the other relevant classes

*/

import {

    //board
    boardDimensions,
    scaleFactor,
    gridWidth,
    gameboardColor,
    selectedSquareColor,
    possibleMovesColor,
    gridLineColor,
    gridLineCursor,
    mousePositionOffset,

    //players
    topPlayerName,
    bottomPlayerName,
    topPlayerNotation,
    bottomPlayerNotation,

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
        this. drawPossibleMovesGrid();

        if ((x > mousePositionOffset.x && x < scaleFactor * boardDimensions) && 
            (y > mousePositionOffset.y && y < scaleFactor * boardDimensions)) {
                this.mouseGridPosition.x = Math.floor( x / scaleFactor); 
                this.mouseGridPosition.y = Math.floor( y / scaleFactor);
                this.drawGridLinesBox(this.mouseGridPosition.x , this.mouseGridPosition.y, gridLineCursor);
                //this. drawPossibleMovesGrid();
            } else {
            this.mouseGridPosition.x = null;
            this.mouseGridPosition.y = null;
        }
    }

    
    unidirectionalFactor() {

        if(this.pieceSelected.moves.unidirectional && this.pieceSelected.color.charAt(0) == bottomPlayerNotation) {
            return -1
        }
        return 1

    }


    possibleMoves() {

        if(!this.pieceSelected) return;
        
        switch (this.pieceSelected.type) {
            case 'knight':
                this.pieceSelected.possibleMovesKnight();
                break;
            case 'pawn':
                this.pieceSelected.possibleMovesPawn();
                break;
            default:
                this.pieceSelected.possibleMovesDefault();
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
                this.drawPossibleMovesGrid();
                
            
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
                //console.log(element)
                this.drawSquare(element.position[0],element.position[1], selectedSquareColor);
            }
       })
    }


    drawPossibleMovesGrid() {
        this.possibleMovesArray.forEach((row, indexY) => {
            row.forEach((element, indexX) => {
                if(element == 1) {
                    this.drawGridLinesBox(indexX , indexY, possibleMovesColor);
                };
            });
        }); 
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

    possibleMovesKnight() {
        
        if(this.type != 'knight') return

        let coordinatesArray = this.moves.coordinates;
        let occupiedSamePlayer = this.color.charAt(0);

        coordinatesArray.forEach((element) => {
            //console.log(coordinatesArray);
            
            let xCoordinate = this.position[0] + element[0];
            let yCoordinate = this.position[1] + element[1];
            
                //console.log(yCoordinate, xCoordinate)
                //console.log("-------");
                //console.log(yCoordinate, xCoordinate);

                if(xCoordinate < 0 || xCoordinate >= boardDimensions || 
                    yCoordinate < 0 || yCoordinate >= boardDimensions) {
                        return;
                } 

                if(board.boardArray[yCoordinate][xCoordinate] != occupiedSamePlayer) {
                    board.possibleMovesArray[yCoordinate][xCoordinate] = 1;
                    //board.drawGridLinesBox(xCoordinate , yCoordinate, possibleMovesColor);
                }

        });
        console.table(board.possibleMovesArray);
    }

    possibleMovesDefault() {

        let coordinatesArray = this.moves.coordinates;
        let occupiedSamePlayer = this.color.charAt(0);
        let unidirectionalFactor = this.moves.unidirectional ? -1: 1; 

        
        coordinatesArray.forEach((element) => {
            this.evaluateCoordinates(element, occupiedSamePlayer, unidirectionalFactor, true, false)
            /*
            console.log(element)
            
            let exitFlag = 0;
            let xDirection = element[0] == 0 ? 0 : element[0] / Math.abs(element[0]);
            let yDirection = element[1] == 0 ? 0 : element[1] / Math.abs(element[1]);
            let xCoordinate = this.position[0];
            let yCoordinate = this.position[1];
            
            //let occupiedSamePlayer = this.pieceSelected.color.charAt(0);
            let occupiedOtherPlayerCounter = 0;

            let xMax = element[0] == 0 ? boardDimensions - 1 : Math.abs(element[0]);
            let yMax = element[1] == 0 ? boardDimensions - 1 : Math.abs(element[1]);
            let xCounter = 0;
            let yCounter = 0;

            do {

                console.log("x:", xCoordinate, "y:", yCoordinate)
                console.log(element)
                console.log("x:", element[0], "y:", element[1])
                console.log("-------")
                
                xCoordinate = xCoordinate + xDirection;
                yCoordinate = yCoordinate + yDirection;

                console.log("x:", xCoordinate, "y:", yCoordinate)

                if(xCoordinate < 0 || xCoordinate >= boardDimensions || 
                    yCoordinate < 0 || yCoordinate >= boardDimensions) {
                        console.log('offboard')
                        return;
                } 
                
                if(board.boardArray[yCoordinate][xCoordinate] == occupiedSamePlayer ||
                    occupiedOtherPlayerCounter > 1 || xCounter >= xMax || yCounter >= yMax) {
                        console.log('occupiedSamePlayer: ', board.boardArray[yCoordinate][xCoordinate], yCoordinate, xCoordinate, board.boardArray[yCoordinate][xCoordinate] == occupiedSamePlayer)
                        console.log('occupiedOtherPlayerCounter: ', occupiedOtherPlayerCounter)
                        console.log('xCounter > xMax: ', xCounter, xMax)
                        console.log('yCounter > yMax: ', yCounter, yMax)
                        exitFlag = 1;
                } else {

                    console.log('this.boardArray[yCoordinate][xCoordinate]', board.boardArray[yCoordinate][xCoordinate])
                    console.log('this.boardArray[yCoordinate][xCoordinate] != occupiedSamePlayer', board.boardArray[yCoordinate][xCoordinate] != occupiedSamePlayer)
                    if(board.boardArray[yCoordinate][xCoordinate] &&
                        board.boardArray[yCoordinate][xCoordinate] != occupiedSamePlayer) {
                            occupiedOtherPlayerCounter++;
                            console.log('occupiedOtherPlayerCounter', occupiedOtherPlayerCounter)
                    }
                    
                    if( occupiedOtherPlayerCounter < 2 ) {
                        board.possibleMovesArray[yCoordinate][xCoordinate] = 1;
                    }
                }

                xCounter++;
                yCounter++;
                
            } while (!exitFlag);
            
            */
           
        });
        
        this.checkCastleConditions();
        console.table(board.possibleMovesArray);
        
    }


    checkCastleConditions() {

        if(this.type != 'king') return;
        if(this.moves.hadFirstMove) return;

        let rightSquareClear = this.checkCastleSideSquares('right');
        let leftSquareClear = this.checkCastleSideSquares('left');

        if(!rightSquareClear && !leftSquareClear) return;
        
        let rightRookCoordinates = [[this.position[0] + 3], [this.position[1]]];
        let leftRookCoordinates = [[this.position[0] - 4], [this.position[1]]];
        
        let rightRook = null;
        let leftRook = null;

        whitePlayer.pieces.forEach((element) => {
            if(rightSquareClear && element.position[0] == rightRookCoordinates[0] && element.position[1] == rightRookCoordinates[1] && element.type == 'rook' && !element.moves.hadFirstMove) {
                rightRook = element;
                board.possibleMovesArray[element.position[1]][element.position[0] - 1] = 1;
            };
            
            if(leftSquareClear && element.position[0] == leftRookCoordinates[0] && element.position[1] == leftRookCoordinates[1] && element.type == 'rook' && !element.moves.hadFirstMove) {
                leftRook = element;
                board.possibleMovesArray[element.position[1]][element.position[0] + 1] = 1;
            };
        });

    }

    
    checkCastleSideSquares(side) {

        let counter = side == 'right' ? boardDimensions - this.position[0] - 1 : this.position[0];
        let XCoordinate = this.position[0];

        do {

            XCoordinate = side == 'right' ? XCoordinate += 1: XCoordinate -= 1;
            counter--;

        } while (counter > 0 && !board.boardArray[this.position[1]][XCoordinate]);

        return !counter
    }
    

    possibleMovesPawn() {

        if(this.type != 'pawn') return

        let coordinatesArray = this.moves.coordinates;
        let occupiedSamePlayer = this.color.charAt(0);
        let unidirectionalFactor = this.moves.unidirectional && occupiedSamePlayer == 'w' ? -1 : 1;
        
        coordinatesArray.forEach((element) => {
            this.evaluateCoordinates(element, occupiedSamePlayer, unidirectionalFactor, false, false)
        }); 

       if(this.moves.hasSpecialFirstMove && !this.moves.hadFirstMove) {
            let specialFirstMoveArray = this.moves.specialFirstMoveCoordinates
            specialFirstMoveArray.forEach((element) => {
                this.evaluateCoordinates(element, occupiedSamePlayer, unidirectionalFactor, false, false);
            });
        }

       if(this.moves.differentAttack) {
            let attackMoveArray = this.moves.differentAttackMoveCoordiates
            attackMoveArray.forEach((element) => {
                this.evaluateCoordinates(element, occupiedSamePlayer, unidirectionalFactor, true, true);
            });
        }

    }


    evaluateCoordinates(element, occupiedSamePlayer, unidirectionalFactor, canAttack, onlyAttack) {

        let attackCondition = canAttack? 1 : 0
        let occupiedOpposingPlayer = occupiedSamePlayer == this.color.charAt(0) ? topPlayerNotation : bottomPlayerNotation
        //console.log(occupiedOpposingPlayer)
        //console.table(board.boardArray)
        //console.log(element)
        //console.log("unidirectionalFactor:", unidirectionalFactor);
        let yMove  = element[1] * unidirectionalFactor;
        //console.log(element)
        
        let exitFlag = 0;
        let xDirection = element[0] == 0 ? 0 : element[0] / Math.abs(element[0]);
        let yDirection = yMove == 0 ? 0 : yMove / Math.abs(yMove);
        let xCoordinate = this.position[0];
        let yCoordinate = this.position[1];
        let occupiedOtherPlayerCounter = 0;

        let xMax = element[0] == 0 ? boardDimensions - 1 : Math.abs(element[0]);
        let yMax = yMove == 0 ? boardDimensions - 1 : Math.abs(yMove);
        let xCounter = 0;
        let yCounter = 0;

        do {

            //console.log("x:", xCoordinate, "y:", yCoordinate)
            //console.log(element)
            //console.log("x:", element[0], "y:", yMove)
            //console.log("-------")
            
            xCoordinate = xCoordinate + xDirection;
            yCoordinate = yCoordinate + yDirection;

            //console.log("x:", xCoordinate, "y:", yCoordinate)

            if(xCoordinate < 0 || xCoordinate >= boardDimensions || 
                yCoordinate < 0 || yCoordinate >= boardDimensions) {
                    //console.log('offboard')
                    return;
            } 
            
            if(board.boardArray[yCoordinate][xCoordinate] == occupiedSamePlayer ||
                occupiedOtherPlayerCounter > attackCondition || xCounter >= xMax || yCounter >= yMax) {
                    //console.log('occupiedSamePlayer: ', board.boardArray[yCoordinate][xCoordinate], yCoordinate, xCoordinate, board.boardArray[yCoordinate][xCoordinate] == occupiedSamePlayer)
                    //console.log('occupiedOtherPlayerCounter: ', occupiedOtherPlayerCounter)
                    //console.log('xCounter > xMax: ', xCounter, xMax)
                    //console.log('yCounter > yMax: ', yCounter, yMax)
                    exitFlag = 1;
            } else {

                //console.log('this.boardArray[yCoordinate][xCoordinate]', board.boardArray[yCoordinate][xCoordinate])
                //console.log('this.boardArray[yCoordinate][xCoordinate] != occupiedSamePlayer', board.boardArray[yCoordinate][xCoordinate] != occupiedSamePlayer)
                if(board.boardArray[yCoordinate][xCoordinate] &&
                    board.boardArray[yCoordinate][xCoordinate] == occupiedOpposingPlayer /*!= occupiedSamePlayer*/) {
                        occupiedOtherPlayerCounter++;
                        //console.log('occupiedOtherPlayerCounter', occupiedOtherPlayerCounter)
                }

                //console.log(onlyAttack, board.boardArray[yCoordinate][xCoordinate], occupiedOpposingPlayer)
                if(onlyAttack && board.boardArray[yCoordinate][xCoordinate] == occupiedOpposingPlayer) {
                    console.log('condition met')
                    board.possibleMovesArray[yCoordinate][xCoordinate] = 1;
                } else if (!onlyAttack && occupiedOtherPlayerCounter < attackCondition + 1 ) {
                    board.possibleMovesArray[yCoordinate][xCoordinate] = 1;
                }
            }

            xCounter++;
            yCounter++;

        } while (!exitFlag);

    }


}




const board = new Board(boardDimensions, scaleFactor);
const blackPlayer = new Players(topPlayerName);
const whitePlayer = new Players(bottomPlayerName, true);


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

blackPlayer.pieces = setupPieces(topPlayerName);
whitePlayer.pieces = setupPieces(bottomPlayerName);

window.addEventListener('mousemove', function(e) {
    board.mapMousePositionToGrid(e.x, e.y);
});

window.addEventListener('click', function() {
    board.clickListener();
});