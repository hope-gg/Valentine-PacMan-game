const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== АДАПТАЦІЯ ДЛЯ СМАРТФОНІВ =====
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== ГЛОБАЛЬНІ ЗМІННІ =====
let gameActive = false;
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

// ===== ЗАВАНТАЖЕННЯ АССЕТІВ =====
const heartImage = new Image();
heartImage.src = "heart.png";

const brokenHeartImage = new Image();
brokenHeartImage.src = "broken-heart.png";

// ===== ФУНКЦІЯ СТВОРЕННЯ СЕРДЕЦЬ =====
function createHeart(isBroken = false) {
    return {
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height - 100),
        size: 60,
        isBroken: isBroken,
        speed: 0.7 + Math.random() * 1.5, 
        opacity: 1,
        shrink: false
    };
}

// ===== МАЛЮВАННЯ СЕРДЕЦЬ =====
function drawHearts() {
    hearts.forEach((heart) => {
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
        ctx.globalAlpha = 1;
    });

    hearts = hearts.filter((heart) => heart.opacity > 0);
}

// ===== МАЛЮВАННЯ ІГРОВОГО ЕКРАНУ =====
function drawGameScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#C14444";
    ctx.font = "32px 'Playfair Display'";
    ctx.textAlign = "center";
    ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 50);
    drawHearts();
}

// ===== ФУНКЦІЯ СТАРТУ ГРИ =====
function startGame() {
    gameActive = true;
    player.collectedHearts = 0;
    hearts = [];

    // Генеруємо серця
    for (let i = 0; i < 15; i++) {
        hearts.push(createHeart(Math.random() < 0.3));
    }

    gameLoop();
}

// ===== КЛІК ПО СЕРЦЮ =====
canvas.addEventListener("click", (e) => {
    if (!gameActive) return;

    hearts.forEach((heart) => {
        if (
            e.clientX > heart.x &&
            e.clientX < heart.x + heart.size &&
            e.clientY > heart.y &&
            e.clientY < heart.y + heart.size
        ) {
            if (!heart.isBroken) {
                player.collectedHearts++;
                if (player.collectedHearts >= requiredHearts) {
                    displayMessage();
                }
            }
            heart.shrink = true;

            // Вібрація при кліку
            if ("vibrate" in navigator) navigator.vibrate(100);
        }
    });
});

// ===== ФІНАЛЬНЕ ПОВІДОМЛЕННЯ =====
function displayMessage() {
    gameActive = false;
    document.getElementById("message-container").innerText =
        romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    document.getElementById("message-container").style.display = "block";
}

// ===== ІГРОВИЙ ЦИКЛ =====
function gameLoop() {
    if (!gameActive) return;
    drawGameScreen();
    requestAnimationFrame(gameLoop);
}
