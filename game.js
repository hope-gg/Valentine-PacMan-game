const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ==== АДАПТАЦІЯ ДЛЯ СМАРТФОНІВ ====
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

// ==== ЗАВАНТАЖЕННЯ ЗОБРАЖЕНЬ ====
const heartImage = new Image();
heartImage.src = 'assets/heart.png';

const brokenHeartImage = new Image();
brokenHeartImage.src = 'assets/broken-heart.png';

const buttonImage = new Image();
buttonImage.src = 'assets/button.png';

const lifeHeartBar = new Image();
lifeHeartBar.src = 'assets/lifeheartbar.jpeg';

// ==== ФУНКЦІЯ ДЛЯ МАЛЮВАННЯ ФОНУ (анімація градієнту) ====
let gradientY = 0;
function drawBackground() {
    gradientY += 0.2;
    if (gradientY > canvas.height) gradientY = 0;

    const gradient = ctx.createLinearGradient(0, gradientY, canvas.width, canvas.height + gradientY);
    gradient.addColorStop(0, '#ffccee');
    gradient.addColorStop(1, '#f8a3d8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ВХІДНИЙ ЕКРАН (анімація кнопки) ====
function drawWelcomeScreen() {
    drawBackground();
    ctx.fillStyle = '#cc0066';
    ctx.font = '5vw Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Love is in the air...", canvas.width / 2, canvas.height * 0.35);

    // Кнопка "Start"
    const buttonWidth = canvas.width * 0.4;
    const buttonHeight = canvas.height * 0.08;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height * 0.6;

    ctx.drawImage(buttonImage, buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = "4vw Arial";
    ctx.fillText("💗 Start 💗", canvas.width / 2, canvas.height * 0.65);
}

// ==== ФУНКЦІЯ ДЛЯ СЕРДЕЦЬ (анімація появи) ====
function createHeart(isBroken = false) {
    return { 
        x: Math.random() * (canvas.width - 100), 
        y: Math.random() * (canvas.height - 150), 
        size: 0, 
        maxSize: Math.min(100, canvas.width * 0.15), 
        isBroken: isBroken, 
        speed: 0.7 + Math.random() * 1.2, 
        opacity: 1, 
        shrink: false 
    };
}

// ==== ГОЛОВНИЙ ІГРОВИЙ ЕКРАН (анімація появи сердець) ====
function drawGameScreen() {
    drawBackground();

    // Панель життя
    ctx.drawImage(lifeHeartBar, 20, 20, 150, 50);

    ctx.fillStyle = "#cc0066";
    ctx.font = "4vw Arial";
    ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 100);

    hearts.forEach(heart => {
        if (heart.size < heart.maxSize) {
            heart.size += 2;
        }
        if (heart.shrink) {
            heart.opacity -= 0.05;
            heart.size -= 2;
        }
        ctx.globalAlpha = heart.opacity;
        ctx.drawImage(
            heart.isBroken ? brokenHeartImage : heartImage,
            heart.x, heart.y, heart.size, heart.size
        );
        heart.y -= heart.speed;
        ctx.globalAlpha = 1;
    });

    hearts = hearts.filter(heart => heart.opacity > 0);
}

// ==== ФІНАЛЬНИЙ ЕКРАН ====
function drawEndScreen() {
    drawBackground();
    ctx.fillStyle = "#cc0066";
    ctx.font = "5vw Arial";
    ctx.textAlign = "center";
    const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height * 0.4);

    // Кнопка "Restart"
    const buttonWidth = canvas.width * 0.4;
    const buttonHeight = canvas.height * 0.08;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height * 0.6;

    ctx.drawImage(buttonImage, buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = "4vw Arial";
    ctx.fillText("Restart", canvas.width / 2, canvas.height * 0.65);
}

// ==== ОНОВЛЕННЯ ГРИ ====
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

// ==== ОБРОБКА КЛІКІВ (вібрація та ефекти) ====
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
        screen = 1;
    }
});

// ==== ЗАПУСК ====
function initGame() {
    resizeCanvas();
    gameLoop();
}
window.addEventListener("load", initGame);
