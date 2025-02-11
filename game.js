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

    movePlayer();
    drawPlayer();
    updateHearts();
    drawHearts();

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
