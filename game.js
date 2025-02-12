const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ghost = {
    x: 50,
    y: 50,
    size: 60,
    speed: 10,
    img: new Image()
};
ghost.img.src = "assets/ghost.png";

const hearts = [];
const numHearts = 5;
for (let i = 0; i < numHearts; i++) {
    hearts.push({
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height - 50),
        size: Math.random() * 20 + 30,
        img: new Image()
    });
    hearts[i].img.src = "assets/heart.png";
}

const finishPoint = {
    x: canvas.width - 150,
    y: canvas.height - 150,
    size: 100,
    img: new Image()
};
finishPoint.img.src = "assets/big_heart.png";

let score = 0;

function drawGhost() {
    ctx.drawImage(ghost.img, ghost.x, ghost.y, ghost.size, ghost.size);
}

function drawHearts() {
    hearts.forEach(heart => {
        ctx.drawImage(heart.img, heart.x, heart.y, heart.size, heart.size);
    });
}

function drawFinishPoint() {
    ctx.drawImage(finishPoint.img, finishPoint.x, finishPoint.y, finishPoint.size, finishPoint.size);
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 40);
}

function checkCollisions() {
    hearts.forEach((heart, index) => {
        if (
            ghost.x < heart.x + heart.size &&
            ghost.x + ghost.size > heart.x &&
            ghost.y < heart.y + heart.size &&
            ghost.y + ghost.size > heart.y
        ) {
            hearts.splice(index, 1);
            score += 10;
        }
    });

    if (
        ghost.x < finishPoint.x + finishPoint.size &&
        ghost.x + ghost.size > finishPoint.x &&
        ghost.y < finishPoint.y + finishPoint.size &&
        ghost.y + ghost.size > finishPoint.y
    ) {
        setTimeout(() => {
            showWinScreen();
        }, 100);
    }
}

function showWinScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "pink";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const heart = new Image();
    heart.src = "assets/big_heart.png";
    heart.onload = () => {
        ctx.drawImage(heart, canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 200);
        ctx.fillStyle = "red";
        ctx.font = "36px Arial";
        ctx.fillText("Happy Valentine's Day! ❤️", canvas.width / 2 - 150, canvas.height / 2 + 150);
    };
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawHearts();
    drawGhost();
    drawFinishPoint();
    checkCollisions();
    requestAnimationFrame(gameLoop);
}

function moveGhost(x, y) {
    ghost.x += x * ghost.speed;
    ghost.y += y * ghost.speed;
}

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            moveGhost(0, -1);
            break;
        case "ArrowDown":
            moveGhost(0, 1);
            break;
        case "ArrowLeft":
            moveGhost(-1, 0);
            break;
        case "ArrowRight":
            moveGhost(1, 0);
            break;
    }
});

// Mobile controls
const controls = document.createElement("div");
controls.innerHTML = `
    <div style="position:fixed; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px;">
        <button onclick="moveGhost(-1, 0)">⬅️</button>
        <button onclick="moveGhost(0, -1)">⬆️</button>
        <button onclick="moveGhost(0, 1)">⬇️</button>
        <button onclick="moveGhost(1, 0)">➡️</button>
    </div>
`;
document.body.appendChild(controls);

gameLoop();
