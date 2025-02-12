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

const bigHeartImage = new Image();
bigHeartImage.src = 'assets/big_heart.png';

ghostImage.onload = () => console.log('Ghost image loaded:', ghostImage.src);
heartImage.onload = () => console.log('Heart image loaded:', heartImage.src);
bigHeartImage.onload = () => console.log('Big heart image loaded:', bigHeartImage.src);

// Player setup
const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 150,
    size: 120, // Increased size for better touch detection
    speed: 6,  // Adjusted for smoother movement
    dx: 0,
    dy: 0,
    target: null
};

// Hearts array
let hearts = [];
let score = 0;

// Finish point with big heart
const finishPoint = {
    x: canvas.width / 2 - 60,
    y: 50,
    size: 150,
    reached: false
};

let gameFinished = false;

// Function to move ghost towards a target
function moveTowardsTarget() {
    if (!player.target) return;

    let dx = player.target.x - player.x;
    let dy = player.target.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > player.speed) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    } else {
        player.x = player.target.x;
        player.y = player.target.y;
        player.target = null;
    }
}

// Function to draw player
function drawPlayer() {
    ctx.drawImage(ghostImage, player.x, player.y, player.size, player.size);
}

// Function to draw finish point with big heart
function drawFinishPoint() {
    ctx.drawImage(bigHeartImage, finishPoint.x, finishPoint.y, finishPoint.size, finishPoint.size);
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
        finishPoint.reached = true;
    }
}

// Function to display end message
function displayEndMessage() {
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Happy Valentine\'s Day!', canvas.width / 2, canvas.height / 2);
    ctx.drawImage(bigHeartImage, canvas.width / 2 - 100, canvas.height / 2 - 200, 200, 200);
}

// Function to update and draw hearts
function updateHearts() {
    hearts.forEach((heart, index) => {
        if (
            player.x < heart.x + heart.size &&
            player.x + player.size > heart.x &&
            player.y < heart.y + heart.size &&
            player.y + player.size > heart.y
        ) {
            hearts.splice(index, 1);
            score += 1;
            if (score % 5 === 0) {
                addHeart();
            }
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
        size: 70
    });
}

// Click event to move towards the clicked heart
canvas.addEventListener('click', (e) => {
    let clickX = e.clientX;
    let clickY = e.clientY;
    let foundTarget = false;
    
    hearts.forEach((heart) => {
        if (
            clickX > heart.x && clickX < heart.x + heart.size &&
            clickY > heart.y && clickY < heart.y + heart.size
        ) {
            player.target = { x: heart.x, y: heart.y };
            foundTarget = true;
        }
    });
    
    if (!foundTarget) {
        player.target = { x: clickX - player.size / 2, y: clickY - player.size / 2 };
    }
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameFinished) {
        displayEndMessage();
        return;
    }

    moveTowardsTarget();
    drawPlayer();
    updateHearts();
    drawHearts();
    drawFinishPoint();
    checkFinish();

    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);

    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    for (let i = 0; i < 7; i++) {
        addHeart();
    }
    gameLoop();
}

// Start the game
initGame();
