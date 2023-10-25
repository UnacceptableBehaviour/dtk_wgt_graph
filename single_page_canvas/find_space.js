

function lineXline(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Line segment 1: (x1,y1) to (x2,y2)
    // Line segment 2: (x3,y3) to (x4,y4)

    // Calculate the direction vectors
    const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

    // Check if lines intersect
    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
}

class Rectangle {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width; 
      this.height = height;
    }
  
    lineIntersect(line) {
      // Same logic as before 
      const x1 = line.x;
      const y1 = line.y; 
      const x2 = line.x1;
      const y2 = line.y1;
      
      if (this.pointInside(x1, y1) || this.pointInside(x2, y2)) {
        return true;
      }
      
      const left = lineXline(x1, y1, x2, y2, this.x, this.y, this.x, this.y + this.height);
      const right = lineXline(x1, y1, x2, y2, this.x + this.width, this.y, this.x + this.width, this.y + this.height);
      const top = lineXline(x1, y1, x2, y2, this.x, this.y, this.x + this.width, this.y);
      const bottom = lineXline(x1, y1, x2, y2, this.x, this.y + this.height, this.x + this.width, this.y + this.height);
  
      return left || right || top || bottom;
    }
    
    rectIntersect(rect) {
      // Check if any edges intersect
      return (
        this.lineIntersect(rect.getLeftLine()) ||
        this.lineIntersect(rect.getRightLine()) ||
        this.lineIntersect(rect.getTopLine()) ||  
        this.lineIntersect(rect.getBottomLine())
      );
    }
  
    pointInside(x, y) {
        return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
    }

    getLeftLine() {
      return {x: this.x, y: this.y, x1: this.x, y1: this.y + this.height}; 
    }
    getRightLine() {
        return {x: this.x + this.width, y: this.y, x1: this.x + this.width, y1: this.y + this.height};
    }
    getTopLine() {
        return {x: this.x, y: this.y, x1: this.x + this.width, y1: this.y}; 
    }      
    getBottomLine() {
        return {x: this.x, y: this.y + this.height, x1: this.x + this.width, y1: this.y + this.height};
    }    
}

// add propper tests

const r1 = new Rectangle(10, 20, 100, 50);
const r2 = new Rectangle(50, 60, 150, 80); 

const line = {x: 0, y: 0, x1: 100, y1: 100};

console.log('TESTS - - - - S');
console.log('-line-');
console.log(line);
console.log('-r1-');
console.log(r1);
console.log('-r2-');
console.log(r2);
console.log(`r1.lineIntersect(line) - ${r1.lineIntersect(line)}`);
console.log(`r1.rectIntersect(r2) - ${r1.rectIntersect(r2)}`);
console.log('TESTS - - - - E');