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
                context.fillStyle = "gray";
                context.fillRect((obj.pos.x - obj.size.w / 2) * scale.w + center.x,
                    (obj.pos.y - obj.size.h / 2) * scale.h + center.y,
                    obj.size.w * scale.w,
                    obj.size.h * scale.h);
            }
            obj.drawFunct();
        }
    }

    onFrame(timeSinceLastFrame) {
        // Update all object velocities according to accelerations.
        this.updateVel(timeSinceLastFrame);

        // Update positions according to velocities. Do this piecewise according
        // to collisions.
        var remainingTime = timeSinceLastFrame;

        while (remainingTime > 0) {
            console.log("remainingTime: ", remainingTime);
            // Returns an object of collisions between pairs of solid objects.
            // All those collisions are guaranteed to happen at the same time,
            // which is within the provided duration.
            var collisions = this.calculateEarliestCollisions(remainingTime);

            // Update positions of objects according to their velocities,
            // assuming no acceleration and no collisions (constant velocities).
            this.updatePosNoCollision(collisions.time);

            // Update velocities of colliding objects.
            this.updateCollisions(collisions.collisions);
    
            remainingTime -= collisions.time;
        }
        console.log("frame done");
    }

    updateVel(timeSinceLastFrame){
        for(var i = 0; i < this.movingObjects.length; i++){
            var obj = this.objects[this.movingObjects[i]];
            //gravity
            obj.vel.y += obj.gravity * timeSinceLastFrame;
        }
    }

    resetCollisions(){
        for(var i = 0; i < this.solidObjects.length; i++){
            var obj = this.objects[this.solidObjects[i]];
            obj.collision = {up: false, down: false, left: false, right: false};
            obj.collisions = [];
        }
    }

    updatePosNoCollision(time){
        for(var i = 0; i < this.movingObjects.length; i++){
            var obj = this.objects[this.movingObjects[i]];
            obj.pos.x += obj.vel.x * time;
            obj.pos.y += obj.vel.y * time;
        }
    }

    // Returns an object describing the earliest collision or collisions
    // that happen between pairs of objects within the given duration.
    // of collisions between pairs of objects.
    //
    // This object has the following fields:
    // - time:
    //   The time until the collisions occur. If no collisions occur
    //   within the specified time, this field will be equal to the
    //   duration argument.
    // - collisions:
    //   An array of objects, each representing a future collision between
    //   a pair of objects, happening at the given time.
    //   These objects have two fields:
    //   - first: The first object involved in the collision. 
    //   - second: The second object involved in the collision.
    //   - axis: The axis in which the collision accured.
    //   In case there are no collisions within the given duration, this
    //   array will be empty. 
    calculateEarliestCollisions(duration) {
        var collisions = { time: duration, collisions: [] };
        for(var i = 0; i < this.solidObjects.length; i++){
            var objI = this.objects[this.solidObjects[i]];
            for(var j = i + 1; j < this.solidObjects.length; j++){
                var objJ = this.objects[this.solidObjects[j]];

                var collision = this.calculateCollision(objI, objJ);
                var timeToCollide = collision.time;
                var axis = collision.axis;
                if(timeToCollide <= collisions.time) {
                    if (timeToCollide < collisions.time) {
                        collisions.collisions = [];
                        collisions.time = timeToCollide;
                    }
                    collisions.collisions.push({first: objI, second: objJ, axis: axis});
                }
            }
        }
        return collisions;
    }

    calculateCollision(objI, objJ){
        var relativePos = new V2(objI.pos.x - objJ.pos.x, objI.pos.y - objJ.pos.y);
        var relativeVel = new V2(objJ.vel.x - objI.vel.x, objJ.vel.y - objI.vel.y);

        var timeToXCollision = Infinity;
        var timeToYCollision = Infinity;

        var averageSize = new V2((objI.size.w + objJ.size.w) / 2, (objI.size.h + objJ.size.h) / 2);

        //check potential collision on the x axis
        if(Math.abs(relativePos.x) >= averageSize.w && relativeVel.x != 0 && Math.sign(relativePos.x) == Math.sign(relativeVel.x)){
            var distToCollision = relativePos.x < 0 ? relativePos.x + averageSize.w : relativePos.x - averageSize.w;
            var timeToCollide = distToCollision / relativeVel.x;
            if(timeToCollide >= 0){
                var posYAtCollision = relativePos.y + relativeVel.y * timeToCollide;
                if(Math.abs(posYAtCollision) <= averageSize.h){
                    timeToXCollision = timeToCollide;
                }
            }
        }
        //check potential collision on the y axis
        if(Math.abs(relativePos.y) >= averageSize.h && relativeVel.y != 0 && Math.sign(relativePos.y) == Math.sign(relativeVel.y)){
            var distToCollision = relativePos.y < 0 ? relativePos.y + averageSize.h : relativePos.y - averageSize.h;
            var timeToCollide = distToCollision / relativeVel.y;
            if(timeToCollide >= 0){
                var posXAtCollision = relativePos.x + relativeVel.x * timeToCollide;
                if(Math.abs(posXAtCollision) <= averageSize.w){
                    timeToYCollision = timeToCollide;
                }
            }
        }

        if(Math.min(timeToYCollision, timeToXCollision) == timeToYCollision){
            return {time: timeToYCollision, axis: "y"};
        } else {
            return {time: timeToXCollision, axis: "x"};
        }
        
    }

    updateCollisions(collisions){
        for(var i = 0; i < collisions.length; i++){
            var first = collisions[i].first;
            var second = collisions[i].second;
            var axis = collisions[i].axis;
            this.collisionForAxis(axis, first, second);

            //find the direction of the collision,
            //and update the collisions and collsion values of the objects.
            if(axis == "x"){
                if(first.pos.x < second.pos.x){
                    console.log("+++first on left");
                    first.collisions.push({obj: second, dir: "right"});
                    second.collisions.push({obj: first, dir: "left"});

                    first.collision.right = true;
                    second.collision.left = true;
                } else {
                    console.log("+++first on right");
                    first.collisions.push({obj: second, dir: "left"});
                    second.collisions.push({obj: first, dir: "right"});

                    first.collision.left = true;
                    second.collision.Right = true;
                }
            } else if(axis == "y"){
                if(first.pos.y < second.pos.y){
                    console.log("+++first on top");
                    first.collisions.push({obj: second, dir: "down"});
                    second.collisions.push({obj: first, dir: "up"});

                    first.collision.down = true;
                    second.collision.up = true;
                } else {
                    console.log("+++first on bottom ");
                    first.collisions.push({obj: second, dir: "up"});
                    second.collisions.push({obj: first, dir: "down"});

                    first.collision.up = true;
                    second.collision.down = true;
                }
            }

            //call the collision functions for the objects
            first.collisionFunct(second);
            second.collisionFunct(first);
        }
        console.log(player.collision);
    }

    collisionForAxis(axis, objI, objJ) {
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
    }

    update() {
        // Reset the collision and collisions values for all solid objects.
        this.resetCollisions();
        this.onFrame(1 / constants.fps);
        this.callTickFuncts();
    }

    callTickFuncts(){
        for(var i = 0; i < this.objects.length; i++){
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
    
class RectObject{
    constructor(moving, solid){
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
        this.collision = { up: false, down: false, left: false, right: false};
        this.collisions = [];
    }
    drawFunct(){}
    collisionFunct(obj){}
    tickFunct(){}
}

function force(obj, axis, force){
    if(axis == "x"){
        obj.vel.x += force;
    } else if(axis == "y"){
        obj.vel.y += force;
    }
}

function friction(obj, axis, force){
    if(axis == "x"){
        if(obj.vel.x >= force){
            obj.vel.x -= force;
        } else if(obj.vel.x <= -force){
            obj.vel.x += force;
        } else {
            obj.vel.x = 0;
        }
    } else if(axis == "y"){
        if(obj.vel.y >= force){
            obj.vel.y -= force;
        } else if(obj.vel.y <= -force){
            obj.vel.y += force;
        } else {
            obj.vel.y = 0;
        }
    }
}