let player;
let playerWalkSpriteSheet;
let playerIdleSpriteSheet;

let platforms = [];
let platformImg;

let bgImg;

let playAgainButton;
let score = 0;
let scoreText;
let scoreSpan;

let time = 0;
let timeText;
let timeSpan;

const INITIAL_PLAYER_POSITION = {
  x: 200,
  y: 200,
};
const PLATFORM_INFO = [
  {
    x: 0,
    y: 320,
    width: 300,
    height: 80,
    img: platformImg,
  },
  {
    x: 400,
    y: 460,
    width: 300,
    height: 80,
    img: platformImg,
  },
];
const MAX_JUMP_DISTANCE = 50;
let isGameOver = false;

function preload() {
  playerWalkSpriteSheet = loadImage(
    "assets/player/spritesheets/man-walk01.png"
  );
  playerIdleSpriteSheet = loadImage(
    "assets/player/spritesheets/man-idle01.png"
  );
  platformImg = loadImage("assets/pads/pad01.png");
  bgImg = loadImage("assets/background/bg01.png");
}

function setup() {
  createCanvas(1280, 720);
  // TODO: should use html elements and css, then could do element selection here to manipulate.
  scoreText = createSpan("Score: ");
  scoreSpan = createSpan(score);
  setInterval(handleScore, 200);
  createP();
  timeText = createSpan("Time: ");
  timeSpan = createSpan(score);
  setInterval(handleTime, 1000);

  playAgainButton = createButton("Play Again");
  playAgainButton.hide();
  playAgainButton.mousePressed(handleClickPlayAgain);

  player = new Player(
    INITIAL_PLAYER_POSITION.x,
    INITIAL_PLAYER_POSITION.y,
    playerWalkSpriteSheet,
    playerIdleSpriteSheet
  );
  initalizePlatforms();
}

function draw() {
  background(bgImg);

  player.show();
  showPlatforms();
  player.applyGravity();

  if (keyIsDown(RIGHT_ARROW)) {
    player.setAnimationState(ANIMATION_STATE.MOVING_RIGHT);
    player.moveRight();
  } else if (keyIsDown(LEFT_ARROW)) {
    player.setAnimationState(ANIMATION_STATE.MOVING_LEFT);
    player.moveLeft();
  } else {
    if (player.direction === -1) {
      player.setAnimationState(ANIMATION_STATE.IDLE_LEFT);
    } else {
      player.setAnimationState(ANIMATION_STATE.IDLE_RIGHT);
    }
  }
  checkScreenLimits();
  checkColliding();
  handlePlatformMovement();

  if (player.checkGameOver()) {
    playAgainButton.show();
    isGameOver = true;
    console.log("GAME OVER!");
  }
  if (isGameOver) {
    noLoop();
  }
}

function initalizePlatforms() {
  platforms = [];
  for (let index = 0; index < 2; index++) {
    const newPlatform = PLATFORM_INFO[index];
    platforms.push(
      new Platform(
        newPlatform.x,
        newPlatform.y,
        newPlatform.width,
        newPlatform.height,
        platformImg
      )
    );
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    player.jump();
  } else if (keyCode === DOWN_ARROW) {
  }

  return false;
}

function handleScore() {
  if (!isGameOver) {
    score += 0.2;
    scoreSpan.html(floor(score));
  }
}

function handleTime() {
  if (!isGameOver) {
    time++;
    timeSpan.html(time);
  }
}

function showPlatforms() {
  for (const platform of platforms) {
    platform.show();
  }
}

/* TODO: next 2 func need serious improvements:
  1- need to figure out WHEN & WHERE to generate a new platform
  2- need some way to calculate maximum jumping distance and make it dynamic
  3- need some dynamic way to initialize platforms
  4- need to prevent vertical off-screen platform generation
  5- need to clear old & horizontal off-screen platforms
*/
function handlePlatformMovement() {
  for (const platform of platforms) {
    platform.moveLeft();
  }
  const lastPlatform = platforms[platforms.length - 1];
  if (lastPlatform.x + lastPlatform.width <= width - MAX_JUMP_DISTANCE * 2) {
    platforms.push(generateRandomPlatform());
    // platforms.splice(0, 1);
  }
}

function generateRandomPlatform() {
  const lastPlatform = platforms[platforms.length - 1];

  // TODO: should only generate within the jump distance, probably should use trajectory calc. this is
  return new Platform(
    random(lastPlatform.x + lastPlatform.width, width),
    random(
      lastPlatform.y - MAX_JUMP_DISTANCE,
      lastPlatform.y + MAX_JUMP_DISTANCE + lastPlatform.height
    ),
    300,
    80,
    platformImg
  );
}

function checkScreenLimits() {
  if (player.x <= 0) {
    player.disableHorizontalMovement(0);
  } else if (player.x + player.width >= width) {
    player.disableHorizontalMovement(width - player.width);
  }
}

// function checkColliding() {
//   for (const platform of platforms) {
//     if (
//       // player.isColliding(
//       //   platform.x,
//       //   platform.x + platform.width,
//       //   platform.y,
//       //   platform.y + platform.height
//       // )
//       collideRectRect(
//         platform.x,
//         platform.y,
//         platform.width,
//         platform.height,
//         player.x,
//         player.y,
//         player.width,
//         player.height
//       )
//     ) {
//       // check vertical colliding
//       // if (player.isColliding())
//       console.log("collides!");
//       player.disableVerticalMovement(
//         platform.y - playerWalkSpriteSheetData._height
//       );
//     } else {
//       console.log("fall");
//     }
//   }
// }

function checkColliding() {
  for (const platform of platforms) {
    if (
      player.isColliding(
        platform.x,
        platform.x + platform.width,
        platform.y,
        platform.y + platform.height
      )
    ) {
      console.log("collides!");
      player.disableVerticalMovement(
        platform.y - playerWalkSpriteSheetData._height
      );
    } else {
      console.log("fall");
    }
  }
}

function handleClickPlayAgain() {
  player.setPosition(INITIAL_PLAYER_POSITION.x, INITIAL_PLAYER_POSITION.y);
  initalizePlatforms();
  player.setAnimationState(ANIMATION_STATE.IDLE_RIGHT);
  this.direction = 1;
  playAgainButton.hide();
  score = 0;
  time = 0;
  isGameOver = false;
  loop();
}
