const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ghost = {
    x: 50,
    y: 50,
    size: 40,
    speed: 5,
    img: new Image()
};
ghost.img.src = "assets/ghost.png";

const hearts = [];
const numHearts = 5;
for (let i = 0; i < numHearts; i++) {
    hearts.push({
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * (canvas.height - 30),
        size: 30,
        img: new Image()
    });
    hearts[i].img.src = "assets/heart.png";
}

const finishPoint = {
    x: canvas.width - 100,
    y: canvas.height - 100,
    size: 80,
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
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
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
            alert("Happy Valentine's Day! ❤️");
        }, 100);
    }
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

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            ghost.y -= ghost.speed;
            break;
        case "ArrowDown":
            ghost.y += ghost.speed;
            break;
        case "ArrowLeft":
            ghost.x -= ghost.speed;
            break;
        case "ArrowRight":
            ghost.x += ghost.speed;
            break;
    }
});

gameLoop();
