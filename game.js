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

// ====== 3. "Друга половинка" (фініш) ======
const soulmate = {
  x: canvas.width / 2 - 50,
  y: canvas.height / 2 - 50,
  size: 120,
  active: false
};

// ====== 4. Сердечка ======
let hearts = [];

function createHeart() {
  return {
    x: Math.random() * (canvas.width - 80) + 40,
    y: Math.random() * (canvas.height - 200) + 100,
    size: 50
  };
}

// ====== 5. Завантаження персонажів ======
const playerImage = new Image();
playerImage.src = 'assets/ghost.png'; // Гравець-привид

const soulmateImage = new Image();
soulmateImage.src = 'assets/soulmate.png'; // Друга половинка

const heartImage = new Image();
heartImage.src = 'assets/heart.png';

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

// ====== 8. Малювання другої половинки ======
function drawSoulmate() {
  ctx.globalAlpha = soulmate.active ? 1 : 0.5; // Робимо її трохи прозорою, якщо гравець ще не зібрав сердечка
  ctx.drawImage(soulmateImage, soulmate.x, soulmate.y, soulmate.size, soulmate.size);
  ctx.globalAlpha = 1;
}

// ====== 9. Оновлення сердечок ======
function updateHearts() {
  hearts = hearts.filter(heart => {
    if (
      player.x < heart.x + heart.size &&
      player.x + player.size > heart.x &&
      player.y < heart.y + heart.size &&
      player.y + player.size > heart.y
    ) {
      player.collectedHearts++;
      if (player.collectedHearts >= 5) {
        soulmate.active = true; // Активуємо фініш
      }
      return false;
    }
    return true;
  });
}

// ====== 10. Малювання сердечок ======
function drawHearts() {
  hearts.forEach(heart => {
    ctx.drawImage(heartImage, heart.x, heart.y, heart.size, heart.size);
  });
}

// ====== 11. Рух гравця ======
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

  // Якщо гравець зустрічає свою другу половинку
  if (soulmate.active) {
    let dxSoulmate = (soulmate.x + soulmate.size / 2) - player.x;
    let dySoulmate = (soulmate.y + soulmate.size / 2) - player.y;
    let distSoulmate = Math.sqrt(dxSoulmate * dxSoulmate + dySoulmate * dySoulmate);

    if (distSoulmate < 40) {
      gameFinished = true;
    }
  }
}

// ====== 12. Обробка кліку ======
canvas.addEventListener('click', (e) => {
  player.target = { x: e.clientX, y: e.clientY };
});

// ====== 13. Фінальний текст ======
function displayEndMessage() {
  ctx.fillStyle = '#cc0066';
  ctx.font = '48px "Dancing Script", cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText("You found your soulmate! 💖", canvas.width / 2, canvas.height / 2);
}

// ====== 14. Основний цикл гри ======
let gameFinished = false;

function gameLoop() {
  drawBackground();
  moveTowardsTarget();
  drawSoulmate();
  drawPlayer();
  updateHearts();
  drawHearts();

  if (gameFinished) {
    displayEndMessage();
    return;
  }

  requestAnimationFrame(gameLoop);
}

// ====== 15. Запуск гри ======
function initGame() {
  resizeCanvas();
  soulmate.x = canvas.width / 2 - soulmate.size / 2;
  soulmate.y = canvas.height / 2 - soulmate.size / 2;

  for (let i = 0; i < 5; i++) {
    hearts.push(createHeart());
  }

  gameLoop();
}

window.addEventListener('load', initGame);
