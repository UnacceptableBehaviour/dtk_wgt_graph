// Ex create a module that implements a page behaviour by clicking a button in the navbar

// Eventually be code from:  <script src='static/nutrient_traffic_lights.js'></script>
  //<script>      
  //  var recipes = {{ recipes|tojson }};       // convert info using tojson filter      
  //  console.log(`recipe_t JS ${recipes[0]['ri_name']} - inline CONCLUDED`);  // sanity check      
  //</script>
var pageTarget;
var pageId = 'snap_page_parent';
var htmlSource = 'static/html/snap.html';
var jsSource = '';//'static/js_modules/content/mathTiles.js';
var jsContainerId = 'snap_page';
var buttonId = 'b_nav_snap';

import {getCurrentPage, setCurrentPage, setUnloadCurrentPageCallback, createHTMLPageContainer} from './navbarMod.js';

// tidy up when another button is pressed
// maybe just hide page
function unload_page(idOfPressedButton) {
  // are we on the same page if so do nothing!
  if (getCurrentPage() === idOfPressedButton) {
    console.log('unload_snap: SAME PAGE - DO NOTHING');
    return;
  } 
  
  console.log(`module_page_snap.js: ${pageId} - UNLOADING`);    
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
  
  console.log(`module_page_snap.js: ${pageId} - loading: ${htmlSource}`);

  setUnloadCurrentPageCallback(unload_page);
  
  fetch(htmlSource)
  .then(function(response) {
    return response.text();
  })
  .then(function(body) {
    document.getElementById(pageTarget).innerHTML = body;
  });
  
  // construct page from JS land - very simple container
  //console.log(`module: ${pageId} - constructing html`);
  //createHTMLPageContainer(pageTarget, pageId, jsContainerId, '');
}

export function getButtonInfo(containers){
  console.log(`module_page_snap.js: registering ${pageId} - to ${containers.main}`);
  
  pageTarget = containers.main;
  
  var buttonInfo = {};

  buttonInfo.callback = load_page;
  buttonInfo.image    = 'static/images/svg/snap.svg'; // or '' < will use text if no image
  buttonInfo.alt      = 'photo';
  buttonInfo.text     = 'IMG';
  buttonInfo.id       =  buttonId;
  
  return buttonInfo;
}

export default getButtonInfo;
