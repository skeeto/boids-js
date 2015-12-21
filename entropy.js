/*
  entropy calculation
*/
function Entropy(particles, width, height) {
    this.particles = particles;
    this.width = width;
    this.height = height;
}

Entropy.prototype.getDistance = function(size,a,b) {
    var d = Math.abs(a - b);
    if (d > size/2) {
        d = size - d;
    }
    return d;
}

Entropy.prototype.getDistance2 = function(f,g) {
    var dX = this.getDistance(this.width,f.x, g.x);
    var dY = this.getDistance(this.height,f.y, g.y);
    return Math.sqrt(dX*dX + dY*dY);
}

// calculates average distance among particles
Entropy.prototype.getEntropy = function() {
    var size = this.particles.length;
    if( size < 2 ) {
        return 1.0;
    }

    var sum = 0;
    for (var i = 0; i < size; i++) {
        var f = this.particles[i];
        for (var j = i + 1; j < size; j++) {
            var g = this.particles[j];
            sum += this.getDistance2(f,g);
        }
    }
    return sum /(size*(size-1)/2);
}
