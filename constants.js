const display = {
  cw: window.innerWidth -20,
  ch: window.innerHeight - 20,

  cameraOffset: {x: 1/2, y: 3/4}
}

const constants = {
  fps: 40
}

class Player extends RectObject{
  constructor(){
    super(true, true);
    this.size = new V2(0, 0);
    this.groundFriction = 10;
    this.airFriction = 6;
    this.bounceMultiplier = {x: 5, y: 5};
    this.mass = 1;
    this.gravity = 50;

    this.walkVel = 32;
    this.jumpVel = -800;
    this.wallJumpVel = -1000;
    this.airJumpVel = -800;
    this.airJumpsMax = 1;
    this.airJumpCooldownMax = 0.375;
    this.walkSize = new V2(40, 65);
    this.slideSize = new V2(65, 40);
    this.slideVel = 40;
    this.wallRunVel = new V2(12, -80);

    this.airJumps = 0;
    this.airJumpCooldown = 0;
    this.state = "walking";

    this.animationState = null;
  }
  tickFunct(){
    playerController(this);
  }
  drawFunct(){
    //check player state
    switch(this.state){
      case "walking":
        //if running right
        if(this.vel.x > 0){
          //if was not already running right
          if(this.animationState != "runRight"){
            this.animation = new Animation(new V2(40, 65), 4, true, 1);
            this.animationState = "runRight";
            this.image = document.getElementById("playerRunRight");
          }
          this.animation.ticksPerFrame = 70 / this.vel.x;
        //if running left
        } else if(this.vel.x < 0){
          //if not already running left
          if(this.animationState != "runLeft"){
            this.animation = new Animation(new V2(40, 65), 4, true, 1);
            this.animationState = "runLeft";
            this.image = document.getElementById("playerRunLeft");
          }
          this.animation.ticksPerFrame = 70 / -this.vel.x;
        //if running but not right or left
        } else {
          this.animation = new Animation(new V2(40, 65), 4, true, Infinity);
          this.image = document.getElementById("playerRunRight");
        }
        break;
      case "sliding":
        //if sliding right
        if(this.vel.x > 0){
          //if not already sliding right
          if(this.animationState != "slideRight"){
            this.animation = new Animation(new V2(65, 40), 3, true, 1);
            this.animationState = "slideRight";
            this.image = document.getElementById("playerSlideRight");
          }
          this.animation.ticksPerFrame = 70 / this.vel.x;
        //if sliding left
        } else if(this.vel.x < 0){
          //if not already sliding left
          if(this.animationState != "slideLeft"){
            this.animation = new Animation(new V2(65, 40), 3, true, 1);
            this.animationState = "slideLeft";
            this.image = document.getElementById("playerSlideLeft");
          }
          this.animation.ticksPerFrame = 70 / -this.vel.x;
        //if sliding but not right or left
        } else {
          this.animation = new Animation(new V2(65, 40), 3, true, Infinity);
          this.image = document.getElementById("playerSlideRight");
        }
        break;
      default:
        this.animation = new Animation(new V2(40, 65), 4, true, 1);
        this.animationState = "runRight";
        this.image = document.getElementById("playerRunRight");
    }
    this.animation.nextFrame();
    this.imageSection = this.animation.returnImageSection();
  }
}

class Block extends RectObject{
  constructor(pos, size){
    super(false, true);
    this.pos = pos;
    this.size = size;
  }
}

class Wall extends RectObject{
  constructor(pos, size){
    super(false, false);
    this.pos = pos;
    this.size = size;
  }
}

class Enemy extends RectObject{
  constructor(pos){
    super(true, true);
    this.pos = pos;
    this.size = new V2(40, 40);
    this.airFriction = 0.1;
    this.bounceMultiplier = {x: 0.1, y: 0.1};
    this.mass = 1;
  }
}

const maps = [{
  blocks: [new Block(new V2(1000, 250), new V2(3000, 50)),
          /*new Block(new V2(-450, 0), new V2(100, 600)),
          new Block(new V2(450, -130), new V2(100, 600)),
          new Block(new V2(-250, -300), new V2(50, 600))*/],
  walls: [/*new Wall(new V2(1200, -100), new V2(1000, 400))*/],
  enemies: [/*new Enemy(new V2(100, 200))*/]
}];