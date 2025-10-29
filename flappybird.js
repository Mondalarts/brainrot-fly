// Get the canvas element from index.html
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

// --- Game Variables ---
const boardWidth = 360;
const boardHeight = 640;

// Bird properties (Updated Size)
const birdWidth = 85;
const birdHeight = 60;
const birdX = boardWidth / 8;
const birdY = boardHeight / 2;

// Pipe properties
const pipeWidth = 64;
const pipeHeight = 512;

// Game physics
let velocityX = -4; 
let velocityY = 0;
let gravity = 1;

// Game State
let gameOver = false;
let score = 0;
let pipes = [];

// --- Image Loading ---
const birdImg = new Image();
birdImg.src = "./flappybird.png";

const topPipeImg = new Image();
topPipeImg.src = "./toppipe.png";

const bottomPipeImg = new Image();
bottomPipeImg.src = "./bottompipe.png";

const backgroundImg = new Image();
backgroundImg.src = "./flappybirdbg.png";

// Bird Object
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
};

// --- Game Logic Functions ---
function placePipes() {
    if (gameOver) return;

    let randomPipeY = 0 - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = boardHeight / 4;

    let topPipe = {
        img: topPipeImg,
        x: boardWidth,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };
    pipes.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: boardWidth,
        y: topPipe.y + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };
    pipes.push(bottomPipe);
}

function move() {
    if (gameOver) return;

    velocityY += gravity;
    bird.y += velocityY;
    bird.y = Math.max(bird.y, 0);

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x += velocityX;

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (collision(bird, pipe)) {
            gameOver = true;
        }
    }
    
    while (pipes.length > 0 && pipes[0].x < -pipeWidth) {
        pipes.shift();
    }

    if (bird.y > boardHeight) {
        gameOver = true;
    }
}

function draw() {
    ctx.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    }
    
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    if (gameOver) {
        ctx.fillText("Game Over: " + String(Math.floor(score)), 10, 35);
    } else {
        ctx.fillText(String(Math.floor(score)), 10, 35);
    }
}

function collision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function restartGame() {
    bird.y = birdY;
    velocityY = 0;
    pipes = [];
    gameOver = false;
    score = 0;
}

function gameLoop() {
    move();
    draw();
    requestAnimationFrame(gameLoop);
}

setInterval(placePipes, 1500);

// --- UPDATED EVENT HANDLING FOR MOBILE ---
function handleInput(e) {
    e.preventDefault(); // This is important to prevent zoom/scroll
    
    velocityY = -9; // Jump

    if (gameOver) {
        restartGame();
    }
}

// Listen for both mouse clicks and screen taps
document.addEventListener("mousedown", handleInput);
document.addEventListener("touchstart", handleInput);


// Wait for images to load before starting
backgroundImg.onload = function() {
    requestAnimationFrame(gameLoop);
};

