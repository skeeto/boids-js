/* Boid prototype */

function Boid(ctx) {
    this.x = Math.random() * ctx.canvas.width;
    this.y = Math.random() * ctx.canvas.height;
    this.heading = Math.random() * 2 * Math.PI - Math.PI;
    this.radius = 6;
    this.speed = 2;
    this.radialSpeed = Math.PI / 60;
    this.vision = 50;
}

Boid.prototype.draw = function(ctx) {
    var pointLen = this.radius * 1.75;
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x + Math.cos(this.heading + Math.PI / 2) * this.radius,
               this.y + Math.sin(this.heading + Math.PI / 2) * this.radius);
    ctx.lineTo(this.x + Math.cos(this.heading) * pointLen,
               this.y + Math.sin(this.heading) * pointLen);
    ctx.lineTo(this.x + Math.cos(this.heading - Math.PI / 2) * this.radius,
               this.y + Math.sin(this.heading - Math.PI / 2) * this.radius);
    ctx.fill();
};

Boid.prototype.distance = function(boid) {
    return Math.sqrt((this.x - boid.x) * (this.x - boid.x) +
                     (this.y - boid.y) * (this.y - boid.y));
};

Boid.prototype.getNeighbors = function(swarm) {
    var neighbors = [];
    for (var i = 0; i < swarm.boids.length; i++) {
        var boid = swarm.boids[i];
        if (this !== boid && this.distance(boid) < this.vision) {
            neighbors.push(boid);
        }
    }
    return neighbors;
};

Boid.wrap = function(value) {
    var min, max;
    if (arguments.length === 2) {
        min = 0;
        max = arguments[1];
    } else if (arguments.length === 3) {
        min = arguments[1];
        max = arguments[2];
    } else {
        throw new Error("wrong number of arguments");
    }
    while (value >= max) value -= (max - min);
    while (value < min) value += (max - min);
    return value;
};

Boid.trim = function(value, limit) {
    return Math.min(limit, Math.max(-limit, value));
};

Boid.meanAngle = function() {
    var sumx = 0, sumy = 0, len = arguments.length;
    for (var i = 0; i < len; i++) {
        sumx += Math.cos(arguments[i]);
        sumy += Math.sin(arguments[i]);
    }
    return Math.atan2(sumy / len, sumx / len);
};

Boid.prototype.step = function(swarm) {
    var neighbors = this.getNeighbors(swarm);
    if (neighbors.length > 0) {
        var meanhx = 0, meanhy = 0;
        var meanx = 0, meany = 0;
        var mindist = this.radius * 2, min = null;
        for (var i = 0; i < neighbors.length; i++) {
            var boid = neighbors[i];
            meanhx += Math.cos(boid.heading);
            meanhy += Math.sin(boid.heading);
            meanx += boid.x;
            meany += boid.y;
            var dist = this.distance(boid);
            if (dist < mindist) {
                mindist = dist;
                min = boid;
            }
        }
        meanhx /= neighbors.length;
        meanhy /= neighbors.length;
        meanx /= neighbors.length;
        meany /= neighbors.length;

        var target;
        if (min) {
            // Keep away!
            target = Math.atan2(this.y - min.y, this.x - min.x);
        } else {
            // Match heading and move towards center
            var meanh = Math.atan2(meanhy, meanhx);
            var center = Math.atan2(meany - this.y, meanx - this.x);
            target = Boid.meanAngle(meanh, meanh, meanh, center);
        }

        // Move in this direction
        var delta = Boid.wrap(target - this.heading, -Math.PI, Math.PI);
        delta = Boid.trim(delta, this.radialSpeed);
        this.heading = Boid.wrap(this.heading + delta, -Math.PI, Math.PI);
    }

    this.move(swarm.ctx.canvas.width, swarm.ctx.canvas.height);
};

Boid.prototype.move = function(width, height) {
    this.x = Boid.wrap(this.x + Math.cos(this.heading) * this.speed, width);
    this.y = Boid.wrap(this.y + Math.sin(this.heading) * this.speed, height);
};

/* Swam prototype. */

function Swarm(ctx) {
    this.ctx = ctx;
    this.boids = [];
    var swarm = this;
    this.animate = function() {
        Swarm.step(swarm);
    };
}

Swarm.prototype.createBoid = function(n) {
    for (var i = 0; i < (n || 1); i++) {
        this.boids.push(new Boid(this.ctx));
    }
};

Swarm.prototype.clear = function() {
    this.boids = [];
};

Swarm.step = function (swarm) {
    var ctx = swarm.ctx;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < swarm.boids.length; i++) {
        swarm.boids[i].step(swarm);
        swarm.boids[i].draw(ctx);
    }
    setTimeout(swarm.animate, 33);
};

/* Test */

var swarm; // defined globally for skewer
$("document").ready(function() {
    swarm = new Swarm($('#canvas').get(0).getContext("2d"));
    swarm.animate();
    swarm.clear();
    swarm.createBoid(200);
});
