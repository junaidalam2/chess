
export const boardDimensions = 8;
export const scaleFactor = 80;
export const gridWidth = 1;
export const gameboardColor = 'LightCyan';
export const gridLineColor = 'gray';


export const moves = {

    //proportional - can move part of array; jump - can jump over other pieces
    pawn: {coordinates: [[0, 1]], proportional: false, jump: false}, // diagonal missing
    knight: {coordinates: [[-1, 2], [-2, 1], [1, 2], [2, 1]], proportional: false, jump: true},
    bishop: {coordinates: [[-8, 8], [8, 8]], proportional: true, jump: false},
    rook: {coordinates: [[-8, 0], [8, 0], [0, 8]], proportional: true, jump: false}, // castle outstanding
    queen: {coordinates: [[-8, 8], [8, 8], [-8, 0], [8, 0], [0, 8]], proportional: true, jump: false},
    king: {coordinates: [[-1, 1], [1, 1], [-1, 0], [0, 1], [0, 1]], proportional: false, jump: false}, // castle outstanding

    //bottom lefthand corner are coordinates x = 0, y = 0;
    //coordinates for player on bottom side;
    //to obtain moves for top player, multiply 8 moves by -1;
    //to add specialty (non-standard) moves;

} 