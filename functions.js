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
  //on the ground
  if(p.collision.down){
    //walk
    if(buttons.right){
      p.vel.x += p.runSpeed;
    }
    if(buttons.left){
      p.vel.x -= p.runSpeed;
    }
    //jump
    if(buttons.up){
      p.vel.y += p.jumpVel;
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
}