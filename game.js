const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let screen = 1; // 1 - Вхідний екран, 2 - Гра, 3 - Фінал
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

// ==== ФУНКЦІЯ ДЛЯ ПОЧАТКУ ГРИ ====
function startGame() {
    screen = 2;
    document.getElementById("startButton").style.display = "none";
    gameLoop();
}

// ==== ФУНКЦІЯ ДЛЯ ФОНУ ====
function drawBackground() {
    ctx.fillStyle = "#ffe6f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ФІНАЛЬНИЙ ЕКРАН ====
function drawEndScreen() {
    drawBackground();
    ctx.fillStyle = "#C14444";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

// ==== ІГРОВИЙ ЦИКЛ ====
function gameLoop() {
    if (screen === 2) {
        drawBackground();
        ctx.fillStyle = "#C14444";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 100);
    } else if (screen === 3) {
        drawEndScreen();
    }
    requestAnimationFrame(gameLoop);
}

// ==== ДОДАЄМО `startGame()` В ГЛОБАЛЬНУ ОБЛАСТЬ ====
document.getElementById("startButton").addEventListener("click", startGame);
