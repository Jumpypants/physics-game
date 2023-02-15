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
    this.size = new V2(0, 0);
    this.groundFriction = 0.3;
    this.airFriction = 0.05;
    this.bounceMultiplier = {x: 5, y: 0.1};

    this.walkVel = 0.8;
    this.jumpVel = -20;
    this.wallJumpVel = -15;
    this.airJumpVel = -20;
    this.airJumpsMax = 1;
    this.airJumpCooldownMax = 10;
    this.walkSize = new V2(40, 65);
    this.slideSize = new V2(65, 40);
    this.slideVel = 1;

    this.airJumps = 0;
    this.airJumpCooldown = 0;
    this.state = "walking";
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