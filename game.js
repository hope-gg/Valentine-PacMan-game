const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.75;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.75;
});

let screen = 1;
let hearts = [];
let collectedHearts = 0;
const requiredHearts = 5;
const messages = [
    "You're my forever love 💕",
    "Every love story is beautiful, but ours is my favorite 💖",
    "You hold my heart forever 💗",
    "You are my dream come true ✨",
    "Love you to the moon and back 🌙💞"
];

const heartImage = new Image();
heartImage.src = "assets/heart (1).png"; 

const brokenHeartImage = new Image();
brokenHeartImage.src = "assets/broken-heart.png"; 

function createHeart(isBroken = false) {
    return {
        x: Math.random() * (canvas.width - 100),
        y: Math.random() * (canvas.height - 200),
        size: 100, 
        isBroken: isBroken,
        speed: 1 + Math.random()
    };
}

function drawBackground() {
    ctx.fillStyle = "#ffd1dc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWelcomeScreen() {
    drawBackground();
    ctx.fillStyle = "#ff4d6d";
    ctx.font = "40px 'Dancing Script', cursive";
    ctx.textAlign = "center";
    ctx.fillText("Tap to start!", canvas.width / 2, canvas.height / 2);
}

function drawGameScreen() {
    drawBackground();
    ctx.fillStyle = "#ff4d6d";
    ctx.font = "30px 'Dancing Script', cursive";
    ctx.fillText(`Catch: ${collectedHearts}/${requiredHearts}`, canvas.width / 2, 50);

    hearts.forEach((heart) => {
        ctx.drawImage(heart.isBroken ? brokenHeartImage : heartImage, heart.x, heart.y, heart.size, heart.size);
        heart.y += heart.speed;
    });

    hearts = hearts.filter(heart => heart.y < canvas.height);
}

function drawEndScreen() {
    drawBackground();
    ctx.fillStyle = "#ff4d6d";
    ctx.font = "36px 'Dancing Script', cursive";
    ctx.textAlign = "center";
    const message = messages[Math.floor(Math.random() * messages.length)];
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = "#ff4d6d";
    ctx.fillRect(canvas.width / 2 - 75, canvas.height / 2 + 50, 150, 50);
    ctx.fillStyle = "white";
    ctx.font = "28px 'Dancing Script', cursive";
    ctx.fillText("Restart", canvas.width / 2, canvas.height / 2 + 85);
}

canvas.addEventListener("click", (e) => {
    if (screen === 1) {
        screen = 2;
        collectedHearts = 0;
        hearts = [];
        for (let i = 0; i < 7; i++) hearts.push(createHeart(Math.random() < 0.3));
    } else if (screen === 2) {
        hearts.forEach((heart) => {
            if (
                e.clientX > heart.x &&
                e.clientX < heart.x + heart.size &&
                e.clientY > heart.y &&
                e.clientY < heart.y + heart.size
            ) {
                if (!heart.isBroken) {
                    collectedHearts++;
                    if (collectedHearts >= requiredHearts) {
                        screen = 3;
                    }
                }
                heart.y = canvas.height + 50;
            }
        });
    } else if (screen === 3) {
        screen = 1;
    }
});

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

gameLoop();
