const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ====== 1. Робимо Canvas респонсивним ======
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
  dx: 0,
  dy: 0,
  target: null,
  collectedHearts: 0
};

// ====== 3. Фінішна зона (портал) ======
const finishPoint = {
  x: canvas.width / 2 - 50,
  y: canvas.height / 2 - 50,
  size: 120,
  active: false // Портал активується після збору 5 сердечок
};

// ====== 4. Сердечка для збору ======
let hearts = [];
let score = 0;

function createHeart() {
  return {
    x: Math.random() * (canvas.width - 80) + 40,
    y: Math.random() * (canvas.height - 200) + 100,
    size: 50,
  };
}

// ====== 5. Завантаження персонажа ======
const playerImage = new Image();
playerImage.src = 'assets/ghost.png';

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

// ====== 8. Малювання порталу ======
function drawFinishPoint() {
  if (!finishPoint.active) {
    ctx.fillStyle = 'rgba(180, 180, 180, 0.3)';
  } else {
    ctx.fillStyle = 'rgba(255, 150, 220, 0.8)';
  }
  ctx.beginPath();
  ctx.arc(finishPoint.x + finishPoint.size / 2, finishPoint.y + finishPoint.size / 2, finishPoint.size, 0, Math.PI * 2);
  ctx.fill();
}

// ====== 9. Оновлення анімації сердечок ======
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
        finishPoint.active = true; // Активуємо портал
      }
      return false; // Видаляємо з масиву
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

  // Якщо портал активний - всмоктує гравця
  if (finishPoint.active) {
    let portalDx = (finishPoint.x + finishPoint.size / 2) - player.x;
    let portalDy = (finishPoint.y + finishPoint.size / 2) - player.y;
    let portalDist = Math.sqrt(portalDx * portalDx + portalDy * portalDy);

    if (portalDist < 50) {
      gameFinished = true;
    } else {
      player.x += (portalDx / portalDist) * 2;
      player.y += (portalDy / portalDist) * 2;
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
  ctx.fillText("You completed the journey of love! 💖", canvas.width / 2, canvas.height / 2);
}

// ====== 14. Основний цикл гри ======
let gameFinished = false;

function gameLoop() {
  drawBackground();
  moveTowardsTarget();
  drawFinishPoint();
  drawPlayer();
  updateHearts();
  drawHearts();

  // Якщо гравець потрапив у портал
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
  finishPoint.y = canvas.height / 2 - finishPoint.size / 2;

  for (let i = 0; i < 5; i++) {
    hearts.push(createHeart());
  }

  gameLoop();
}

window.addEventListener('load', initGame);

