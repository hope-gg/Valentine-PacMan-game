const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ====== 1. Робимо Canvas респонсивним (з урахуванням devicePixelRatio) ======
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(ratio, ratio);
}
window.addEventListener('resize', resizeCanvas);

// ====== 2. Гравець у вигляді сердечка ======
const player = {
  x: 100, y: 100, size: 50, speed: 4, target: null
};

const finishPoint = { x: 0, y: 50, size: 80 };

// ====== 3. Масив падаючих сердечок ======
let hearts = [];

// Функція для створення сердечка
function createHeart() {
  return {
    x: Math.random() * canvas.width / devicePixelRatio,
    y: -50,
    size: 20 + Math.random() * 30,
    speedY: 1 + Math.random() * 2,
    speedX: (Math.random() - 0.5) * 1,
    angle: 0,
    rotationSpeed: (Math.random() - 0.5) * 0.02
  };
}

// SVG-зображення сердечка
const heartIcon = new Image();
heartIcon.src = "data:image/svg+xml,%3Csvg width='100' height='90' viewBox='0 0 100 90' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23ff6699' d='M50 85.5l-6.5-5.5C15.2 53.8 0 40.5 0 24.6 0 10.8 10.1 0 22.5 0c6.9 0 13.6 3.2 17.9 8.6C44.8 3.2 51.5 0 58.4 0 70.9 0 81 10.8 81 24.6c0 15.9-15.2 29.2-43.5 55.4L50 85.5z'/%3E%3C/svg%3E";

// ====== 4. Малювання градієнтного фону ======
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#ffccee');
  gradient.addColorStop(1, '#eac1f2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ====== 5. Малювання гравця-сердечка ======
function drawPlayer() {
  ctx.drawImage(heartIcon, player.x, player.y, player.size, player.size);
}

// ====== 6. Малювання фінішної зони ======
function drawFinishPoint() {
  ctx.fillStyle = 'rgba(255, 200, 220, 0.6)';
  ctx.beginPath();
  ctx.arc(finishPoint.x, finishPoint.y, finishPoint.size, 0, Math.PI * 2);
  ctx.fill();
}

// ====== 7. Оновлення анімації сердечок ======
function updateHearts() {
  hearts.forEach(heart => {
    heart.x += heart.speedX;
    heart.y += heart.speedY;
  });
  hearts = hearts.filter(heart => heart.y < canvas.height);
}

// ====== 8. Малювання сердечок ======
function drawHearts() {
  hearts.forEach(heart => {
    ctx.drawImage(heartIcon, heart.x, heart.y, heart.size, heart.size);
  });
}

// ====== 9. Рух гравця до цілі ======
function movePlayer() {
  if (!player.target) return;
  let dx = player.target.x - player.x;
  let dy = player.target.y - player.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (distance > player.speed) {
    player.x += (dx / distance) * player.speed;
    player.y += (dy / distance) * player.speed;
  } else {
    player.target = null;
  }
}

// ====== 10. Обробка кліку (рух гравця) ======
canvas.addEventListener('click', (e) => {
  player.target = { x: e.clientX, y: e.clientY };
});

// ====== 11. Відображення фінального тексту ======
function displayEndMessage() {
  ctx.fillStyle = '#cc0066';
  ctx.font = '48px "Dancing Script", cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText("You are my heart's greatest joy 💖", canvas.width / 2, canvas.height / 2);
}

// ====== 12. Основний ігровий цикл ======
function gameLoop() {
  drawBackground();
  movePlayer();
  drawFinishPoint();
  drawPlayer();
  updateHearts();
  drawHearts();
  
  if (player.y < finishPoint.y + finishPoint.size) {
    displayEndMessage();
    return;
  }

  requestAnimationFrame(gameLoop);
}

// ====== 13. Запуск гри ======
function initGame() {
  resizeCanvas();
  player.x = canvas.width / 2;
  player.y = canvas.height - 100;
  finishPoint.x = canvas.width / 2;
  finishPoint.y = 80;
  
  for (let i = 0; i < 10; i++) {
    hearts.push(createHeart());
  }
  setInterval(() => hearts.push(createHeart()), 800);
  gameLoop();
}

window.addEventListener('load', initGame);
