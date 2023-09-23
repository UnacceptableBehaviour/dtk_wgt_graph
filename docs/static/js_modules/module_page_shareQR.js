// Ex create a module that implements a page behaviour by clicking a button in the navbar

// Eventually be code from:  <script src='static/nutrient_traffic_lights.js'></script>
  //<script>      
  //  var recipes = {{ recipes|tojson }};       // convert info using tojson filter      
  //  console.log(`recipe_t JS ${recipes[0]['ri_name']} - inline CONCLUDED`);  // sanity check      
  //</script>
var pageTarget;
var pageId = 'share_qr_page_parent';
var htmlSource = 'static/html/shareQR.html';
var jsSourceFileName = '';
var jsSource = '';//'static/js_modules/content/share_qr.js';
var jsContainerId = 'share_qr_page';
var buttonId = 'b_nav_share_qr';

import {getCurrentPage, setCurrentPage, setUnloadCurrentPageCallback, createHTMLPageContainer} from './navbarMod.js';

// tidy up when another button is pressed
// maybe just hide page
function unload_page(idOfPressedButton) {
  // are we on the same page if so do nothing!
  if (getCurrentPage() === idOfPressedButton) {
    console.log('unload_share_qr: SAME PAGE - DO NOTHING');
    return;
  } 

  console.log(`butId: ${buttonId} - UNLOADING`);    
  // delete page
  document.getElementById(pageTarget).replaceChildren();
}

function load_page() {
  if (getCurrentPage() === buttonId) {
    console.log('load_page: SAME PAGE - DO NOTHING');
    return;
  } else {
    setCurrentPage(buttonId);
  }  

  console.log(`pageId: ${pageId} - loading: ${htmlSource}`);
  
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
  console.log(`registering ${pageId} - to ${containers.main}`);
  
  pageTarget = containers.main;
  
  var buttonInfo = {};

  buttonInfo.callback = load_page;
  buttonInfo.image    = ''; //'static/images/svg/share_qr.svg'; // or '' < will use text if no image
  buttonInfo.alt      = 'weigh in';
  buttonInfo.text     = 'SHARE';
  buttonInfo.id       =  buttonId;
  
  return buttonInfo;
}

export default getButtonInfo;
