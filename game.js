var player = new Player();
var scene = new Scene();
var blocks = [];
blocks.push(new Block(new V2(0, 250), new V2(900, 50)));
blocks.push(new Block(new V2(-450, 0), new V2(100, 600)));
blocks.push(new Block(new V2(450, 0), new V2(100, 600)));
blocks.push(new Block(new V2(-250, -300), new V2(50, 600)));

var buttons = {
    up: false,
    down: false,
    left: false,
    right: false,
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false
}