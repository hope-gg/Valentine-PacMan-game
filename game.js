const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ==== ADAPT FOR MOBILE ====
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let screen = 1; // 1 - Welcome, 2 - Game, 3 - End
let player = { collectedHearts: 0 };
let hearts = [];
const requiredHearts = 5;

// Load heart images
const heartImg = new Image();
heartImg.src = "assets/heart (1).png";

const brokenHeartImg = new Image();
brokenHeartImg.src = "assets/broken-heart.png";

// ===== CREATE HEARTS =====
function createHeart(isBroken = false) {
  return {
    x: Math.random() * (canvas.width - 80),
    y: Math.random() * (canvas.height - 200),
    size: 100, // Increased size for better touch accuracy
    isBroken: isBroken,
    speed: 1 + Math.random(),
    shrink: false,
    opacity: 1
  };
}

// ==== DRAW WELCOME SCREEN ====
function drawWelcomeScreen() {
  ctx.fillStyle = "#FFD3E3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#D72638";
  ctx.font = "40px 'Playfair Display', serif";
  ctx.textAlign = "center";
  ctx.fillText("Catch the Hearts! 💕", canvas.width / 2, canvas.height / 2 - 80);

  ctx.fillStyle = "red";
  ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2, 200, 80);
  ctx.fillStyle = "white";
  ctx.font = "30px 'Inter', sans-serif";
  ctx.fillText("Start", canvas.width / 2, canvas.height / 2 + 50);
}

// ==== DRAW GAME SCREEN ====
function drawGameScreen() {
  ctx.fillStyle = "#FFD3E3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#D72638";
  ctx.font = "30px 'Inter', sans-serif";
  ctx.fillText(`Hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 80);

  hearts.forEach(heart => {
    if (heart.shrink) {
      heart.opacity -= 0.05;
      heart.size -= 2;
    }
    ctx.globalAlpha = heart.opacity;
    ctx.drawImage(heart.isBroken ? brokenHeartImg : heartImg, heart.x, heart.y, heart.size, heart.size);
    heart.y += heart.speed;
    ctx.globalAlpha = 1;
  });

  hearts = hearts.filter(heart => heart.opacity > 0);
}

// ==== DRAW END SCREEN ====
function drawEndScreen() {
  ctx.fillStyle = "#FFD3E3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#D72638";
  ctx.font = "40px 'Playfair Display', serif";
  ctx.textAlign = "center";
  ctx.fillText("You're my Valentine! 💖", canvas.width / 2, canvas.height / 2 - 80);

  ctx.fillStyle = "red";
  ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2, 200, 80);
  ctx.fillStyle = "white";
  ctx.font = "30px 'Inter', sans-serif";
  ctx.fillText("Restart", canvas.width / 2, canvas.height / 2 + 50);
}

// ==== GAME LOOP ====
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

// ==== HANDLE TOUCH/CHECK COLLISIONS ====
canvas.addEventListener("click", (e) => {
  if (screen === 1) {
    screen = 2;
    player.collectedHearts = 0;
    hearts = [];
    for (let i = 0; i < 10; i++) hearts.push(createHeart(Math.random() < 0.3));
  } else if (screen === 2) {
    hearts.forEach(heart => {
      if (
        e.clientX > heart.x - 50 &&
        e.clientX < heart.x + heart.size + 50 &&
        e.clientY > heart.y - 50 &&
        e.clientY < heart.y + heart.size + 50
      ) {
        if (!heart.isBroken) {
          player.collectedHearts++;
          if (player.collectedHearts >= requiredHearts) {
            screen = 3;
          }
        }
        heart.shrink = true;
      }
    });
  } else if (screen === 3) {
    screen = 1;
  }
});

// ==== INIT GAME ====
function initGame() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gameLoop();
}
window.addEventListener("load", initGame);
