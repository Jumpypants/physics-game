function loop(){
  addObjects();
  scene.update(1);
  draw();
}

function addObjects() {
  scene.clear();
  scene.add(player);
  for(var i = 0; i < blocks.length; i++){
    scene.add(blocks[i]);
  }
}

function playerController(p){
  p.airJumpCooldown--;
  //on the ground
  if(p.collision.down){
    p.airJumpCooldown = p.airJumpCooldownMax;
    p.airJumps = p.airJumpsMax;
    //walk
    if(buttons.right && p.state == "walking"){
      p.vel.x += p.walkVel;
    }
    if(buttons.left && p.state == "walking"){
      p.vel.x -= p.walkVel;
    }
    //jump
    if(buttons.up && p.state == "walking"){
      p.vel.y = p.jumpVel;
    } else {
      //slide
      if(buttons.down){
        if(p.state != "sliding"){
          var slideDir = p.vel.x > 0 ? 1 : -1;
          p.vel.x += p.slideVel * slideDir;
          p.pos.y += (p.walkSize.h - p.slideSize.h) / 2;
          p.state = "sliding";
        }
      } else if(p.state == "sliding"){
        p.state = "walking";
        p.pos.y -= (p.walkSize.h - p.slideSize.h) / 2;
      }
    }
  }
  if(p.collision.left){
    //wall jump
    if(!p.collision.down){
      p.vel.y += p.wallJumpVel;
    }
  }
  if(p.collision.right){
    //wall jump
    if(!p.collision.down){
      p.vel.y += p.wallJumpVel;
    }
  }
  if(!p.collision.up && !p.collision.down && !p.collision.left && !p.collision.right){
    //air jump
    if(buttons.up && p.airJumps > 0 && p.airJumpCooldown <= 0){
      p.vel.y = p.airJumpVel;
      p.airJumps--;
      p.airJumpCooldown = p.airJumpCooldownMax;
    }
  }
  //size
  switch(p.state){
    case "walking":
      p.size = p.walkSize;
      break;
    case "sliding":
      p.size = p.slideSize;
      break;
  }
}