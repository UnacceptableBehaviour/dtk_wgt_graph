// Ex create a module that implements a page behavior by clicking a button in the navbar

// **
// Compare to ** module_page_mathPaint.js ** to see changes required for a new module
// **

// navbar generic
import {getCurrentPage, setCurrentPage, setUnloadCurrentPageCallback, createHTMLPageContainer} from './navbarMod.js';

// specifics to page
import * as blankMod from './content/blankMod.js';       // relative to this file
var jsSource = 'static/js_modules/content/blankMod.js';
var jsContainerId = 'blankMod_js';

var pageTarget;
var pageId = 'blankMod_page';
//var htmlSource = 'static/html/blankMod.html';
var buttonId = 'b_nav_blankMod';

// tidy up when another button is pressed
// maybe just hide page
function unload_page(idOfPressedButton) {
  // are we on the same page if so do nothing!
  if (getCurrentPage() === idOfPressedButton) {
    console.log(`unload_${pageId}: SAME PAGE - DO NOTHING`);
    return;
  }
  
  console.log(`module_page_blankMod.js: ${buttonId} - unloading: stop RAF calls JS: ${jsSource}`);      
  console.log('run blankMod.js resetRAFcallback: - S');
  
  if (typeof(blankMod.startPageAnimation) === 'function') {
    blankMod.stopAnim();
    console.log(`run blankMod.js resetRAFcallback: ${typeof(blankMod.startPageAnimation)} - E`);
  } else {
    console.log('run blankMod.js NOT LOADED! - E');
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
  
  //console.log(`module_page_blankMod.js: ${buttonId} - loading: ${htmlSource}`);
  //fetch(htmlSource)
  //.then(function(response) {
  //  return response.text();
  //})
  //.then(function(body) {
  //  document.getElementById(pageTarget).innerHTML = body;
  //});
  
  // construct page from JS land - very simple container
  console.log(`module_page_blankMod.js: ${pageId} - constructing html`);
  createHTMLPageContainer(pageTarget, pageId, jsContainerId, 'mathTiles');
  
  // fix margin
  document.getElementById(pageId).style.padding = "0px";
  document.getElementById(jsContainerId).style.padding = "0px";
  document.getElementById(pageTarget).style.padding = "0px";
  
  console.log(`module_page_blankMod.js: ${pageId} - loading JS: ${jsSource}`);


  if (typeof(blankMod.startPageAnimation) === 'function') {

    console.log('blankMod.js ALREADY LOADED! restart animation');
    blankMod.setKeepAnimRuning();     // must do before starting anim
    blankMod.startPageAnimation(document.getElementById(jsContainerId));

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
      blankMod.startPageAnimation(document.getElementById(jsContainerId));
    });
    
  }   
}

export function getButtonInfo(containers){
  console.log(`module_page_blankMod.js: registering ${pageId} - to ${containers.main}`);
  
  pageTarget = containers.main;
  
  var buttonInfo = {};

  buttonInfo.callback = load_page;
  buttonInfo.image    = ''; //'static/images/svg/blank.svg'; // or '' < will use text if no image
  buttonInfo.alt      = 'blankMod';
  buttonInfo.text     = 'BM';
  buttonInfo.id       =  buttonId;
  
  return buttonInfo;
}

export default getButtonInfo;
