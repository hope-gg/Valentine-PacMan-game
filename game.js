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
// ==== Перемішуємо масив, щоб "безкоштовний напій" не випадало часто ====
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// ==== Функція перемішування масиву ====
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Масив романтичних повідомлень
const romanticMessages = [
  "𝗬𝗼𝘂 𝗮𝗿𝗲 𝗺𝘆 𝗳𝗶𝗿𝘀𝘁, 𝗺𝘆 𝗹𝗮𝘀𝘁, 𝗺𝘆 𝗲𝘃𝗲𝗿𝘆𝘁𝗵𝗶𝗻𝗴.",
  "𝗧𝗮𝗸𝗲 𝗺𝘆 𝗵𝗮𝗻𝗱, 𝘁𝗮𝗸𝗲 𝗺𝘆 𝘄𝗵𝗼𝗹𝗲 𝗹𝗶𝗳𝗲 𝘁𝗼𝗼, 𝗯𝘂𝘁 𝗜 𝗰𝗮𝗻'𝘁 𝗵𝗲𝗹𝗽 𝗳𝗮𝗹𝗹𝗶𝗻𝗴 𝗶𝗻 𝗹𝗼𝘃𝗲 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂.",
  "𝗪𝗶𝘁𝗵 𝘆𝗼𝘂, 𝗲𝘃𝗲𝗿𝘆 𝗺𝗼𝗺𝗲𝗻𝘁 𝗶𝘀 𝗩𝗮𝗹𝗲𝗻𝘁𝗶𝗻𝗲'𝘀 𝗗𝗮𝘆.",
  "𝗜 𝗰𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂, 𝗮𝗻𝗱 𝗜’𝗱 𝗰𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂 𝗮𝗹𝗹 𝗼𝘃𝗲𝗿 𝗮𝗴𝗮𝗶𝗻.",
  "𝗘𝘃𝗲𝗿𝘆 𝗱𝗮𝘆 𝗜 𝘀𝗽𝗲𝗻𝗱 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂 𝗶𝘀 𝗺𝘆 𝗳𝗮𝘃𝗼𝗿𝗶𝘁𝗲.",
  "𝗜𝗳 𝗜 𝗵𝗮𝗱 𝘁𝗼 𝗰𝗵𝗼𝗼𝘀𝗲 𝗮𝗹𝗹 𝗼𝘃𝗲𝗿 𝗮𝗴𝗮𝗶𝗻, 𝗜’𝗱 𝘀𝘁𝗶𝗹𝗹 𝗰𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂.",
  "𝗢𝘂𝗿 𝗹𝗼𝘃𝗲 𝗶𝘀 𝗮 𝘀𝘁𝗼𝗿𝘆 𝘄𝗶𝘁𝗵𝗼𝘂𝘁 𝗲𝗻𝗱.",
  "𝗪𝗶𝘁𝗵 𝗲𝘃𝗲𝗿𝘆 𝗯𝗿𝗲𝗮𝘁𝗵 𝗜 𝘁𝗮𝗸𝗲, 𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂 𝗺𝗼𝗿𝗲.",
  "𝗜 𝗳𝗲𝗹𝗹 𝗶𝗻 𝗹𝗼𝘃𝗲 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂 𝗮𝗻𝗱 𝗜'𝗱 𝗱𝗼 𝗶𝘁 𝗮𝗹𝗹 𝗼𝘃𝗲𝗿 𝗮𝗴𝗮𝗶𝗻.",
  "𝗜 𝗰𝗮𝗻'𝘁 𝗶𝗺𝗮𝗴𝗶𝗻𝗲 𝗮 𝗳𝘂𝘁𝘂𝗿𝗲 𝘄𝗶𝘁𝗵𝗼𝘂𝘁 𝘆𝗼𝘂."
];

// Повідомлення про безкоштовний напій
const freeDrinkMessage = "🎉 You get one free drink! Happy Valentine's Day from Kanin! 🎉";

// Функція вибору випадкового повідомлення з 50% шансом на безкоштовний напій
function getFinalMessage() {
    return Math.random() < 0.5 ? freeDrinkMessage : romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
}

// Визначаємо фінальне повідомлення для 3-го екрану
let finalMessage = getFinalMessage();

// Визначаємо фінальне повідомлення для 3-го екрану
let finalMessage = getFinalMessage();


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
    let newHeart;
    let isOverlapping;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        isOverlapping = false;
        newHeart = {
            x: Math.random() * (canvas.width - 100),
            y: Math.random() * (canvas.height - 150),
            size: 100,
            isBroken: isBroken,
            speedX: (Math.random() - 0.5) * 2.5,
            speedY: (Math.random() - 0.5) * 2.5,
            opacity: 1,
            shrink: false
        };

        for (let heart of hearts) {
            if (Math.hypot(newHeart.x - heart.x, newHeart.y - heart.y) < 120) {
                isOverlapping = true;
                break;
            }
        }
        attempts++;
    } while (isOverlapping && attempts < maxAttempts);

    return newHeart;
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
  ctx.font = "bold 32px 'Playfair Display', serif";
  ctx.textAlign = "center";

  const maxWidth = canvas.width * 0.7; // Встановлення максимальної ширини тексту
  const lineHeight = 40; // Висота рядка
  const x = canvas.width / 2;
  const y = canvas.height / 2;

  // Розбиваємо текст на рядки, щоб не виходив за межі
  const words = finalMessage.split(" ");
  let line = "";
  let lines = [];
  
  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";
    let testWidth = ctx.measureText(testLine).width;
    
    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line); // Додаємо останній рядок

  // Відображаємо текст, рівномірно розподіляючи рядки
  let startY = y - (lines.length * lineHeight) / 2;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, startY + (i * lineHeight));
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
