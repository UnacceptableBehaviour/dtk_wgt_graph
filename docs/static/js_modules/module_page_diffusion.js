// Ex create a module that implements a page behavior by clicking a button in the navbar

// navbar generic
import {getCurrentPage, setCurrentPage, setUnloadCurrentPageCallback, createHTMLPageContainer} from './navbarMod.js';

// specifics to page
import * as diffusionModule from './content/u7_fp_diffusion_port.js';       // relative to this file
var jsSource = 'static/js_modules/content/u7_fp_diffusion_port.js';
var jsContainerId = 'diffusion_id';

var pageTarget;
var pageId = 'diffusion_page';
//var htmlSource = 'static/html/diffusion.html';
var buttonId = 'b_nav_diffusion';

// tidy up when another button is pressed
// maybe just hide page
function unload_page(idOfPressedButton) {
  // are we on the same page if so do nothing!
  if (getCurrentPage() === idOfPressedButton) {
    console.log(`unload_${pageId}: SAME PAGE - DO NOTHING`);
    return;
  }
  
  console.log(`module_page_diffusion.js: ${buttonId} - unloading: stop RAF calls JS: ${jsSource}`);    
  console.log('run u7_fp_diffusion_port.js resetRAFcallback: - S');
  
  if (typeof(diffusionModule.startPageAnimation) === 'function') {
    diffusionModule.stopAnim();
    console.log(`run u7_fp_diffusion_port.js resetRAFcallback: ${typeof(diffusionModule.startPageAnimation)} - E`);
  } else {
    console.log('run u7_fp_diffusion_port.js NOT LOADED! - E');
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
  
  //console.log(`module_page_diffusion.js: ${buttonId} - loading: ${htmlSource}`);
  //fetch(htmlSource)
  //.then(function(response) {
  //  return response.text();
  //})
  //.then(function(body) {
  //  document.getElementById(pageTarget).innerHTML = body;
  //});
  
  // construct page from JS land - very simple container
  console.log(`module_page_diffusion.js: ${pageId} - constructing html`);
  createHTMLPageContainer(pageTarget, pageId, jsContainerId, 'mathTiles');
  
  // fix margin
  document.getElementById(pageId).style.padding = "0px";
  document.getElementById(jsContainerId).style.padding = "0px";
  document.getElementById(pageTarget).style.padding = "0px";
  
  console.log(`module_page_diffusion.js: ${pageId} - loading JS: ${jsSource}`);


  if (typeof(diffusionModule.startPageAnimation) === 'function') {

    console.log('u7_fp_diffusion_port.js ALREADY LOADED! restart animation');
    diffusionModule.setKeepAnimRuning();     // must do before starting anim
    diffusionModule.startPageAnimation(document.getElementById(jsContainerId));

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
      diffusionModule.startPageAnimation(document.getElementById(jsContainerId));
    });
    
  }   
}

export function getButtonInfo(containers){
  console.log(`module_page_mathPaintCanvas.js: registering ${pageId} - to ${containers.main}`);
  
  pageTarget = containers.main;
  
  var buttonInfo = {};

  buttonInfo.callback = load_page;
  buttonInfo.image    = ''; //'static/images/svg/blank.svg'; // or '' < will use text if no image
  buttonInfo.alt      = 'diffusion simulation';
  buttonInfo.text     = 'DF';
  buttonInfo.id       =  buttonId;
  
  return buttonInfo;
}

export default getButtonInfo;
