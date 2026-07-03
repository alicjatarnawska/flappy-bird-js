const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const flapSound = new Audio("flap.mp3");
const scoreSound = new Audio("score.mp3");
// Głośność 50%
scoreSound.volume = 0.5;

const enemySound = new Audio("enemy.mp3");
enemySound.volume = 0.4;

const birdUp = new Image();
birdUp.src = "bird-up.png";
const birdDown = new Image();
birdDown.src = "bird-down.png";

const backgroundImage = new Image();
backgroundImage.src = "clouds.jpg";

const enemyImage = new Image();
enemyImage.src = "enemy.png";

const fastEnemyImage = new Image();
fastEnemyImage.src = "enemy2.png";

let currentBirdImage = birdUp;

let bird;
let pipes;
let enemies = [];
let fastEnemies = [];
let warningActive = false;
let warningCount = 0;
let warningY = 0;
let score;
let gameOver;
let pipeSpeed = 2;
let pipeGap = 220;
let highScore = localStorage.getItem("highScore") || 0;
let enemySpawnTimeout;
let fastEnemySpawnTimeout;
let loopVersion = 0;

function resetGame() {
  bird = {
    x: 80,
    y: 200,
    width: 30,
    height: 30,
    gravity: 0.6,
    lift: -10,
    velocity: 0,
  };
  loopVersion++;

  clearTimeout(enemySpawnTimeout);
  clearTimeout(fastEnemySpawnTimeout);

  pipes = [];
  score = 0;
  gameOver = false;

  //Reset trudnosci
  pipeSpeed = 2;
  pipeGap = 220;

  enemies = [];
  fastEnemies = [];

  warningActive = false;
  warningCount = 0;

  spawnEnemyLoop(loopVersion);
  spawnFastEnemyLoop(loopVersion);
}

resetGame();

function createPipe() {
  const gap = pipeGap;
  const topHeight = Math.random() * 300 + 50;

  pipes.push({
    x: canvas.width,
    width: 60,
    top: topHeight,
    bottom: canvas.height - topHeight - gap,
    passed: false,
  });
}

//ENEMIES
function createEnemy() {
  enemySound.currentTime = 0;
  enemySound.play();

  enemies.push({
    x: canvas.width + Math.random() * 400 + 100,
    y: Math.random() * (canvas.height - 200) + 100,
    width: bird.width,
    height: bird.height,
    speed: pipeSpeed + 2,
  });
  if (score >= 22) {
    enemies.push({
      x: canvas.width + Math.random() * 400 + 200,
      y: Math.random() * (canvas.height - 200) + 100,
      width: bird.width,
      height: bird.height,
      speed: pipeSpeed + 2,
    });
  }
}
function createFastEnemy() {
  fastEnemies.push({
    x: canvas.width + 500,
    y: warningY,
    width: bird.width * 1.8,
    height: bird.height * 1.8,
    speed: 12,
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}
function drawFastEnemies() {
  fastEnemies.forEach((enemy) => {
    ctx.drawImage(fastEnemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

function updateEnemies() {
  enemies.forEach((enemy) => {
    enemy.x -= enemy.speed;
    // Kolizja z graczem
    if (
      bird.x < enemy.x + enemy.width &&
      bird.x + bird.width > enemy.x &&
      bird.y < enemy.y + enemy.height &&
      bird.y + bird.height > enemy.y
    ) {
      endGame();
    }
  });
  // Usuwanie poza ekranem
  enemies = enemies.filter((enemy) => enemy.x + enemy.width > 0);
}

function updateFastEnemies() {
  fastEnemies.forEach((enemy) => {
    enemy.x -= enemy.speed;
    if (
      bird.x < enemy.x + enemy.width &&
      bird.x + bird.width > enemy.x &&
      bird.y < enemy.y + enemy.height &&
      bird.y + bird.height > enemy.y
    ) {
      endGame();
    }
  });
  fastEnemies = fastEnemies.filter((enemy) => enemy.x + enemy.width > 0);
}

function startWarningAndSpawn() {
  warningY = Math.random() * (canvas.height - 250) + 100;
  warningActive = true;
  warningCount = 0;
  const warningInterval = setInterval(() => {
    warningCount++;
    if (warningCount >= 8) {
      clearInterval(warningInterval);
      warningActive = false;
      createFastEnemy();
    }
  }, 250);
}

function drawWarning() {
  if (warningActive && warningCount % 2 === 0) {
    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width - 40, warningY, 40, bird.height * 2);
  }
}

function drawBird() {
  ctx.drawImage(currentBirdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height) {
    endGame();
  }

  if (bird.y < 0) {
    bird.y = 0;
  }
}

function drawPipes() {
  ctx.fillStyle = "green";

  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);

    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function updatePipes() {
  pipes.forEach((pipe) => {
    pipe.x -= pipeSpeed;

    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      endGame();
    }

    // Punkty
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;

      scoreSound.currentTime = 0;
      scoreSound.play();

      pipe.passed = true;
      pipeSpeed += 0.05;

      if (pipeGap > 120) {
        pipeGap -= 2;
      }
    }
  });

  pipes = pipes.filter((pipe) => pipe.x + pipe.width > 0);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText("Score: " + score, 20, 50);
  ctx.font = "24px Arial";
  ctx.fillText("Best: " + highScore, 20, 90);
}

function endGame() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  gameOver = true;

  ctx.fillStyle = "red";
  ctx.font = "40px Arial";
  ctx.fillText("GAME OVER", 70, 300);

  ctx.font = "20px Arial";
  ctx.fillText("Press R to restart", 110, 350);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  if (!gameOver) {
    updateBird();
    updatePipes();
    updateEnemies();
    updateFastEnemies();
  }

  drawBird();
  drawPipes();
  drawEnemies();
  drawFastEnemies();
  drawWarning();
  drawScore();

  if (gameOver) {
    endGame();
  }

  requestAnimationFrame(gameLoop);
}

function spawnEnemyLoop(version) {
  if (version !== loopVersion) {
    return;
  }
  if (!gameOver && score >= 5) {
    createEnemy();
  }
  let nextSpawn = 6000;
  if (score >= 22) {
    nextSpawn = 6000 - (score - 22) * 150;
    if (nextSpawn < 2500) {
      nextSpawn = 2500;
    }
  }
  enemySpawnTimeout = setTimeout(() => {
    spawnEnemyLoop(version);
  }, nextSpawn);
}

function spawnFastEnemyLoop(version) {
  if (version !== loopVersion) {
    return;
  }
  if (!gameOver && score >= 10) {
    startWarningAndSpawn();
  }
  let nextSpawn = 15000 - score * 200;
  if (nextSpawn < 5000) {
    nextSpawn = 5000;
  }
  fastEnemySpawnTimeout = setTimeout(() => {
    spawnFastEnemyLoop(version);
  }, nextSpawn);
}

// Sterowanie
document.addEventListener("keydown", (event) => {
  // Skok
  if (event.code === "Space" && !gameOver) {
    bird.velocity = bird.lift;

    flapSound.currentTime = 0;
    flapSound.play();

    currentBirdImage = birdDown;

    setTimeout(() => {
      currentBirdImage = birdUp;
    }, 150);
  }

  if (event.code === "KeyR") {
    resetGame();
  }
});

setInterval(() => {
  if (!gameOver) {
    createPipe();
  }
}, 2000);

gameLoop();
