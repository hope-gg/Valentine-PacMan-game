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
  "𝗜𝗻 𝘆𝗼𝘂, 𝗜'𝘃𝗲 𝗳𝗼𝘂𝗻𝗱 𝗺𝘆 𝗳𝗼𝗿𝗲𝘃𝗲𝗿."
];

let finalMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];

// ==== ФОНОВА АНІМАЦІЯ ====
function drawBackground() {
  ctx.fillStyle = "#FCF5EB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==== ФУНКЦІЯ ДОДАВАННЯ СЕРДЕЦЬ ====
function checkHeartBalance() {
    let intactHearts = hearts.filter(heart => !heart.isBroken).length;
    while (intactHearts < requiredHearts - player.collectedHearts) {
        hearts.push(createHeart(false)); // Додаємо тільки цілі серця
        intactHearts++;
    }
}

// ==== ОБРОБКА КЛІКІВ ====
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (screen === 2) {
        hearts = hearts.filter(heart => {
            const distance = Math.hypot(clickX - (heart.x + heart.size / 2), clickY - (heart.y + heart.size / 2));

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
        checkHeartBalance(); // Додаємо перевірку після кожного кліку
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
