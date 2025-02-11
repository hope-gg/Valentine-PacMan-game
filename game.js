// Basic setup for Valentine-themed Pacman-style game with mobile adaptation
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fit mobile or desktop
const canvasWidth = window.innerWidth * 0.9;
const canvasHeight = window.innerHeight * 0.8;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Assets
const heartImage = new Image();
heartImage.src = 'assets/heart.png';

const ghostImage = new Image();
ghostImage.src = 'assets/ghost.png';

// Player setup
const player = {
    x: canvasWidth / 2 - 30,
    y: canvasHeight - 100,
    size: 60,
    speed: 5,
    dx: 0,
    dy: 0
};

// Hearts array
let hearts = [];
let score = 0;

// Finish point
const finishPoint = {
    x: canvasWidth / 2 - 50,
    y: 50,
    size: 100
};

let gameFinished = false;

// Input handling
let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Handle touch input for mobile
let touchStartX, touchStartY;
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    player.x += dx * 0.1;
    player.y += dy * 0.1;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    // Prevent player from moving off-screen
    player.x = Math.max(0, Math.min(canvasWidth - player.size, player.x));
    player.y = Math.max(0, Math.min(canvasHeight - player.size, player.y));
    e.preventDefault();
});

// Functions to handle movement
function movePlayer() {
    if (keys['ArrowLeft']) player.dx = -player.speed;
    else if (keys['ArrowRight']) player.dx = player.speed;
    else player.dx = 0;

    if (keys['ArrowUp']) player.dy = -player.speed;
    else if (keys['ArrowDown']) player.dy = player.speed;
    else player.dy = 0;

    player.x += player.dx;
    player.y += player.dy;

    // Prevent player from moving off-screen
    player.x = Math.max(0, Math.min(canvasWidth - player.size, player.x));
    player.y = Math.max(0, Math.min(canvasHeight - player.size, player.y));
}

// Function to draw player
function drawPlayer() {
    ctx.drawImage(ghostImage, player.x, player.y, player.size, player.size);
}

// Function to draw finish point
function drawFinishPoint() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(finishPoint.x, finishPoint.y, finishPoint.size, finishPoint.size);
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('Reach Here!', finishPoint.x + 10, finishPoint.y + 55);
}

// Function to check if player reached the finish point
function checkFinish() {
    if (
        player.x < finishPoint.x + finishPoint.size &&
        player.x + player.size > finishPoint.x &&
        player.y < finishPoint.y + finishPoint.size &&
        player.y + player.size > finishPoint.y
    ) {
        gameFinished = true;
    }
}

// Function to display end message
function displayEndMessage() {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Happy Valentine\'s Day!', canvasWidth / 2, canvasHeight / 2);
}

// Function to update and draw hearts
function updateHearts() {
    hearts.forEach((heart, index) => {
        heart.y += 2; // Move hearts down
        if (heart.y > canvasHeight) {
            heart.y = -heart.size; // Reset position to top
            heart.x = Math.random() * (canvasWidth - heart.size);
        }

        // Check for collision with player
        if (
            player.x < heart.x + heart.size &&
            player.x + player.size > heart.x &&
            player.y < heart.y + heart.size &&
            player.y + player.size > heart.y
        ) {
            hearts.splice(index, 1); // Remove heart
            score += 1; // Increase score
            addHeart(); // Add a new heart
        }
    });
}

function drawHearts() {
    hearts.forEach(heart => {
        ctx.drawImage(heartImage, heart.x, heart.y, heart.size, heart.size);
    });
}

// Function to add a new heart
function addHeart() {
    hearts.push({
        x: Math.random() * (canvasWidth - 40),
        y: Math.random() * (canvasHeight / 2),
        size: 40
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (gameFinished) {
        displayEndMessage();
        return;
    }

    movePlayer();
    drawPlayer();
    updateHearts();
    drawHearts();
    drawFinishPoint();
    checkFinish();

    // Display score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    for (let i = 0; i < 5; i++) {
        addHeart();
    }
    gameLoop();
}

// Start the game
initGame();
