// helpers
const cl = (str) => {
  console.log(str);
}

//cl(`u8_fp_flock.js: loading - ${global.canvasSketch} - ${typeof(global.canvasSketch)} <`);

//const canvasSketch = require('canvas-sketch');
//const math = require('canvas-sketch-util/math');
//const random = require('canvas-sketch-util/random');
//const Tweakpane = require('tweakpane');

import {math, random} from './require_random.js';

//class Random {
//  range(min, max) {
//    if (min < max) {
//      let no = Math.random() * (max -  min);
//      return (min + no);
//    }
//    return undefined;
//  }
//  rangeFloor(min, max=0){
//    if (max === 0) {
//      [min, max] = [max, min];
//    }
//    return Math.floor(this.range(min, max));
//  }
//}
//var random = new Random;
//
//const EPSILON = Number.EPSILON;
//class MathMath {
//  mapRange (value, inputMin, inputMax, outputMin, outputMax, clamp) {
//    // Reference:
//    // https://openframeworks.cc/documentation/math/ofMath/
//    if (Math.abs(inputMin - inputMax) < EPSILON) {
//      return outputMin;
//    } else {
//      var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
//      if (clamp) {
//        if (outputMax < outputMin) {
//          if (outVal < outputMax) outVal = outputMax;
//          else if (outVal > outputMin) outVal = outputMin;
//        } else {
//          if (outVal > outputMax) outVal = outputMax;
//          else if (outVal < outputMin) outVal = outputMin;
//        }
//      }
//      return outVal;
//    }
//  }  
//}
//var math = new MathMath;

class Vector {
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  getDistance(v) {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}
  
  magnitude(){
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  
  plus(v){    
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z); 
  }
  
  div(d) {
    return new Vector(this.x/d, this.y/d, this.z/d); 
  }

  // average list of vectors  
  static average (lVec) {
    let sum = new Vector(0,0,0);
    lVec.forEach( v => {
       sum = sum.plus(v);
    });    
    return sum.div(lVec.length);
  }
  
  dbg(){
    console.log(this);    
  }
}

let cubeSize = 2400;
const scene = new Vector(cubeSize, cubeSize, cubeSize);

const settings = {
  dimensions: [ scene.x, scene.y ],
  animate: true
};

//const centreOfCage = 
// PARAMETERS - #TWEAKABLE
const params = {
  noOfBoids: 200,                    
  boidMaxRad: 40,
  boidMinRad: 2,
  speedLimit: 15,
  speedLimitOn: true,
  borderStroke: true,
  
  flockDensity: 0.3,   // 1: No space between birds, 0 = no birds  
  rule1multiplier: 0.05,  
  nearestNeighbourEffect: 7,  
  nNEffect: true,
  
  visualRangeEffect: 50,
  vREffect: false,
  
  minSafeDistance: 10,
  
  centreOfScene: new Vector(scene.x/2, scene.y/2, scene.z/2),
  
  leadBoidLoc: new Vector(scene.x/2, scene.y/2, scene.z/2),
  leadBoid: null,
  freeFlightAmp: 4,
  leadBoidConfinement: cubeSize / 4,   // no of pixels from the edge of scene that confinement cube starts
  
  fontSize: cubeSize / 30,
};


// SKETCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SKETCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SKETCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const sketch = ({ context, width, height }) => {

  let flock = [];
  const velZero = new Vector(0,0,0);
  
  let stationaryCentrePoint = new Boid(params.centreOfScene, velZero, scene, -1);     // (pos, vel, scene, id)
      
  //placeFlockOnGround(flock);  
  adjustFlockSize(flock, params.noOfBoids);   // create flock to start
  
  flock[flock.length/2].makeIndependantBoid();  // create lead bird
  
  return ({ context, width, height }) => {
    context.fillStyle = 'beige';
    context.fillRect(0, 0, width, height);
    context.font = `${params.fontSize}px serif`;
    context.textBaseline = 'middle'; // hanging
    context.textAlign = 'left';    
    context.fillStyle = 'black';    
  
    adjustFlockSize(flock, params.noOfBoids);
    
    flock.sort(compareZ);
    
    //stationaryCentrePoint.draw(context);
    
    params.centreOfScene = Boid.averageLoc(flock);
    let avVel = Boid.averageVel(flock);
    
    getNearestXBoidsForFlock(flock); 
    
    flock.forEach( boid => {
       boid.draw(context);
       boid.bounce();
       boid.update();
    });
    
    let [xPos, yPos] = [cubeSize * 0.66, cubeSize - (220 * 0.8)];
    context.fillText(`CoF: ${Math.floor(params.centreOfScene.x)} - ${Math.floor(params.centreOfScene.y)} - ${Math.floor(params.centreOfScene.z)}`,  xPos, yPos);
    context.fillText(`AvV: ${Math.floor(avVel.x)} - ${Math.floor(avVel.y)} - ${Math.floor(avVel.z)}`,  xPos, yPos + 35 * cubeSize/1200);
    //context.fillText(`AvV: ${avVel.x} - ${avVel.y} - ${avVel.z}`,  10, yPos + 35 * cubeSize/1200);
    context.fillText(`Cub: ${Math.floor(cubeSize)} - ${Math.floor(cubeSize)} - ${Math.floor(cubeSize)}`,  xPos, yPos + 70 * cubeSize/1200);    
    
    
  };
};
// SKETCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SKETCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SKETCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



// class Flock - TODO - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let birdsCreated = 0;

function compNum(a, b) {
  if ( a < b ){
    return -1;
  }
  if ( a > b ){
    return 1;
  }
  return 0;
}

function compBoidDistPair(a, b) {
  if ( a.dist < b.dist ){
    return -1;
  }
  if ( a.dist > b.dist ){
    return 1;
  }
  return 0;
}

function placeFlockOnGround(flock) {
  // place 'square' of birds on ground
  const side = Math.ceil(Math.sqrt(params.noOfBoids));
  const numberOfBoids = params.noOfBoids;
  let id = 0;
  
  //cubeSize
  const step = params.boidMaxRad *4;
  const [gndX, gndZ] = [cubeSize/2 - (step * side/2), cubeSize/2 - (step * side/2)];

  for (let x=0; x<side; x++) {        
    for (let z=0; z<side; z++) {
      let placeX = gndX + step * x;
      let placeZ = gndZ + step * z;      
      let pos = new Vector(placeX,cubeSize,placeZ); 
      //let pos = new Vector(placeX,placeZ,cubeSize);
      let vel = new Vector(0,0,0);
      id++;
      stationaryBoid = new Boid(pos, vel, scene, id); // (pos, vel, scene, id)
      flock.push(stationaryBoid);
      cl(`pfog: ${id}`);
      if (id === numberOfBoids) break;
    }
    if (id === numberOfBoids) break;
  }
  
}

function getNearestXBoidsForFlock(flock) {
  flock.forEach( b => {
    b.updateNearest(flock);
  });
}

function adjustFlockSize(flock, numberOfBoids) {
  if (flock.length === numberOfBoids) return;
  while (flock.length < numberOfBoids) {
    addRandomBoidToFlock(flock);
  }
  while (flock.length > numberOfBoids) {
    removeBoidFromFlock(flock);
  }  
}

function addRandomBoidToFlock(flock) {
  let pos = new Vector( random.rangeFloor(1,scene.x), random.rangeFloor(1,scene.y), random.rangeFloor(1,scene.z));
  let vel = new Vector( random.rangeFloor(params.speedLimit *-1,params.speedLimit), random.rangeFloor(params.speedLimit *-1,params.speedLimit), random.rangeFloor(params.speedLimit *-1,params.speedLimit));      
  flock.push(new Boid(pos, vel, scene, birdsCreated));
}

function removeBoidFromFlock(flock) {
  //const removedBoid = flock.pop();
  //if (removedBoid.id === -1) {
  //  flock.unshift(removedBoid);
  //}
  return flock.length;
}
// class Flock - TODO - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// Boid compare helper - TODO how to add to Boid so array.sort uses automatically? Is poss?
function compareZ(boidA, boidB) {
  if ( boidA.pos.z < boidB.pos.z ){
    return -1;
  }
  if ( boidA.pos.z > boidB.pos.z ){
    return 1;
  }
  return 0;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class Boid {
  
  constructor(pos, vel, scene, id){
    this.pos = pos; //new Vector(x,y,z);
    this.vel = vel;   //new Vector(x,y,z);
    this.scene = scene;    
    this.rad = this.radiusFromPos();
    this.id = id;
    this.nearest = [];
    this.lead = false;
    birdsCreated += 1;    // make class var?    
  }
  
  radiusFromPos(){
    return math.mapRange(this.pos.z, 0, this.scene.x, params.boidMinRad, params.boidMaxRad, true);
    //return mapRange(this.pos.z, 0, this.scene.x, params.boidMinRad, params.boidMaxRad, true);
  }
  
  draw(context){    
    context.save();                             // isolate drawing behaviour by saving & restoring context
    
    context.translate(this.pos.x, this.pos.y);  // move the origin / move canvas under plotter pen - see if it helps to think of it like this!?    
    context.lineWidth = 4;    
    context.beginPath();
    context.arc(0,0, this.rad, 0, Math.PI*2);        
    context.strokeStyle = 'black';
    if (params.borderStroke) context.stroke();
    if (this.lead) {
      context.fillStyle = 'yellow';
    }else {
      context.fillStyle = 'red';  
    }
    
    context.fill();
    
    context.restore();
  }
  
  makeIndependantBoid(){
    this.lead = true;
    const shrink = params.leadBoidConfinement;
    this.pos = new Vector( random.rangeFloor(shrink,scene.x-shrink), random.rangeFloor(shrink,scene.y-shrink), random.rangeFloor(shrink,scene.z-shrink));
    params.leadBoidLoc = this.pos;
    params.leadBoid = this;
  }
  
  bounce() {
    if (this.lead) {
      const shrink = params.leadBoidConfinement;
      if (this.pos.x <= shrink || this.pos.x >= this.scene.x - shrink) this.vel.x *= -1;  //{this.vel.x *= -1; this.pos.x += this.vel.x;}
      if (this.pos.y <= shrink || this.pos.y >= this.scene.y - shrink) this.vel.y *= -1;  //{this.vel.y *= -1; this.pos.y += this.vel.y;}
      if (this.pos.z <= shrink || this.pos.z >= this.scene.z - shrink) this.vel.z *= -1;  //{this.vel.z *= -1; this.pos.z += this.vel.z;}    
      
    } else {
      if (this.pos.x <= 0 || this.pos.x >= this.scene.x) this.vel.x *= -1;
      if (this.pos.y <= 0 || this.pos.y >= this.scene.y) this.vel.y *= -1;
      if (this.pos.z <= 0 || this.pos.z >= this.scene.z) this.vel.z *= -1;      
    }    
	}
  
	update() {    
    if (this.lead) {
      this.freeFlight();
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.pos.z += this.vel.z;
      params.leadBoidLoc = this.pos;
      this.rad = this.radiusFromPos();            
    } else {
      this.averageVelocityOfNearestNeighbours()
      //this.ruleOneGravitateToPoint0(params.centreOfScene);      // TODO select w/ tweakpane
      //this.ruleOneGravitateToPoint1(params.centreOfScene);
      this.ruleOneGravitateToPoint1(params.leadBoidLoc);
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.pos.z += this.vel.z;
      this.enforceSafeDist();
      this.rad = this.radiusFromPos();
    }     
	}

  speedLimit(){
    if (params.speedLimitOn) {
      if (this.vel.x > params.speedLimit) this.vel.x = params.speedLimit;
      if (this.vel.y > params.speedLimit) this.vel.y = params.speedLimit;
      if (this.vel.z > params.speedLimit) this.vel.z = params.speedLimit;
    }    
  }
  
  enforceSafeDist(){ // params.minSafeDistance
    let nb = this.nearest[1].boid; // closest boid
    //cl('enforceSafeDist - - S');
    //cl(this.nearest);
    //cl(this.nearest[1]);
    //cl('enforceSafeDist - - E');
    const rx1 = this.pos.x - params.minSafeDistance; 
    const rx2 = this.pos.x + params.minSafeDistance;
    if ((nb.pos.x > rx1) && (nb.pos.x < rx2)) {  // houston we have a problem
      const adjust = this.pos.x - nb.pos.x;
      this.pos.x += adjust;
    }
    
    const ry1 = this.pos.y - params.minSafeDistance; 
    const ry2 = this.pos.y + params.minSafeDistance;
    if ((nb.pos.y > ry1) && (nb.pos.y < ry2)) {  // houston we have a problem
      const adjust = this.pos.y - nb.pos.y;
      this.pos.y += adjust;
    }
    
    const rz1 = this.pos.z - params.minSafeDistance; 
    const rz2 = this.pos.z + params.minSafeDistance;
    if ((nb.pos.z > rz1) && (nb.pos.z < rz2)) {  // houston we have a problem
      const adjust = this.pos.z - nb.pos.z;
      this.pos.z += adjust;
    }    
    
  }

  freeFlight(){
    const dx = random.range(params.freeFlightAmp * -1, params.freeFlightAmp);
    const dy = random.range(params.freeFlightAmp * -1, params.freeFlightAmp);
    const dz = random.range(params.freeFlightAmp * -1, params.freeFlightAmp);
    
    this.vel.x += dx;
    this.vel.y += dy;
    this.vel.z += dz;
    
    this.speedLimit();
  }
  
  updateNearest(flock){
    let max = 0;
    this.nearest = [];
    flock.forEach( b => { 
      let d = this.pos.getDistance(b.pos);
      const pair = {dist: d, boid: b};
      
      if (this.nearest.length < params.nearestNeighbourEffect) { // fill array first
        if (d > max) max = d;
        this.nearest.push(pair);
        this.nearest.sort(compBoidDistPair);
      } else if (d < max) {  // check for max b4 insert & sort
        this.nearest.push(pair);
        this.nearest.sort(compBoidDistPair);
      }
      if (this.nearest.length > params.nearestNeighbourEffect) this.nearest.pop();      
    });
    //cl(this.nearest);
  }
  
  // average velocity of list of boids
  static averageVel (boids) {
    let sum = new Vector(0,0,0);
    boids.forEach( b => {
       sum = sum.plus(b.vel);
    });    
    return sum.div(boids.length);
  }

  // average positions (centre of group) of list of boids  
  static averageLoc (boids) {
    let sum = new Vector(0,0,0);
    boids.forEach( b => {
       sum = sum.plus(b.pos);
    });    
    return sum.div(boids.length);
  }
  
  ruleOneGravitateToPoint0(point){
    const accel = 0.1;
    
    if (point.x - this.pos.x > 0) {
      this.vel.x += accel;
    } else {
      this.vel.x -= accel;
    }
    if (point.y - this.pos.y > 0) {
      this.vel.y += accel;
    } else {
      this.vel.y -= accel;
    }
    if (point.z - this.pos.z > 0) {
      this.vel.z += accel;
    } else {
      this.vel.z -= accel;
    }
    this.speedLimit();
  }
  // point vel vector @ point - maintain magnitude
  ruleOneGravitateToPoint1(point){
    const velMag = this.vel.magnitude();
    const velSquared = velMag * velMag;
    
    // ratios of x^2,y^2,z^2 sum to vel^2 
    
    const dx = point.x - this.pos.x;
		const dy = point.y - this.pos.y;
    const dz = point.z - this.pos.z;
    const sx = Math.sign(dx);
		const sy = Math.sign(dy);
    const sz = Math.sign(dz);
    
    let sumOfSqrs = dx * dx + dy * dy + dz * dz;
    
    const xRat = (dx * dx) / (sumOfSqrs);
    const yRat = (dy * dy) / (sumOfSqrs);
    const zRat = (dz * dz) / (sumOfSqrs);
    
    //vector - magnitude: same as current velocity -
    //         direction: scene centre from this boid
    //this.vel.x = Math.sqrt( velSquared * xRat) * sx;
    //this.vel.y = Math.sqrt( velSquared * yRat) * sy;
    //this.vel.z = Math.sqrt( velSquared * zRat) * sz;
    
    this.vel.x += params.rule1multiplier * Math.sqrt( velSquared * xRat) * sx;
    this.vel.y += params.rule1multiplier * Math.sqrt( velSquared * yRat) * sy;
    this.vel.z += params.rule1multiplier * Math.sqrt( velSquared * zRat) * sz;    
    //cl(`> - - - dx:${dx} - dy:${dy} - dz:${dz}`);
    //cl(`velMag:${velMag} - velSquared:${velSquared} - xRat:${xRat} - yRat:${yRat} - zRat:${zRat}`);
    //cl(this.vel);
    this.speedLimit();
  }  

  averageVelocityOfNearestNeighbours(){
    let sum = new Vector(0,0,0);
    this.nearest.shift(); // chuck first element - will always be this - this is the nearest to this!
    
    this.nearest.forEach( pair => {
      sum = sum.plus(pair.boid.vel);
    });    
    this.vel = sum.div(this.nearest.length);
  }

  
  dbg(){
    console.log(this);    
  }

}

const createpane = () => {
  const pane = new Tweakpane.Pane();  
  let folder;
  
  folder = pane.addFolder({ title: 'Boids '});
  //folder.addInput(params, 'noOfBoids', { min: 10, max: 500, step: 10 });
  folder.addInput(params, 'boidMinRad', { min: 1, max: 100, step: 1 });
  folder.addInput(params, 'boidMaxRad', { min: 1, max: 100, step: 1 }); 
  folder.addInput(params, 'speedLimit', { min: 1, max: 100, step: 1 });
  folder.addInput(params, 'speedLimitOn');
  folder.addInput(params, 'borderStroke');
  
  folder = pane.addFolder({ title: 'Flock '});
  folder.addInput(params, 'rule1multiplier', { min: 0.01, max: 0.2, step: 0.01 });
  //folder.addInput(params, 'flockDensity', { min: 0, max: 1, step: 0.05 });
  folder.addInput(params, 'nearestNeighbourEffect', { min: 2, max: 20, step: 1 });
  folder.addInput(params, 'nNEffect');
  //folder.addInput(params, 'visualRangeEffect', { min: 1, max: 500, step: 5 });
  //folder.addInput(params, 'vREffect');
  folder.addInput(params, 'freeFlightAmp', { min: 0.01, max: 5, step: 0.05 });
  folder.addInput(params, 'minSafeDistance', { min: 0, max: 100, step: 5 });
  // add slider w/ callback
  //folder.addInput(params, 'leadBoidConfinement', { min: 0, max: (cubeSize/2 -50), step: 50 });  
  const lBCinput = pane.addInput(params, 'leadBoidConfinement', { min: 0, max: (cubeSize/2 -50), step: 50 });
  lBCinput.on('change', function(ev) {
    const leadBoid = params.leadBoid;
    const shrink = params.leadBoidConfinement;
    if (leadBoid.pos.x <= shrink) leadBoid.pos.x = shrink + 1;
    if (leadBoid.pos.x >= scene.x - shrink) leadBoid.pos.x = scene.x - shrink -1;
    if (leadBoid.pos.y <= shrink) leadBoid.pos.y = shrink + 1;
    if (leadBoid.pos.y >= scene.y - shrink) leadBoid.pos.y = scene.y - shrink -1;
    if (leadBoid.pos.z <= shrink) leadBoid.pos.z = shrink + 1;
    if (leadBoid.pos.z >= scene.z - shrink) leadBoid.pos.z = scene.z - shrink -1;
  });
}

createpane();
canvasSketch(sketch, settings);

