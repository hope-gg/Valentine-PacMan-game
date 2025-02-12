const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const messageContainer = document.getElementById('message-container');
const startButton = document.getElementById('startButton');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

let screen = 1;
let player = { collectedHearts: 0 };
let hearts = [];
const requiredHearts = 5;
const romanticMessages = [
  "You are my forever love 💕",
  "Every love story is beautiful, but ours is my favorite 💖",
  "You hold my heart forever 💗",
  "You are my dream come true ✨",
  "Love you to the moon and back 🌙💞"
];

function drawBackground() {
    ctx.fillStyle = "#FDF3E7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWelcomeScreen() {
    drawBackground();
    ctx.fillStyle = "#C14444";
    ctx.font = "40px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText("Love is in the air...", canvas.width / 2, canvas.height / 2 - 50);
}

function createHeart() {
    return {
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height - 100),
        size: 40,
    };
}

function drawGameScreen() {
    drawBackground();
    ctx.fillStyle = "#C14444";
    ctx.font = "30px 'Playfair Display', serif";
    ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 50);
    hearts.forEach(heart => {
        ctx.font = "50px Arial";
        ctx.fillText("💗", heart.x, heart.y);
    });
}

function drawEndScreen() {
    drawBackground();
    messageContainer.innerText = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    messageContainer.style.display = "block";
    startButton.innerText = "Restart";
    startButton.style.display = "block";
}

canvas.addEventListener("click", (e) => {
    if (screen === 1) {
        screen = 2;
        player.collectedHearts = 0;
        hearts = Array.from({ length: 10 }, createHeart);
        messageContainer.style.display = "none";
    } else if (screen === 2) {
        hearts.forEach((heart, index) => {
            if (Math.abs(e.clientX - heart.x) < 40 && Math.abs(e.clientY - heart.y) < 40) {
                player.collectedHearts++;
                hearts.splice(index, 1);
                if (player.collectedHearts >= requiredHearts) {
                    screen = 3;
                }
            }
        });
    } else if (screen === 3) {
        screen = 1;
        startButton.innerText = "Start";
    }
});

function gameLoop() {
    if (screen === 1) drawWelcomeScreen();
    else if (screen === 2) drawGameScreen();
    else if (screen === 3) drawEndScreen();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    screen = 2;
    player.collectedHearts = 0;
    hearts = Array.from({ length: 10 }, createHeart);
    messageContainer.style.display = "none";
    startButton.style.display = "none";
}

window.onload = gameLoop;
