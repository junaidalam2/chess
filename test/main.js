


const canvas = document.querySelector('.board');
// canvas.width = 1000;
// canvas.height = 1000;
const context = canvas.getContext('2d');
//context.scale(100, 100);

// try to draw one image and then replicate to all pieces.

let img = new Image();
img.src = './mario.png';
img.onload = () => { context.drawImage(img, 0, 0) };
