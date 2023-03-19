function loop(){
  console.log("loop");
  addObjects();
  scene.update();
  draw();
}

function addObjects() {
  scene.clear();
  currentMap = {...maps[map]};
  for(var i = 0; i < currentMap.blocks.length; i++){
    scene.add(currentMap.blocks[i]);
  }
  for(var i = 0; i < currentMap.walls.length; i++){
    scene.add(currentMap.walls[i]);
  }
  //for(var i = 0; i < currentMap.enemies.length; i++){
  //  scene.add(currentMap.enemies[i]);
  //}
  scene.add(player);
}

function playerController(p){
  console.log("player controller for: ", p.state, p.collision);
  p.airJumpCooldown--;
  //on the ground
  if(p.collision.down){
    if(p.state != "sliding"){
      p.state = "walking";
    }
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
          var dir = p.vel.x > 0 ? 1 : -1;
          p.vel.x += p.slideVel * dir;
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
      p.vel.y = p.wallJumpVel;
    }
  }
  if(p.collision.right){
    //wall jump
    if(!p.collision.down){
      p.vel.y = p.wallJumpVel;
    }
  }
  if(!p.collision.up && !p.collision.down && !p.collision.left && !p.collision.right){
    //wall run
    if(checkPlayerWallCollisions(p, currentMap.walls) && buttons.up){
      p.state = "walking";
      var dir = p.vel.x > 0 ? 1 : -1;
      p.vel.x += p.wallRunVel.x * dir;
      p.vel.y = p.wallRunVel.y;
      p.airJumps = p.airJumpsMax;
    } else {
      //air jump
      p.state = "jumping";
      if(buttons.up && p.airJumps > 0 && p.airJumpCooldown <= 0){
        p.vel.y = p.airJumpVel;
        p.airJumps--;
        p.airJumpCooldown = p.airJumpCooldownMax;
      }
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
    case "jumping":
      p.size = p.walkSize;
  }
}

function checkPlayerWallCollisions(p, w){
  for(var i = 0; i < w.length; w++){
    if(rectCollision(createRect(new V2(p.pos.x, p.pos.y + p.size.h / 2 - 1), new V2(p.size.w, 1)), createRect(w[i].pos, w[i].size))){
      return true;
    }
  }
}