const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ==== АДАПТАЦІЯ ДЛЯ МОБІЛЬНИХ ====
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

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

// ==== АССЕТИ ====
const heartImg = new Image();
heartImg.src = "heart.png";

const brokenHeartImg = new Image();
brokenHeartImg.src = "broken-heart.png";

// ==== ФУНКЦІЯ ДЛЯ ФОНУ ====
function drawBackground() {
    ctx.fillStyle = "#fdece4"; // Ніжний рожевий фон
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ВХІДНИЙ ЕКРАН ====
function drawWelcomeScreen() {
    drawBackground();
    ctx.fillStyle = "#C14444";
    ctx.font = "40px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText("Love is in the air...", canvas.width / 2, canvas.height / 2 - 50);

    ctx.drawImage(heartImg, canvas.width / 2 - 50, canvas.height / 2, 100, 100);
}

// ==== ФУНКЦІЯ ДЛЯ СЕРДЕЦЬ ====
function createHeart(isBroken = false) {
    return { 
        x: Math.random() * (canvas.width - 80), 
        y: Math.random() * (canvas.height - 200), 
        size: 80, 
        isBroken: isBroken, 
        speed: 0.5 + Math.random() * 1.5,
        shrink: false 
    };
}

// ==== ГОЛОВНИЙ ЕКРАН ГРИ ====
function drawGameScreen() {
    drawBackground();
    ctx.fillStyle = "#C14444";
    ctx.font = "30px Arial"; 
    ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 50);

    hearts.forEach(heart => {
        if (heart.shrink) {
            heart.size -= 5;
        }
        if (heart.isBroken) {
            ctx.drawImage(brokenHeartImg, heart.x, heart.y, heart.size, heart.size);
        } else {
            ctx.drawImage(heartImg, heart.x, heart.y, heart.size, heart.size);
        }
        heart.y += heart.speed;
    });

    hearts = hearts.filter(heart => heart.size > 10);
}

// ==== ФІНАЛЬНИЙ ЕКРАН ====
function drawEndScreen() {
    drawBackground();
    ctx.fillStyle = "#C14444";
    ctx.font = "40px 'Playfair Display', serif"; 
    ctx.textAlign = "center";
    const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = "#9E2A2A";
    ctx.fillRect(canvas.width / 2 - 80, canvas.height / 2 + 50, 160, 50);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Restart", canvas.width / 2, canvas.height / 2 + 80);
}

// ==== ГОЛОВНИЙ ЦИКЛ ГРИ ====
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

// ==== ОБРОБКА КЛІКІВ ====
canvas.addEventListener("click", (e) => {
    if (screen === 1) {
        if ("vibrate" in navigator) navigator.vibrate(200);
        screen = 2;
        player.collectedHearts = 0;
        player.lives = 5;
        hearts = [];
        for (let i = 0; i < 15; i++) hearts.push(createHeart(Math.random() < 0.3));
    } else if (screen === 2) {
        hearts.forEach(heart => {
            if (Math.abs(e.clientX - heart.x) < 50 && Math.abs(e.clientY - heart.y) < 50) {
                if (!heart.isBroken) {
                    player.collectedHearts++;
                    if (player.collectedHearts >= requiredHearts) {
                        screen = 3;
                        if ("vibrate" in navigator) navigator.vibrate(300);
                    }
                } else {
                    player.lives--;
                    if ("vibrate" in navigator) navigator.vibrate(500);
                }
                heart.shrink = true;
            }
        });
    } else if (screen === 3) {
        screen = 1;
    }
});

// ==== ЗАПУСК ====
function initGame() {
    resizeCanvas();
    gameLoop();
}
window.addEventListener("load", initGame);
