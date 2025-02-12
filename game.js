const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
});

let screen = 1;
let player = { collectedHearts: 0 };
let hearts = [];
const requiredHearts = 5;
const funLoveMessages = [
    "You're my Player 2 🎮💖",
    "You stole my heart like a pro thief 🕵️‍♂️💘",
    "Game over, but love is forever 😍",
    "You + Me = Best Co-Op Mode 🎮💑",
    "You’re my Ultimate Power-Up ❤️✨"
];

// 🎨 Background with Arcade Feel
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FF80AB');
    gradient.addColorStop(1, '#FF4081');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 💖 Hearts with Motion
function createHeart(isBroken = false) {
    return { 
        x: Math.random() * (canvas.width - 100), 
        y: Math.random() * canvas.height, 
        size: 120, 
        isBroken, 
        speed: 0.8 + Math.random(), 
        opacity: 1,
        bounce: Math.random() * 5
    };
}

// 🎭 Game Screens
function drawWelcomeScreen() {
    drawBackground();
    ctx.fillStyle = '#FF1744';
    ctx.font = '52px "Luckiest Guy", cursive';
    ctx.textAlign = 'center';
    ctx.fillText("Catch the Love! 💖", canvas.width / 2, canvas.height / 2 - 100);
}

// ❤️ Game Screen (Heart Catching)
function drawGameScreen() {
    drawBackground();
    ctx.fillStyle = "#FF1744";
    ctx.font = "40px 'Luckiest Guy', cursive";
    ctx.fillText(`Hearts: ${player.collectedHearts}/${requiredHearts}`, canvas.width / 2, 80);

    hearts.forEach(heart => {
        ctx.globalAlpha = heart.opacity;
        ctx.font = `${heart.size}px 'Dancing Script', cursive`; 
        ctx.fillText(heart.isBroken ? "💔" : "💖", heart.x, heart.y);
        heart.y -= heart.speed;
        heart.bounce += 0.1;
        heart.x += Math.sin(heart.bounce) * 1.5;
        ctx.globalAlpha = 1;
    });

    hearts = hearts.filter(heart => heart.opacity > 0);
}

// 🎀 End Screen with Fun Message
function drawEndScreen() {
    drawBackground();
    ctx.fillStyle = "#FF1744";
    ctx.font = "52px 'Luckiest Guy', cursive"; 
    ctx.textAlign = "center";
    const message = funLoveMessages[Math.floor(Math.random() * funLoveMessages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = "#D50000";
    ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 100, 240, 90);
    ctx.fillStyle = "white";
    ctx.font = "36px 'Luckiest Guy', cursive";
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

// 📲 Catching Hearts
canvas.addEventListener("click", (e) => {
    if (screen === 1) {
        screen = 2;
        player.collectedHearts = 0;
        hearts = [];
        for (let i = 0; i < 8; i++) hearts.push(createHeart(Math.random() < 0.3));
    } else if (screen === 3) {
        screen = 1;
    }
});

// 🚀 Start Game
window.onload = gameLoop;
