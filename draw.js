function draw(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, display.cw, display.ch);
    // scene.draw(new V2(display.cw * display.cameraOffset.x - player.pos.x,  display.ch * display.cameraOffset.y - player.pos.y), new V2(1, 1), ctx);
    scene.draw(new V2(500, 300), new V2(1, 1), ctx);

}
