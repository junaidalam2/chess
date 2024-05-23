
/*
TODO:
-complete moves for each piece + scoring
-clean up moves object in constants.js
-add winning and draw conditions
-create a session class that can create instances of the other relevant classes
-investigate min-max
-authentication
-database for wins, losses, draws, scores
-sound for clicks, win, loss, draw
-visualization - taken pieces, scores, volume 
-vu

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
        this.mouseGridPosition = {x: null, y: null};
        this.mouseSquareSelected = {x: null, y: null};
        this.pieceSelected = null;
        this.desiredPieceSquare = {x: null, y: null};
        this.rookForCastling = {left: null, right: null};
        this.takenPiecesFromTopPlayer = [];
        this.takenPiecesFromBottomPlayer = [];
        this.boardArray = this.createArray();
        this.possibleMovesArray = this.createArray();
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

    drawSquareSelectedPiece(color) {

        if(!this.pieceSelected) return;

        this.fillSquareBackground(this.pieceSelected.position[0],this.pieceSelected.position[1], color);
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
            } else {
            this.mouseGridPosition.x = null;
            this.mouseGridPosition.y = null;
        }
    }

    unidirectionalFactor() {

        if(this.pieceSelected.moves.unidirectional 
            && this.pieceSelected.color.charAt(0) == bottomPlayerNotation) {
                return -1;
        }
        return 1;
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
            case 'king':
                this.pieceSelected.checkCastleConditions();
            default:
                this.pieceSelected.possibleMovesDefault();
        }
    }

    checkPlayerTurn() {
        return whitePlayer.turn ? whitePlayer : blackPlayer;
    }

    changePlayerturn() {

        if(whitePlayer.turn) {
            blackPlayer.turn = true;
            whitePlayer.turn = false;
        } else {
            blackPlayer.turn = false;
            whitePlayer.turn = true;
        }
    }

    clickListener() {
        if(this.mouseGridPosition.x != null && this.mouseGridPosition.y != null) {   
                this.mouseSquareSelected.x = this.mouseGridPosition.x;
                this.mouseSquareSelected.y = this.mouseGridPosition.y;
            
            //selecting a piece when no piece originally selected
            if(!this.pieceSelected) {
                
                let player = this.checkPlayerTurn();
                //this.pieceSelected = this.findPiecebyPosition(player, this.mouseSquareSelected.x, this.mouseSquareSelected.y);
                //let index = this.findPiecebyPosition(player, this.mouseSquareSelected.x, this.mouseSquareSelected.y)
                //this.pieceSelected = player.pieces[index];
                this.findPieceSelected(player)
                this.drawSquareSelectedPiece(selectedSquareColor); //-->
                this.possibleMoves();
                this.drawPossibleMovesGrid();
                
            //unselecting a piece that was originally selected
            } else if (this.pieceSelected.position[0] == this.mouseSquareSelected.x &&
                this.pieceSelected.position[1] == this.mouseSquareSelected.y) {
                    this.drawSquareSelectedPiece(gameboardColor);
                    this.pieceSelected = null;
                    
                    if(this.desiredPieceSquare.x != null && this.desiredPieceSquare.y != null) {
                        this.fillSquareBackground(this.desiredPieceSquare.x, this.desiredPieceSquare.y, gameboardColor);
                    }
                    
                    this.desiredPieceSquare = {x: null, y: null};
                    this.possibleMovesArray = this.createArray();
                    this.unselectRookforCastling();
                    this.drawGridLinesBoard();
                    this.drawPossibleMovesGrid();
            
            } else if (this.pieceSelected) {
                
                //draw background after second click on  destination square
                if (this.desiredPieceSquare.x != null && this.desiredPieceSquare.y != null) {
                    this.fillSquareBackground(this.desiredPieceSquare.x, this.desiredPieceSquare.y, gameboardColor);
                    this.drawGridLinesBox(this.desiredPieceSquare.x, this.desiredPieceSquare.y, gridLineColor);
                }
                
                //second click on the destination square leading to a moved piece
                if(this.boardArray[this.mouseSquareSelected.y][this.mouseSquareSelected.x] == 0 
                    || this.boardArray[this.mouseSquareSelected.y][this.mouseSquareSelected.x] == this.findOpposingPlayerNotation()) {
                    
                    if(this.desiredPieceSquare.x == this.mouseSquareSelected.x && 
                        this.desiredPieceSquare.y == this.mouseSquareSelected.y) {
                            this.fillSquareBackground(this.pieceSelected.position[0], this.pieceSelected.position[1], gameboardColor);
                            this.boardArray[this.pieceSelected.position[1]][this.pieceSelected.position[0]] = 0;
                            this.pieceSelected.position = [this.desiredPieceSquare.x, this.desiredPieceSquare.y];
                            this.checkDestinationSquareforOpposingPiece(this.desiredPieceSquare.x, this.desiredPieceSquare.y);
                            this.pieceSelected.moves.hadFirstMove = true;
                            this.boardArray[this.pieceSelected.position[1]][this.pieceSelected.position[0]] = this.pieceSelected.color.charAt(0);
                            this.checkIfKingCastled();
                            this.unselectRookforCastling();
                            this.drawSquareSelectedPiece(gameboardColor);
                            this.desiredPieceSquare = {x: null, y: null};
                            this.pieceSelected = null;
                            this.possibleMovesArray = this.createArray();
                            this.changePlayerturn();
                            console.table(this.boardArray);
                    } 
                    
                    //initial click on destination square
                    else { 
                            this.desiredPieceSquare = {x: this.mouseSquareSelected.x, y: this.mouseSquareSelected.y};
                            this.fillSquareBackground(this.desiredPieceSquare.x, this.desiredPieceSquare.y, selectedSquareColor);
                    }
                }
            }
        }
    }

    checkIfKingCastled(){


        //console.log('this.pieceSelected.type', this.pieceSelected.type)
        if(this.pieceSelected.type != 'king') return;

        let kingStartingPositionXCoordinate = startingPosition.king.black[0][0];
        //console.log('kingStartingPositionXCoordinate', kingStartingPositionXCoordinate)
        let rightKingXCoordinate = this.pieceSelected.moves.specialFirstMoveCoordinates[0][0] + kingStartingPositionXCoordinate;
        
        let leftKingXCoordinate = this.pieceSelected.moves.specialFirstMoveCoordinates[1][0] + kingStartingPositionXCoordinate;
        //console.log('this.pieceSelected.moves.specialFirstMoveCoordinates[1][0]', this.pieceSelected.moves.specialFirstMoveCoordinates[1][0])
        
        //console.log('left', this.rookForCastling.left)
        //console.log('x position', this.pieceSelected.position[0])
        //console.log('leftKingXCoordinate', leftKingXCoordinate)

        if(this.rookForCastling.left && this.pieceSelected.position[0] == leftKingXCoordinate) {
            //console.log('condition met left')
            this.moveRook('left');
            return;
        } else if (this.rookForCastling.right && this.pieceSelected.position[0] == rightKingXCoordinate) {
            //console.log('condition met right')
            this.moveRook('right');
            return;
        }
    }

    moveRook(side) {

        if(side == 'left') {
            this.boardArray[this.rookForCastling.left.position[1]][this.rookForCastling.left.position[0]] = 0;
            this.fillSquareBackground(this.rookForCastling.left.position[0], this.rookForCastling.left.position[1], gameboardColor);
            let leftRookMove = this.rookForCastling.left.moves.specialFirstMoveCoordinates[1][0];
            this.rookForCastling.left.position[0] += leftRookMove;
            this.boardArray[this.rookForCastling.left.position[1]][this.rookForCastling.left.position[0]] = this.rookForCastling.left.color.charAt(0);
            this.rookForCastling.left.drawPiece();
        } else {
            this.boardArray[this.rookForCastling.right.position[1]][this.rookForCastling.right.position[0]] = 0;
            this.fillSquareBackground(this.rookForCastling.right.position[0], this.rookForCastling.right.position[1], gameboardColor);
            let rightRookMove = this.rookForCastling.right.moves.specialFirstMoveCoordinates[0][0];
            this.rookForCastling.right.position[0] += rightRookMove;
            this.boardArray[this.rookForCastling.right.position[1]][this.rookForCastling.right.position[0]] = this.rookForCastling.right.color.charAt(0);
            this.rookForCastling.right.drawPiece();
        }
    }
    
    unselectRookforCastling() {
        this.rookForCastling.right = null;
        this.rookForCastling.left = null;
    }

    
    findOpposingPlayerNotation() {
        if(whitePlayer.turn) return topPlayerNotation
        return bottomPlayerNotation
    }    

    /*
    findPiecebyPosition(player, xCoordinate, yCoordinate) {

        //let selectedPiece = null;
        let arrayIndex;

        player.pieces.forEach((piece, index) => {
            if(piece.position[0] == xCoordinate && piece.position[1] == yCoordinate) {
                //selectedPiece = piece;
                //console.log('-->')
                //console.log(selectedPiece)
                arrayIndex = index;
            };
        });
        
        //console.log(selectedPiece)
        //return selectedPiece;
        console.log(arrayIndex)
        return arrayIndex;
    }*/
    

    findPieceSelected(player) {
        player.pieces.forEach((piece) => {
            if(piece.position[0] == this.mouseSquareSelected.x && piece.position[1] == this.mouseSquareSelected.y) {
                this.pieceSelected = piece;
                //this.drawSquare(this.pieceSelected.position[0],this.pieceSelected.position[1], selectedSquareColor);
                return;
            }
        })
    }


    checkDestinationSquareforOpposingPiece(xCoordinate, yCoordinate) {
        
        let player = whitePlayer.turn ? blackPlayer : whitePlayer; 
        let takenPiecesArray = player == whitePlayer ? this.takenPiecesFromBottomPlayer : this.takenPiecesFromTopPlayer;
        //let pieceFound
        // let index = this.findPiecebyPosition(player, xCoordinate, yCoordinate)
        //console.log('--')
        //console.log(pieceFound)
        // let piece = player.pieces[index]; 
        // console.log(index);
        // console.log(piece)

        // piece.position = [null, null]
        //pieceFound.position = [null, null]
        // takenPiecesArray.push(player.pieces[index]);

        
        player.pieces.forEach((piece) => {
            if(piece.position[0] == xCoordinate && piece.position[1] == yCoordinate) {
                piece.position = [null, null]
                takenPiecesArray.push(piece);
                return;
            }
       })

       console.log('this.takenPiecesFromBottomPlayer', this.takenPiecesFromBottomPlayer)
       console.log('this.takenPiecesFromTopPlayer', this.takenPiecesFromTopPlayer)

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
        //this.active = true;
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
        
        //this.checkCastleConditions();
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
        let player = board.checkPlayerTurn();

        player.pieces.forEach((piece) => {
            if(rightSquareClear && piece.position[0] == rightRookCoordinates[0] 
                && piece.position[1] == rightRookCoordinates[1] 
                && piece.type == 'rook' && !piece.moves.hadFirstMove) {
                    board.rookForCastling.right = piece;
                    board.possibleMovesArray[piece.position[1]][piece.position[0] - 1] = 1;
            };
            
            if(leftSquareClear && piece.position[0] == leftRookCoordinates[0] 
                && piece.position[1] == leftRookCoordinates[1] 
                && piece.type == 'rook' && !piece.moves.hadFirstMove) {
                    board.rookForCastling.left = piece;
                    board.possibleMovesArray[piece.position[1]][piece.position[0] + 2] = 1;
            };
        });
    }

    checkCastleSideSquares(side) {

        let counter = side == 'right' ? boardDimensions - this.position[0] - 1 : this.position[0];
        let xCoordinate = this.position[0];

        do {
            xCoordinate = side == 'right' ? xCoordinate += 1: xCoordinate -= 1;
            counter -=1;
        } while (counter > 0 && !board.boardArray[this.position[1]][xCoordinate]);

        return !counter
    }

    possibleMovesPawn() {

        if(this.type != 'pawn') return;

        let coordinatesArray = this.moves.coordinates;
        let occupiedSamePlayer = this.color.charAt(0);
        let unidirectionalFactor = this.moves.unidirectional && occupiedSamePlayer == bottomPlayerNotation ? -1 : 1;
        
        coordinatesArray.forEach((element) => {
            this.evaluateCoordinates(element, occupiedSamePlayer, unidirectionalFactor, false, false);
        }); 

       if(this.moves.hasSpecialFirstMove && !this.moves.hadFirstMove) {
            let specialFirstMoveArray = this.moves.specialFirstMoveCoordinates;
            specialFirstMoveArray.forEach((element) => {
                this.evaluateCoordinates(element, occupiedSamePlayer, unidirectionalFactor, false, false);
            });
        }

       if(this.moves.differentAttack) {
            let attackMoveArray = this.moves.differentAttackMoveCoordiates;
            attackMoveArray.forEach((element) => {
                this.evaluateCoordinates(element, occupiedSamePlayer, unidirectionalFactor, true, true);
            });
        }
    }

    evaluateCoordinates(element, occupiedSamePlayer, unidirectionalFactor, canAttack, onlyAttack) {

        let attackCondition = canAttack? 1 : 0;
        let occupiedOpposingPlayer = board.findOpposingPlayerNotation();
        //let attackOpposingPlayer = false;
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
                occupiedOtherPlayerCounter > 0 /*attackCondition*/ || xCounter >= xMax || yCounter >= yMax) {
                    //console.log('occupiedSamePlayer: ', board.boardArray[yCoordinate][xCoordinate], yCoordinate, xCoordinate, board.boardArray[yCoordinate][xCoordinate] == occupiedSamePlayer)
                    //console.log('occupiedOtherPlayerCounter: ', occupiedOtherPlayerCounter)
                    //console.log('xCounter > xMax: ', xCounter, xMax)
                    //console.log('yCounter > yMax: ', yCounter, yMax)
                    exitFlag = 1;
                    
            } else {

                //console.log('this.boardArray[yCoordinate][xCoordinate]', board.boardArray[yCoordinate][xCoordinate])
                //console.log('this.boardArray[yCoordinate][xCoordinate] != occupiedSamePlayer', board.boardArray[yCoordinate][xCoordinate] != occupiedSamePlayer)
                if(board.boardArray[yCoordinate][xCoordinate] &&
                    board.boardArray[yCoordinate][xCoordinate] == occupiedOpposingPlayer
                    /* && occupiedOtherPlayerCounter < attackCondition */) {
                        //if(occupiedOtherPlayerCounter > 0) return;
                        occupiedOtherPlayerCounter += 1;
                        //attackOpposingPlayer = true;
                        //console.log('occupiedOtherPlayerCounter', occupiedOtherPlayerCounter)
                }

                //console.log(onlyAttack, board.boardArray[yCoordinate][xCoordinate], occupiedOpposingPlayer)
                if(onlyAttack && board.boardArray[yCoordinate][xCoordinate] == occupiedOpposingPlayer) {
                    //console.log('condition met')
                    board.possibleMovesArray[yCoordinate][xCoordinate] = 1;
                } else if (!onlyAttack && occupiedOtherPlayerCounter < attackCondition + 1 ) {
                    board.possibleMovesArray[yCoordinate][xCoordinate] = 1;
                }
            }

            xCounter++;
            yCounter++;

        } while (!exitFlag);

    }

    /*
    findOpposingPlayerNotation() {
        if(whitePlayer.turn) return topPlayerNotation
        return bottomPlayerNotation
    }*/    
}


const board = new Board(boardDimensions, scaleFactor);
const blackPlayer = new Players(topPlayerName);
const whitePlayer = new Players(bottomPlayerName, true);


function setupPieces(color) {

    let pieceInstanceArray = [];

    pieceNamesArray.forEach((element, index) => {
        for(let i = 0; i < pieceCountArray[index]; i++) {
            let movesClone = {...moves[element]}
            const piece = new Pieces(element, movesClone, color, pieceImages[element][color], startingPosition[element][color][i]);
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