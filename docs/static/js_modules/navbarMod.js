// Naive navbar implementation - experimenting w/ modules

//                      index.html
// add buttons to       <div class="btn-group" id="navButtons">
// display content in   <div class="container pwa_page" id="pwa_page">
// and                  <div class="container pwa_page" id="pwa_page_footer">

// read: https://www.javascript-coder.com/button/javascript-button-p1/

var navButtonsId = 'nav_buttons';
var unloadCurrentPageCallback = () => console.log('> - - - NO PAGE IS CURRENTLY LOADED - - - <');
var currentSelectedPage = 'none';

export function setUnloadCurrentPageCallback(cb){
  unloadCurrentPageCallback = cb;
}
export function setCurrentPage(pageId){
  currentSelectedPage = pageId;
}
export function getCurrentPage(){
  return currentSelectedPage;
}

//<div class="container" id="maths_paint_parent">
//    dbg_txt
//    <div class="container" id="maths_paint"></div>    
//</div>
export function createHTMLPageContainer(pageTarget, pageId, jsContainerId, dbg_txt=''){
  var parent = document.createElement("div");
  //parent.classList.add("container");
  parent.id = pageId;  
  parent.text = dbg_txt;
  
  console.log(`adding ${jsContainerId} to: ${pageId}`);
  var page = document.createElement("div");
  //page.classList.add("container");
  page.id = jsContainerId;
  parent.appendChild(page);
  
  console.log(`adding ${pageId} to: ${pageTarget}`);
  document.getElementById(pageTarget).appendChild(parent);  
}

export function getContainers(){
  var containers = {};
  
  containers.main   = 'pwa_page';
  containers.footer = 'pwa_page_footer';  
  
  console.log(`navbarMod.js Return containers ${containers.main}`);
  return(containers);
}

// EG
//<button id='bt_weigh_in'>
//    <a href="{{url_for('weigh_in')}}"><img src="static/images/PNG/balance-scale.png" alt="tick" srcset="static/images/svg/balance-scale.svg"></a>
//</button>
//
export function addNavbutton(buttonInfo){
  console.log(`navbarMod.js ADDING BUTTON - - - - to ${buttonInfo.alt} - S`);  
  var navbar = document.getElementById(navButtonsId);
    
  let image = buttonInfo.image;
  let alt  = buttonInfo.alt;

  let callback = (e) => {
    console.log(`==> NAV btn cb: ${e.currentTarget.id} - ${e.currentTarget} <`);
    unloadCurrentPageCallback(e.currentTarget.id);
    buttonInfo.callback();  
  };
  
  var navButton  = document.createElement('button');

  navButton.id = buttonInfo.id;
  navButton.onclick = callback;
  if (buttonInfo.image !== ''){
    navButton.innerHTML = `<img src="${image}">`; // '<img src="static/images/PNG/balance-scale.png">'  
  } else {    
    navButton.textContent = buttonInfo.text;          
  }
  
  navbar.appendChild(navButton);
  
  console.log("navbarMod.js ADDING BUTTON - - - - E");
  
  return(navButton.id)
}

export function removeNavbutton(buttonInfo){
  console.log(`navbarMod.js BUTTON REMOVED - - - - to ${navButtonsId} - * * NOT * *  IMPLEMENTED`);
  console.log(`navbarMod.js BUTTON REMOVED - - - - to ${navButtonsId} - * * NOT * *  IMPLEMENTED`);
}
