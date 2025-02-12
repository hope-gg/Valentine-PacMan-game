const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==== ФУНКЦІЯ ДЛЯ ПОЧАТКУ ГРИ ====
function startGame() {
    console.log("Game started!");
    document.getElementById("startButton").style.display = "none"; // Ховаємо кнопку
    gameLoop(); // Запускаємо анімацію гри
}

// ==== ФУНКЦІЯ ДЛЯ ФОНУ ====
function drawBackground() {
    ctx.fillStyle = "#ffe6f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ІГРОВИЙ ЦИКЛ ====
function gameLoop() {
    drawBackground();
    requestAnimationFrame(gameLoop);
}

// ==== ДОДАЄМО `startGame()` В ГЛОБАЛЬНУ ОБЛАСТЬ ====
window.startGame = startGame;
