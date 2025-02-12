const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let screen = 1; // 1 - Вхідний екран, 2 - Гра, 3 - Фінал
let player = { x: canvas.width / 2, y: canvas.height - 100, size: 100, speed: 5, target: null, collectedHearts: 0 };
let hearts = [];
const requiredHearts = 5;
const romanticMessages = [
  "You are my forever love ❤️",
  "Every love story is beautiful, but ours is my favorite 💖",
  "You may hold my hand for a while, but you hold my heart forever 💕",
  "You are my dream come true ✨",
  "Love you to the moon and back 🌙❤️"
];

// ==== ФОНОВІ ЕФЕКТИ ====
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#ffccee');
  gradient.addColorStop(1, '#eac1f2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== СЕРДЕЧКА ====
function createHeart(isBroken = false) {
  return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 50, isBroken: isBroken, speed: 1 + Math.random() * 1.5 };
}
const fullHeart = new Image();
fullHeart.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTAwIDkwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGw9IiNmZjY2OTkiIGQ9Ik01MCA4NS41bC02LjUtNS41QzE1LjIgNTMuOCAwIDQwLjUgMCAyNC42IDAgMTAuOCAxMC4xIDAgMjIuNSAwYzYuOSAwIDEzLjYgMy4yIDE3LjkgOC42QzQ0LjggMy4yIDUxLjUgMCA1OC40IDAgNzAuOSAwIDgxIDEwLjggODEgMjQuNmMwIDE1LjktMTUuMiAyOS4yLTQzLjUgNTUuNEw1MCA4NS41eiIvPjwvc3ZnPg==";

// ==== ВХІДНИЙ ЕКРАН ====
function drawWelcomeScreen() {
  drawBackground();
  ctx.fillStyle = '#cc0066';
  ctx.font = '48px "Dancing Script", cursive';
  ctx.textAlign = 'center';
  ctx.fillText("Love is in the air...", canvas.width / 2, canvas.height / 2 - 50);

  // Кнопка ❤️
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2 + 50, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("❤️", canvas.width / 2, canvas.height / 2 + 60);
}

// ==== ГОЛОВНИЙ ІГРОВИЙ ЕКРАН ====
function drawGameScreen() {
  drawBackground();
  ctx.fillStyle = "#cc0066";
  ctx.font = "24px Arial";
  ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 50);

  // Сердечка
  hearts.forEach(heart => {
    ctx.drawImage(fullHeart, heart.x, heart.y, heart.size, heart.size);
    heart.y -= heart.speed; // Анімація підняття сердець
  });

  // Видаляємо серця, які вилетіли за межі
  hearts = hearts.filter(heart => heart.y > -50);
}

// ==== ФІНАЛЬНИЙ ЕКРАН ====
function drawEndScreen() {
  drawBackground();
  ctx.fillStyle = "#cc0066";
  ctx.font = "36px 'Dancing Script', cursive";
  ctx.textAlign = "center";
  const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);

  // Кнопка "Restart"
  ctx.fillStyle = "red";
  ctx.fillRect(canvas.width / 2 - 75, canvas.height / 2 + 50, 150, 50);
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Restart", canvas.width / 2, canvas.height / 2 + 80);
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
    // Перехід на гру
    screen = 2;
    player.collectedHearts = 0;
    hearts = [];
    for (let i = 0; i < 10; i++) hearts.push(createHeart());
  } else if (screen === 2) {
    // Ловимо сердечка
    hearts = hearts.filter(heart => {
      if (Math.abs(e.clientX - heart.x) < 30 && Math.abs(e.clientY - heart.y) < 30) {
        player.collectedHearts++;
        if (player.collectedHearts >= requiredHearts) {
          screen = 3; // Перехід на фінальний екран
        }
        return false;
      }
      return true;
    });
  } else if (screen === 3) {
    // Рестарт гри
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

