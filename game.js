const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ghost = {
    x: 50,
    y: 50,
    size: 60,
    speed: 3,
    img: new Image(),
    target: null
};
ghost.img.src = "assets/ghost.png";

const hearts = [];
const numHearts = 5;
for (let i = 0; i < numHearts; i++) {
    hearts.push({
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height - 50),
        size: Math.random() * 20 + 30,
        img: new Image(),
        isClicked: false,
        scale: 1
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
        if (heart.isClicked) {
            heart.scale += 0.1;
            heart.size *= heart.scale;
            if (heart.scale > 1.5) {
                hearts.splice(hearts.indexOf(heart), 1);
            }
        }
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

function moveGhostTowardsTarget() {
    if (!ghost.target) return;
    
    let dx = ghost.target.x - ghost.x;
    let dy = ghost.target.y - ghost.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > ghost.speed) {
        ghost.x += (dx / distance) * ghost.speed;
        ghost.y += (dy / distance) * ghost.speed;
    } else {
        ghost.x = ghost.target.x;
        ghost.y = ghost.target.y;
        ghost.target = null;
    }
}

canvas.addEventListener("click", event => {
    const clickX = event.clientX;
    const clickY = event.clientY;
    hearts.forEach(heart => {
        if (
            clickX > heart.x &&
            clickX < heart.x + heart.size &&
            clickY > heart.y &&
            clickY < heart.y + heart.size
        ) {
            ghost.target = { x: heart.x, y: heart.y };
        }
    });
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawHearts();
    moveGhostTowardsTarget();
    drawGhost();
    drawFinishPoint();
    checkCollisions();
    requestAnimationFrame(gameLoop);
}

gameLoop();
