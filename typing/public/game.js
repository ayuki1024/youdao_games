// 飞机打字游戏逻辑（障碍 + 重力）

// 从配置文件读取词库和难度等级（如果未定义则使用默认值）
const CONFIG = window.GAME_CONFIG || {};
const DEFAULT_WORDS = [
  "int", "vector", "string", "include", "define",
  "while", "for", "return", "struct", "typedef",
  "double", "long", "inline", "static", "const",
  "sort", "lower_bound", "upper_bound", "push_back", "size"
];

const LEVELS = CONFIG.levels || null;
let currentLevelKey = CONFIG.defaultLevel || 1;

function getCurrentLevelConfig() {
  if (
    LEVELS &&
    LEVELS[currentLevelKey] &&
    Array.isArray(LEVELS[currentLevelKey].words) &&
    LEVELS[currentLevelKey].words.length
  ) {
    return LEVELS[currentLevelKey];
  }
  return { words: DEFAULT_WORDS, totalWords: 20 };
}

let words = getCurrentLevelConfig().words.slice();
let totalWords = Number.isInteger(getCurrentLevelConfig().totalWords) && getCurrentLevelConfig().totalWords > 0
  ? getCurrentLevelConfig().totalWords
  : words.length;
const BG_SPEED = 80; // 背景滚动速度（px/s）
const GRAVITY = 20; // 飞机下坠加速度（px/s^2）
const JUMP_STRENGTH = 40; // 单词完成时向上的初速度
const OBSTACLE_SPEED = 220; // 障碍移动速度（px/s）
const OBSTACLE_SPAWN_INTERVAL = 2000; // 固定生成间隔（ms）
const OBSTACLE_BOTTOM_OFFSET = -10; // rock 底部距离地面像素
const OBSTACLE_SIZE = 72;
const COLLISION_PAD_X = 10; // 水平方向缩小碰撞框像素
const COLLISION_PAD_Y = 8;  // 垂直方向缩小碰撞框像素

const currentWordEl = document.getElementById("currentWord");
const wordIndexEl = document.getElementById("wordIndex");
const timeLabel = document.getElementById("timeLabel");
const accuracyLabel = document.getElementById("accuracyLabel");
const wpmLabel = document.getElementById("wpmLabel");
const progressInner = document.getElementById("progressInner");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const birdEl = document.getElementById("bird");
const skyEl = document.querySelector(".sky");

let gameStarted = false;
let currentIndex = 0;
let startTime = 0;
let typedChars = 0;
let correctChars = 0;
let charIndex = 0;

let bgOffset = 0;
let birdY = 0;
let birdVelocity = 0;
let loopActive = false;
let lastLoopTime = 0;
let lastSpawnTime = 0;
const obstacles = [];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let wordList = shuffle(words);

function resetGame() {
  stopLoop();
  gameStarted = false;
  currentIndex = 0;
  charIndex = 0;
  typedChars = 0;
  correctChars = 0;
  bgOffset = 0;
  birdVelocity = 0;
  setBirdInitialPosition();
  clearObstacles();
  if (skyEl) {
    skyEl.style.backgroundPosition = "0px 0px";
  }
  wordList = shuffle(words);
  updateWordDisplay();
  updateStats(0);
  progressInner.style.width = "0%";
  messageEl.textContent = "开始输入任意字母即可启动训练。";
  messageEl.className = "message";
  restartBtn.disabled = true;
}

function setBirdInitialPosition() {
  const skyHeight = skyEl ? skyEl.clientHeight : 360;
  birdY = skyHeight * 0.55;
  setBirdPosition(birdY);
}

function setBirdPosition(y) {
  if (!birdEl) return;
  birdEl.style.top = `${y}px`;
}

function updateWordDisplay() {
  const idx = Math.min(currentIndex + 1, totalWords);
  wordIndexEl.textContent = idx + " / " + totalWords;
  const word = wordList[currentIndex] || "";
  currentWordEl.innerHTML = "";
  for (let i = 0; i < word.length; i++) {
    const span = document.createElement("span");
    span.textContent = word[i];
    span.className = "letter";
    currentWordEl.appendChild(span);
  }
  charIndex = 0;
}

function updateStats(elapsedSec) {
  timeLabel.textContent = elapsedSec.toFixed(1) + " s";
  const accuracy = typedChars === 0 ? 1 : correctChars / typedChars;
  accuracyLabel.textContent = (accuracy * 100).toFixed(1) + "%";
  const wpm = elapsedSec > 0 ? (correctChars / elapsedSec) * 60 : 0;
  wpmLabel.textContent = wpm.toFixed(1);
}

function startLoop() {
  loopActive = true;
  lastLoopTime = 0;
  lastSpawnTime = 0;
  requestAnimationFrame(gameLoop);
}

function stopLoop() {
  loopActive = false;
}

function gameLoop(timestamp) {
  if (!loopActive) return;
  if (!lastLoopTime) {
    lastLoopTime = timestamp;
    lastSpawnTime = timestamp;
  }
  const delta = Math.min((timestamp - lastLoopTime) / 1000, 0.05);
  lastLoopTime = timestamp;

  updateBackground(delta);
  updateBird(delta);
  updateObstacles(delta);
  maybeSpawnObstacle(timestamp);

  if (loopActive) {
    requestAnimationFrame(gameLoop);
  }
}

function updateBackground(delta) {
  if (!skyEl) return;
  bgOffset -= BG_SPEED * delta;
  if (bgOffset < -5000) {
    bgOffset = 0;
  }
  skyEl.style.backgroundPosition = `${bgOffset}px 0px`;
}

function updateBird(delta) {
  if (!gameStarted) return;
  const skyHeight = skyEl ? skyEl.clientHeight : 360;
  const minY = 60;
  const maxY = skyHeight - 30;

  birdVelocity += GRAVITY * delta;
  birdY += birdVelocity * delta;

  if (birdY < minY) {
    birdY = minY;
    birdVelocity = 0;
  }
  if (birdY >= maxY) {
    birdY = maxY;
    birdVelocity = 0;
    crashGame("坠毁啦！下次记得更快输入单词！");
    return;
  }
  setBirdPosition(birdY);
}

function boostBird() {
  birdVelocity = -JUMP_STRENGTH;
}

function clearObstacles() {
  while (obstacles.length) {
    const obs = obstacles.pop();
    obs.el.remove();
  }
}

function spawnObstacle() {
  if (!skyEl) return;
  const obstacle = document.createElement("div");
  obstacle.className = "obstacle";
  const skyWidth = skyEl.clientWidth || 800;
  obstacle.style.left = `${skyWidth + 60}px`;
  obstacle.style.bottom = `${OBSTACLE_BOTTOM_OFFSET}px`;
  skyEl.appendChild(obstacle);

  obstacles.push({
    el: obstacle,
    x: skyWidth + 60
  });
}

function maybeSpawnObstacle(timestamp) {
  if (!gameStarted) return;
  if (!lastSpawnTime) {
    lastSpawnTime = timestamp;
  }
  if (timestamp - lastSpawnTime >= OBSTACLE_SPAWN_INTERVAL) {
    spawnObstacle();
    lastSpawnTime = timestamp;
  }
}

function updateObstacles(delta) {
  if (!gameStarted) return;
  const toRemove = [];
  const birdRect = birdEl.getBoundingClientRect();

  obstacles.forEach((obj, idx) => {
    obj.x -= OBSTACLE_SPEED * delta;
    if (obj.x < -OBSTACLE_SIZE - 40) {
      toRemove.push(idx);
      obj.el.remove();
      return;
    }
    obj.el.style.left = `${obj.x}px`;

    const obsRect = obj.el.getBoundingClientRect();
    if (isColliding(birdRect, obsRect)) {
      crashGame("撞上岩石啦！换个节奏再来一次！");
    }
  });

  for (let i = toRemove.length - 1; i >= 0; i--) {
    obstacles.splice(toRemove[i], 1);
  }
}

function isColliding(rectA, rectB) {
  // 缩小碰撞框，让判定更宽松
  const a = {
    left: rectA.left + COLLISION_PAD_X,
    right: rectA.right - COLLISION_PAD_X,
    top: rectA.top + COLLISION_PAD_Y,
    bottom: rectA.bottom - COLLISION_PAD_Y
  };

  const b = {
    left: rectB.left + COLLISION_PAD_X,
    right: rectB.right - COLLISION_PAD_X,
    top: rectB.top + COLLISION_PAD_Y,
    bottom: rectB.bottom - COLLISION_PAD_Y
  };

  // 防御：如果缩小过头导致无效矩形，直接认为不碰撞
  if (a.left >= a.right || a.top >= a.bottom || b.left >= b.right || b.top >= b.bottom) {
    return false;
  }

  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

function finishGame(isCrash = false) {
  if (!gameStarted && !loopActive) return;
  gameStarted = false;
  stopLoop();
  restartBtn.disabled = false;
  const elapsedSec = (performance.now() - startTime) / 1000;
  updateStats(elapsedSec);
  if (!isCrash) {
    messageEl.textContent = "训练结束！可以点击「重新开始」再来一局。";
    messageEl.className = "message ok";
  }
}

function crashGame(text) {
  if (!gameStarted) return;
  messageEl.textContent = text;
  messageEl.className = "message error";
  finishGame(true);
}

function beginGame() {
  if (gameStarted) return;
  gameStarted = true;
  startTime = performance.now();
  messageEl.textContent = "训练开始！保持节奏，别让飞机坠落。";
  restartBtn.disabled = false;
  startLoop();
}

restartBtn.addEventListener("click", () => {
  resetGame();
});

window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key.length !== 1) {
    return;
  }

  if (!gameStarted) {
    // 只有在刚复位（restartBtn 被禁用）时才允许自动开局
    if (restartBtn.disabled) {
      beginGame();
    } else {
      return;
    }
  }

  const word = wordList[currentIndex] || "";
  const spans = currentWordEl.querySelectorAll(".letter");
  if (!word || charIndex >= word.length) {
    e.preventDefault();
    return;
  }

  const expected = word[charIndex];
  typedChars += 1;

  if (key === expected) {
    const span = spans[charIndex];
    if (span) {
      span.classList.remove("wrong");
      span.classList.add("correct");
    }
    correctChars += 1;
    charIndex += 1;

    if (charIndex >= word.length) {
      currentIndex += 1;
      const elapsedSec = (performance.now() - startTime) / 1000;
      updateStats(elapsedSec);

      const progress = Math.min((currentIndex / totalWords) * 100, 100);
      progressInner.style.width = progress + "%";
      boostBird();

      if (currentIndex >= totalWords) {
        finishGame(false);
      } else {
        updateWordDisplay();
      }
    }
  } else {
    const span = spans[charIndex];
    if (span) {
      span.classList.remove("correct");
      span.classList.add("wrong");
    }
  }

  e.preventDefault();
});

// 初始化
resetGame();


