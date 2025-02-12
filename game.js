const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ==== АДАПТАЦІЯ ДЛЯ СМАРТФОНІВ ====
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

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

// ==== ФОНОВА АНІМАЦІЯ ====
function drawBackground() {
  ctx.fillStyle = "#FDF8F5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ЗАВАНТАЖЕННЯ ЗОБРАЖЕНЬ ====
const heartImage = new Image();
heartImage.src = 'assets/love (1).png';
const brokenHeartImage = new Image();
brokenHeartImage.src = 'assets/heartbreak.png';
const cupidImage = new Image();
cupidImage.src = 'assets/cupid.png';

// ==== ФУНКЦІЯ ДЛЯ СЕРДЕЦЬ ====
function createHeart(isBroken = false) {
  return {
    x: Math.random() * (canvas.width - 100),
    y: -100,
    size: 100,
    isBroken: isBroken,
    speed: 1.5 + Math.random() * 2,
    opacity: 1,
    shrink: false
  };
}

// ==== ВХІДНИЙ ЕКРАН ====
function drawWelcomeScreen() {
  drawBackground();
  ctx.drawImage(cupidImage, canvas.width / 2 - 50, 100, 100, 100);
  ctx.fillStyle = "#D72638";
  ctx.font = "42px 'Playfair Display', serif";
  ctx.textAlign = "center";
  ctx.fillText("Catch the Hearts! 💕", canvas.width / 2, canvas.height / 2 - 50);
}

// ==== ГОЛОВНИЙ ІГРОВИЙ ЕКРАН ====
function drawGameScreen() {
  drawBackground();
  ctx.fillStyle = "#D72638";
  ctx.font = "36px 'Inter', sans-serif";
  ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 80);

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
    heart.y += heart.speed;
    ctx.globalAlpha = 1;
  });
  hearts = hearts.filter(heart => heart.opacity > 0);
}

// ==== ФІНАЛЬНИЙ ЕКРАН ====
function drawEndScreen() {
  drawBackground();
  ctx.fillStyle = "#D72638";
  ctx.font = "40px 'Playfair Display', serif";
  ctx.textAlign = "center";
  const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
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
    screen = 1;
  }
});

// ==== ЗАПУСК ====
function initGame() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gameLoop();
}
window.addEventListener("load", initGame);
