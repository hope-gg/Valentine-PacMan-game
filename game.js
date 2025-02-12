const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// === Завантаження зображень ===
const fullHeartImg = new Image();
fullHeartImg.src = "assets/heart (1).png";

const brokenHeartImg = new Image();
brokenHeartImg.src = "assets/broken-heart.png";

// === Глобальні змінні ===
let screen = 1; // 1 - Вхідний екран, 2 - Гра, 3 - Фінал
let player = { collectedHearts: 0, lives: 3 };
let hearts = [];
const requiredHearts = 5;
const romanticMessages = [
    "You are my forever love 💕",
    "Every love story is beautiful, but ours is my favorite 💖",
    "You hold my heart forever 💗",
    "You are my dream come true ✨",
    "Love you to the moon and back 🌙💞"
];

// === Функція старту гри ===
function startGame() {
    screen = 2;
    document.getElementById("startButton").style.display = "none";
    player.collectedHearts = 0;
    player.lives = 3;
    hearts = [];
    generateHearts();
    gameLoop();
}

// === Функція фону ===
function drawBackground() {
    ctx.fillStyle = "#ffe6f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// === Функція генерації сердець ===
function generateHearts() {
    for (let i = 0; i < 10; i++) {
        hearts.push({
            x: Math.random() * (canvas.width - 50),
            y: Math.random() * (canvas.height - 200),
            size: 50,
            isBroken: Math.random() < 0.3, // 30% шанс, що серце буде розбитим
            speed: 1 + Math.random() * 2
        });
    }
}

// === Функція малювання сердець ===
function drawHearts() {
    hearts.forEach(heart => {
        if (heart.isBroken) {
            ctx.drawImage(brokenHeartImg, heart.x, heart.y, heart.size, heart.size);
        } else {
            ctx.drawImage(fullHeartImg, heart.x, heart.y, heart.size, heart.size);
        }
        heart.y += heart.speed;
        if (heart.y > canvas.height) {
            heart.y = -50;
            heart.x = Math.random() * (canvas.width - 50);
        }
    });
}

// === Головний ігровий екран ===
function drawGameScreen() {
    drawBackground();
    ctx.fillStyle = "#C14444";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Hearts: ${player.collectedHearts}/${requiredHearts} | Lives: ${player.lives}`, canvas.width / 2, 50);
    drawHearts();
}

// === Фінальний екран ===
function drawEndScreen() {
    drawBackground();
    ctx.fillStyle = "#C14444";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

// === Ігровий цикл ===
function gameLoop() {
    if (screen === 2) {
        drawGameScreen();
    } else if (screen === 3) {
        drawEndScreen();
    }
    requestAnimationFrame(gameLoop);
}

// === Обробка кліків ===
canvas.addEventListener("click", (e) => {
    if (screen === 2) {
        hearts.forEach((heart, index) => {
            if (
                e.clientX > heart.x &&
                e.clientX < heart.x + heart.size &&
                e.clientY > heart.y &&
                e.clientY < heart.y + heart.size
            ) {
                if (heart.isBroken) {
                    player.lives--;
                } else {
                    player.collectedHearts++;
                }

                // Видаляємо серце після кліку
                hearts.splice(index, 1);

                // Додаємо нове серце, щоб балансувати гру
                hearts.push({
                    x: Math.random() * (canvas.width - 50),
                    y: -50,
                    size: 50,
                    isBroken: Math.random() < 0.3,
                    speed: 1 + Math.random() * 2
                });

                // Якщо гравець зібрав 5 сердець → перемога
                if (player.collectedHearts >= requiredHearts) {
                    screen = 3;
                }
            }
        });
    }
});

// === Додаємо startGame у кнопку ===
document.getElementById("startButton").addEventListener("click", startGame);

