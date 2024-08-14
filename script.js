const gameArea = document.getElementById('gameArea');
const ball = document.getElementById('ball');
const playerPaddle = document.getElementById('playerPaddle');
const enemyPaddle = document.getElementById('enemyPaddle');
const playerScoreElem = document.getElementById('playerScore');
const enemyScoreElem = document.getElementById('enemyScore');
const levelDisplay = document.getElementById('levelDisplay');

let ballX = 390, ballY = 290;
let ballSpeedX = 5, ballSpeedY = 5;
let playerScore = 0, enemyScore = 0;
let playerPaddleY = 250, enemyPaddleY = 250;
let enemyPaddleSpeed = 4;
let level = 1;
const maxScorePerLevel = 5;  // Punkte für ein Level

function resetBall() {
    ballX = 390;
    ballY = 290;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 3);
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 3);
}

function levelUp() {
    level++;
    levelDisplay.textContent = ` | Level: ${level}`;
    enemyPaddleSpeed += 2;  // Gegner wird schneller
    resetBall();
}

function update() {
    moveBall();
    movePaddles();
    checkCollisions();
    updateScores();
    updatePositions();

    requestAnimationFrame(update);
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= 580) {
        ballSpeedY *= -1;
    }
}

function movePaddles() {
    playerPaddleY = Math.min(Math.max(playerPaddleY, 0), 500);
    playerPaddle.style.top = `${playerPaddleY}px`;

    // Einfacher KI-Algorithmus für den Gegner
    if (enemyPaddleY + 50 < ballY) {
        enemyPaddleY += enemyPaddleSpeed;
    } else {
        enemyPaddleY -= enemyPaddleSpeed;
    }
    enemyPaddleY = Math.min(Math.max(enemyPaddleY, 0), 500);
    enemyPaddle.style.top = `${enemyPaddleY}px`;
}

function checkCollisions() {
    if (ballX <= 40 && ballY >= playerPaddleY && ballY <= playerPaddleY + 100) {
        ballSpeedX *= -1.1;
        ballX = 40;
    }

    if (ballX >= 740 && ballY >= enemyPaddleY && ballY <= enemyPaddleY + 100) {
        ballSpeedX *= -1.1;
        ballX = 740;
    }
}

function updateScores() {
    if (ballX <= 0) {  // Spieler hat verfehlt, Gegner bekommt einen Punkt
        enemyScore++;
        enemyScoreElem.textContent = `Gegner: ${enemyScore}`;
        if (enemyScore >= maxScorePerLevel) {
            alert("Game Over! Du hast verloren.");
            resetGame();
        } else {
            resetBall();
        }
    }

    if (ballX >= 780) {  // Gegner hat verfehlt, Spieler bekommt einen Punkt
        playerScore++;
        playerScoreElem.textContent = `Ich: ${playerScore}`;
        if (playerScore >= maxScorePerLevel) {
            levelUp();
        } else {
            resetBall();
        }
    }
}

function updatePositions() {
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

function resetGame() {
    playerScore = 0;
    enemyScore = 0;
    level = 1;
    enemyPaddleSpeed = 4;
    playerScoreElem.textContent = `Ich: ${playerScore}`;
    enemyScoreElem.textContent = `Gegner: ${enemyScore}`;
    levelDisplay.textContent = ` | Level: ${level}`;
    resetBall();
}

// Steuerung des Spielerschlägers mit der Maus
document.addEventListener('mousemove', (e) => {
    const rect = gameArea.getBoundingClientRect();
    playerPaddleY = e.clientY - rect.top - 50; // Schläger zentrieren
});

// Start des Spiels
resetGame();
update();