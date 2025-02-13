const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ==== АДАПТАЦІЯ ДЛЯ СМАРТФОНІВ ====
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let screen = 1;
let player = { collectedHearts: 0, lives: 5 };
let hearts = [];
const requiredHearts = 5;
const romanticMessages = [
  "𝗬𝗼𝘂 𝗮𝗿𝗲 𝘁𝗵𝗲 𝘀𝗼𝗻𝗴 𝘁𝗵𝗮𝘁 𝗺𝘆 𝗵𝗲𝗮𝗿𝘁 𝗹𝗼𝘃𝗲𝘀 𝘁𝗼 𝘀𝗶𝗻𝗴.",
  "𝗔𝗹𝗹 𝘁𝗵𝗮𝘁 𝘆𝗼𝘂 𝗮𝗿𝗲 𝗶𝘀 𝗮𝗹𝗹 𝘁𝗵𝗮𝘁 𝗜’𝗹𝗹 𝗲𝘃𝗲𝗿 𝗻𝗲𝗲𝗱.",
  "𝗧𝗮𝗸𝗲 𝗺𝘆 𝗵𝗮𝗻𝗱, 𝘁𝗮𝗸𝗲 𝗺𝘆 𝘄𝗵𝗼𝗹𝗲 𝗹𝗶𝗳𝗲 𝘁𝗼𝗼, 𝗯𝘂𝘁 𝗜 𝗰𝗮𝗻'𝘁 𝗵𝗲𝗹𝗽 𝗳𝗮𝗹𝗹𝗶𝗻𝗴 𝗶𝗻 𝗹𝗼𝘃𝗲 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂.",
  "𝗟𝗶𝗳𝗲 𝗶𝘀 𝗯𝗲𝘁𝘁𝗲𝗿 𝘄𝗵𝗲𝗻 𝗜 𝗵𝗮𝘃𝗲 𝘆𝗼𝘂 𝗯𝘆 𝗺𝘆 𝘀𝗶𝗱𝗲.",
  "𝗜 𝗹𝗼𝘃𝗲 𝘁𝗵𝗮𝘁 𝘄𝗲'𝘃𝗲 𝗻𝗲𝘃𝗲𝗿 𝗹𝗼𝘀𝘁 𝘁𝗵𝗲 𝗺𝗮𝗴𝗶𝗰 𝘁𝗵𝗮𝘁 𝗺𝗮𝗸𝗲𝘀 𝘂𝘀 𝘂𝘀.",
  "𝗪𝗶𝘁𝗵 𝘆𝗼𝘂, 𝗲𝘃𝗲𝗿𝘆 𝗺𝗼𝗺𝗲𝗻𝘁 𝗶𝘀 𝗩𝗮𝗹𝗲𝗻𝘁𝗶𝗻𝗲'𝘀 𝗗𝗮𝘆.",
  "𝗜 𝗳𝗲𝗹𝗹 𝗶𝗻 𝗹𝗼𝘃𝗲 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂 𝗮𝗻𝗱 𝗜'𝗱 𝗱𝗼 𝗶𝘁 𝗮𝗹𝗹 𝗼𝘃𝗲𝗿 𝗮𝗴𝗮𝗶𝗻.",
  "𝗬𝗼𝘂 𝗮𝗿𝗲 𝗺𝘆 𝗳𝗶𝗿𝘀𝘁, 𝗺𝘆 𝗹𝗮𝘀𝘁, 𝗺𝘆 𝗲𝘃𝗲𝗿𝘆𝘁𝗵𝗶𝗻𝗴.",
  "𝗧𝗵𝗲 𝗺𝗼𝗿𝗲 𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂, 𝘁𝗵𝗲 𝗺𝗼𝗿𝗲 𝗜 𝗿𝗲𝗮𝗹𝗶𝘇𝗲 𝗜 𝗻𝗲𝘃𝗲𝗿 𝘄𝗮𝗻𝘁 𝘁𝗼 𝗹𝗲𝘁 𝗴𝗼.",
  "𝗬𝗼𝘂 𝗮𝗿𝗲 𝗺𝘆 𝗵𝗮𝗽𝗽𝗶𝗹𝘆 𝗲𝘃𝗲𝗿 𝗮𝗳𝘁𝗲𝗿.",
  "𝗜𝗻 𝘆𝗼𝘂, 𝗜 𝗳𝗼𝘂𝗻𝗱 𝗺𝘆 𝗳𝗼𝗿𝗲𝘃𝗲𝗿 𝗵𝗼𝗺𝗲.",
  "𝗬𝗼𝘂 𝗮𝗿𝗲 𝘁𝗵𝗲 𝗯𝗲𝘀𝘁 𝘁𝗵𝗶𝗻𝗴 𝘁𝗵𝗮𝘁 𝗲𝘃𝗲𝗿 𝗵𝗮𝗽𝗽𝗲𝗻𝗲𝗱 𝘁𝗼 𝗺𝗲.",
  "𝗬𝗼𝘂 𝗮𝗻𝗱 𝗺𝗲—𝗶𝘁 𝗷𝘂𝘀𝘁 𝗳𝗲𝗲𝗹𝘀 𝗿𝗶𝗴𝗵𝘁.",
  "𝗜 𝗰𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂, 𝗮𝗻𝗱 𝗜’𝗱 𝗰𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂 𝗮𝗹𝗹 𝗼𝘃𝗲𝗿 𝗮𝗴𝗮𝗶𝗻.",
  "𝗟𝗼𝘃𝗲 𝗶𝘀 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱, 𝗶𝘁’𝘀 𝗰𝗿𝗲𝗮𝘁𝗲𝗱—𝗮𝗻𝗱 𝗜 𝗰𝗵𝗼𝗼𝘀𝗲 𝘁𝗼 𝗰𝗿𝗲𝗮𝘁𝗲 𝗶𝘁 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂.",
  "𝗟𝗼𝘃𝗲 𝗹𝗶𝗸𝗲 𝗼𝘂𝗿𝘀 𝗱𝗼𝗲𝘀𝗻’𝘁 𝗳𝗮𝗱𝗲, 𝗶𝘁 𝗼𝗻𝗹𝘆 𝗴𝗿𝗼𝘄𝘀.",
  "𝗜 𝗰𝗮𝗻'𝘁 𝗶𝗺𝗮𝗴𝗶𝗻𝗲 𝗮 𝗳𝘂𝘁𝘂𝗿𝗲 𝘄𝗶𝘁𝗵𝗼𝘂𝘁 𝘆𝗼𝘂.",
  "𝗘𝘃𝗲𝗿𝘆 𝗱𝗮𝘆 𝗜 𝘀𝗽𝗲𝗻𝗱 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂 𝗶𝘀 𝗺𝘆 𝗳𝗮𝘃𝗼𝗿𝗶𝘁𝗲.",
  "𝗜𝗳 𝗜 𝗵𝗮𝗱 𝘁𝗼 𝗰𝗵𝗼𝗼𝘀𝗲 𝗮𝗹𝗹 𝗼𝘃𝗲𝗿 𝗮𝗴𝗮𝗶𝗻, 𝗜’𝗱 𝘀𝘁𝗶𝗹𝗹 𝗰𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂.",
  "𝗢𝘂𝗿 𝗹𝗼𝘃𝗲 𝗶𝘀 𝗮 𝘀𝘁𝗼𝗿𝘆 𝘄𝗶𝘁𝗵𝗼𝘂𝘁 𝗲𝗻𝗱.",
  "𝗪𝗶𝘁𝗵 𝗲𝘃𝗲𝗿𝘆 𝗯𝗿𝗲𝗮𝘁𝗵 𝗜 𝘁𝗮𝗸𝗲, 𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂 𝗺𝗼𝗿𝗲.",
  "𝗜 𝗳𝗲𝗹𝗹 𝗶𝗻 𝗹𝗼𝘃𝗲 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂 𝗮𝗻𝗱 𝗜’𝗱 𝗳𝗮𝗹𝗹 𝗮𝗹𝗹 𝗼𝘃𝗲𝗿 𝗮𝗴𝗮𝗶𝗻.",
  "𝗪𝗶𝘁𝗵 𝘆𝗼𝘂, 𝗹𝗼𝘃𝗲 𝗶𝘀 𝘀𝗶𝗺𝗽𝗹𝗲.",
  "𝗬𝗼𝘂 𝗺𝗮𝗸𝗲 𝗺𝗲 𝗯𝗲𝗹𝗶𝗲𝘃𝗲 𝗶𝗻 𝗳𝗼𝗿𝗲𝘃𝗲𝗿."
];

let finalMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];

// ==== ФОНОВА АНІМАЦІЯ ====
function drawBackground() {
  ctx.fillStyle = "#FCF5EB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ЗАВАНТАЖЕННЯ ЗОБРАЖЕНЬ ====
const heartImage = new Image();
heartImage.src = 'assets/heart.png';
const brokenHeartImage = new Image();
brokenHeartImage.src = 'assets/heartbreak.png';
const cupidImage = new Image();
cupidImage.src = 'assets/cupid.png';
const buttonImage = new Image();
buttonImage.src = 'assets/button.png';

const imagesLoaded = { heart: false, brokenHeart: false, cupid: false, button: false };

heartImage.onload = () => imagesLoaded.heart = true;
brokenHeartImage.onload = () => imagesLoaded.brokenHeart = true;
cupidImage.onload = () => imagesLoaded.cupid = true;
buttonImage.onload = () => imagesLoaded.button = true;

function allImagesLoaded() {
  return imagesLoaded.heart && imagesLoaded.brokenHeart && imagesLoaded.cupid && imagesLoaded.button;
}

// ==== ФУНКЦІЯ ДЛЯ СЕРДЕЦЬ ====
function createHeart(isBroken = false) {
  return {
    x: Math.random() * (canvas.width - 100),
    y: Math.random() * (canvas.height - 150),
    size: 100, // Трохи більше для кращого кліку
    isBroken: isBroken,
    speedX: (Math.random() - 0.5) * 2.5,
    speedY: (Math.random() - 0.5) * 2.5,
    opacity: 1,
    shrink: false
  };
}

// ==== ВХІДНИЙ ЕКРАН ====
function drawWelcomeScreen() {
  drawBackground();
  if (allImagesLoaded()) {
    ctx.drawImage(cupidImage, canvas.width / 2 - 50, 100, 100, 100);
    ctx.drawImage(buttonImage, canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 160);
  }
  ctx.fillStyle = "#D72638";
  ctx.font = "42px 'Playfair Display', serif";
  ctx.textAlign = "center";
  ctx.fillText("LOVE IN THE AIR", canvas.width / 2, canvas.height / 2 - 50);
}

// ==== ГОЛОВНИЙ ІГРОВИЙ ЕКРАН ====
function drawGameScreen() {
  drawBackground();
  ctx.fillStyle = "#D72638";
  ctx.font = "36px 'Inter', sans-serif";
  ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 50);

  hearts.forEach(heart => {
    ctx.globalAlpha = heart.opacity;
    if (allImagesLoaded()) {
      ctx.drawImage(heart.isBroken ? brokenHeartImage : heartImage, heart.x, heart.y, heart.size, heart.size);
    }
    heart.x += heart.speedX;
    heart.y += heart.speedY;
    if (heart.x < 0 || heart.x + heart.size > canvas.width) heart.speedX *= -1;
    if (heart.y < 0 || heart.y + heart.size > canvas.height) heart.speedY *= -1;
    ctx.globalAlpha = 1;
  });
}

// ==== ФІНАЛЬНИЙ ЕКРАН ====
function drawEndScreen() {
  drawBackground();
  ctx.fillStyle = "#D72638";
  ctx.font = "bold 36px 'Playfair Display', serif";
  ctx.textAlign = "center";

  document.fonts.ready.then(() => {
      ctx.fillText(finalMessage, canvas.width / 2, canvas.height / 2, canvas.width * 0.8);
  });
}


// ==== ФУНКЦІЯ ДОДАВАННЯ СЕРДЕЦЬ ====
function checkHeartBalance() {
    let intactHearts = hearts.filter(heart => !heart.isBroken).length;
    while (intactHearts < requiredHearts - player.collectedHearts) {
        hearts.push(createHeart(false)); // Додаємо тільки цілі серця
        intactHearts++;
    }
}

// ==== ПОКРАЩЕНА ОБРОБКА КЛІКІВ ====
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (screen === 1) {
        screen = 2;
        player.collectedHearts = 0;
        hearts = [];
        for (let i = 0; i < 10; i++) hearts.push(createHeart(Math.random() < 0.3));
    } else if (screen === 2) {
        hearts = hearts.filter(heart => {
            const distance = Math.hypot(clickX - (heart.x + heart.size / 2), clickY - (heart.y + heart.size / 2));

            if (distance < heart.size * 0.7) { // Покращена зона кліку
                if (!heart.isBroken) {
                    player.collectedHearts++;
                    if (player.collectedHearts >= requiredHearts) {
                        screen = 3;
                    }
                } else {
                    player.collectedHearts = Math.max(0, player.collectedHearts - 1);
                }
                return false;
            }
            return true;
        });
    }
});

// ==== ЗАПУСК ====
function gameLoop() {
  if (screen === 1) drawWelcomeScreen();
  else if (screen === 2) drawGameScreen();
  else if (screen === 3) drawEndScreen();
  requestAnimationFrame(gameLoop);
}
window.addEventListener("load", gameLoop);
