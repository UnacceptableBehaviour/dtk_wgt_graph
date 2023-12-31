// Ex create a module that implements a page behaviour by clicking a button in the navbar

// navbar generic
import {getCurrentPage, setCurrentPage, setUnloadCurrentPageCallback, createHTMLPageContainer} from './navbarMod.js';

// specifics to page
import * as pageModule from './content/recipe_dtk_multi.js';
var jsSourceFileName = 'recipe_dtk_multi.js';
var jsSource = `static/js_modules/content/${jsSourceFileName}.js`;
var jsContainerId = 'recipe_pag';

var pageTarget;
var pageId = 'recipe_page_parent';
//var htmlSource= 'static/html/recipe.html';
var buttonId = 'b_nav_reci';


// tidy up when another button is pressed
// maybe just hide page
function unload_page(idOfPressedButton) {
  // are we on the same page if so do nothing!
  if (getCurrentPage() === idOfPressedButton) {
    console.log('unload_recipe: SAME PAGE - DO NOTHING');
    retrn;
  } 
  
  console.log(`pageId: ${pageId} - UNLOADING`);    
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
  
  //fetch(htmlSource)
  //.then(function(response) {
  //  return response.text();
  //})
  //.then(function(body) {
  //  document.getElementById(pageTarget).innerHTML = body;
  //});
  
  // construct page from JS land - very simple container
  console.log(`module: ${pageId} - constructing html`);
  createHTMLPageContainer(pageTarget, pageId, jsContainerId, '');
  
  /* JS is imported at the top is the even necessary - TODO REMOVE - test */  
  if (typeof(pageModule.loadDTKRecipe) === 'function') {
    console.log(`module: ${pageId} - JS ALREADY LOADED`);    
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
    });    
  }
  
  //pageModule.loadDTKRecipe(pageId, 'squid stuffed w chicken and spinach');
  pageModule.loadDTKRecipe(jsContainerId); 
}

export function getButtonInfo(containers){
  console.log(`registering ${pageId} - to ${containers.main}`);
  
  pageTarget = containers.main;
  
  var buttonInfo = {};

  buttonInfo.callback = load_page;
  buttonInfo.image    = ''; //'static/images/svg/pencil.svg'; // or '' < will use text if no image
  buttonInfo.alt      = 'recipe';
  buttonInfo.text     = 'R';
  buttonInfo.id       =  buttonId;
  
  return buttonInfo;
}

export default getButtonInfo;
