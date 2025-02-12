// Basic setup for a simple Valentine-themed Pacman-style game

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Responsive canvas settings
function resizeCanvas() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Assets
const heartImage = new Image();
heartImage.src = 'assets/heart.png';

const ghostImage = new Image();
ghostImage.src = 'assets/ghost.png';

ghostImage.onload = () => console.log('Ghost image loaded:', ghostImage.src);
heartImage.onload = () => console.log('Heart image loaded:', heartImage.src);

// Player setup
const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 150,
    size: 80, // Increased size for better touch detection
    speed: 50,  // Adjusted speed for smoother mobile movement
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
    size: 100
};

let gameFinished = false;

// Input handling
let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Touch controls for mobile
let touchStartX = 0, touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchend', (e) => {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        player.dx = Math.sign(diffX) * player.speed;
        player.dy = 0;
    } else {
        player.dy = Math.sign(diffY) * player.speed;
        player.dx = 0;
    }

    setTimeout(() => {
        player.dx = 0;
        player.dy = 0;
    }, 150); // Stop movement after swipe
});

// Functions to handle movement
function movePlayer() {
    if (keys['ArrowLeft'] || keys['a']) player.dx = -player.speed;
    else if (keys['ArrowRight'] || keys['d']) player.dx = player.speed;
    else player.dx = 0;

    if (keys['ArrowUp'] || keys['w']) player.dy = -player.speed;
    else if (keys['ArrowDown'] || keys['s']) player.dy = player.speed;
    else player.dy = 0;

    player.x += player.dx;
    player.y += player.dy;

    // Prevent player from moving off-screen
    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

// Function to draw player
function drawPlayer() {
    ctx.drawImage(ghostImage, player.x, player.y, player.size, player.size);
}

// Function to draw finish point
function drawFinishPoint() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(finishPoint.x, finishPoint.y, finishPoint.size, finishPoint.size);
    ctx.strokeStyle = 'darkblue';
    ctx.lineWidth = 3;
    ctx.strokeRect(finishPoint.x, finishPoint.y, finishPoint.size, finishPoint.size);
    ctx.fillStyle = 'black';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Reach Here!', finishPoint.x + finishPoint.size / 2, finishPoint.y + 55);
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
    ctx.fillText('Happy Valentine\'s Day!', canvas.width / 2, canvas.height / 2);
}

// Function to update and draw hearts
function updateHearts() {
    hearts.forEach((heart, index) => {
        heart.y += 6; // Move hearts down faster for mobile screens
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

// Function to add a new heart
function addHeart() {
    hearts.push({
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height / 2),
        size: 60 // Slightly larger hearts for better visibility on mobile
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
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);

    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    for (let i = 0; i < 7; i++) { // Increased initial number of hearts
        addHeart();
    }
    gameLoop();
}

// Start the game
initGame();

