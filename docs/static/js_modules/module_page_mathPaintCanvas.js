// Ex create a module that implements a page behavior by clicking a button in the navbar

// navbar generic
import {getCurrentPage, setCurrentPage, setUnloadCurrentPageCallback, createHTMLPageContainer} from './navbarMod.js';

// specifics to page
import * as tileModCanvas from './content/u10_fp_math_functions.js';       // relative to this file
var jsSourceFileName = 'u10_fp_math_functions.js';
var jsSource = `static/js_modules/content/${jsSourceFileName}`;  // switch (to canvas once working
var jsContainerId = 'maths_paint_canvas';

var pageTarget;
var pageId = 'mathPaintCanvas_page';
//var htmlSource = 'static/html/mathPaintCanvas.html';
var buttonId = 'b_nav_math_tile_canvas';

// tidy up when another button is pressed
// maybe just hide page
function unload_page(idOfPressedButton) {
  // are we on the same page if so do nothing!
  if (getCurrentPage() === idOfPressedButton) {
    console.log(`unload_${pageId}: SAME PAGE - DO NOTHING`);
    return;
  }
  
  console.log(`butId: ${buttonId} - unloading: stop RAF calls JS: ${jsSource}`);    
  console.log(`run ${jsSourceFileName} resetRAFcallback: - S`);
  
  if (typeof(tileModCanvas.startPageAnimation) === 'function') {
    tileModCanvas.stopAnim();
    console.log(`run ${jsSourceFileName} resetRAFcallback: ${typeof(tileModCanvas.startPageAnimation)} - E`);
  } else {
    console.log(`run ${jsSourceFileName} NOT LOADED! - E`);
  }
  // delete page
  document.getElementById(pageTarget).replaceChildren();
}

function load_page() {
  // are we on the same page if so do nothing!
  if (getCurrentPage() === buttonId) {
    console.log('SAME PAGE - DO NOTHING');
    return;
  } else {
    setCurrentPage(buttonId);
  }
  
  setUnloadCurrentPageCallback(unload_page);
  
  //console.log(`butId: ${buttonId} - loading: ${htmlSource}`);
  //fetch(htmlSource)
  //.then(function(response) {
  //  return response.text();
  //})
  //.then(function(body) {
  //  document.getElementById(pageTarget).innerHTML = body;
  //});
  
  // construct page from JS land - very simple container
  console.log(`pageId: ${pageId} - constructing html`);
  createHTMLPageContainer(pageTarget, pageId, jsContainerId, 'mathTiles');
  
  // fix margin
  document.getElementById(pageId).style.padding = "0px";
  document.getElementById(jsContainerId).style.padding = "0px";
  document.getElementById(pageTarget).style.padding = "0px";
  
  console.log(`pageId: ${pageId} - loading JS: ${jsSource}`);


  if (typeof(tileModCanvas.startPageAnimation) === 'function') {

    console.log(`${jsSourceFileName} ALREADY LOADED! restart animation`);
    tileModCanvas.setKeepAnimRuning();     // must do before starting anim
    tileModCanvas.startPageAnimation(document.getElementById(jsContainerId));

  } else {

    fetch(jsSource)
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {    
      var script = document.createElement("script");
      script.innerHTML = text;
      script.setAttribute("type", "module");
      document.getElementById(jsContainerId).appendChild(script);
      tileModCanvas.startPageAnimation(document.getElementById(jsContainerId));
    });
    
  }   
}

export function getButtonInfo(containers){
  console.log(`registering ${pageId} - to ${containers.main}`);
  
  pageTarget = containers.main;
  
  var buttonInfo = {};

  buttonInfo.callback = load_page;
  buttonInfo.image    = ''; //'static/images/svg/blank.svg'; // or '' < will use text if no image
  buttonInfo.alt      = 'mathPaintCanvas';
  buttonInfo.text     = 'MPC';
  buttonInfo.id       =  buttonId;
  
  return buttonInfo;
}

export default getButtonInfo;
