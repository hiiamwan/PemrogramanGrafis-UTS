const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const MONKEY_WIDTH = 50;
const MONKEY_HEIGHT = 50;
const GROUND_HEIGHT = 50;

let monkeyY = (canvas.height - GROUND_HEIGHT - MONKEY_HEIGHT) / 2;
let jumpVelocity = 0;
let isJumping = false;
let isGameOver = false;
let score = 0;

const coconuts = [];
const COCONUT_WIDTH = 25;
const COCONUT_HEIGHT = 60;
const COCONUT_SPEED = 3;
const MIN_SPAWN_INTERVAL = 1000;
const MAX_SPAWN_INTERVAL = 1800;
let coconutSpawnTimer = 0;
let coconutSpawnDelay = getRandomSpawnInterval();
let initialJumpMade = false;
let needReset = false;

const monkeyImage = new Image();
monkeyImage.src = 'monkey.png'; // Ganti 'monkey.png' dengan nama file gambar monyet yang Anda unduh
monkeyImage.onload = function() {
    imagesLoaded();
};

const coconutTreeImage = new Image();
coconutTreeImage.src = 'coconut_tree.png'; // Ganti 'coconut_tree.png' dengan nama file gambar pohon kelapa yang Anda unduh
coconutTreeImage.onload = function() {
    imagesLoaded();
};

let imagesCount = 0;
function imagesLoaded() {
    imagesCount++;
    if (imagesCount === 2) {
        gameLoop(); // Memulai loop permainan setelah semua gambar dimuat
    }
}

function getRandomSpawnInterval() {
    return Math.random() * (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL) + MIN_SPAWN_INTERVAL;
}

function drawMonkey() {
    ctx.drawImage(monkeyImage, 50, monkeyY, MONKEY_WIDTH, MONKEY_HEIGHT);
}

function drawCoconutTree(x, y) {
    ctx.drawImage(coconutTreeImage, x, y, COCONUT_WIDTH, COCONUT_HEIGHT);
    // Menggambar garis di bawah pohon kelapa dari ujung kiri ke ujung kanan
    ctx.beginPath();
    ctx.moveTo(0, y + COCONUT_HEIGHT);
    ctx.lineTo(canvas.width, y + COCONUT_HEIGHT);
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function jump() {
    if (!initialJumpMade) {
        initialJumpMade = true;
        coconutSpawnTimer = coconutSpawnDelay;
    }
    if (!isJumping && !isGameOver) {
        isJumping = true;
        jumpVelocity = 15;
    }
}

function checkCollision() {
    for (const coconut of coconuts) {
        if (
            monkeyY + MONKEY_HEIGHT >= coconut.y &&
            monkeyY <= coconut.y + COCONUT_HEIGHT &&
            50 + MONKEY_WIDTH >= coconut.x &&
            50 <= coconut.x + COCONUT_WIDTH
        ) {
            isGameOver = true;
            gameOver();
        }
    }
}

function update() {
    if (isJumping) {
        monkeyY -= jumpVelocity;
        jumpVelocity -= 0.8;
        if (monkeyY >= (canvas.height - GROUND_HEIGHT - MONKEY_HEIGHT) / 2) {
            monkeyY = (canvas.height - GROUND_HEIGHT - MONKEY_HEIGHT) / 2;
            isJumping = false;
            jumpVelocity = 0;
        }
    }

    if (initialJumpMade) {
        if (coconutSpawnTimer <= 0) {
            coconuts.push({ x: canvas.width, y: (canvas.height - GROUND_HEIGHT - COCONUT_HEIGHT) / 2, scored: false });
            coconutSpawnTimer = getRandomSpawnInterval();
        } else {
            coconutSpawnTimer -= 16;
        }

        for (let i = 0; i < coconuts.length; i++) {
            coconuts[i].x -= COCONUT_SPEED;
            if (coconuts[i].x + COCONUT_WIDTH < 0) {
                coconuts.splice(i, 1);
                i--;
            }
        }

        checkCollision();

        for (let i = 0; i < coconuts.length; i++) {
            if (coconuts[i].x + COCONUT_WIDTH < 50 && !coconuts[i].scored) {
                score++;
                coconuts[i].scored = true;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMonkey();
    drawCoconutTrees();
    drawScore();
}

function drawCoconutTrees() {
    for (const coconut of coconuts) {
        drawCoconutTree(coconut.x, coconut.y);
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Poin: " + score, canvas.width - 100, 30);
}

function gameLoop() {
    update();
    draw();
    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function resetGame() {
    isGameOver = false;
    score = 0;
    coconuts.length = 0;
    initialJumpMade = false;
    coconutSpawnTimer = 0;
    gameLoop();
}

function gameOver() {
    alert("Total Poin : " + score);
    needReset = true;
}

document.addEventListener("keydown", event => {
    if (!isGameOver) {
        if (event.code === "Space") {
            jump();
        }
    }
});
