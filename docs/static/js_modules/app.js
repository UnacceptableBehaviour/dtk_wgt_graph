// PWA Template 

import * as navBarMod from './navbarMod.js';
import * as pageShareQR from './module_page_shareQR.js';
//import * as pageHome from './module_page_home.js';
//import * as pageTracker from './module_page_tracker.js';
import * as pageRecipe from './module_page_recipe.js';
//import * as pageSnap from './module_page_snap.js';
import * as pageDtkChart from './module_page_dtk_chart.js';
import * as pageMathPaintCanvas from './module_page_mathPaintCanvas.js';
import * as pageRandomTarget from './module_page_randomTarget.js';
import * as pageDiffusion from './module_page_diffusion.js';
import * as pageFlock from './module_page_flock.js';
import * as pageBlank from './module_page_blankMod.js';

// TODO enforce load order - necessary?


// register pages
var containers = navBarMod.getContainers();

//var buttonInfo = pageTable.getButtonInfo(containers);
//navBarMod.addNavbutton(buttonInfo);
// order in which they appear on the navbar . .
//navBarMod.addNavbutton(pageHome.getButtonInfo(containers));
//navBarMod.addNavbutton(pageTracker.getButtonInfo(containers));
//navBarMod.addNavbutton(pageSnap.getButtonInfo(containers));
navBarMod.addNavbutton(pageShareQR.getButtonInfo(containers));
navBarMod.addNavbutton(pageDtkChart.getButtonInfo(containers));
navBarMod.addNavbutton(pageRecipe.getButtonInfo(containers));
navBarMod.addNavbutton(pageMathPaintCanvas.getButtonInfo(containers));
navBarMod.addNavbutton(pageRandomTarget.getButtonInfo(containers));
navBarMod.addNavbutton(pageDiffusion.getButtonInfo(containers));
navBarMod.addNavbutton(pageFlock.getButtonInfo(containers));
navBarMod.addNavbutton(pageBlank.getButtonInfo(containers));
