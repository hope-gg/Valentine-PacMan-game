const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ==== АДАПТАЦІЯ ДЛЯ СМАРТФОНІВ ====
function resizeCanvas() {
    canvas.width = 400;
    canvas.height = 600;
}
resizeCanvas();

let screen = 1; // 1 - Вхідний екран, 2 - Гра, 3 - Фінал
let player = { collectedHearts: 0, lives: 5 };
let hearts = [];
const requiredHearts = 5;
const romanticMessages = [
  "You are my forever love ❤️",
  "Every love story is beautiful, but ours is my favorite 💖",
  "You hold my heart forever 💟",
  "You are my dream come true ✨",
  "Love you to the moon and back 🌟💙"
];
let finalMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];

// ==== ФОНОВА АНІМАЦІЯ ====
function drawBackground() {
  ctx.fillStyle = "#FCF5EB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ЗАВАНТАЖЕННЯ ЗОБРАЖЕНЬ ====
const heartImage = new Image();
heartImage.src = 'assets/heart.png';
const brokenHeartImage = new Image();
brokenHeartImage.src = 'assets/heartbreak.png';
const cupidImage = new Image();
cupidImage.src = 'assets/cupid.png';
const buttonImage = new Image();
buttonImage.src = 'assets/button.png';

const imagesLoaded = { heart: false, brokenHeart: false, cupid: false, button: false };

heartImage.onload = () => imagesLoaded.heart = true;
brokenHeartImage.onload = () => imagesLoaded.brokenHeart = true;
cupidImage.onload = () => imagesLoaded.cupid = true;
buttonImage.onload = () => imagesLoaded.button = true;

function allImagesLoaded() {
  return imagesLoaded.heart && imagesLoaded.brokenHeart && imagesLoaded.cupid && imagesLoaded.button;
}

// ==== ФУНКЦІЯ ДЛЯ СЕРДЕЦЬ ====
function createHeart(isBroken = false) {
  return {
    x: Math.random() * (canvas.width - 100),
    y: Math.random() * (canvas.height - 200),
    size: 90, // Трішки збільшив
    isBroken: isBroken,
    speedX: (Math.random() - 0.5) * 2, 
    speedY: (Math.random() - 0.5) * 2,
    opacity: 1,
    shrink: false
  };
}

// ==== ВХІДНИЙ ЕКРАН ====
function drawWelcomeScreen() {
  drawBackground();
  if (allImagesLoaded()) {
    ctx.drawImage(cupidImage, canvas.width / 2 - 50, 100, 100, 100);
    ctx.drawImage(buttonImage, canvas.width / 2 - 50, canvas.height / 2, 100, 100);
  }
  ctx.fillStyle = "#D72638";
  ctx.font = "42px 'Playfair Display', serif";
  ctx.textAlign = "center";
  ctx.fillText("LOVE IN THE AIR", canvas.width / 2, canvas.height / 2 - 50);
}

// ==== ГОЛОВНИЙ ІГРОВИЙ ЕКРАН ====
function drawGameScreen() {
  drawBackground();
  ctx.fillStyle = "#D72638";
  ctx.font = "28px 'Inter', sans-serif";
  ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 50);

  hearts.forEach(heart => {
    ctx.globalAlpha = heart.opacity;
    if (allImagesLoaded()) {
      ctx.drawImage(heart.isBroken ? brokenHeartImage : heartImage, heart.x, heart.y, heart.size, heart.size);
    }
    heart.x += heart.speedX;
    heart.y += heart.speedY;
    if (heart.x < 0 || heart.x + heart.size > canvas.width) heart.speedX *= -1;
    if (heart.y < 0 || heart.y + heart.size > canvas.height) heart.speedY *= -1;
    ctx.globalAlpha = 1;
  });
}

// ==== ФІНАЛЬНИЙ ЕКРАН ====
function drawEndScreen() {
  document.getElementById("message-container").style.display = "block";
  document.getElementById("message-container").innerText = finalMessage;
}

// ==== ПОКРАЩЕНА ОБРОБКА КЛІКІВ ====
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect(); // Отримуємо позицію canvas
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (screen === 2) {
        hearts = hearts.filter(heart => {
            const distance = Math.hypot(clickX - (heart.x + heart.size / 2), clickY - (heart.y + heart.size / 2));

            if (distance < heart.size * 0.6) { // Точність кліку покращена
                if (!heart.isBroken) {
                    player.collectedHearts++;
                    if (player.collectedHearts >= requiredHearts) {
                        screen = 3;
                        document.getElementById("message-container").style.display = "block"; // Показуємо фінальний текст
                    }
                } else {
                    player.collectedHearts = Math.max(0, player.collectedHearts - 1);
                }
                return false; // Видаляємо серце після кліку
            }
            return true;
        });
    }
});


// ==== ЗАПУСК ====
function gameLoop() {
  if (screen === 1) drawWelcomeScreen();
  else if (screen === 2) drawGameScreen();
  requestAnimationFrame(gameLoop);
}
window.addEventListener("load", gameLoop);
