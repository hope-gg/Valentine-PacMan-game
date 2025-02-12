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

// ==== ФУНКЦІЯ ДЛЯ МАЛЮВАННЯ ФОНУ ====
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ffccee'); 
    gradient.addColorStop(1, '#eac1f2'); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ФОНОВІ АНІМАЦІЇ ====
let floatingHearts = [];
for (let i = 0; i < 40; i++) { 
  floatingHearts.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.7 + Math.random() * 1.5 });
}

function drawFloatingHearts() {
  ctx.fillStyle = "rgba(255, 102, 153, 0.3)";
  floatingHearts.forEach(heart => {
    ctx.font = "36px Arial"; 
    ctx.fillText("❤️", heart.x, heart.y);
    heart.y += heart.speed;
    if (heart.y > canvas.height) heart.y = -10;
  });
}

// ==== СЕРДЕЧКА ====
function createHeart(isBroken = false) {
  return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 100, isBroken: isBroken, speed: 1 + Math.random() };
}

// ==== ВХІДНИЙ ЕКРАН ====
function drawWelcomeScreen() {
  drawBackground();
  drawFloatingHearts();
  ctx.fillStyle = '#cc0066';
  ctx.font = '60px "Dancing Script", cursive'; 
  ctx.textAlign = 'center';
  ctx.fillText("Love is in the air...", canvas.width / 2, canvas.height / 2 - 80);

  let pulse = Math.sin(Date.now() / 300) * 10 + 80;
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2 + 100, pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.fillText("❤️", canvas.width / 2, canvas.height / 2 + 115);
}

// ==== ГОЛОВНИЙ ІГРОВИЙ ЕКРАН ====
function drawGameScreen() {
  drawBackground();
  ctx.fillStyle = "#cc0066";
  ctx.font = "40px Arial"; 
  ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 120);

  hearts.forEach(heart => {
    ctx.font = heart.isBroken ? "80px Arial" : "100px Arial"; 
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
  ctx.font = "56px 'Dancing Script', cursive"; 
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
    screen = 2;
    player.collectedHearts = 0;
    hearts = [];
    for (let i = 0; i < 10; i++) hearts.push(createHeart(Math.random() < 0.3)); 
  } else if (screen === 2) {
    hearts = hearts.filter(heart => {
      if (Math.abs(e.clientX - heart.x) < 70 && Math.abs(e.clientY - heart.y) < 70) {
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
    if (
      e.clientX > canvas.width / 2 - 120 &&
      e.clientX < canvas.width / 2 + 120 &&
      e.clientY > canvas.height / 2 + 100 &&
      e.clientY < canvas.height / 2 + 190
    ) {
      screen = 1; // Тепер перезапуск лише після кліку на "Restart"
    }
  }
});

// ==== ЗАПУСК ====
function initGame() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gameLoop();
}
window.addEventListener("load", initGame);
