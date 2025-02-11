// Responsive setup for a Valentine-themed game

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fit the screen, with some padding for mobile
canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.85;

// Assets
const heartImage = new Image();
heartImage.src = 'assets/heart.png';

const ghostImage = new Image();
ghostImage.src = 'assets/ghost.png';

// Player setup
const player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 100,
    size: Math.min(canvas.width, canvas.height) / 10, // Adjust size based on screen dimensions
    speed: 8, // Increased speed for smoother movement
    dx: 0,
    dy: 0
};

// Hearts array
let hearts = [];
let score = 0;

// Finish point
const finishPoint = {
    x: canvas.width / 2 - 50,
    y: 50,
    size: 80
};

let gameFinished = false;

// Input handling
let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Adjust player movement
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
    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

// Draw player
function drawPlayer() {
    ctx.drawImage(ghostImage, player.x, player.y, player.size, player.size);
}

// Draw finish point
function drawFinishPoint() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(finishPoint.x, finishPoint.y, finishPoint.size, finishPoint.size);
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('Reach Here!', finishPoint.x + 10, finishPoint.y + 55);
}

// Check if player reached the finish point
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

// Display end message
function displayEndMessage() {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Happy Valentine\'s Day!', canvas.width / 2, canvas.height / 2);
}

// Update and draw hearts
function updateHearts() {
    hearts.forEach((heart, index) => {
        heart.y += 2; // Move hearts down
        if (heart.y > canvas.height) {
            heart.y = -heart.size; // Reset position to top
            heart.x = Math.random() * (canvas.width - heart.size);
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

// Add a new heart
function addHeart() {
    hearts.push({
        x: Math.random() * (canvas.width - 40),
        y: Math.random() * (canvas.height / 2),
        size: 40
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
