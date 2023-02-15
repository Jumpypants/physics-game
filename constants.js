const display = {
  cw: 900,
  ch: 600,

  cameraOffset: {x: 1/2, y: 3/4}
}

const constants = {
  fps: 40
}

class Player extends RectObject{
  constructor(){
    super(true, true);
    this.size = new V2(40, 40);
    this.groundFriction = 0.3;
    this.airFriction = 0.05;
    this.bounceMultiplier = {x: 10, y: 0.1};

    this.runSpeed = 0.7;
    this.jumpVel = -30;
    this.wallJumpVel = -15;
  }
  tickFunct(){
    playerController(this);
  }
}

class Block extends RectObject{
  constructor(pos, size){
    super(false, true);
    this.pos = pos;
    this.size = size;
  }
}