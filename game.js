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
  "𝗪𝗶𝘁𝗵 𝘆𝗼𝘂, 𝗲𝘃𝗲𝗿𝘆 𝗺𝗼𝗺𝗲𝗻𝘁 𝗶𝘀 𝗩𝗮𝗹𝗲𝗻𝘁𝗶𝗻𝗲'𝘀 𝗗𝗮𝘆."
];

let finalMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];

// ==== ФОНОВА АНІМАЦІЯ ====
function drawBackground() {
  ctx.fillStyle = "#FCF5EB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ВХІДНИЙ ЕКРАН ====
function drawWelcomeScreen() {
  drawBackground();
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
    ctx.fillStyle = heart.isBroken ? "#D72638" : "#FF4D6D";
    ctx.beginPath();
    ctx.arc(heart.x, heart.y, heart.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

// ==== ФІНАЛЬНИЙ ЕКРАН ====
function drawEndScreen() {
  drawBackground();
  ctx.fillStyle = "#D72638";
  ctx.font = "bold 32px 'Playfair Display', serif";
  ctx.textAlign = "center";

  // Гармонійне розташування тексту
  let maxWidth = canvas.width * 0.8;
  let x = canvas.width / 2;
  let y = canvas.height / 2;

  wrapText(ctx, finalMessage, x, y, maxWidth, 40);
}

// Функція для автоматичного перенесення тексту
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  let words = text.split(' ');
  let line = '';
  let lines = [];

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  let startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    context.fillText(line, x, startY + (index * lineHeight));
  });
}

// ==== ОБРОБКА КЛІКІВ ====
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (screen === 1) {
        screen = 2;
        player.collectedHearts = 0;
        hearts = [];
        for (let i = 0; i < 10; i++) hearts.push({
            x: Math.random() * (canvas.width - 100),
            y: Math.random() * (canvas.height - 150),
            size: 100,
            isBroken: Math.random() < 0.3
        });
    } else if (screen === 2) {
        hearts = hearts.filter(heart => {
            const distance = Math.hypot(clickX - heart.x, clickY - heart.y);
            if (distance < heart.size * 0.7) {
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
