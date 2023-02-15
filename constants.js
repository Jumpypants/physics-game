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
    this.groundFriction = 0.3;
    this.airFriction = 0.05;
    this.bounceMultiplier = {x: 5, y: 0.1};

    this.walkVel = 0.8;
    this.jumpVel = -20;
    this.wallJumpVel = -15;
    this.airJumpVel = -20;
    this.airJumpsMax = 1;
    this.airJumpCooldownMax = 15;
    this.walkSize = new V2(40, 65);
    this.slideSize = new V2(65, 40);
    this.slideVel = 1;

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