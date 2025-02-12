const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ==== АДАПТАЦІЯ ДЛЯ СМАРТФОНІВ (ФІКС) ====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ==== ГЛОБАЛЬНІ ЗМІННІ ====
let screen = 1; // 1 - Вхідний екран, 2 - Гра, 3 - Фінал
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

// ==== ФУНКЦІЯ ДЛЯ МАЛЮВАННЯ ФОНУ ====
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ffccee');
    gradient.addColorStop(1, '#f8a3d8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ВХІДНИЙ ЕКРАН (ФІКС ПОЗИЦІОНУВАННЯ) ====
function drawWelcomeScreen() {
    drawBackground();
    
    ctx.fillStyle = '#cc0066';
    ctx.font = '5vw Arial';  // Фікс для масштабування тексту
    ctx.textAlign = 'center';
    ctx.fillText("Love is in the air...", canvas.width / 2, canvas.height * 0.35);

    // **Кнопка старту**
    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width / 2 - canvas.width * 0.2, canvas.height * 0.6, canvas.width * 0.4, canvas.height * 0.08);
    
    ctx.fillStyle = "white";
    ctx.font = "4vw Arial";  
    ctx.fillText("💗 Start 💗", canvas.width / 2, canvas.height * 0.65);
}

// ==== ФІНАЛЬНИЙ ЕКРАН (ФІКС ПОЗИЦІОНУВАННЯ) ====
function drawEndScreen() {
    drawBackground();
    
    ctx.fillStyle = "#cc0066";
    ctx.font = "5vw Arial"; 
    ctx.textAlign = "center";
    const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height * 0.4);  // Фікс для центрування
    
    // **Кнопка перезапуску**
    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width / 2 - canvas.width * 0.2, canvas.height * 0.6, canvas.width * 0.4, canvas.height * 0.08);
    
    ctx.fillStyle = "white";
    ctx.font = "4vw Arial";  
    ctx.fillText("Restart", canvas.width / 2, canvas.height * 0.65);
}

// ==== ОНОВЛЕННЯ ГРИ ====
function gameLoop() {
    if (screen === 1) {
        drawWelcomeScreen();
    } else if (screen === 3) {
        drawEndScreen();
    }
    requestAnimationFrame(gameLoop);
}

// ==== ОБРОБКА КЛІКІВ ====
canvas.addEventListener("click", (e) => {
    if (screen === 1) {
        screen = 2;  // Перехід до гри
    } else if (screen === 3) {
        screen = 1;  // Перезапуск гри
    }
});

// ==== ЗАПУСК ====
function initGame() {
    resizeCanvas();
    gameLoop();
}
window.addEventListener("load", initGame);
