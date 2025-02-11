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
heartImage.src = 'assets/heart.png';  // Ensure this path is correct

const brokenHeartImage = new Image();
brokenHeartImage.src = 'assets/broken-heart.png';  // Ensure this path is correct

const ghostImage = new Image();
ghostImage.src = 'assets/ghost.png';  // Ensure this path is correct

// Player setup
const player = {
    x: canvasWidth / 2,
    y: canvasHeight - 60,
    size: 60,  // Adjusted for larger player size
    speed: 5,
    dx: 0,
    dy: 0
};

// Animation variables
let pulseFactor = 0;
let pulseDirection = 1;

// Hearts and enemies
let hearts = [];
let enemies = [];
let ghosts = [];
let caughtEffects = [];

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

// Function to animate player with pulse effect
function animatePlayer() {
    pulseFactor += pulseDirection * 0.1;
    if (pulseFactor > 5 || pulseFactor < -5) pulseDirection *= -1;

    const animatedSize = player.size + pulseFactor;
    ctx.drawImage(ghostImage, player.x, player.y, animatedSize, animatedSize);  // Use ghost image for player animation
}

// Function to update and draw hearts
function updateHearts() {
    hearts.forEach(heart => {
        heart.y += 1;  // Hearts move downward
        if (heart.y > canvasHeight) heart.y = -heart.size;  // Reset position to top
    });
}

function drawHearts() {
    hearts.forEach(heart => {
        ctx.drawImage(heartImage, heart.x, heart.y, 50, 50);  // Adjusted size for hearts
    });
}

// Function to update and draw enemies
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speed || 2;
        if (enemy.x > canvasWidth || enemy.x < 0) {
            enemy.speed = -enemy.speed;
        }
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(brokenHeartImage, enemy.x, enemy.y, 60, 60);  // Adjusted size for enemies
    });
}

// Function to update and draw ghosts
function updateGhosts() {
    ghosts.forEach(ghost => {
        ghost.y += 1.5;
        if (ghost.y > canvasHeight) ghost.y = -ghost.size;
    });
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.drawImage(ghostImage, ghost.x, ghost.y, 70, 70);  // Adjusted size for ghosts
    });
}

// Function to add and update catch effects
function addCatchEffect(x, y) {
    caughtEffects.push({ x, y, opacity: 1 });
}

function updateCatchEffects() {
    caughtEffects.forEach((effect, index) => {
        effect.opacity -= 0.02;
        ctx.fillStyle = `rgba(255, 0, 0, ${effect.opacity})`;
        ctx.font = '24px Arial';
        ctx.fillText('💖', effect.x, effect.y);

        if (effect.opacity <= 0) caughtEffects.splice(index, 1);
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    movePlayer();
    animatePlayer();
    updateHearts();
    drawHearts();
    updateEnemies();
    drawEnemies();
    updateGhosts();
    drawGhosts();
    updateCatchEffects();

    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    // Generate hearts, enemies, and ghosts
    for (let i = 0; i < 5; i++) {
        hearts.push({ x: Math.random() * (canvasWidth - 40), y: Math.random() * (canvasHeight - 40), size: 50 });
        enemies.push({ x: Math.random() * (canvasWidth - 40), y: Math.random() * (canvasHeight - 40), size: 60, speed: Math.random() * 2 + 1 });
        ghosts.push({ x: Math.random() * (canvasWidth - 40), y: Math.random() * (canvasHeight - 40), size: 70 });
    }

    gameLoop();
}

// Start the game
initGame();
