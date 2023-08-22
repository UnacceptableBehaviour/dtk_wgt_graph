//import { collidingBalls } from './collision_canvas.js';
import { createDtkChart, updateChart, chart_settings } from './dtk_chart.js';

// note on using import - module syntax
// https://bobbyhadz.com/blog/javascript-syntaxerror-cannot-use-import-statement-outside-module

// use .mjs in node?
// https://exerror.com/uncaught-syntaxerror-cannot-use-import-statement-outside-a-module-when-importing-ecmascript-6/


console.log('createDtkChart(); - - - S');
document.addEventListener('DOMContentLoaded', (event) => {
    const divCanv = document.getElementById('weigh-in-chart-canv');
    createDtkChart({width: 400, height: 400, parent: divCanv});
});
console.log('createDtkChart(); - - - E');

  



// So FOUR ways to schedule work:
// - - - - Summary
// f() calls push onto the stack
// setTimeout(callback, timeout) passes callback to eventTable / Web API
//                  - this puts callBack in the msgQ at appropriate time - set by timeout
// requestAnimationFrame(callback) puts callback into start of the rendering steps
//                  - rendering steps: callback, Style Calcs, Layout Tree, Pixel Render
//                  - aka RAF callback
// Event Loop:
// Execute off stack first. (UNTIL EMPTY)
// Pull callbacks from msgQ push to stack
// RAF callback - RenderQ - exec renderQ 60FPS insert between msgQ call back as appropiate
// MicrotasksQ (used for Promises) - Waits until stack empty, then highest priority, keep being serviced until uTaskQ empty!
//
// Event Loop in 3m
// https://www.youtube.com/watch?v=5YcMKYTZZvk
//
// Event Loop - in Depth
// https://www.youtube.com/watch?v=8aGhZQkoFbQ
//
// Node Event Loop
// https://www.youtube.com/watch?v=zphcsoSJMvM
//
// Event Loop Visualized - how requestAnimationFrame fits into the picture, and microTasks 27m30
// https://www.youtube.com/watch?v=cCOL7MC4Pl0

// SUMMARY - FOUR ways to schedule work:
// 1. function call - uses stack
// 2. setTimeout(callback, timeout) - puts callback on msgQ
// 3. RAF call back - this._raf = window.requestAnimationFrame(this._animateHandler) - exec callback before rendering
// 4. uTaskQ - add syntax for scheduling callback

// pre import / require
// Revealing Module Pattern (IIFE) (pre import / require)
var revealingModule = (function () {
    var privateVar = "Ben Thomas";
    function setNameFn( strName ) {
        privateVar = strName;
    }
    function getNameFn() {
        return privateVar;
    }
    return {
        setName: setNameFn,
        getName: getNameFn,
    };
})(); //  (IIFE) immediately invoked function expression

console.log(revealingModule.getName());
revealingModule.setName( "Paul Adams" );
console.log(revealingModule.getName());

