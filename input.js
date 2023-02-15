function keyDown(evt) {
    switch (evt.code) {
      case "ArrowLeft":
        buttons.left = true;
        break;
      case "ArrowUp":
        buttons.up = true;
        break;
      case "ArrowRight":
        buttons.right = true;
        break;
      case "ArrowDown":
        buttons.down = true;
        break;
      case "ShiftLeft":
        buttons.shift = true;
        break;


      case "KeyW":
        buttons.w = true;
        break;
      case "KeyA":
        buttons.a = true;
        break;
      case "KeyS":
        buttons.s = true;
        break;
      case "KeyD":
        buttons.d = true;
        break;
      case "Space":
        buttons.space = true;
        break;
    }
  }

  function keyUp(evt) {
    switch (evt.code) {
      case "ArrowLeft":
        buttons.left = false;
        break;
      case "ArrowUp":
        buttons.up = false;
        break;
      case "ArrowRight":
        buttons.right = false;
        break;
      case "ArrowDown":
        buttons.down = false;
        break;
      case "ArrowLeft":
        buttons.left = false;
        break;


      case "KeyW":
        buttons.w = false;
        break;
      case "KeyA":
        buttons.a = false;
        break;
      case "KeyS":
        buttons.s = false;
        break;
      case "KeyD":
        buttons.d = false;
        break;
      case "Space":
        buttons.space = false;
        break;
    }
  }