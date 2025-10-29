// Get the canvas element from index.html
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

// --- Game Variables (equivalent to your Java class members) ---
const boardWidth = 360;
const boardHeight = 640;

// Bird properties
const birdWidth = 34;
const birdHeight = 24;
const birdX = boardWidth / 8;
const birdY = boardHeight / 2;

// Pipe properties
const pipeWidth = 64;
const pipeHeight = 512;

// Game physics
let velocityX = -4; // Pipe moving speed
let velocityY = 0;  // Bird's jump/fall speed
let gravity = 1;

// Game State
let gameOver = false;
let score = 0;
let pipes = []; // Equivalent to ArrayList<Pipe>

// --- Image Loading (equivalent to new ImageIcon(...)) ---
const birdImg = new Image();
birdImg.src = "./flappybird.png";

const topPipeImg = new Image();
topPipeImg.src = "./toppipe.png";

const bottomPipeImg = new Image();
bottomPipeImg.src = "./bottompipe.png";

const backgroundImg = new Image();
backgroundImg.src = "./flappybirdbg.png";

// Bird Object (equivalent to your Bird class instance)
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
};

// --- Game Logic Functions ---

// Equivalent to your `placePipes()` method
function placePipes() {
    if (gameOver) return;

    let randomPipeY = 0 - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = boardHeight / 4;

    // Top Pipe
    let topPipe = {
        img: topPipeImg,
        x: boardWidth,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };
    pipes.push(topPipe);

    // Bottom Pipe
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

// Equivalent to your `move()` method
function move() {
    if (gameOver) return;

    // Bird movement
    velocityY += gravity;
    bird.y += velocityY;
    bird.y = Math.max(bird.y, 0); // Prevent bird from going above the screen

    // Pipe movement and collision
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x += velocityX;

        // Check for score
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // Score increases by 1 for each pair of pipes
            pipe.passed = true;
        }

        // Check for collision
        if (collision(bird, pipe)) {
            gameOver = true;
        }
    }
    
    // Remove off-screen pipes to save memory
    while (pipes.length > 0 && pipes[0].x < -pipeWidth) {
        pipes.shift(); // Removes the first element
    }

    // Game over if bird hits the ground
    if (bird.y > boardHeight) {
        gameOver = true;
    }
}

// Equivalent to your `draw()` method
function draw() {
    // Background
    ctx.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);

    // Bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Pipes
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    }
    
    // Score
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    if (gameOver) {
        ctx.fillText("Game Over: " + String(Math.floor(score)), 10, 35);
    } else {
        ctx.fillText(String(Math.floor(score)), 10, 35);
    }
}

// Equivalent to your `collision()` method
function collision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Reset game state on restart
function restartGame() {
    bird.y = birdY;
    velocityY = 0;
    pipes = [];
    gameOver = false;
    score = 0;
}

// --- Main Game Loop (equivalent to your Timers and ActionListeners) ---
function gameLoop() {
    move();  // Update game state
    draw();  // Render the screen
    requestAnimationFrame(gameLoop); // Calls gameLoop on the next frame
}

// Start the pipe placement timer (equivalent to `placePipeTimer`)
setInterval(placePipes, 1500);

// --- Event Handling (equivalent to KeyListener) ---
document.addEventListener("keydown", (e) => {
    if (e.code == "Space") {
        velocityY = -9; // Jump

        if (gameOver) {
            restartGame();
        }
    }
});

// Wait for the background image to load before starting the game
backgroundImg.onload = function() {
    requestAnimationFrame(gameLoop);
};
