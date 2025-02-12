const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ====== 1. Налаштування розміру Canvas (з урахуванням devicePixelRatio) ======
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(ratio, ratio);
}

// Викликаємо при зміні розміру
window.addEventListener('resize', () => {
  resizeCanvas();
});

// ====== 2. Масив сердечок ======
let hearts = [];

// Функція створення випадкового сердечка
function createHeart() {
  // Випадкові координати, розміри, швидкість
  const ratio = window.devicePixelRatio || 1;
  const cssWidth = canvas.width / ratio;
  const cssHeight = canvas.height / ratio;

  return {
    x: Math.random() * cssWidth,     // по ширині довільно
    y: -50,                          // починають над екраном
    size: 30 + Math.random() * 30,   // від 30 до 60
    speedY: 1 + Math.random() * 2,   // швидкість падіння
    speedX: (Math.random() - 0.5) * 1, // невелике хитання вбік
    angle: 0,
    rotationSpeed: (Math.random() - 0.5) * 0.02 // обертання
  };
}

// Іконка сердечка (приміром, Emoji) - або можна замінити на зображення
const heartIcon = new Image();
heartIcon.src = "data:image/svg+xml,%3Csvg width='100' height='90' viewBox='0 0 100 90' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23ff6699' d='M50 85.5l-6.5-5.5C15.2 53.8 0 40.5 0 24.6 0 10.8 10.1 0 22.5 0c6.9 0 13.6 3.2 17.9 8.6C44.8 3.2 51.5 0 58.4 0 70.9 0 81 10.8 81 24.6c0 15.9-15.2 29.2-43.5 55.4L50 85.5z'/%3E%3C/svg%3E";

// ====== 3. Малювання градієнтного фону в Canvas ======
function drawBackground() {
  const ratio = window.devicePixelRatio || 1;
  const cssWidth = canvas.width / ratio;
  const cssHeight = canvas.height / ratio;

  // Створюємо вертикальний (або діагональний) градієнт
  const gradient = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
  gradient.addColorStop(0, '#ffccee'); // ніжно-рожевий
  gradient.addColorStop(1, '#eac1f2'); // ніжно-фіолетовий
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, cssWidth, cssHeight);
}

// ====== 4. Малювання сердечок ======
function drawHearts() {
  hearts.forEach((heart) => {
    // Зберігаємо поточний стан canvas
    ctx.save();

    // Трішки обертаємо сердечко навколо центру
    ctx.translate(heart.x + heart.size / 2, heart.y + heart.size / 2);
    ctx.rotate(heart.angle);

    // Малюємо сердечко, зміщується, бо ми вже зсунули origin
    ctx.drawImage(heartIcon, -heart.size / 2, -heart.size / 2, heart.size, heart.size);

    ctx.restore();
  });
}

// ====== 5. Оновлення сердечок (падіння) ======
function updateHearts() {
  const ratio = window.devicePixelRatio || 1;
  const cssHeight = canvas.height / ratio;

  hearts.forEach((heart) => {
    heart.x += heart.speedX;
    heart.y += heart.speedY;
    heart.angle += heart.rotationSpeed;
  });

  // Видаляємо сердечка, які "злетіли" за нижню межу
  hearts = hearts.filter((heart) => heart.y < cssHeight + 100);
}

// ====== 6. Відображення романтичного тексту по центру ======
function drawRomanticText() {
  const ratio = window.devicePixelRatio || 1;
  const cssWidth = canvas.width / ratio;
  const cssHeight = canvas.height / ratio;
  
  ctx.save();
  ctx.fillStyle = '#cc0066';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Налаштовуємо красивий шрифт
  ctx.font = '48px "Dancing Script", cursive';
  
  // Малюємо текст по центру
  ctx.fillText("Love is in the air...", cssWidth / 2, cssHeight / 2);
  ctx.restore();
}

// ====== 7. Основний цикл анімації ======
function animate() {
  // Очищаємо
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Малюємо градієнтний фон
  drawBackground();

  // Оновлюємо й малюємо сердечка
  updateHearts();
  drawHearts();

  // Малюємо текст поверх
  drawRomanticText();

  requestAnimationFrame(animate);
}

// ====== 8. Ініціалізація ======
function init() {
  resizeCanvas();

  // Створимо певну кількість сердечок для старту
  for (let i = 0; i < 15; i++) {
    hearts.push(createHeart());
  }

  // Кожні 800 мс створюватимемо нове сердечко
  setInterval(() => {
    hearts.push(createHeart());
  }, 800);

  animate();
}

// Запуск після завантаження
window.addEventListener('load', init);
