import { createDtkChart, createDtkChartWithControls } from './dtk_chart.js';
import { dtkChartData } from './dtk_data_process.js';

// note on using import - module syntax
// https://bobbyhadz.com/blog/javascript-syntaxerror-cannot-use-import-statement-outside-module

// use .mjs in node?
// https://exerror.com/uncaught-syntaxerror-cannot-use-import-statement-outside-a-module-when-importing-ecmascript-6/

var dtkChart1;
var dtkClip;
var dtkCh20;
var dtkCwgt;


document.addEventListener('DOMContentLoaded', (e) => {
    const divCanv1 = document.getElementById('chartname-dtk-chart-canv');
    // {selectedDataSources: ['dtk_weight', 'dtk_pc_fat', 'dtk_pc_h2o']}
    dtkChart1 = createDtkChart({width: 400, height: 400, parent: divCanv1}, {selectedDataSources: ['dtk_pc_fat', 'dtk_pc_h2o']});
});


document.addEventListener('DOMContentLoaded', (e) => {    
    dtkClip = createDtkChartWithControls("wic-lip", "weigh-in-chart", {selectedDataSources: ['dtk_pc_fat']});
});

document.addEventListener('DOMContentLoaded', (e) => {    
    dtkCh20 = createDtkChartWithControls("wic-h2o", "weigh-in-chart", {selectedDataSources: ['dtk_pc_h2o']});
});

document.addEventListener('DOMContentLoaded', (e) => {    
    dtkCwgt = createDtkChartWithControls("wic-wgt", "weigh-in-chart", {selectedDataSources: ['dtk_weight']});
});

document.addEventListener('DOMContentLoaded', (e) => {    
    const dtkCw = createDtkChartWithControls("wic-tur", "weigh-in-chart", {selectedDataSources: ['dtk_weight','dtk_pc_h2o']});
});


var periodWindowButtons = document.getElementById('chartname-btn-period-window');
periodWindowButtons.addEventListener('click', (e) => {
    console.log(`periodWindowButtons: ${e.target.id}`);
    console.log(e.target.value);
    console.log(e);
    if (e.target.id.includes('but-win-set')){
        if (dtkChart1.chartSettings.chartWidthDays != e.target.value){ // no repaint unless needed
            dtkChart1.chartSettings.chartWidthDays = e.target.value;        
            console.log(`chSetgs.chartWidthDays: ${dtkChart1.chartSettings.chartWidthDays}`);
            dtkChart1.update(); 
        }
    }
    if (e.target.id === 'chartname-but-win-mov-fwd'){
        console.log(`chSetgs.endIndex: ${dtkChart1.chartSettings.endIndex} + dtkChart1.chartSettings.chartWidthDays:${dtkChart1.chartSettings.chartWidthDays}`);
        dtkChart1.chartSettings.endIndex = parseInt(dtkChart1.chartSettings.endIndex) + parseInt(dtkChart1.chartSettings.chartWidthDays);
        console.log(`chSetgs.endIndex AFTER ADD: ${dtkChart1.chartSettings.endIndex}`);
        
        if (dtkChart1.chartSettings.endIndex > dtkChartData.length){
            dtkChart1.chartSettings.endIndex = dtkChartData.length;
            dtkChart1.chartSettings.startIndex = dtkChart1.chartSettings.endIndex - dtkChart1.chartSettings.chartWidthDays;
        }            
        
        console.log(`chSetgs.endIndex: ${dtkChart1.chartSettings.endIndex}`);
        dtkChart1.update(); 
    }
    if (e.target.id === 'chartname-but-win-mov-bak'){        
        console.log(`chSetgs.endIndex: ${dtkChart1.chartSettings.endIndex} + dtkChart1.chartSettings.chartWidthDays:${dtkChart1.chartSettings.chartWidthDays}`);
        dtkChart1.chartSettings.endIndex = parseInt(dtkChart1.chartSettings.endIndex) - parseInt(dtkChart1.chartSettings.chartWidthDays);
        console.log(`chSetgs.endIndex AFTER SUB: ${dtkChart1.chartSettings.endIndex}`);

        if (parseInt(dtkChart1.chartSettings.startIndex) < 0 ){
            dtkChart1.chartSettings.startIndex = 0;
            dtkChart1.chartSettings.endIndex = dtkChart1.chartSettings.chartWidthDays;
        }

        console.log(`chSetgs.endIndex: ${dtkChart1.chartSettings.endIndex}`);
        dtkChart1.update();
    }

});


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

