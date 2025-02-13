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
  "𝗜𝘁’𝘀 𝗯𝗲𝗲𝗻 𝗮 𝗷𝗼𝘂𝗿𝗻𝗲𝘆 … 𝗼𝗻𝗲 𝗜’𝗱 𝗱𝗼 𝗮𝗹𝗹 𝗼𝘃𝗲𝗿 𝗮𝗴𝗮𝗶𝗻.",
  "𝗘𝘃𝗲𝗿𝘆 𝗹𝗼𝘃𝗲 𝘀𝗼𝗻𝗴 𝗶𝘀 𝗮𝗯𝗼𝘂𝘁 𝘆𝗼𝘂. 𝗛𝗮𝗽𝗽𝘆 𝗩𝗮𝗹𝗲𝗻𝘁𝗶𝗻𝗲'𝘀 𝗗𝗮𝘆!",
  "𝗜 𝗹𝗼𝘃𝗲 𝘁𝗵𝗮𝘁 𝘄𝗲'𝘃𝗲 𝗻𝗲𝘃𝗲𝗿 𝗹𝗼𝘀𝘁 𝘁𝗵𝗲 𝗺𝗮𝗴𝗶𝗰 𝘁𝗵𝗮𝘁 𝗺𝗮𝗸𝗲𝘀 𝘂𝘀 𝘂𝘀.",
  "𝗪𝗶𝘁𝗵 𝘆𝗼𝘂, 𝗲𝘃𝗲𝗿𝘆 𝗺𝗼𝗺𝗲𝗻𝘁 𝗶𝘀 𝗩𝗮𝗹𝗲𝗻𝘁𝗶𝗻𝗲'𝘀 𝗗𝗮𝘆.",
  "𝗬𝗼𝘂 𝗮𝗿𝗲 𝘁𝗵𝗲 𝘀𝘄𝗲𝗲𝘁𝗲𝘀𝘁 𝗹𝗼𝘃𝗲 𝘀𝗼𝗻𝗴 𝗺𝘆 𝗵𝗲𝗮𝗿𝘁 𝗵𝗮𝘀 𝗲𝘃𝗲𝗿 𝗸𝗻𝗼𝘄𝗻.",
  "𝗟𝗼𝘃𝗶𝗻𝗴 𝘆𝗼𝘂 𝗶𝘀 𝗺𝘆 𝗳𝗮𝘃𝗼𝗿𝗶𝘁𝗲 𝗮𝗱𝘃𝗲𝗻𝘁𝘂𝗿𝗲.",
  "𝗬𝗼𝘂 𝗮𝗻𝗱 𝗺𝗲, 𝘁𝗼𝗴𝗲𝘁𝗵𝗲𝗿 𝗳𝗼𝗿𝗲𝘃𝗲𝗿—𝗻𝗼𝘁𝗵𝗶𝗻𝗴 𝗲𝗹𝘀𝗲 𝗺𝗮𝘁𝘁𝗲𝗿𝘀.",
  "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂, 𝗻𝗼𝘁 𝗷𝘂𝘀𝘁 𝗳𝗼𝗿 𝘄𝗵𝗼 𝘆𝗼𝘂 𝗮𝗿𝗲, 𝗯𝘂𝘁 𝗳𝗼𝗿 𝗵𝗼𝘄 𝘆𝗼𝘂 𝗺𝗮𝗸𝗲 𝗺𝗲 𝗳𝗲𝗲𝗹.",
  "𝗜𝗻 𝘆𝗼𝘂, 𝗜'𝘃𝗲 𝗳𝗼𝘂𝗻𝗱 𝗺𝘆 𝗳𝗼𝗿𝗲𝘃𝗲𝗿.",
  "𝗬𝗼𝘂𝗿 𝘀𝗺𝗶𝗹𝗲 𝗶𝘀 𝗺𝘆 𝗳𝗮𝘃𝗼𝗿𝗶𝘁𝗲 𝘀𝘂𝗻𝘀𝗵𝗶𝗻𝗲.",
  "𝗜 𝗳𝗲𝗹𝗹 𝗳𝗼𝗿 𝘆𝗼𝘂 𝗮𝗻𝗱 𝗶𝘁 𝘄𝗮𝘀 𝘁𝗵𝗲 𝗯𝗲𝘀𝘁 𝗱𝗲𝗰𝗶𝘀𝗶𝗼𝗻 𝗜'𝘃𝗲 𝗲𝘃𝗲𝗿 𝗺𝗮𝗱𝗲."
  "𝗬𝗼𝘂 𝗺𝗮𝗸𝗲 𝗺𝘆 𝘄𝗼𝗿𝗹𝗱 𝗯𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹, 𝗼𝗻𝗲 𝘀𝗺𝗶𝗹𝗲 𝗮𝘁 𝗮 𝘁𝗶𝗺𝗲.",
  "𝗢𝘂𝗿 𝗹𝗼𝘃𝗲 𝗶𝘀 𝗮 𝘀𝘁𝗼𝗿𝘆 𝗜 𝗻𝗲𝘃𝗲𝗿 𝘄𝗮𝗻𝘁 𝘁𝗼 𝗲𝗻𝗱."
  "𝗬𝗼𝘂 𝗮𝗻𝗱 𝗺𝗲, 𝘁𝗼𝗴𝗲𝘁𝗵𝗲𝗿 𝗳𝗼𝗿𝗲𝘃𝗲𝗿—𝗻𝗼𝘁𝗵𝗶𝗻𝗴 𝗲𝗹𝘀𝗲 𝗺𝗮𝘁𝘁𝗲𝗿𝘀.",
  "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂, 𝗻𝗼𝘁 𝗷𝘂𝘀𝘁 𝗳𝗼𝗿 𝘄𝗵𝗼 𝘆𝗼𝘂 𝗮𝗿𝗲, 𝗯𝘂𝘁 𝗳𝗼𝗿 𝗵𝗼𝘄 𝘆𝗼𝘂 𝗺𝗮𝗸𝗲 𝗺𝗲 𝗳𝗲𝗲𝗹."
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
  
  // Додаємо красиве повідомлення в стилі "меседж"
  const boxWidth = canvas.width * 0.75;
  const boxHeight = 100;
  const boxX = (canvas.width - boxWidth) / 2;
  const boxY = (canvas.height / 2) - boxHeight / 2;

  // Малюємо білу "рамку" для повідомлення
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
  ctx.strokeStyle = "#D72638";
  ctx.lineWidth = 4;
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

  // Текст усередині
  ctx.fillStyle = "#D72638";
  ctx.fillText(finalMessage, canvas.width / 2, canvas.height / 2);
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

