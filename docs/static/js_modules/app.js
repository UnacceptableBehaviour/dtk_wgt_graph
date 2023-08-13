// PWA Template 

import * as navBarMod from './navbarMod.js';
//import * as pageHome from './module_page_home.js';
//import * as pageTracker from './module_page_tracker.js';
//import * as pageSnap from './module_page_snap.js';
import * as pageWeighIn from './module_page_weigh_in.js';
//import * as pageMathPaint from './module_page_mathPaint.js';
import * as pageMathPaintCanvas from './module_page_mathPaintCanvas.js';
import * as pageRandomTarget from './module_page_randomTarget.js';
import * as pageDiffusion from './module_page_diffusion.js';
import * as pageFlock from './module_page_flock.js';

// TODO enforce load order - necessary?


// register pages
var containers = navBarMod.getContainers();

//var buttonInfo = pageTable.getButtonInfo(containers);
//navBarMod.addNavbutton(buttonInfo);
// order in which they appear on the navbar . .
//navBarMod.addNavbutton(pageHome.getButtonInfo(containers));
//navBarMod.addNavbutton(pageTracker.getButtonInfo(containers));
//navBarMod.addNavbutton(pageSnap.getButtonInfo(containers));
navBarMod.addNavbutton(pageWeighIn.getButtonInfo(containers));
//navBarMod.addNavbutton(pageMathPaint.getButtonInfo(containers));
navBarMod.addNavbutton(pageMathPaintCanvas.getButtonInfo(containers));
navBarMod.addNavbutton(pageRandomTarget.getButtonInfo(containers));
navBarMod.addNavbutton(pageDiffusion.getButtonInfo(containers));
navBarMod.addNavbutton(pageFlock.getButtonInfo(containers));
