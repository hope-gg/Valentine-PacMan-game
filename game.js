const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let screen = 1;
let player = { collectedHearts: 0 };
let hearts = [];
const requiredHearts = 5;
const loveMessages = [
    "You are my forever love 💌",
    "Every love story is beautiful, but ours is my favorite 💖",
    "You hold my heart forever ❤️",
    "You are my dream come true ✨",
    "Love you to the moon and back 🌙💞"
];

// 🎨 Background with Soft Gradient
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFEBE9');
    gradient.addColorStop(1, '#FFCDD2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 💖 Creating Floating Hearts
function createHeart(isBroken = false) {
    return { 
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height, 
        size: 160, 
        isBroken, 
        speed: 1 + Math.random(), 
        opacity: 1 
    };
}

// 🎭 Screen Transitions
function drawWelcomeScreen() {
    drawBackground();
    ctx.fillStyle = '#A21838';
    ctx.font = '50px "Dancing Script", cursive';
    ctx.textAlign = 'center';
    ctx.fillText("Love is in the air...", canvas.width / 2, canvas.height / 2 - 100);
}

// ❤️ Game Screen (Heart Catching)
function drawGameScreen() {
    drawBackground();
    ctx.fillStyle = "#A21838";
    ctx.font = "38px 'Playfair Display', serif";
    ctx.fillText(`Catch the hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 100);

    hearts.forEach(heart => {
        if (heart.size < 180) {
            heart.size += 2;
        }
        ctx.globalAlpha = heart.opacity;
        ctx.font = `${heart.size}px 'Dancing Script', cursive`; 
        ctx.fillText(heart.isBroken ? "💔" : "💖", heart.x, heart.y);
        heart.y -= heart.speed;
        ctx.globalAlpha = 1;
    });

    hearts = hearts.filter(heart => heart.opacity > 0);
}

// 🎀 Romantic Ending Message
function drawEndScreen() {
    drawBackground();
    ctx.fillStyle = "#A21838";
    ctx.font = "60px 'Dancing Script', cursive"; 
    ctx.textAlign = "center";
    const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 100, 240, 90);
    ctx.fillStyle = "white";
    ctx.font = "36px 'Playfair Display', serif";
    ctx.fillText("Restart", canvas.width / 2, canvas.height / 2 + 155);
}

// 🔄 Game Loop
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

// 📲 Click Interactions
canvas.addEventListener("click", (e) => {
    if (screen === 1) {
        screen = 2;
        player.collectedHearts = 0;
        hearts = [];
        for (let i = 0; i < 10; i++) hearts.push(createHeart(Math.random() < 0.2));
    } else if (screen === 2) {
        hearts.forEach(heart => {
            if (Math.abs(e.clientX - heart.x) < 90 && Math.abs(e.clientY - heart.y) < 90) {
                if (!heart.isBroken) {
                    player.collectedHearts++;
                    if (player.collectedHearts >= requiredHearts) {
                        screen = 3;
                    }
                }
                heart.opacity = 0;
            }
        });
    } else if (screen === 3) {
        screen = 1;
    }
});

// 🚀 Start Game
window.onload = gameLoop;
