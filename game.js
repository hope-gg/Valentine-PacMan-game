const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ====== 1. Респонсивний Canvas ======
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(ratio, ratio);
}
window.addEventListener('resize', resizeCanvas);

// ====== 2. Гравець ======
const player = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  size: 100,
  speed: 5,
  target: null,
  collectedHearts: 0
};

// ====== 3. Сердечка (правильні та розбиті) ======
let hearts = [];
const requiredHearts = 5;

function createHeart(isBroken = false) {
  return {
    x: Math.random() * (canvas.width - 80) + 40,
    y: Math.random() * (canvas.height - 200) + 100,
    size: 50,
    isBroken: isBroken // Розбите чи повне сердечко
  };
}

// ====== 4. Завантаження графіки ======
const playerImage = new Image();
playerImage.src = 'assets/ghost.png';

const fullHeartImage = new Image();
fullHeartImage.src = 'assets/full_heart.png'; // Повне рожеве серце

const brokenHeartImage = new Image();
brokenHeartImage.src = 'assets/broken_heart.png'; // Розбите серце

// ====== 5. Малювання фону ======
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#ffccee');
  gradient.addColorStop(1, '#eac1f2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ====== 6. Малювання персонажа ======
function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);
}

// ====== 7. Оновлення та малювання сердечок ======
function updateHearts() {
  hearts = hearts.filter(heart => {
    if (
      player.x < heart.x + heart.size &&
      player.x + player.size > heart.x &&
      player.y < heart.y + heart.size &&
      player.y + player.size > heart.y
    ) {
      if (!heart.isBroken) {
        player.collectedHearts++;
        if (player.collectedHearts >= requiredHearts) {
          gameFinished = true;
        }
      }
      return false;
    }
    return true;
  });
}

function drawHearts() {
  hearts.forEach(heart => {
    const img = heart.isBroken ? brokenHeartImage : fullHeartImage;
    ctx.drawImage(img, heart.x, heart.y, heart.size, heart.size);
  });
}

// ====== 8. Рух гравця ======
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

// ====== 9. Обробка кліку ======
canvas.addEventListener('click', (e) => {
  player.target = { x: e.clientX, y: e.clientY };
});

// ====== 10. Фінальне вікно з текстом ======
function displayEndMessage() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 100, 400, 200);

  ctx.fillStyle = '#cc0066';
  ctx.font = '32px "Dancing Script", cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText("You collected all the love! 💖", canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText("Happy Valentine's Day!", canvas.width / 2, canvas.height / 2 + 30);
}

// ====== 11. Основний цикл гри ======
let gameFinished = false;

function gameLoop() {
  drawBackground();
  moveTowardsTarget();
  drawPlayer();
  updateHearts();
  drawHearts();

  if (gameFinished) {
    displayEndMessage();
    return;
  }

  requestAnimationFrame(gameLoop);
}

// ====== 12. Запуск гри ======
function initGame() {
  resizeCanvas();

  // Створюємо 5 правильних сердець і 5 розбитих
  for (let i = 0; i < 5; i++) {
    hearts.push(createHeart(false)); // Повне серце
    hearts.push(createHeart(true));  // Розбите серце
  }

  gameLoop();
}

window.addEventListener('load', initGame);
