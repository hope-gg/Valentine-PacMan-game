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

// ====== 2. Гравець - ваш персонаж (залишаємо вашу логіку) ======
const player = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 150,
  size: 100,
  speed: 5,
  dx: 0,
  dy: 0,
  target: null
};

// ====== 3. Фінішна зона ======
const finishPoint = {
  x: canvas.width / 2 - 50,
  y: 50,
  size: 100
};

let gameFinished = false;

// ====== 4. Масив падаючих сердечок ======
let hearts = [];
let score = 0;

function createHeart() {
  return {
    x: Math.random() * (canvas.width - 50),
    y: -50,
    size: 20 + Math.random() * 30,
    speedY: 1 + Math.random() * 2
  };
}

// ====== 5. Завантаження персонажа (ваші зображення) ======
const playerImage = new Image();
playerImage.src = 'assets/ghost.png'; // ваш персонаж

const heartImage = new Image();
heartImage.src = 'assets/heart.png'; // сердечка

// ====== 6. Малювання фону ======
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#ffccee');
  gradient.addColorStop(1, '#eac1f2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ====== 7. Малювання персонажа ======
function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);
}

// ====== 8. Малювання фінішної зони ======
function drawFinishPoint() {
  ctx.fillStyle = 'rgba(255, 200, 220, 0.6)';
  ctx.beginPath();
  ctx.arc(finishPoint.x + finishPoint.size / 2, finishPoint.y + finishPoint.size / 2, finishPoint.size, 0, Math.PI * 2);
  ctx.fill();
}

// ====== 9. Оновлення анімації сердечок ======
function updateHearts() {
  hearts.forEach(heart => {
    heart.y += heart.speedY;
  });
  hearts = hearts.filter(heart => heart.y < canvas.height);
}

// ====== 10. Малювання сердечок ======
function drawHearts() {
  hearts.forEach(heart => {
    ctx.drawImage(heartImage, heart.x, heart.y, heart.size, heart.size);
  });
}

// ====== 11. Рух персонажа ======
function moveTowardsTarget() {
  if (!player.target) return;
  let dx = player.target.x - player.x;
  let dy = player.target.y - player.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > player.speed) {
    player.x += (dx / distance) * player.speed;
    player.y += (dy / distance) * player.speed;
  } else {
    player.x = player.target.x;
    player.y = player.target.y;
    player.target = null;
  }
}

// ====== 12. Обробка кліку (рух гравця) ======
canvas.addEventListener('click', (e) => {
  player.target = { x: e.clientX, y: e.clientY };
});

// ====== 13. Фінальний романтичний текст ======
const endPhrases = [
  "You are the song that my heart loves to sing.",
  "All that you are is all that I’ll ever need.",
  "Take my hand, take my whole life too, but I can't help falling in love with you",
  "Every love song is about you. Happy Valentine's Day!",
  "You’re my happily ever after.",
  "You may hold my hand for a while, but you hold my heart forever.",
  "The best things in life are better with you.",
  "I never believed in luck until I found you.",
  "Every love story is beautiful but ours is my favorite.",
  "You’re the one. I’ve never been so sure of anything in my whole life."
];

function displayEndMessage() {
  ctx.fillStyle = '#cc0066';
  ctx.font = '48px "Dancing Script", cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const phrase = endPhrases[Math.floor(Math.random() * endPhrases.length)];
  ctx.fillText(phrase, canvas.width / 2, canvas.height / 2);
}

// ====== 14. Основний ігровий цикл ======
function gameLoop() {
  drawBackground();
  moveTowardsTarget();
  drawFinishPoint();
  drawPlayer();
  updateHearts();
  drawHearts();

  if (
    player.x < finishPoint.x + finishPoint.size &&
    player.x + player.size > finishPoint.x &&
    player.y < finishPoint.y + finishPoint.size &&
    player.y + player.size > finishPoint.y
  ) {
    gameFinished = true;
  }

  if (gameFinished) {
    displayEndMessage();
    return;
  }

  requestAnimationFrame(gameLoop);
}

// ====== 15. Запуск гри ======
function initGame() {
  resizeCanvas();
  finishPoint.x = canvas.width / 2 - finishPoint.size / 2;
  finishPoint.y = 50;

  for (let i = 0; i < 10; i++) {
    hearts.push(createHeart());
  }
  setInterval(() => hearts.push(createHeart()), 800);

  gameLoop();
}

window.addEventListener('load', initGame);
