//board
export const boardDimensions = 8;
export const scaleFactor = 80;
export const gridWidth = 1;
export const gameboardColor = 'LightCyan';
export const gridLineColor = 'gray';

//pieces

export const pieceHeight = 1;
export const pieceWidth = 0.95;

export const startingPosition = {

    bishop: {black: [[0, 2], [0, 5]], white: [[7, 2], [7, 5]]},
    king: {black: [[0, 4]], white: [[7, 4]]},
    knight: {black: [[0, 1], [0, 6]], white: [[7, 1], [7, 6]]},
    pawn: {black: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7]], white: [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7]]},
    queen: {black: [[0, 3]], white: [[7, 3]]},
    rook: {black: [[0, 0], [0, 7]], white: [[7, 0], [7, 7]]},

}
Object.freeze(startingPosition);

export const pieceNamesArray = Object.keys(startingPosition);

function generatePieceCount() {
    let pieceCountArray = [];
    pieceNamesArray.forEach( (element) => {
        pieceCountArray.push(Object.values(startingPosition[element]['black']).length);
    });

    return pieceCountArray;
}

export let pieceCountArray = generatePieceCount();
export const moves = {

    //proportional - can move part of array; jump - can jump over other pieces
    bishop: {coordinates: [[-7, 7], [7, 7]], proportional: true, jump: false},
    king: {coordinates: [[-1, 1], [1, 1], [-1, 0], [0, 1], [0, 1]], proportional: false, jump: false}, // castle outstanding
    knight: {coordinates: [[-1, 2], [-2, 1], [1, 2], [2, 1]], proportional: false, jump: true},
    pawn: {coordinates: [[0, 1]], proportional: false, jump: false}, // diagonal missing
    queen: {coordinates: [[-7, 7], [7, 7], [-7, 0], [7, 0], [0, 7]], proportional: true, jump: false},
    rook: {coordinates: [[-7, 0], [7, 0], [0, 7]], proportional: true, jump: false}, // castle outstanding

    //bottom lefthand corner are coordinates x = 0, y = 0;
    //coordinates for player on bottom side;
    //to obtain moves for top player, multiply 8 moves by -1;
    //to add specialty (non-standard) moves;

} 

// images - source: https://commons.wikimedia.org/wiki/Category:PNG_chess_pieces/Standard_transparent;
export const pieceImages = {

        bishop: {black: './resources/images/bishopBlack.png', white: './resources/images/bishopWhite.png'},
        king: {black: './resources/images/kingBlack.png', white: './resources/images/kingWhite.png'},
        knight: {black: './resources/images/knightBlack.png', white: './resources/images/knightWhite.png'},
        pawn: {black: './resources/images/pawnBlack.png', white: './resources/images/pawnWhite.png'},
        queen: {black: './resources/images/queenBlack.png', white: './resources/images/queenWhite.png'},
        rook: {black: './resources/images/rookBlack.png', white: './resources/images/rookWhite.png'},

}
Object.freeze(pieceImages);
