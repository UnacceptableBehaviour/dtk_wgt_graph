// use in conjunction with module_page_blankMod.js
// helpers
const cl = (str) => {
  console.log(str);
};


// paint metrics
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
}
















const runAnimation = animation => {
  let lastTime = null;
  const frame = time => {
    if (lastTime !== null) {
      const timeStep = Math.min(100, time - lastTime) / 1000;

      // return false from animation to stop
      if (animation(timeStep) === false) {
        return;
      }
    }
    lastTime = time;
    requestAnimationFrame(frame);     // re-insert frame callback in animation Q
  };
  requestAnimationFrame(frame);       // start animation
};

//const random = (max = 9, min = 0) => {
//  return Math.floor(Math.random() * (max - min + 1) + min);
//};

var animModuleKeepRunningAnimation = true;
var tweakPaneContainerElement;

export const setKeepAnimRuning = () => {
  animModuleKeepRunningAnimation = true;
};
export const stopAnim = () => {
  animModuleKeepRunningAnimation = false;
  //tweakPaneContainerElement.remove()
};


// main - entry point - initialise & build page
export const startPageAnimation = (targetContainer) => {
  // const display = new Canvas(targetContainer);
  // const [width, height] = display.getCanvasWH();
  // createpane();  
  // tweakPaneContainerElement = document.querySelector("body > div.tp-dfwv");
  // let nabarElementHeight = document.querySelector("#pwa_navbar").offsetHeight;
  // let viewportHeight = window.innerHeight;
  // let viewportWidth = window.innerWidth;
  // let tpElementHeight = tweakPaneContainerElement.offsetHeight;
  // tweakPaneContainerElement.style.top = `${viewportHeight - tpElementHeight - nabarElementHeight}px`;
  // //
  // //
  // // - - - - -
  // // setup code here
  
  // fabric = new FabricState(params.fabricWidth, params.fabricHeight, params.cellSizeXY);
  
  // fabric.injectParticles();
  
  // // - - - - -
  // //
  // //  
  
  
  // cl('setTimeout(resetWatermarks)')
  // setTimeout(resetMetrics, 5000);  
  
  // runAnimation(time => {
  //   rafStartTime = performance.now();                                           //
  //   // metrics - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//
  //   let context = display.getContext();

  //   //
  //   //
  //   // - - - - -    
  //   // animation code here
  //   fabric.draw(context);
    
  //   // run cycle 
  //   fabric.diffusionCycle();
    
  //   // - - - - -
  //   //
  //   //

  //   //let context = display.getContext();
  //   //context.fillStyle = 'beige';
  //   //context.fillRect(0, 0, width, height);    
  //   //for (let t = 0; t < mathTiles.length; t++) {
  //   ////for (let t = 0; t < 4; t++) {
  //   //  mathTiles[t].draw(context);
  //   //  mathTiles[t].update();
  //   //}
    
  //   // metrics - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//
  //   rafFinishTime = performance.now();                                          //
  //   rafCount++;                                                                 //
  //   rafFrameTime = rafFinishTime - rafStartTime;                                //
  //   rafTotalTime += rafFrameTime;                                               //
  //   rafAveFrameTime = rafTotalTime / rafCount;                                  //
  //   if (rafFrameTime < rafLowWatermark) rafLowWatermark = rafFrameTime;         //
  //   if (rafFrameTime > rafHighWatermark) rafHighWatermark = rafFrameTime;       //
  //   let idx = Math.floor(rafFrameTime);                                         //
  //   if (rafBuckets[idx] === undefined)                                          //
  //     rafBuckets[idx] = 1;                                                      //
  //   else{                                                                       //
  //     rafBuckets[idx]++;                                                        //
  //   }                                                                           //
  //   if (rafCount % 60 === 0) {                                                  //
  //     cl(performance.now());                                                    //
  //     cl(`This frame:    ${rafFrameTime}`);                                     //
  //     cl(`Average frame: ${rafAveFrameTime}`);                                  //
  //     cl(`Low tide:      ${rafLowWatermark}`);                                  //
  //     cl(`High tide:     ${rafHighWatermark}`);                                 //
  //     cl(`rafCount:      ${rafCount}`);                                         //
  //     cl(`totalTime:     ${performance.now() - rafTotalTimeStart}`);            //
  //     cl('rafBuckets');                                                         //
  //     cl(rafBuckets);                                                           //
  //   }
    
  //   return animModuleKeepRunningAnimation;
  // });
};