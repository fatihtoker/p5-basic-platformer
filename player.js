const GRAVITY = 1;

const playerWalkSpriteSheetData = {
  startX: 5,
  startY: 18,
  distance: 94,
  _width: 48,
  _height: 82,
  count: 6,
};
const playerIdleSpriteSheetData = {
  startX: 5,
  startY: 18,
  distance: 94,
  _width: 48,
  _height: 82,
  count: 4,
};
const ANIMATION_SPEED = 0.1;

const ANIMATION_STATE = {
  IDLE_RIGHT: 0,
  IDLE_LEFT: 1,
  MOVING_RIGHT: 2,
  MOVING_LEFT: 3,
};

let currentAnimation, currentAnimationLength;

class Player {
  constructor(x, y, playerWalkSpriteSheet, playerIdleSpriteSheet) {
    this.x = x;
    this.y = y;
    this.width = playerWalkSpriteSheetData._width;
    this.height = playerWalkSpriteSheetData._height;

    this.playerWalkAnimation = [];
    this.playerIdleAnimation = [];
    this.xVelocity = 10;
    this.yVelocity = 5;
    this.isJumping = false;
    this.jumpHeight = 20;
    this.animationIndex = 0;
    this.animationState = ANIMATION_STATE.IDLE_RIGHT;
    this.direction = 1;

    this.playerWalkAnimation = this.populateAnimationArray(
      playerWalkSpriteSheet,
      playerWalkSpriteSheetData
    );
    this.walkAnimationLength = this.playerWalkAnimation.length;

    this.playerIdleAnimation = this.populateAnimationArray(
      playerIdleSpriteSheet,
      playerIdleSpriteSheetData
    );
    this.idleAnimationLength = this.playerIdleAnimation.length;
  }

  setAnimationState(state) {
    this.animationState = state;
  }

  populateAnimationArray(sheet, sheetData) {
    const { startX, startY, distance, _width, _height, count } = sheetData;
    let arr = [];
    for (let i = 0; i < count; i++) {
      let img = sheet.get(startX + i * distance, startY, _width, _height);
      arr.push(img);
    }
    return arr;
  }

  show() {
    console.log("state: ", this.animationState);
    this.animationIndex += ANIMATION_SPEED;
    switch (this.animationState) {
      case ANIMATION_STATE.IDLE_RIGHT:
      case ANIMATION_STATE.IDLE_LEFT:
        currentAnimation = this.playerIdleAnimation;
        currentAnimationLength = this.idleAnimationLength;
        break;
      case ANIMATION_STATE.MOVING_RIGHT:
      case ANIMATION_STATE.MOVING_LEFT:
        currentAnimation = this.playerWalkAnimation;
        currentAnimationLength = this.walkAnimationLength;
        break;
      default:
        break;
    }
    if (this.direction === -1) {
      let index = ceil(this.animationIndex) % currentAnimationLength;
      push();
      scale(-1, 1);
      // rect(-this.x - this.width, this.y, this.width, this.height);
      image(currentAnimation[abs(index)], -this.x - this.width, this.y);
      pop();
    } else {
      let index = floor(this.animationIndex) % currentAnimationLength;
      // rect(this.x, this.y, this.width, this.height);
      image(currentAnimation[abs(index)], this.x, this.y);
    }
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  setDirection(direction) {
    this.direction = direction;
  }
  applyGravity() {
    this.y += this.yVelocity;
    this.yVelocity += GRAVITY;
  }
  jump() {
    console.log("jump");
    if (!this.isJumping) {
      this.isJumping = true;
      this.yVelocity -= this.jumpHeight;
    }
  }
  moveRight() {
    this.direction = 1;
    this.animationState = ANIMATION_STATE.MOVING_RIGHT;
    this.x += this.xVelocity;
  }
  moveLeft() {
    this.direction = -1;
    this.animationState = ANIMATION_STATE.MOVING_LEFT;
    this.x -= this.xVelocity;
  }
  checkGameOver() {
    // off screen
    return this.y >= height;
  }
  disableVerticalMovement(stopPoint) {
    this.y = stopPoint;
    this.yVelocity = 0;
    this.isJumping = false;
  }
  disableHorizontalMovement(stopPoint) {
    this.x = stopPoint;
    this.isJumping = false;
  }
  isColliding(x1, x2, y1, y2) {
    // TODO: x position colliding slightly off
    return (
      this.y + this.height >= y1 &&
      this.y + this.height <= y2 &&
      this.x >= x1 &&
      this.x + this.width <= x2
    );
  }
}
