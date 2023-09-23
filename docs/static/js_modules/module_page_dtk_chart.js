// Ex create a module that implements a page behavior by clicking a button in the navbar


// navbar generic
import {getCurrentPage, setCurrentPage, setUnloadCurrentPageCallback, createHTMLPageContainer} from './navbarMod.js';

// specifics to page
import * as dtkChart from './content/dtk_chart.js';       // relative to this file

// TODO - remove jsSourceFileName - used for loading JS [not needed because of import] & console outs
var jsSourceFileName = 'dtk_chart.js';// - - /            // console.log support
var jsSource = `static/js_modules/content/${jsSourceFileName}`;
var jsContainerId = 'dtkChart_js';

var pageTarget;
var pageId = 'dtkChart_page';
//var htmlSource = 'static/html/dtkChart.html';
var buttonId = 'b_nav_dtkChart';

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
  
  if (typeof(dtkChart.startPageAnimation) === 'function') {
    dtkChart.stopAnim();
    console.log(`run ${jsSourceFileName} resetRAFcallback: ${typeof(dtkChart.startPageAnimation)} - E`);
  } else {
    console.log(`run ${jsSourceFileName} NOT LOADED! - E`);
  }
  // delete page
  document.getElementById(pageTarget).replaceChildren();
}

function load_page(){
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
  createHTMLPageContainer(pageTarget, pageId, jsContainerId, 'dtkChart');
  
  // fix margin - TODO - move this into CSS
  document.getElementById(pageId).style.padding = "0px";
  document.getElementById(jsContainerId).style.padding = "0px";
  document.getElementById(pageTarget).style.padding = "0px";
  
  console.log(`pageId: ${pageId} - loading JS: ${jsSource}`);


  if (typeof(dtkChart.startPageAnimation) === 'function') {

    console.log(`${jsSourceFileName} ALREADY LOADED! restart animation`);
    dtkChart.setKeepAnimRuning();     // must do before starting anim
    dtkChart.startPageAnimation(document.getElementById(jsContainerId));

  } else {

    // fetch(jsSource)
    // .then(function(response) {
    //   return response.text();
    // })
    // .then(function(text) {    
    //   var script = document.createElement("script");
    //   script.innerHTML = text;
    //   script.setAttribute("type", "module");
    //   document.getElementById(jsContainerId).appendChild(script);
    //   dtkChart.startPageAnimation(document.getElementById(jsContainerId));
    // });
    //const dtkClip = new DtkChartWithControls( "wic-lip", "dtkChart_js", {selectedDataSources: ['dtk_kg_fat','dtk_kg_fat_av7']} );
    //const dtkClip = new dtkChart.DtkChartWithControls( "wic-lip", "dtkChart_js", {selectedDataSources: ['dtk_kg_fat','dtk_kg_fat_av7']} );
    const dtkCwgt = new dtkChart.DtkChartWithControls( "wic-wgt", "dtkChart_js", {selectedDataSources: ['dtk_weight', 'dtk_weight_av7']} );    
    const dtkClip = new dtkChart.DtkChartWithControls( "wic-lip", "dtkChart_js", {selectedDataSources: ['dtk_kg_fat','dtk_kg_fat_av7']} );
    const dtkCh20 = new dtkChart.DtkChartWithControls( "wic-h2o", "dtkChart_js", {selectedDataSources: ['dtk_kg_h2o', 'dtk_kg_h2o_av7']} );
  }
}


export function getButtonInfo(containers){
  console.log(`registering ${pageId} - to ${containers.main}`);
  
  pageTarget = containers.main;
  
  var buttonInfo = {};

  buttonInfo.callback = load_page;
  buttonInfo.image    = 'static/images/svg/weigh_in.svg'; // or '' < will use text if no image
  buttonInfo.alt      = 'dtkChart';
  buttonInfo.text     = 'WI';
  buttonInfo.id       =  buttonId;
  
  return buttonInfo;
}

export default getButtonInfo;
