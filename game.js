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
const loveMessages = [
    "You're my Player 2 🎮💖",
    "You stole my heart like a pro thief 🕵️‍♂️💘",
    "Game over, but love is forever 😍",
    "You + Me = Best Co-Op Mode 🎮💑",
    "You’re my Ultimate Power-Up ❤️✨"
];

// Background with Gradient
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFEBE9');
    gradient.addColorStop(1, '#FFCDD2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Creating Hearts
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

// Game Screens
function drawWelcomeScreen() {
    drawBackground();
    ctx.fillStyle = '#A21838';
    ctx.font = '52px "Dancing Script", cursive';
    ctx.textAlign = 'center';
    ctx.fillText("Catch the Love! 💖", canvas.width / 2, canvas.height / 2 - 100);
}

function drawGameScreen() {
    drawBackground();
    ctx.fillStyle = "#A218
::contentReference[oaicite:0]{index=0}
 
