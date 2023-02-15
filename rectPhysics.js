class Scene {
    constructor() {
        this.objects = [];
        this.solidObjects = [];
        this.movingObjects = [];

        this.correctionMultiplier = 0.05;
        this.maxCorrection = 100000;
    }
    add(obj) {
        this.objects.push(obj);
        if (obj.solid) {
            this.solidObjects.push(this.objects.length - 1);
        }
        if (obj.moving) {
            this.movingObjects.push(this.objects.length - 1);
        }
    }
    clear() {
        this.objects = [];
        this.solidObjects = [];
        this.movingObjects = [];
    }
    draw(center, scale, context) {
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            if (obj.image != null) {
                if (obj.imageSection == null) {
                    context.drawImage(obj.image,
                        (obj.pos.x - obj.size.w / 2) * scale.w + center.x,
                        (obj.pos.y - obj.size.h / 2) * scale.h + center.y,
                        obj.size.w * scale.w,
                        obj.size.h * scale.h);
                } else {
                    context.drawImage(obj.image,
                        obj.imageSection.x,
                        obj.imageSection.y,
                        obj.imageSection.w,
                        obj.imageSection.h,
                        (obj.pos.x - obj.size.w / 2) * scale.w + center.x,
                        (obj.pos.y - obj.size.h / 2) * scale.h + center.y,
                        obj.size.w * scale.w,
                        obj.size.h * scale.h);
                }
            } else {
                context.fillStyle = "black";
                context.fillRect((obj.pos.x - obj.size.w / 2) * scale.w + center.x,
                    (obj.pos.y - obj.size.h / 2) * scale.h + center.y,
                    obj.size.w * scale.w,
                    obj.size.h * scale.h);
            }
            obj.drawFunct();
        }
    }
    update(gravity) {
        //x
        for(var i = 0; i < this.movingObjects.length; i++) {
            var obj = this.objects[this.movingObjects[i]];
            //apply air friction
            if (obj.vel.x > obj.airFriction) {
                obj.vel.x -= obj.airFriction;
            } else if (obj.vel.x < -obj.airFriction) {
                obj.vel.x += obj.airFriction;
            } else {
                obj.vel.x = 0;
            }

            //apply ground friction
            if (obj.collision.down) {
                if (obj.vel.x > obj.groundFriction) {
                    obj.vel.x -= obj.groundFriction;
                } else if (obj.vel.x < -obj.groundFriction) {
                    obj.vel.x += obj.groundFriction;
                } else {
                    obj.vel.x = 0;
                }
            }

            //move object
            obj.pos.x += obj.vel.x;
        }

        //collision
        for (var i = 0; i < this.solidObjects.length; i++) {
            var objI = this.objects[this.solidObjects[i]];
            objI.collision = {up: false, down: false, left: false, right: false};
            var rectI = createRect(objI.pos, objI.size);
            for (var j = i + 1; j < this.solidObjects.length; j++) {
                var objJ = this.objects[this.solidObjects[j]];
                objJ.collision = {up: false, down: false, left: false, right: false};
                var rectJ = createRect(objJ.pos, objJ.size);

                if (!objI.moving && !objJ.moving) {
                    continue;
                }
                if (collisionForAxis("x", objI, objJ, rectI, rectJ)) {
                    var max = this.maxCorrection;
                    //1 means object i is on the left, -1 that object j is on the left.
                    var collisionDir = objI.pos.x < objJ.pos.x ? 1 : -1;
                    var collided = false;
                    while (rectCollision(rectI, rectJ) && max > 0) {
                        collided = true;
                        max--;
                        rectI = createRect(objI.pos, objI.size);
                        rectJ = createRect(objJ.pos, objJ.size);
                        if (objI.moving && objJ.moving) {
                            objI.pos.x -= collisionDir * this.correctionMultiplier;
                            objJ.pos.x += collisionDir * this.correctionMultiplier;
                        } else if (objI.moving) {
                            objI.pos.x -= collisionDir * this.correctionMultiplier;
                        } else if (objJ.moving) {
                            objJ.pos.x += collisionDir * this.correctionMultiplier;
                        }
                    }
                    if(collided){
                        if (objI.pos.x < objJ.pos.x) {
                            objI.collision.right = true;
                            objJ.collision.left = true;
                        } else {
                            objI.collision.left = true;
                            objJ.collision.right = true;
                        }
                    }
                }
            }
        }
        //y
        for (var i = 0; i < this.movingObjects.length; i++) {
            var obj = this.objects[this.movingObjects[i]];
            //apply gravity
            obj.vel.y += gravity;
            //apply air friction
            if (obj.vel.y > obj.airFriction) {
                obj.vel.y -= obj.airFriction;
            } else if (obj.vel.y < -obj.airFriction) {
                obj.vel.y += obj.airFriction;
            } else {
                obj.vel.y = 0;
            }
            //move object
            obj.pos.y += obj.vel.y;
        }

        //collision
        for (var i = 0; i < this.solidObjects.length; i++) {
            var objI = this.objects[this.solidObjects[i]];
            var rectI = createRect(objI.pos, objI.size);
            for (var j = i + 1; j < this.solidObjects.length; j++) {
                var objJ = this.objects[this.solidObjects[j]];
                var rectJ = createRect(objJ.pos, objJ.size);

                if (!objI.moving && !objJ.moving) {
                    continue;
                }
                collisionForAxis("y", objI, objJ, rectI, rectJ);
                var max = this.maxCorrection;
                //1 means object i is on the top, -1 that object j is on the top.
                var collisionDir = objI.pos.y < objJ.pos.y ? 1 : -1;
                var collided = false;
                while (rectCollision(rectI, rectJ) && max > 0) {
                    collided = true;
                    max--;
                    rectI = createRect(objI.pos, objI.size);
                    rectJ = createRect(objJ.pos, objJ.size);
                    if (objI.moving && objJ.moving) {
                        objI.pos.y -= collisionDir * this.correctionMultiplier;
                        objJ.pos.y += collisionDir * this.correctionMultiplier;
                    } else if (objI.moving) {
                        objI.pos.y -= collisionDir * this.correctionMultiplier;
                    } else if (objJ.moving) {
                        objJ.pos.y += collisionDir * this.correctionMultiplier;
                    }
                }

                if(collided){
                    if (objI.pos.y < objJ.pos.y) {
                        objI.collision.down = true;
                        objJ.collision.up = true;
                    } else {
                        objI.collision.up = true;
                        objJ.collision.down = true;
                    }
                }
            }
        }
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].tickFunct();
        }
    }
}

function createRect(pos, size) {
    return { x: pos.x, y: pos.y, w: size.w, h: size.h };
}

function rectCollision(r1, r2) {
    if (r1.x + r1.w / 2 > r2.x - r2.w / 2 &&
        r2.x + r2.w / 2 > r1.x - r1.w / 2 &&
        r1.y + r1.h / 2 > r2.y - r2.h / 2 &&
        r2.y + r2.h / 2 > r1.y - r1.h / 2) {
        return true;
    }
    return false;
}

class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = x;
        this.h = y;
    }
}

function collisionForAxis(axis, objI, objJ, rectI, rectJ) {
    //check for collision
    if (rectCollision(rectI, rectJ)) {
        if (!objI.moving) {
            var elasticXI = 0;
            var elasticYI = 0;
            var plasticX = 0;
            var plasticY = 0;
            if (axis == "y") {
                var elasticXJ = objJ.vel.x;
                var elasticYJ = -objJ.vel.y;
            } else if (axis == "x") {
                var elasticXJ = -objJ.vel.x;
                var elasticYJ = objJ.vel.y;
            }
        } else if (!objJ.moving) {
            var elasticXJ = 0;
            var elasticYJ = 0;
            var plasticX = 0;
            var plasticY = 0;
            if (axis == "y") {
                var elasticXI = objI.vel.x;
                var elasticYI = -objI.vel.y;
            } else if (axis == "x") {
                var elasticXI = -objI.vel.x;
                var elasticYI = objI.vel.y;
            }
        } else {
            var plasticX = (objI.mass * objI.vel.x + objJ.mass * objJ.vel.x) / (objI.mass + objJ.mass);
            var plasticY = (objI.mass * objI.vel.y + objJ.mass * objJ.vel.y) / (objI.mass + objJ.mass);

            if (axis == "y") {
                var elasticXI = objI.vel.x;
                var elasticYI = ((objI.mass - objJ.mass) / (objI.mass + objJ.mass) * objI.vel.y) + ((objJ.mass * 2) / (objI.mass + objJ.mass) * objJ.vel.y);
                var elasticXJ = objJ.vel.x;
                var elasticYJ = ((objJ.mass - objI.mass) / (objJ.mass + objI.mass) * objJ.vel.y) + ((objI.mass * 2) / (objJ.mass + objI.mass) * objI.vel.y);
            } else if (axis == "x") {
                var elasticXI = ((objI.mass - objJ.mass) / (objI.mass + objJ.mass) * objI.vel.x) + ((objJ.mass * 2) / (objI.mass + objJ.mass) * objJ.vel.x);
                var elasticYI = objI.vel.y;
                var elasticXJ = ((objJ.mass - objI.mass) / (objJ.mass + objI.mass) * objJ.vel.x) + ((objI.mass * 2) / (objJ.mass + objI.mass) * objI.vel.x);
                var elasticYJ = objJ.vel.y;
            }
        }

        if (axis == "x") {
            var k = objI.bounceMultiplier.x * objJ.bounceMultiplier.x;
            objI.vel.x = k * elasticXI + (1 - k) * plasticX;
            objJ.vel.x = k * elasticXJ + (1 - k) * plasticX;
        } else if (axis == "y") {
            var k = objI.bounceMultiplier.y * objJ.bounceMultiplier.y;
            objJ.vel.y = k * elasticYJ + (1 - k) * plasticY;
            objI.vel.y = k * elasticYI + (1 - k) * plasticY;
        }


        objI.collisionFunct(objJ);
        objJ.collisionFunct(objI);
        return true;
    } else {
        return false;
    }
}

class RectObject {
    constructor(moving, solid) {
        this.pos = { x: 0, y: 0 };
        this.size = { w: 0, h: 0 };
        this.vel = { x: 0, y: 0 };
        this.solid = solid;
        this.moving = moving;
        this.image = null;
        this.imageSection = null;
        this.bounceMultiplier = {x: 0.1, y: 0.1};
        this.mass = 1;
        this.airFriction = 0.03;
        this.groundFriction = 0.03;
        this.collision = { up: false, down: false, left: false, right: false };
    }
    drawFunct() {}
    collisionFunct() {}
    tickFunct() {}
}