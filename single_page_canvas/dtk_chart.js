import { dtk_chart_info } from './dtk_data_process.js';


export var chart_settings = {
  cnv_width: 400,
  cnv_height: 400,
  chartWidthDays: 21,
  fontSize: 10,
}

var progressChart;

class DisplayObject {
  constructor({display, doName, x_pc, y_pc, w_pc, h_pc, rad, col_ink, col_bk, alpha, fontSize=10, col_bbox='magenta', dbgOn=true} = {}){
		this.display = display;
    this.ctx = display.ctx;
    this.doName = doName;
    this.x_pc = x_pc;
    this.x = this.display.canvas.width * (this.x_pc / 100);
    this.y_pc = y_pc;
    this.y = this.display.canvas.height * (this.y_pc / 100);
    this.w_pc = w_pc;
    this.w = this.display.canvas.width * (this.w_pc / 100);
    this.h_pc = h_pc;
    this.h = this.display.canvas.height * (this.h_pc / 100);
    this.rad = rad;
    this.col_ink = col_ink;
    this.col_bk = col_bk;
    this.alpha = alpha;
    this.col_bbox = col_bbox;
    this.fontSize = fontSize;

    // debug
    this.dbgOn = dbgOn;
    this.border = dbgOn;
    this.titleOn = dbgOn;
    this.markers = dbgOn;
    this.textEdgeMarkers = dbgOn;
  }

  scaleCoords(){
    this.x = this.display.canvas.width * (this.x_pc / 100);
    this.y = this.display.canvas.height * (this.y_pc / 100);
    this.w = this.display.canvas.width * (this.w_pc / 100);
    this.h = this.display.canvas.height * (this.h_pc / 100);
  }

  draw(){
    this.scaleCoords();
    this.ctx.save();
    if (this.border) { // boundingBox
      this.drawLineCentre2Obj();
      //console.log(`doName: ${this.doName}, x: ${this.x}, y: ${this.y}, w: ${this.w}, h: ${this.h}, ink:${this.col_ink}, bbox:${this.col_bbox}`); 

      // border - guideline for now
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.col_bbox;      
      this.ctx.lineWidth = 1;
      this.ctx.rect(this.x, this.y, this.w, this.h);
      this.ctx.stroke();
    }
    if (this.titleOn) {      
      //placeCentreText(this.ctx, text, xl, xr, y, color, fontSize, lnW = 2)
      this.placeCentreText(this.ctx, this.doName, this.x, this.x + this.w, this.y + this.h, this.col_ink, this.fontSize);
    }
    if (this.markers) {
      // show rect place
      //drawCircle(this.x, this.y, 6, 'cyan');
      this.ctx.beginPath();
      this.ctx.fillStyle = 'cyan';
      this.ctx.arc(this.x, this.y, 6, 0, 2*Math.PI);
      this.ctx.fill();
      
      // show translate place
      //drawCircle(this.x + this.w/2, this.y + this.h/2, 6, 'orange');
      this.ctx.beginPath();
      this.ctx.fillStyle = 'orange';
      this.ctx.arc(this.x + this.w/2, this.y + this.h/2, 6, 0, Math.PI*2);
      this.ctx.fill();

      // show origin
      //drawCircle(0, 0, 3, 'blue');
      this.ctx.translate(0, 0);     
      this.ctx.beginPath();
      this.ctx.fillStyle = 'blue';
      this.ctx.arc(0, 0, 3, 0, 2*Math.PI);
      this.ctx.fill();       
    }    
    this.ctx.restore();
  }

  placeCentreTextNoMk(ctx=null, text, xl, xr, y, color, fontSize) {    
    if (ctx==null){ ctx = this.ctx };
    //   |                                 |      < fontSize(epth)
    //   xl             texts              xr
    //                    |
    //                    ^ markMidddle
    ctx.save();
    
    // font def
    ctx.font = `${fontSize}px Arial`;
    ctx.textBaseline = 'middle'; // hanging
    ctx.textAlign = 'center';
      
    let markMiddle = xl + (xr - xl) / 2;
    let textMetrics = ctx.measureText(text);
    let textStart = markMiddle;   
  
    // place text between if it fits below if not
    ctx.fillStyle = color;
    ctx.fillText(text, textStart, y+fontSize);
    ctx.restore();
  }  

  placeCentreText(ctx=null, text, xl, xr, y, color, fontSize, lnW = 2) {    
    if (ctx==null){ ctx = this.ctx };
    //   |                                 |      < fontSize(epth)
    //   xl             texts              xr
    //                    |
    //                    ^ markMidddle
    ctx.save();
    
    // font def
    ctx.font = `${fontSize}px Arial`;
    ctx.textBaseline = 'middle'; // hanging
    ctx.textAlign = 'center';
      
    let markMiddle = xl + (xr - xl) / 2;
    let textMetrics = ctx.measureText(text);
    let textStart = markMiddle;
    
    if (this.textEdgeMarkers) {
      // place left vert line
      ctx.beginPath();
      ctx.lineWidth = lnW;
      ctx.strokeStyle = color;
      ctx.moveTo(xl, y);
      ctx.lineTo(xl, y+fontSize);  // line depth - marker depth
      ctx.stroke(); 
    
      // place right vert line
      ctx.beginPath();
      ctx.lineWidth = lnW;
      ctx.strokeStyle = color;
      ctx.moveTo(xr, y);
      ctx.lineTo(xr, y+fontSize);  // line depth - marker depth
      ctx.stroke();
    }
  
    // place text between if it fits below if not
    ctx.fillStyle = color;
    ctx.fillText(text, textStart, y+fontSize);
    ctx.restore();
  }  

  drawLineCentre2Obj(){
    let x_c = this.display.canvas.width / 2;
    let y_c = this.display.canvas.height / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x_c, y_c);
    this.ctx.lineTo(this.x, this.y);
    this.ctx.strokeStyle = this.col_ink;
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
  }

  drawCircle(x,y,w,col,rad_start=0,rad_end=Math.PI * 2) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, w, rad_start, rad_end);
    this.ctx.closePath();
    this.ctx.fillStyle = col;
    this.ctx.fill();
  }  
}

class VertLabelBar extends DisplayObject {
  // display rolling average for period length
  constructor( {display, doName, x_pc, y_pc, w_pc, h_pc, rad, col_ink, col_bk, alpha, fontSize, col_bbox, dbgOn} = {},
                label_top='#',label_bot='#', pwPos=1, periodWindow=7, dark=null  )
  {
    if (dark === null) dark = pwPos % 2;   // 0=dark 1=light
    if (dark > 0) dark = 1;
    
    alpha = alpha * dark;
    
    x_pc = (pwPos-1) * (100 / periodWindow);
    y_pc = 0;
    w_pc = (100 / periodWindow);
    h_pc = 100;
    super({ display:display, doName:doName, 
      x_pc:x_pc, y_pc:y_pc, w_pc:w_pc, h_pc:h_pc, rad:rad, 
      col_ink:col_ink, col_bk:col_bk, alpha:alpha, fontSize:fontSize, col_bbox:col_bbox, dbgOn:dbgOn});

    this.label_top    = label_top;
    this.label_bot    = label_bot;
    this.pwPos        = pwPos;
    this.periodWindow = periodWindow;    
    this.dark         = dark;
  }  // olive navy maroon lime  

  draw(){
    super.draw();
    const ctx = this.display.canvas.getContext("2d");
    ctx.fillStyle = this.col_ink;
    ctx.globalAlpha = this.alpha;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.globalAlpha = 1;                                        // TODO - sort propert geometry calculation out for text placement
    this.placeCentreTextNoMk(ctx, this.label_top, this.x, this.x + this.w, this.y + (this.h - (this.h/this.fontSize)-this.fontSize), this.col_ink, this.fontSize );
    this.placeCentreTextNoMk(ctx, this.label_bot, this.x, this.x + this.w, this.y + (this.h - (this.h/this.fontSize)+this.fontSize), this.col_ink, this.fontSize );
    //console.log(`VertLabelBar ${this.label} - dark:${this.dark} - alpha:${this.alpha}  \tx:${this.x_pc}, y:${this.y_pc}, w:${this.w_pc}, h:${this.h_pc},`);
  }
}

class SummaryBar extends DisplayObject {
  // display rolling average for period length
  constructor( {display, doName, x_pc, y_pc, w_pc, h_pc, rad, col_ink, col_bk, alpha, fontSize, col_bbox, dbgOn} = {},
                nix_time_day, ave_for_period, ave_last_period, min, max, pos_LR='right' )
  {
    super({ display:display, doName:doName, 
            x_pc:x_pc, y_pc:y_pc, w_pc:w_pc, h_pc:h_pc, rad:rad, 
            col_ink:col_ink, col_bk:col_bk, alpha:alpha, fontSize:fontSize, col_bbox:col_bbox, dbgOn:dbgOn});
        
  }  // olive navy maroon lime  
}

class DtkChart extends DisplayObject { // hold curent state
  constructor( {display, doName, x_pc, y_pc, w_pc, h_pc, rad, col_ink, col_bk, alpha, fontSize, col_bbox, dbgOn} = {},
                settings, )
  {         
    super({ display:display, doName:doName, 
            x_pc:x_pc, y_pc:y_pc, w_pc:w_pc, rad:rad, 
            col_ink:col_ink, col_bk:col_bk, alpha:alpha, fontSize:fontSize, col_bbox:col_bbox, dbgOn:dbgOn})

    let days = chart_settings.chartWidthDays;
    let dayIdxStart = dtk_chart_info.length - days - 1;
    let dayIdxEnd = dtk_chart_info.length; 
    for (let i = dayIdxStart; i < dayIdxEnd; i++){
      console.log(`dtk[${i}] - ${dtk_chart_info[i].dtk_weight}`);
      console.log(dtk_chart_info[i]);
    }

    // 1568764800000: {
    //   dtk_pc_fat: "38.3",
    //   dtk_pc_h2o: "44.8",
    //   dtk_rcp: {
    //     dt_date: 1568764800000,
    //     dt_date_readable: "2019 09 18",
    //     dt_day: "day",
    //   },
    //   dtk_user_info: { UUID: "x-x-x-x-xxx", name: "AGCT" },
    //   dtk_weight: "105.7",
    // }            


    this.zList = [this];
    let dsObjConfig = { display:display, doName:doName, 
                        x_pc:x_pc, y_pc:y_pc, w_pc:w_pc, rad:rad, 
                        col_ink:col_ink, col_bk:col_bk, alpha:alpha, fontSize:fontSize, col_bbox:col_bbox, dbgOn:dbgOn}

    dsObjConfig = Object.assign(dsObjConfig, {doName:'a1', x_pc:10, y_pc:10, w_pc:10, h_pc:10, rad:0, col_ink:'lime', col_bbox:'magenta'});
    let a1 = new DisplayObject(dsObjConfig);
    this.zList.push(a1);

    dsObjConfig = Object.assign(dsObjConfig, {doName:'a2', x_pc:10, y_pc:80, w_pc:10, h_pc:10, rad:0, col_ink:'yellowgreen', col_bbox:'magenta'});
    let a2 = new DisplayObject(dsObjConfig);
    this.zList.push(a2);

    dsObjConfig = Object.assign(dsObjConfig, {doName:'a3', x_pc:80, y_pc:80, w_pc:10, h_pc:10, rad:0, col_ink:'purple', col_bbox:'magenta'});
    let a3 = new DisplayObject(dsObjConfig);
    this.zList.push(a3);

    dsObjConfig = Object.assign(dsObjConfig, {doName:'a4', x_pc:80, y_pc:10, w_pc:10, h_pc:10, rad:0, col_ink:'orangered', col_bbox:'magenta'});
    let a4 = new DisplayObject(dsObjConfig);
    this.zList.push(a4);

    dsObjConfig = { display:display, doName:'sBar', 
                    x_pc:80, y_pc:0, w_pc:20, h_pc:100, rad:0, 
                    col_ink:'maroon', col_bk:col_bk, alpha:alpha, fontSize:fontSize, col_bbox:'magenta', dbgOn:true}
    let sBar = new SummaryBar(dsObjConfig);
    this.zList.push(sBar);

    let periodWindow = chart_settings.chartWidthDays;
    let indexStart = dtk_chart_info.length - periodWindow;

    for (let pwPos = 0; pwPos < periodWindow; pwPos++){
      dsObjConfig = { display:display, doName:'vBar', 
      //x_pc:80, y_pc:0, w_pc:20, h_pc:100, rad:0, 
      col_ink:'black', col_bk:col_bk, alpha:0.1, fontSize:fontSize, col_bbox:'cyan', dbgOn:true};
      
      let dataIdxOffset = indexStart+pwPos;
      let dayShort = dtk_chart_info[dataIdxOffset].dtk_rcp.dt_day.slice(0,2);;
      let dayNum = dtk_chart_info[dataIdxOffset].dtk_rcp.dt_date_readable.slice(-2); // last 2 chars
      let vBar = new VertLabelBar(dsObjConfig, dayShort, dayNum, pwPos+1, periodWindow );
      this.zList.push(vBar);      
    }

  


  } // olive navy maroon lime

  update(){
    this.display.sync(this);
  }

  resizeCanvas(){
    // Get the new window dimensions
    const winInnerWidth = window.innerWidth;
    const winInnerHeight = window.innerHeight;

    // Resize the canvas to the new dimensions
    this.display.canvas.width = winInnerWidth;
    this.display.canvas.height = winInnerHeight / 2;
    this.display.canvas.style.position = 'absolute';
    this.display.canvas.style.left = "0px";        
    this.update();
  }

  addDisplayObject(dspObj){
    this.zList.push(dspObj);
  }
}
	




class Canvas {
  constructor(parent = document.body, width = 400, height = 400) {
    console.log(`Canvas:\nparent: ${parent}`);
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.position = 'absolute';
    //this.canvas.style.top = "100px";
    this.canvas.style.left = "0px";    
    parent.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  sync(dtkChart) {
    this.clearDisplay();
    this.update(dtkChart.zList);
  }

  clearDisplay() {
    // opacity controls the trail effect in animation set to 1 to remove
    //this.ctx.fillStyle = 'rgba(255, 255, 255, .4)';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update(zList){
    for (let dspObj of zList){
      dspObj.draw();
    }
  }

}





const runAnimation = animation => {
  let lastTime = null;
  const frame = time => {
    if (lastTime !== null) {
      const timeStep = Math.min(100, time - lastTime) / 1000;

      // return false from animation to stop
      if (animation(timeStep) === false) {
        return;
      }
    }
    lastTime = time;
    requestAnimationFrame(frame);     // re-insert frame callback in animation Q
  };
  requestAnimationFrame(frame);       // start animation
};


var rafScheduled = false;
window.addEventListener('resize', () => {
  // Perform actions in response to window resize
  //console.log('Window was resized');
  progressChart.resizeCanvas()
  // if (rafScheduled == false) {
  //   rafScheduled = true;
  //   requestAnimationFrame(progressChart.resizeCanvas);
  // }
});


export function updateChart({cnv_width = 400, cnv_height = 400, parent = document.body, chartWidthDays = 7} = {}){
  progressChart.update();
}


export function createDtkChart({cnv_width = 400, cnv_height = 400, parent = document.body, chartWidthDays = 7} = {}){
  const display = new Canvas(parent, cnv_width, cnv_height);

  display.canvas.width = window.innerWidth;
  display.canvas.height = window.innerHeight / 2;
  display.canvas.style.position = 'absolute';
  display.canvas.style.left = "0px"; 

  progressChart = new DtkChart(  
    { display: display,
      doName:'dtkProgress',
      x:0, y:0, w:cnv_width, h:cnv_height, rad:0, 
      col_ink:'black', col_bk:'white', alpha:'100', fontSize:10, col_bbox:'olive', dbgOn:true },
    chart_settings ) ;

  progressChart.update(); // pass in state: 7day, 14d, 21d, 1m, 3m, 6m, 1y, 2y, plus new dimensions

  // runAnimation(time => {
  //   // pass in state: 7day, 14d, 21d, 1m, 3m, 6m, 1y, 2y
  //   progressChart.update();
  //   display.sync();  
  // });
};


