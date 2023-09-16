
export const boardDimensions = 8;
export const scaleFactor = 80;
export const gridWidth = 1;
export const gameboardColor = 'LightCyan';
export const gridLineColor = 'gray';


const moves = {

    //proportional - can move part of array; jump - can jump over other pieces
    bishop: {coordinates: [[-8, 8], [8, 8]], proportional: true, jump: false},
    king: {coordinates: [[-1, 1], [1, 1], [-1, 0], [0, 1], [0, 1]], proportional: false, jump: false}, // castle outstanding
    knight: {coordinates: [[-1, 2], [-2, 1], [1, 2], [2, 1]], proportional: false, jump: true},
    pawn: {coordinates: [[0, 1]], proportional: false, jump: false}, // diagonal missing
    queen: {coordinates: [[-8, 8], [8, 8], [-8, 0], [8, 0], [0, 8]], proportional: true, jump: false},
    rook: {coordinates: [[-8, 0], [8, 0], [0, 8]], proportional: true, jump: false}, // castle outstanding

    //bottom lefthand corner are coordinates x = 0, y = 0;
    //coordinates for player on bottom side;
    //to obtain moves for top player, multiply 8 moves by -1;
    //to add specialty (non-standard) moves;

} 


// images - source: https://commons.wikimedia.org/wiki/Category:PNG_chess_pieces/Standard_transparent;
const pieceImages = {

        bishop: {black: './resources/images/bishopBlack.png', white: './resources/images/bishopWhite.png'},
        king: {black: './resources/images/kingBlack.png', white: './resources/images/kingWhite.png'},
        knight: {black: './resources/images/knightBlack.png', white: './resources/images/knightWhite.png'},
        pawn: {black: './resources/images/pawnBlack.png', white: './resources/images/pawnWhite.png'},
        queen: {black: './resources/images/queenBlack.png', white: './resources/images/queenWhite.png'},
        rook: {black: './resources/images/rookBlack.png', white: './resources/images/rookWhite.png'},

}
Object.freeze(pieceImages);


export const pieces = [moves, pieceImages]
