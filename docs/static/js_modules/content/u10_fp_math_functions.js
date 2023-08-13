//const canvasSketch = require('canvas-sketch');
//const random = require('canvas-sketch-util/random');
//const math = require('canvas-sketch-util/math');
//const Tweakpane = require('tweakpane');

// helpers
const cl = (str) => {
  console.log(str);
};

cl('u10_fp_math_functions.js: LOADING - - - S');

// paint metrics
var paintMetricsEnabled = false;
var rafCount = 0;
var rafStartTime = 0;
var rafFinishTime = 0;
var rafFrameTime = 0;
var rafTotalTimeStart = 0;
var rafTotalTime = 0;
var rafHighWatermark = 0;
var rafLowWatermark = 10000;
var rafAveFrameTime = 0;
var rafBuckets = [];

// initial interpret & compile steps skew rafHighWatermark
// reset after initial conditions settle down
function resetWatermarks() { 
  cl('Watermarks - RESET');
  rafHighWatermark = 0;
  rafLowWatermark = 10000;
}
function resetMetrics() { 
  cl('Metrics - RESET');
  rafCount = 0;
  rafStartTime = 0;
  rafFinishTime = 0;
  rafFrameTime = 0;
  rafTotalTimeStart = performance.now();  
  rafTotalTime = 0;
  rafHighWatermark = 0;
  rafLowWatermark = 10000;
  rafAveFrameTime = 0;
  rafBuckets = [];
  rafEvents = 0;
}

// TODO - equations loop at #12 tan(x) is a repeat of #0
// MAKE ALL UNIQUE
const EQU_COLOR = 0;
const EQU_TITLE = 1;
const EQU_EQUATION = 2;
//              color     title                            anonymous maths function taking radians
var equA = [
            [ '#F4EC00', 'tan(x)',                        (rad) => { return Math.tan(rad); } ],
            [ '#99650D', 'sin(x)',                        (rad) => { return Math.sin(rad); } ],
            [ '#E89E00', 'cos(x)',                        (rad) => { return Math.cos(rad); } ],            
            [ '#5E2100', 'sin(sin(x)^8)',                 (rad) => { return Math.sin(Math.pow(8, Math.sin(rad))); } ],
            [ '#600000', '(sqrt(x)/x + sqrt(x)/2) / 5',   (rad) => { return (Math.sqrt(rad)/rad + Math.sqrt(rad)/2) /5; } ],
            [ '#630E32', 'floor((sin(rad) * 5) +1) / 5))',(rad) => { return (Math.floor((Math.sin(rad) * 5) +1) /5); } ],
            [ '#840919', 'sin(rad) + cos(rad)/4',         (rad) => { return Math.sin(rad) + Math.cos(rad*4)/4; } ],
            [ '#AA842A', 'sin(x*10)',                     (rad) => { return Math.sin(rad*10); } ],
            [ '#C17700', 'sin(x)+cos(rad*10)/4',          (rad) => { return Math.sin(rad)+Math.cos(rad*10)/4; } ],
            [ '#F4C300', 'sec(x)',                        (rad) => { return (1 / Math.cos(rad)) /20; } ],
            [ '#93832F', 'cos(sin(x)^4)',                 (rad) => { return Math.cos(Math.pow(4, Math.sin(rad))); } ],
            [ '#3D2409', 'f(x)',                          (rad) => { return (Math.sqrt(rad)/rad + Math.sqrt(rad)/2) /3 + (Math.sin(rad*10)/4); }  ],
            [ '#F4EC00', 'tan(x)',                        (rad) => { return Math.tan(rad); } ],
            [ '#99650D', 'sin(x)',                        (rad) => { return Math.sin(rad); } ],
            [ '#E89E00', 'cos(x)',                        (rad) => { return Math.cos(rad); } ],            
            [ '#5E2100', 'sin(sin(x)^8)',                 (rad) => { return Math.sin(Math.pow(8, Math.sin(rad))); } ],
            [ '#600000', '(sqrt(x)/x + sqrt(x)/2) / 5',   (rad) => { return (Math.sqrt(rad)/rad + Math.sqrt(rad)/2) /5; } ],
            [ '#630E32', 'floor((sin(rad) * 5) +1) / 5))',(rad) => { return (Math.floor((Math.sin(rad) * 5) +1) /5); } ],
            [ '#840919', 'sin(rad) + cos(rad)/4',         (rad) => { return Math.sin(rad) + Math.cos(rad*4)/4; } ],
            [ '#AA842A', 'sin(x*10)',                     (rad) => { return Math.sin(rad*10); } ],
            [ '#C17700', 'sin(x)+cos(rad*10)/4',          (rad) => { return Math.sin(rad)+Math.cos(rad*10)/4; } ],
            [ '#F4C300', 'sec(x)',                        (rad) => { return (1 / Math.cos(rad)) /20; } ],
            [ '#93832F', 'cos(sin(x)^4)',                 (rad) => { return Math.cos(Math.pow(4, Math.sin(rad))); } ],
            [ '#3D2409', 'f(x)',                          (rad) => { return (Math.sqrt(rad)/rad + Math.sqrt(rad)/2) /3 + (Math.sin(rad*10)/4); }  ],
            [ '#F4EC00', 'tan(x)',                        (rad) => { return Math.tan(rad); } ],
            [ '#99650D', 'sin(x)',                        (rad) => { return Math.sin(rad); } ],
            [ '#E89E00', 'cos(x)',                        (rad) => { return Math.cos(rad); } ],            
            [ '#5E2100', 'sin(sin(x)^8)',                 (rad) => { return Math.sin(Math.pow(8, Math.sin(rad))); } ],
            [ '#600000', '(sqrt(x)/x + sqrt(x)/2) / 5',   (rad) => { return (Math.sqrt(rad)/rad + Math.sqrt(rad)/2) /5; } ],
            [ '#630E32', 'floor((sin(rad) * 5) +1) / 5))',(rad) => { return (Math.floor((Math.sin(rad) * 5) +1) /5); } ],
            [ '#840919', 'sin(rad) + cos(rad)/4',         (rad) => { return Math.sin(rad) + Math.cos(rad*4)/4; } ],
            [ '#AA842A', 'sin(x*10)',                     (rad) => { return Math.sin(rad*10); } ],
            [ '#C17700', 'sin(x)+cos(rad*10)/4',          (rad) => { return Math.sin(rad)+Math.cos(rad*10)/4; } ],
            [ '#F4C300', 'sec(x)',                        (rad) => { return (1 / Math.cos(rad)) /20; } ],
            [ '#93832F', 'cos(sin(x)^4)',                 (rad) => { return Math.cos(Math.pow(4, Math.sin(rad))); } ],
            [ '#3D2409', 'f(x)',                          (rad) => { return (Math.sqrt(rad)/rad + Math.sqrt(rad)/2) /3 + (Math.sin(rad*10)/4); }  ],
            [ '#F4EC00', 'tan(x)',                        (rad) => { return Math.tan(rad); } ],
            [ '#99650D', 'sin(x)',                        (rad) => { return Math.sin(rad); } ],
            [ '#E89E00', 'cos(x)',                        (rad) => { return Math.cos(rad); } ],            
            [ '#5E2100', 'sin(sin(x)^8)',                 (rad) => { return Math.sin(Math.pow(8, Math.sin(rad))); } ],
            [ '#600000', '(sqrt(x)/x + sqrt(x)/2) / 5',   (rad) => { return (Math.sqrt(rad)/rad + Math.sqrt(rad)/2) /5; } ],
            [ '#630E32', 'floor((sin(rad) * 5) +1) / 5))',(rad) => { return (Math.floor((Math.sin(rad) * 5) +1) /5); } ],
            [ '#840919', 'sin(rad) + cos(rad)/4',         (rad) => { return Math.sin(rad) + Math.cos(rad*4)/4; } ],
            [ '#AA842A', 'sin(x*10)',                     (rad) => { return Math.sin(rad*10); } ],
            [ '#C17700', 'sin(x)+cos(rad*10)/4',          (rad) => { return Math.sin(rad)+Math.cos(rad*10)/4; } ],
            [ '#F4C300', 'sec(x)',                        (rad) => { return (1 / Math.cos(rad)) /20; } ],
            [ '#93832F', 'cos(sin(x)^4)',                 (rad) => { return Math.cos(Math.pow(4, Math.sin(rad))); } ],
            [ '#3D2409', 'f(x)',                          (rad) => { return (Math.sqrt(rad)/rad + Math.sqrt(rad)/2) /3 + (Math.sin(rad*10)/4); }  ],
            ];

function getOptTileLayoutInfo(canvWidth, canvHeight, noOfXTiles, noOfYTiles, minSpace, fontSize=20) {
  // tiles should have a space between them and
  // enough space to write the equation below them  
  let yCombinedSpace = minSpace + fontSize *1.5;
  let maxW = ( canvWidth - ( minSpace * (noOfXTiles -1) ) ) / noOfXTiles;
  let maxH = ( canvHeight - ( yCombinedSpace * noOfYTiles )) / noOfYTiles;   // all tiles have a title
  let size = Math.floor(Math.min(maxW,maxH));
  
  let spaceX = Math.floor((canvWidth - size*noOfXTiles) / noOfXTiles);
  let spaceY = Math.floor((canvHeight - size*noOfYTiles) / noOfYTiles);
  return [size, spaceX, spaceY];
}

const settings = {
  //dimensions: [ 1600, 1024 ],
  //dimensions: [ 1024, 1024 ],
  dimensions: [ 1280, 1024 ],
  //dimensions: [ 2000, 1224 ],
  animate: true
};
//const xTiles = 8;
//const yTiles = 6;
const xTiles = 4;
const yTiles = 3;
//const xTiles = 3;
//const yTiles = 2;

const minSpacerSize = 10;

const sketch = ({ context, width, height }) => {  
  
  const mathTiles = [];  
  const [size, spaceX, spaceY] = getOptTileLayoutInfo(width, height, xTiles, yTiles, minSpacerSize);

  let cnt = 0;
  for (let rectX = 0; rectX < xTiles; rectX++) {
    for (let rectY = 0; rectY < yTiles; rectY++) {
      if ((paintMetricsEnabled) && ((rectX === xTiles -1) && (rectY === yTiles -1))) { // put histo in last square
        mathTiles.push( new RafHistogram(rectX * (size + spaceX) + (spaceX/2),   // centre w/ + (spaceX/2) offset
                                      rectY * (size + spaceY),
                                      size,
                                      equA[cnt][EQU_EQUATION],
                                      equA[cnt][EQU_TITLE],
                                      equA[cnt][EQU_COLOR])
                       );
      } else {
        mathTiles.push( new MathsTile(rectX * (size + spaceX) + (spaceX/2),   // centre w/ + (spaceX/2) offset
                                      rectY * (size + spaceY),
                                      size,
                                      equA[cnt][EQU_EQUATION],
                                      equA[cnt][EQU_TITLE],
                                      equA[cnt][EQU_COLOR])
                       );
        
      }
      cnt++;        
      cl(`pX:${rectX * (size + spaceX)}, pY:${rectY * (size + spaceY)}, size:${size}, spcX-Y:${spaceX}-${spaceY}`);
    }
  }
  
  if (paintMetricsEnabled) {
    cl('setTimeout(resetWatermarks)');
    setTimeout(resetMetrics, 5000);
  } else {
    cl('* * * paintMetrics DISABLED * * *');
  }
  
  return ({ context, width, height }) => {
    if (paintMetricsEnabled) rafStartTime = performance.now();                  //
    // metrics - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//
    
    context.fillStyle = 'beige';
    context.fillRect(0, 0, width, height);
    
    for (let t = 0; t < mathTiles.length; t++) {
    //for (let t = 0; t < 6; t++) {
      mathTiles[t].draw(context);
      mathTiles[t].update();
    }
  
    // metrics - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//
    if (paintMetricsEnabled) {                                                  //
      rafFinishTime = performance.now();                                        //
      rafCount++;                                                               //
      rafFrameTime = rafFinishTime - rafStartTime;                              //
      rafTotalTime += rafFrameTime;                                             //
      rafAveFrameTime = rafTotalTime / rafCount;                                //
      if (rafFrameTime < rafLowWatermark) rafLowWatermark = rafFrameTime;       //
      if (rafFrameTime > rafHighWatermark) rafHighWatermark = rafFrameTime;     //
      let idx = Math.floor(rafFrameTime);                                       //
      if (rafBuckets[idx] === undefined)                                        //
        rafBuckets[idx] = 1;                                                    //
      else{                                                                     //
        rafBuckets[idx]++;                                                      //
      }                                                                         //
      if (rafCount % 60 === 0) {                                                //
        cl(performance.now());                                                  //
        cl(`This frame:    ${rafFrameTime}`);                                   //
        cl(`Average frame: ${rafAveFrameTime}`);                                //
        cl(`Low tide:      ${rafLowWatermark}`);                                //
        cl(`High tide:     ${rafHighWatermark}`);                               //
        cl(`rafCount:      ${rafCount}`);                                       //
        cl(`totalTime:     ${performance.now() - rafTotalTimeStart}`);          //
        cl('rafBuckets');                                                       //
        cl(rafBuckets);                                                         //
      }      
    }
  };
};

// TODO - break MathTile into Tile and MathsTile extends Tile
// RafHistogram extends Tile - remove equation refs
class MathsTile {
  constructor(x, y, size, equationCallback, title, color ){
    this.x = x;
    this.y = y;
    this.w = size;
    this.h = size;
    
    this.radialColor = color;
    this.equC = equationCallback;       // use -1 to 1 or rads?
    
    this.title = title;
    this.fontSz = 20;

    this.amp = size / 3;                // waveform amplitude
    this.waveDotWidth = 2;
    this.offset = 0;                    // plot start point - increased to creat animation
    this.ballScale = 1.3;               // compared to waveform amplitude
    
    // component switches / debug
    this.markers = false;
    this.textEdgeMarkers = false;
    this.border = true;
    this.titleOn = true;

    this.yValues = [];                  // calculate the plot values once!
    for (let step = 0; step < this.w; step++) {
      let rads = (step / this.w) * Math.PI*2;
      let y = this.amp * this.equC(rads);      
      this.yValues.push(y);
    }
    
  }
  
  draw(context){
    // isolate drawing behaviour by saving & restoring context
    context.save();
    
    let fontSize = (this.h/10).toString();
    context.font = `${fontSize}px Arial`;    // was serif
    
    //context.translate(this.x, this.y);  
    context.lineWidth = 2;    
    
    let clipRegion = new Path2D();
    clipRegion.rect(this.x,this.y, this.w,this.h); // x,y,w,h
    context.clip(clipRegion,"nonzero");
    
    // circle    
    context.beginPath();
    let ballRadius = Math.abs(this.yValues[this.offset]) * this.ballScale;
    context.arc(this.x + this.w/2, this.y + this.h/2, ballRadius, 0, Math.PI*2);    
    context.fillStyle = this.radialColor;
    context.fill();

    let index = this.offset;
    let nextPoint = index + 1;
    if (nextPoint >= this.w) nextPoint = 0;
    
    for (let step = 0; step < this.w; step++) {
    //for (let step = 0; step < 5 ; step++) {
      // draw a dot per step
      context.beginPath();
      context.fillStyle = 'grey';
      context.lineWidth = 2;
      context.moveTo(this.x + step, this.y + this.h/2 + this.yValues[index]);
      context.lineTo(this.x + step + 1, this.y + this.h/2 + this.yValues[nextPoint]); 
      context.stroke();
      
      index++;
      nextPoint = index + 1;
      if (index >= this.w) index = 0;                    
      if (nextPoint >= this.w) nextPoint = 0;
    }
    context.restore();  // clear clipping region
    
    context.save();
    if (this.border) {
      // border - guideline for now
      context.beginPath();
      context.rect(this.x,this.y, this.w,this.h);
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.stroke();
    }
    if (this.titleOn) {      
      //placeCentreText(context, text, xl, xr, y, color, fontSize, lnW = 2)
      // left parameter in so can pull it out as a function later
      this.placeCentreText(context, this.title, this.x, this.x + this.w, this.y + this.h, 'black', this.fontSz);
    }
    if (this.markers) {
      // show rect place
      context.beginPath();
      context.fillStyle = 'cyan';
      context.arc(this.x, this.y, 10, 0, 2*Math.PI);
      context.fill();
      
      // show translate place
      context.beginPath();
      context.fillStyle = 'orange';
      context.arc(this.x + this.w/2, this.y + this.h/2, 10, 0, Math.PI*2);
      context.fill();

      // show origin
      context.translate(0, 0);     
      context.beginPath();
      context.fillStyle = 'blue';
      context.arc(0, 0, 5, 0, 2*Math.PI);
      context.fill();       
    }    
    context.restore();
  }
    
  
  update() {
    this.offset++;
    if (this.offset >= this.w) this.offset = 0;
  }
  
  dbg(){
    console.log(this);    
  }
  makersOnOff(tf){
    this.markers = tf && true;
  }
  borderOnOff(tf){
    this.border = tf && true;
  }
  
  placeCentreText(context, text, xl, xr, y, color, fontSize, lnW = 2) {    
    //   |                                 |      < fontSize(epth)
    //   xl             texts              xr
    //                    |
    //                    ^ markMidddle
    context.save();
    
    // font def
    context.font = `${fontSize}px Arial`;
    context.textBaseline = 'middle'; // hanging
    context.textAlign = 'center';
      
    let markMiddle = xl + (xr - xl) / 2;
    let textMetrics = context.measureText(text);
    let textStart = markMiddle;
    
    if (this.textEdgeMarkers) {
      // place left vert line
      context.beginPath();
      context.lineWidth = lnW;
      context.strokeStyle = color;
      context.moveTo(xl, y);
      context.lineTo(xl, y+fontSize);  // line depth - marker depth
      context.stroke(); 
    
      // place right vert line
      context.beginPath();
      context.lineWidth = lnW;
      context.strokeStyle = color;
      context.moveTo(xr, y);
      context.lineTo(xr, y+fontSize);  // line depth - marker depth
      context.stroke();
    }
  
    // place text between if it fits below if not
    context.fillStyle = color;
    context.fillText(text, textStart, y+fontSize);
    context.restore();
  }  
}

// TODO - break MathTile into Tile and MathsTile extends Tile
// RafHistogram extends Tile - remove equation refs
class RafHistogram extends MathsTile{
  constructor(x, y, size, equationCallback, title, color ){
    super(x, y, size, equationCallback, title, color);
  }
  
  draw(context){
      context.beginPath();
      context.rect(this.x,this.y, this.w,this.h);
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.stroke();
      context.strokeStyle = 'CornflowerBlue';
      
      let barW = this.w/rafBuckets.length;
      //let max = Math.max(...rafBuckets) ?? 1;   // return NaN if any element is not a number IE undefined!
      
      // we know the shape of this data - the peak is early in the array and happens once! < INCORRECT
      //let max = Math.max(rafBuckets.filter(element => typeof element === 'number'));
      let max = 1;
      let maxAt = 1;
      for (let i=0; i<rafBuckets.length; i++) {
        if (max < rafBuckets[i]) { max = rafBuckets[i]; maxAt = i; }
      }      
      
      let unitH = this.h / max;
      context.fillStyle = 'CornflowerBlue';
      
      for (let col = 0; col < rafBuckets.length; col++) {
        let val = rafBuckets[col] ?? 0;
        //cl(`x:${this.x + col*barW} - y:${this.y + this.h - val*unitH} w:${barW} h:${val*unitH}`);
        //cl(`t.y:${this.y} t.h:${this.h} val:${val} max:${max} uH: ${unitH} h:${val*unitH}`);
        context.fillRect(this.x + col*barW, this.y + this.h - val*unitH, barW, val*unitH);
      }
      
      this.placeChartText(context, 'green');
  }
  
  placeChartText(context, color) {    
    // place text left justified right half
    context.save();
    let text = [  'raf paint / ms ',
                  ' ',
                  `H: ${rafHighWatermark.toFixed(2)} `,
                  //' ',
                  `Av: ${rafAveFrameTime.toFixed(2)} `,
                  //' ',
                  `L: ${rafLowWatermark.toFixed(2)} `,
                ];

    let rows = text.length;
    let fontSize = Math.floor(this.h / (rows * 2));
    let padding = fontSize / 4;
    let rowHeight = fontSize + padding;
    let textStart = Math.floor(this.x + (this.w / 2));    
    let rowZero = Math.floor(this.y + ((this.h - (rowHeight * rows)) / 2));
    let maxWidth = this.w / 2;
                
    // font def
    context.font = `${fontSize}px Arial`;
    context.textBaseline = 'middle'; // hanging
    context.textAlign = 'left';
            
    // place text between if it fits below if not
    context.fillStyle = color;
    for (let r=0; r<rows; r++) {
      context.fillText(text[r], textStart, rowZero + rowHeight * r, maxWidth);
    }
    context.restore();

  } 
  
}

//createpane();    
canvasSketch(sketch, settings);

cl('u10_fp_math_functions.js: LOADING - - - E');
