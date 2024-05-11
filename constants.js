//board
export const boardDimensions = 8;
export const scaleFactor = 80;
export const gridWidth = 1;
export const gameboardColor = 'LightCyan';
export const selectedSquareColor = '#d3dee0';
export const gridLineColor = 'gray';
export const gridLineCursor = 'blue';
export const mousePositionOffset = {x: 6, y: 6};


//pieces

export const pieceHeight = 1;
export const pieceWidth = 0.95;

export const startingPosition = {

    bishop: {black: [[2, 0], [5, 0]], white: [[2, 7], [5, 7]]},
    king: {black: [[4, 0]], white: [[4, 7]]},
    knight: {black: [[1, 0], [6, 0]], white: [[1, 7], [6, 7]]},
    pawn: {black: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]], white: [[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]]},
    queen: {black: [[3, 0]], white: [[3, 7]]},
    rook: {black: [[0, 0], [7, 0]], white: [[0, 7], [7, 7]]},

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
    bishop: {coordinates: [[-7, 7], [7, 7]], jump: false, hadFirstMove: false},
    king: {coordinates: [[-1, 1], [1, 1], [-1, 0], [0, 1], [0, 1]], jump: false, hadFirstMove: false}, // castle outstanding
    knight: {coordinates: [[-1, 2], [1, 2], [-2, 1], [-2, -1], [2, -1], [2, 1], [-2, -1], [-2, 1]], jump: true, hadFirstMove: false},
    pawn: {coordinates: [[0, 1]], jump: false, hadFirstMove: false}, // diagonal missing + first move oustanding
    queen: {coordinates: [[-7, 7], [7, 7], [-7, 0], [7, 0], [0, 7]], jump: false, hadFirstMove: false},
    rook: {coordinates: [[-7, 0], [7, 0], [0, 7], [0, -7]], jump: false, hadFirstMove: false}, // castle outstanding

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
