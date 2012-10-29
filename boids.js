/* Boid prototype */

function Boid(ctx) {
    this.x = Math.random() * ctx.canvas.width;
    this.y = Math.random() * ctx.canvas.height;
    this.heading = Math.random() * 2 * Math.PI - Math.PI;
    this.radius = 8;
    this.speed = 2;
    this.radialSpeed = Math.PI / 60;
    this.vision = 50;
}

Boid.prototype.draw = function(ctx) {
    var pointLen = this.radius * 1.5;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + Math.cos(this.heading) * pointLen,
               this.y + Math.sin(this.heading) * pointLen);
    ctx.stroke();
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

Boid.wrap = function(value, wrap) {
    while (value >= wrap) value -= wrap;
    while (value < 0) value += wrap;
    return value;
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
            target = Boid.wrap(target, 2 * Math.PI);
        } else {
            // Match heading and move towards center
            var meanh = Math.atan2(meanhy, meanhx);
            var center = Math.atan2(meany, meanx);
            var tx = (Math.cos(meanh) * 3 + Math.cos(center)) / 4;
            var ty = (Math.sin(meanh) * 3 + Math.sin(center)) / 4;
            target = Math.atan2(ty, tx);
        }

        // Move in this direction
        var headingDelta = target - this.heading;
        if (headingDelta > this.radialSpeed)
            headingDelta = this.radialSpeed;
        else if (headingDelta < -this.radialSpeed) {
            headingDelta = -this.radialSpeed;
        }
        this.heading = Boid.wrap(this.heading + headingDelta,
                                 2 * Math.PI);
    }

    this.move(swarm.ctx.canvas.width, swarm.ctx.canvas.height);
};

Boid.prototype.move = function(width, height) {
    this.x += Math.cos(this.heading) * this.speed;
    this.x = (this.x + width) % width;
    this.y += Math.sin(this.heading) * this.speed;
    this.y = (this.y + height) % height;
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
    swarm.createBoid(100);
});
