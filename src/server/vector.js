class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vector2D(this.x, this.y);
    }

    add(v) {
        this.x += v.x; 
        this.y += v.y;
        return this;
    }

    subtract(v) {
        this.x -= v.x; 
        this.y -= v.y;
        return this;
    }

    multiply(scalar) {
       this.x *= scalar; 
       this.y *= scalar;
        return this;
    }

    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar; 
            this.y /= scalar;
            return this;
        } else {
            return this;
        }
    }

    clamp(min, max) {
        this.x = Math.max(min, Math.min(max, this.x));
        this.y = Math.max(min, Math.min(max, this.y));
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    setMagnitude(scalar) {
        const unitVector = this.normalize();
        this.x = unitVector.x * scalar;
        this.y = unitVector.y * scalar;
        return this;
    }

    normalize() {
        let mag = this.magnitude();
        return mag !== 0 ? this.divide(mag) : new Vector2D();
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    distance(v) {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }

    direction() {
        return Math.atan2(this.y, this.x);
    }

    addMagnitudeInDirection(magnitude, direction) {
        this.x += magnitude * Math.cos(direction);
        this.y += magnitude * Math.sin(direction);
        return this;    //chainable method
    }
}

module.exports = Vector2D;