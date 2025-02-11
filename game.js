// Basic setup for a simple Valentine-themed Pacman-style game

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const canvasWidth = 800;
const canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Assets
const heartImage = new Image();
heartImage.src = 'assets/heart.png';

const brokenHeartImage = new Image();
brokenHeartImage.src = 'assets/broken-heart.png';

const ghostImage = new Image();
ghostImage.src = 'assets/ghost.png';

// Player setup
const player = {
    x: canvasWidth / 2,
    y: canvasHeight - 60,
    size: 60,
    speed: 5,
    dx: 0,
    dy: 0
};

// Hearts array
let hearts = [];

// Input handling
let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

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

// Function to update and draw hearts
function updateHearts() {
    hearts.forEach(heart => {
        heart.y += 2;  // Hearts move downward
        if (heart.y > canvasHeight) heart.y = -heart.size;  // Reset position to top

        // Check collision with player
        if (player.x < heart.x + heart.size &&
            player.x + player.size > heart.x &&
            player.y < heart.y + heart.size &&
            player.y + player.size > heart.y) {
            heart.y = -heart.size;  // Reset heart position if caught
        }
    });
}

function drawHearts() {
    hearts.forEach(heart => {
        ctx.drawImage(heartImage, heart.x, heart.y, 50, 50);
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    movePlayer();
    drawPlayer();
    updateHearts();
    drawHearts();

    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    // Generate hearts
    for (let i = 0; i < 5; i++) {
        hearts.push({ x: Math.random() * (canvasWidth - 50), y: Math.random() * -canvasHeight, size: 50 });
    }

    gameLoop();
}

// Start the game
initGame();
