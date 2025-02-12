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
let player = { x: canvas.width / 2, y: canvas.height - 150, size: 150, collectedHearts: 0 };
let hearts = [];
const requiredHearts = 5;
const romanticMessages = [
  "You are my forever love ❤️",
  "Every love story is beautiful, but ours is my favorite 💖",
  "You hold my heart forever 💕",
  "You are my dream come true ✨",
  "Love you to the moon and back 🌙❤️"
];

// ==== ФОНОВІ АНІМАЦІЇ ====
let floatingHearts = [];
for (let i = 0; i < 30; i++) { // Більше сердечок для мобільних
  floatingHearts.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.7 + Math.random() * 1.5 });
}

function drawFloatingHearts() {
  ctx.fillStyle = "rgba(255, 102, 153, 0.3)";
  floatingHearts.forEach(heart => {
    ctx.font = "32px Arial"; // Збільшений розмір
    ctx.fillText("❤️", heart.x, heart.y);
    heart.y += heart.speed;
    if (heart.y > canvas.height) heart.y = -10;
  });
}

// ==== СЕРДЕЧКА ====
function createHeart(isBroken = false) {
  return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 80, isBroken: isBroken, speed: 1 + Math.random() };
}

// ==== ВХІДНИЙ ЕКРАН ====
function drawWelcomeScreen() {
  drawBackground();
  drawFloatingHearts();
  ctx.fillStyle = '#cc0066';
  ctx.font = '56px "Dancing Script", cursive'; // Збільшений розмір тексту
  ctx.textAlign = 'center';
  ctx.fillText("Love is in the air...", canvas.width / 2, canvas.height / 2 - 80);

  // Кнопка-серце
  let pulse = Math.sin(Date.now() / 300) * 10 + 70;
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2 + 100, pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("❤️", canvas.width / 2, canvas.height / 2 + 115);
}

// ==== ГОЛОВНИЙ ІГРОВИЙ ЕКРАН ====
function drawGameScreen() {
  drawBackground();
  ctx.fillStyle = "#cc0066";
  ctx.font = "32px Arial"; // Збільшений розмір
  ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 100);

  hearts.forEach(heart => {
    ctx.font = heart.isBroken ? "64px Arial" : "80px Arial"; // Розбиті трохи менші
    ctx.fillText(heart.isBroken ? "💔" : "❤️", heart.x, heart.y);
    heart.y -= heart.speed;
  });

  hearts = hearts.filter(heart => heart.y > -50);
}

// ==== ФІНАЛЬНИЙ ЕКРАН ====
function drawEndScreen() {
  drawBackground();
  drawFloatingHearts();
  ctx.fillStyle = "#cc0066";
  ctx.font = "44px 'Dancing Script', cursive"; // Збільшений розмір
  ctx.textAlign = "center";
  const message = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);

  // Кнопка Restart
  let pulse = Math.sin(Date.now() / 200) * 5 + 1;
  ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`;
  ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 100, 200, 80);
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText("Restart", canvas.width / 2, canvas.height / 2 + 150);
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
    screen = 2;
    player.collectedHearts = 0;
    hearts = [];
    for (let i = 0; i < 10; i++) hearts.push(createHeart(Math.random() < 0.3)); // 30% шанс розбитого
  } else if (screen === 2) {
    hearts = hearts.filter(heart => {
      if (Math.abs(e.clientX - heart.x) < 50 && Math.abs(e.clientY - heart.y) < 50) {
        if (!heart.isBroken) {
          player.collectedHearts++;
          if (player.collectedHearts >= requiredHearts) {
            screen = 3;
          }
        }
        return false;
      }
      return true;
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
