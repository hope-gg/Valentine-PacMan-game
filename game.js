// Basic setup for a simple Valentine-themed Pacman-style game

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Responsive canvas with devicePixelRatio
function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Скидаємо трансформацію і масштабуємо
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
}

// Викликаємо один раз і при зміні розміру (або орієнтації) екрану
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ====== Assets ======
const heartImage = new Image();
heartImage.src = 'assets/heart.png';

const ghostImage = new Image();
ghostImage.src = 'assets/ghost.png';

ghostImage.onload = () => console.log('Ghost image loaded:', ghostImage.src);
heartImage.onload = () => console.log('Heart image loaded:', heartImage.src);

// ====== Player setup ======
const player = {
    x: 0, // Тимчасово, уточнимо пізніше
    y: 0,
    size: 100, // Increased size for better touch detection
    speed: 5,
    dx: 0,
    dy: 0,
    target: null
};

// Hearts array
let hearts = [];
let score = 0;

// Finish point
const finishPoint = {
    x: 0, // Уточнимо пізніше
    y: 50,
    size: 100
};

let gameFinished = false;

// === Move ghost towards a target ===
function moveTowardsTarget() {
    if (!player.target) return;

    let dx = player.target.x - player.x;
    let dy = player.target.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > player.speed) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    } else {
        // Reached the target
        player.x = player.target.x;
        player.y = player.target.y;
        player.target = null;
    }
}

// === Draw player ===
function drawPlayer() {
    ctx.drawImage(ghostImage, player.x, player.y, player.size, player.size);
}

// === Draw finish point ===
function drawFinishPoint() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(finishPoint.x, finishPoint.y, finishPoint.size, finishPoint.size);
    ctx.strokeStyle = 'darkblue';
    ctx.lineWidth = 3;
    ctx.strokeRect(finishPoint.x, finishPoint.y, finishPoint.size, finishPoint.size);

    ctx.fillStyle = 'black';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Reach Here!', finishPoint.x + finishPoint.size / 2, finishPoint.y + finishPoint.size / 2);
}

// === Check if player reached the finish point ===
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

// === Display end message ===
function displayEndMessage() {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Happy Valentine\'s Day!', canvas.width / 2, canvas.height / 2);
}

// === Update and draw hearts ===
function updateHearts() {
    hearts.forEach((heart, index) => {
        // Check for collision with player
        if (
            player.x < heart.x + heart.size &&
            player.x + player.size > heart.x &&
            player.y < heart.y + heart.size &&
            player.y + player.size > heart.y
        ) {
            hearts.splice(index, 1); // Remove heart
            score += 1;             // Increase score
            addHeart();             // Add a new heart
        }
    });
}

function drawHearts() {
    hearts.forEach(heart => {
        ctx.drawImage(heartImage, heart.x, heart.y, heart.size, heart.size);
    });
}

// === Add a new heart ===
function addHeart() {
    hearts.push({
        x: Math.random() * (canvas.width / (window.devicePixelRatio || 1) - 50),
        y: Math.random() * (canvas.height / (window.devicePixelRatio || 1) / 2),
        size: 60
    });
}

// === Click event (for desktop); for mobile краще pointer events ===
canvas.addEventListener('click', (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;

    hearts.forEach((heart) => {
        if (
            clickX > heart.x && clickX < heart.x + heart.size &&
            clickY > heart.y && clickY < heart.y + heart.size
        ) {
            player.target = { x: heart.x, y: heart.y };
        }
    });
});

// === Game loop ===
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

    // Display score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 40);

    requestAnimationFrame(gameLoop);
}

// === Initialize game ===
function initGame() {
    // Розташовуємо гравця по центру ширини, але ближче до низу
    player.x = (canvas.width / (window.devicePixelRatio || 1)) / 2 - player.size / 2;
    player.y = (canvas.height / (window.devicePixelRatio || 1)) - player.size - 50;

    // Розташовуємо фініш по центру ширини, зверху
    finishPoint.x = (canvas.width / (window.devicePixelRatio || 1)) / 2 - finishPoint.size / 2;
    finishPoint.y = 50;

    // Створюємо кілька початкових сердець
    for (let i = 0; i < 7; i++) {
        addHeart();
    }

    gameLoop();
}

// Start the game
initGame();
