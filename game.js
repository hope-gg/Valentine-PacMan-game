const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ==== ADAPTATION FOR MOBILE ====
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let screen = 1; // 1 - Welcome, 2 - Game, 3 - Finish
let player = { collectedHearts: 0, lives: 5 };
let hearts = [];
const requiredHearts = 5;
const romanticMessages = [
    "You are my forever love 💕",
    "Every love story is beautiful, but ours is my favorite 💖",
    "You hold my heart forever 💗",
    "You are my dream come true ✨",
    "Love you to the moon and back 🌙💞"
];

// ==== HEART OBJECTS ====
const heartImage = new Image();
heartImage.src = "assets/heart (1).png";
const brokenHeartImage = new Image();
brokenHeartImage.src = "assets/broken-heart.png";

function createHeart(isBroken = false) {
    return { 
        x: Math.random() * (canvas.width - 80), 
        y: -50, 
        size: 80,
        isBroken: isBroken, 
        speed: 1 + Math.random() * 2,
        caught: false
    };
}

// ==== DRAW GAME BACKGROUND ====
function drawBackground() {
    ctx.fillStyle = "#FFD3E3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== WELCOME SCREEN ====
function drawWelcomeScreen() {
    drawBackground();
    ctx.fillStyle = "#D72638";
    ctx.font = "36px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText("Catch the Hearts!", canvas.width / 2, canvas.height / 3);
}

// ==== GAME SCREEN ====
function drawGameScreen() {
    drawBackground();
    ctx.font = "24px Arial";
    ctx.fillStyle = "#D72638";
    ctx.fillText(`Hearts: ${player.collectedHearts}/${requiredHearts}`, 20, 40);

    hearts.forEach(heart => {
        if (!heart.caught) {
            ctx.drawImage(heart.isBroken ? brokenHeartImage : heartImage, heart.x, heart.y, heart.size, heart.size);
        }
        heart.y += heart.speed;
    });
    hearts = hearts.filter(heart => heart.y < canvas.height);
}

// ==== FINISH SCREEN ====
function drawEndScreen() {
    drawBackground();
    ctx.fillStyle = "#D72638";
    ctx.font = "30px 'Playfair Display', serif";
    ctx.textAlign = "center";
    const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

// ==== GAME LOOP ====
function gameLoop() {
    if (screen === 1) {
        drawWelcomeScreen();
    } else if (screen === 2) {
        drawGameScreen();
    } else if (screen === 3) {
        drawEndScreen();
    }
    requestAnimationFrame(gameLoop);
}

// ==== HANDLE CLICKS ====
canvas.addEventListener("click", (e) => {
    if (screen === 1) {
        screen = 2;
        player.collectedHearts = 0;
        hearts = [];
        for (let i = 0; i < 8; i++) hearts.push(createHeart(Math.random() < 0.3));
    } else if (screen === 2) {
        hearts.forEach(heart => {
            if (
                e.clientX > heart.x && e.clientX < heart.x + heart.size &&
                e.clientY > heart.y && e.clientY < heart.y + heart.size
            ) {
                heart.caught = true;
                if (!heart.isBroken) {
                    player.collectedHearts++;
                    if (player.collectedHearts >= requiredHearts) {
                        screen = 3;
                    }
                }
            }
        });
    } else if (screen === 3) {
        screen = 1;
    }
});

// ==== INIT GAME ====
function initGame() {
    resizeCanvas();
    gameLoop();
}
window.addEventListener("load", initGame);
