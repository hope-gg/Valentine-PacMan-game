const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ==== АДАПТАЦІЯ ДЛЯ СМАРТФОНІВ (ФІКС) ====
function resizeCanvas() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
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
let gradientY = 0;
function drawBackground() {
    gradientY += 0.3;
    if (gradientY > canvas.height) gradientY = 0;

    const gradient = ctx.createLinearGradient(0, gradientY, canvas.width, canvas.height + gradientY);
    gradient.addColorStop(0, '#ffccee');
    gradient.addColorStop(1, '#f8a3d8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ВХІДНИЙ ЕКРАН ====
function drawWelcomeScreen() {
    drawBackground();
    ctx.fillStyle = '#cc0066';
    ctx.font = '60px Arial';  // ФІКС ШРИФТУ
    ctx.textAlign = 'center';
    ctx.fillText("Love is in the air...", canvas.width / 2, canvas.height / 2 - 80);

    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 80);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.fillText("💗 Start 💗", canvas.width / 2, canvas.height / 2 + 100);
}

// ==== ФУНКЦІЯ ДЛЯ СЕРДЕЦЬ (довше тримаються) ====
function createHeart(isBroken = false) {
    return { 
        x: Math.random() * (canvas.width - 120), 
        y: Math.random() * (canvas.height - 200), 
        size: Math.min(120, canvas.width * 0.15), 
        isBroken: isBroken, 
        speed: 0.5 + Math.random() * 0.8, // **ПОВІЛЬНІШИЙ РУХ**
        opacity: 1, 
        shrink: false 
    };
}

// ==== ГОЛОВНИЙ ІГРОВИЙ ЕКРАН ====
function drawGameScreen() {
    drawBackground();
    ctx.fillStyle = "#cc0066";
    ctx.font = "40px Arial"; 
    ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 100);

    hearts.forEach(heart => {
        if (heart.shrink) {
            heart.opacity -= 0.02; // **ПОВІЛЬНІШЕ ЗНИКНЕННЯ**
            heart.size -= 1.5;
        }
        ctx.globalAlpha = heart.opacity;
        ctx.font = `${heart.size}px Arial`; 
        ctx.fillText(heart.isBroken ? "💔" : "💗", heart.x, heart.y);
        heart.y -= heart.speed;
        ctx.globalAlpha = 1;
    });

    hearts = hearts.filter(heart => heart.opacity > 0);

    // **ПОСТІЙНО ДОДАЄМО НОВІ СЕРЦЯ**
    if (Math.random() < 0.02) {
        hearts.push(createHeart(Math.random() < 0.3));
    }
}

// ==== ФІНАЛЬНИЙ ЕКРАН (ФІКС ТЕКСТУ) ====
function drawEndScreen() {
    drawBackground();
    ctx.fillStyle = "#cc0066";
    ctx.font = "50px Arial";  // **ПРИБРАЛИ DANCING SCRIPT**
    ctx.textAlign = "center";
    const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 100, 240, 90);
    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.fillText("Restart", canvas.width / 2, canvas.height / 2 + 155);
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

// ==== ОБРОБКА КЛІКІВ ====
canvas.addEventListener("click", (e) => {
    if (screen === 1) {
        if ("vibrate" in navigator) navigator.vibrate(200);
        screen = 2;
        player.collectedHearts = 0;
        player.lives = 5;
        hearts = [];
        for (let i = 0; i < 15; i++) hearts.push(createHeart(Math.random() < 0.3));  // **БІЛЬШЕ СЕРДЕЦЬ НА СТАРТІ**
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
