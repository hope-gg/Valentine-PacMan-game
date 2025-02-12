// Basic setup for a simple Valentine-themed Pacman-style game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ====== 1. Responsive canvas with devicePixelRatio ======
function resizeCanvas() {
  // Поточна щільність пікселів (Retina, тощо)
  const ratio = window.devicePixelRatio || 1;

  // Поточні "логічні" розміри екрану
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Встановлюємо CSS-розміри (щоб вони збігалися з повним екраном)
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  // Внутрішня роздільність (фізичні px) = логічний розмір * devicePixelRatio
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  // Скидаємо попередній масштаб і налаштовуємо новий
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(ratio, ratio);
}

// Викликаємо під час зміни розміру/орієнтації
window.addEventListener('resize', () => {
  // Змінюємо розмір Canvas
  resizeCanvas();
  // За потреби можна знову викликати gameLoop або перемалювати (якщо потрібно)
  // gameLoop(); // Якщо хочете постійно оновлювати розташування
});

// ====== 2. Завантаження ассетів (зображень) ======
const heartImage = new Image();
heartImage.src = 'assets/heart.png';

const ghostImage = new Image();
ghostImage.src = 'assets/ghost.png';

ghostImage.onload = () => console.log('Ghost image loaded:', ghostImage.src);
heartImage.onload = () => console.log('Heart image loaded:', heartImage.src);

// ====== 3. Параметри гравця ======
const player = {
    x: 0, // ініціалізуємо пізніше, коли вже відомий розмір canvas
    y: 0,
    size: 100, // Increased size for better touch detection
    speed: 5,  // Adjusted for smoother movement
    target: null
};

// ====== 4. Інші ігрові змінні ======
let hearts = [];
let score = 0;
let gameFinished = false;

// Finish point
const finishPoint = {
    x: 0, // визначимо після resizeCanvas
    y: 50,
    size: 100
};

// ====== 5. Функція руху гравця до цілі (клікнутого heart) ======
function moveTowardsTarget() {
    if (!player.target) return;

    let dx = player.target.x - player.x;
    let dy = player.target.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > player.speed) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    } else {
        // Reached the target
        player.x = player.target.x;
        player.y = player.target.y;
        player.target = null;
    }
}

// ====== 6. Малювання гравця ======
function drawPlayer() {
    ctx.drawImage(ghostImage, player.x, player.y, player.size, player.size);
}

// ====== 7. Малювання фінішної зони ======
function drawFinishPoint() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(finishPoint.x, finishPoint.y, finishPoint.size, finishPoint.size);

    ctx.strokeStyle = 'darkblue';
    ctx.lineWidth = 3;
    ctx.strokeRect(finishPoint.x, finishPoint.y, finishPoint.size, finishPoint.size);

    ctx.fillStyle = 'black';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Reach Here!', 
      finishPoint.x + finishPoint.size / 2, 
      finishPoint.y + finishPoint.size / 2
    );
}

// ====== 8. Перевірка, чи досягнуто фінішу ======
function checkFinish() {
    if (
        player.x < finishPoint.x + finishPoint.size &&
        player.x + player.size > finishPoint.x &&
        player.y < finishPoint.y + finishPoint.size &&
        player.y + player.size > finishPoint.y
    ) {
        gameFinished = true;
    }
}

// ====== 9. Відображення фінального повідомлення ======
function displayEndMessage() {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Зверніть увагу на devicePixelRatio
    const ratio = window.devicePixelRatio || 1;
    const centerX = (canvas.width / ratio) / 2;
    const centerY = (canvas.height / ratio) / 2;

    ctx.fillText('Happy Valentine\'s Day!', centerX, centerY);
}

// ====== 10. Оновлення та малювання сердечок ======
function updateHearts() {
    hearts.forEach((heart, index) => {
        // Перевірка зіткнення з гравцем
        if (
            player.x < heart.x + heart.size &&
            player.x + player.size > heart.x &&
            player.y < heart.y + heart.size &&
            player.y + player.size > heart.y
        ) {
            // Прибираємо сердечко
            hearts.splice(index, 1);
            score += 1;  // Збільшуємо рахунок
            addHeart();  // Додаємо нове сердечко
        }
    });
}

function drawHearts() {
    hearts.forEach(heart => {
        ctx.drawImage(heartImage, heart.x, heart.y, heart.size, heart.size);
    });
}

// ====== 11. Додавання нового сердечка у випадкове місце ======
function addHeart() {
    // Знову ж таки, врахуйте devicePixelRatio для коректної «логічної» області
    const ratio = window.devicePixelRatio || 1;
    const cssWidth = canvas.width / ratio;
    const cssHeight = canvas.height / ratio;

    hearts.push({
        x: Math.random() * (cssWidth - 50),
        y: Math.random() * (cssHeight / 2),
        size: 60
    });
}

// ====== 12. Обробка кліків ======
canvas.addEventListener('click', (e) => {
    let clickX = e.clientX;
    let clickY = e.clientY;

    // Якщо натиснули на одне з сердечок, встановимо його як ціль
    hearts.forEach((heart) => {
        if (
            clickX > heart.x && clickX < heart.x + heart.size &&
            clickY > heart.y && clickY < heart.y + heart.size
        ) {
            player.target = { x: heart.x, y: heart.y };
        }
    });
});

// ====== 13. Основний цикл гри (gameLoop) ======
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameFinished) {
        displayEndMessage();
        return;
    }

    moveTowardsTarget();
    drawPlayer();
    updateHearts();
    drawHearts();
    drawFinishPoint();
    checkFinish();

    // Відображення рахунку
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 40);

    requestAnimationFrame(gameLoop);
}

// ====== 14. Ініціалізація гри ======
function initGame() {
    // 1) Робимо Canvas повноекранним з урахуванням ratio
    resizeCanvas();
    
    // 2) Вираховуємо «логічні» розміри (для початкових координат)
    const ratio = window.devicePixelRatio || 1;
    const cssWidth = canvas.width / ratio;
    const cssHeight = canvas.height / ratio;

    // 3) Початкове розташування гравця (по центру внизу)
    player.x = cssWidth / 2 - player.size / 2;
    player.y = cssHeight - player.size - 50;

    // 4) Початкове розташування фінішу (по центру вгорі)
    finishPoint.x = cssWidth / 2 - finishPoint.size / 2;
    finishPoint.y = 50;

    // 5) Генеруємо перші сердечка
    for (let i = 0; i < 7; i++) {
        addHeart();
    }

    // 6) Запускаємо цикл гри
    gameLoop();
}

// Стартуємо гру після завантаження сторінки
window.addEventListener('load', initGame);
