const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ==== Завантаження ассетів ====
const heartImage = new Image();
heartImage.src = 'heart.png';

const brokenHeartImage = new Image();
brokenHeartImage.src = 'broken-heart.png';

const backgroundImage = new Image();
backgroundImage.src = 'background.jpg';

let screen = 1;
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

// ==== Функція для малювання фону ====
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// ==== Вхідний екран ====
function drawWelcomeScreen() {
    drawBackground();
    ctx.fillStyle = '#C14444';
    ctx.font = '48px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText("Love is in the air...", canvas.width / 2, canvas.height / 2 - 50);
}

// ==== Функція для створення сердець ====
function createHeart(isBroken = false) {
    return { 
        x: Math.random() * (canvas.width - 100), 
        y: Math.random() * (canvas.height - 200), 
        size: 80, 
        isBroken: isBroken, 
        speed: 1 + Math.random(), 
        opacity: 1, 
        shrink: false 
    };
}

// ==== Ігровий екран ====
function drawGameScreen() {
    drawBackground();
    ctx.fillStyle = "#C14444";
    ctx.font = "32px 'Playfair Display', serif";
    ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 60);

    hearts.forEach(heart => {
        if (heart.shrink) {
            heart.opacity -= 0.05;
            heart.size -= 2;
        }
        ctx.globalAlpha = heart.opacity;
        if (heart.isBroken) {
            ctx.drawImage(brokenHeartImage, heart.x, heart.y, heart.size, heart.size);
        } else {
            ctx.drawImage(heartImage, heart.x, heart.y, heart.size, heart.size);
        }
        heart.y -= heart.speed;
        ctx.globalAlpha = 1;
    });

    hearts = hearts.filter(heart => heart.opacity > 0);
}

// ==== Фінальний екран ====
function drawEndScreen() {
    drawBackground();
    ctx.fillStyle = "#C14444";
    ctx.font = "48px 'Playfair Display', serif";
    ctx.textAlign = "center";
    const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 50);

    ctx.fillStyle = "#9E2A2A";
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 60);
    ctx.fillStyle = "white";
    ctx.font = "32px 'Playfair Display', serif";
    ctx.fillText("Restart", canvas.width / 2, canvas.height / 2 + 90);
}

// ==== Оновлення гри ====
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

// ==== Обробка кліків ====
canvas.addEventListener("click", (e) => {
    if (screen === 1) {
        if ("vibrate" in navigator) navigator.vibrate(200);
        screen = 2;
        player.collectedHearts = 0;
        player.lives = 5;
        hearts = [];
        for (let i = 0; i < 10; i++) hearts.push(createHeart(Math.random() < 0.3));
    } else if (screen === 2) {
        hearts.forEach(heart => {
            if (Math.abs(e.clientX - heart.x) < 80 && Math.abs(e.clientY - heart.y) < 80) {
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
        if (
            e.clientX > canvas.width / 2 - 100 &&
            e.clientX < canvas.width / 2 + 100 &&
            e.clientY > canvas.height / 2 + 50 &&
            e.clientY < canvas.height / 2 + 110
        ) {
            screen = 1;
        }
    }
});

// ==== Запуск гри ====
function initGame() {
    resizeCanvas();
    gameLoop();
}
window.addEventListener("load", initGame);
