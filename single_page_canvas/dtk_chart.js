import { dtkChartData } from './dtk_data_process.js';

const CHART_WIDTH_DAYS_DEFAULT = 7;
const INDEX_END_DEFAULT = parseInt(dtkChartData.length);
const INDEX_START_DEFAULT = parseInt(INDEX_END_DEFAULT - CHART_WIDTH_DAYS_DEFAULT);
export var chartSettings = {
  cnv_width: 400,
  cnv_height: 400,
  startIndex: INDEX_START_DEFAULT,        // DEPRACATED calc index from END
  endIndex:   INDEX_END_DEFAULT,
  chartWidthDays: CHART_WIDTH_DAYS_DEFAULT,
  fontSize: 10,
  availableDataSources: ['dtk_weight', 'dtk_pc_fat', 'dtk_pc_h2o'],
  selectedDataSources:  ['dtk_weight'],
}

var progressChart;

class DisplayObject {
  constructor({display, doName, x_pc, y_pc, w_pc, h_pc, x1_pc, y1_pc, radius_pc, arc_rad, col_ink, col_bk, alpha, fontSize=10, col_bbox='magenta', dbgOn=true} = {}){
		this.display = display;
    this.ctx = this.display.canvas.getContext("2d");
    this.doName = doName;
    this.x_pc = x_pc;
    this.x = this.display.canvas.width * (this.x_pc / 100);
    this.y_pc = y_pc;
    this.y = this.display.canvas.height * (this.y_pc / 100);
    this.w_pc = w_pc;
    this.w = this.display.canvas.width * (this.w_pc / 100);
    this.h_pc = h_pc;
    this.h = this.display.canvas.height * (this.h_pc / 100);
    this.x1_pc = x1_pc;
    this.x1 = this.display.canvas.width * (this.x1_pc / 100);
    this.y1_pc = y1_pc;
    this.y1 = this.display.canvas.height * (this.y1_pc / 100);
    this.radius_pc = radius_pc;
    this.arc_rad = arc_rad;
    this.col_ink = col_ink;
    this.col_bk = col_bk;
    this.alpha = alpha;
    this.col_bbox = col_bbox;
    this.fontSize = fontSize;

    // debug
    this.dbgOn = dbgOn;
    this.border = dbgOn;
    this.titleOn = true;//dbgOn;
    this.markers = dbgOn;
    this.textEdgeMarkers = dbgOn;
  }

  scaleCoords(){
    this.x = this.display.canvas.width * (this.x_pc / 100);
    this.y = this.display.canvas.height * (this.y_pc / 100);
    this.w = this.display.canvas.width * (this.w_pc / 100);
    this.h = this.display.canvas.height * (this.h_pc / 100);
    this.x1 = this.display.canvas.width * (this.x1_pc / 100);
    this.y1 = this.display.canvas.height * (this.y1_pc / 100);
  }

  draw(){
    this.scaleCoords();
    this.ctx.save();
    if (this.border) { // boundingBox
      //this.drawLineCentre2Obj();
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
      //console.log(`title: ${this.doName} :ON`);
    } else {      
      //console.log(`title: ${this.doName} :OFF`);
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
  
  // const baselines = ["top","hanging","middle","alphabetic","ideographic","bottom"];
  placeCentreTextNoMk(ctx=null, text, xl, xr, y, color, fontSize, align='center', baseline='middle') {    
    if (ctx==null){ ctx = this.ctx };
    //   |                                 |      < fontSize(epth)
    //   xl             texts              xr
    //                    |
    //                    ^ markMidddle
    ctx.save();
    
    // font def
    ctx.font = `${fontSize}px Arial`;
    ctx.textBaseline = baseline; // hanging
    ctx.textAlign = align;  // 'left' 'center'
      
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
  constructor( {display, doName, x_pc, y_pc, w_pc, h_pc, arc_rad, col_ink, col_bk, alpha, fontSize, col_bbox, dbgOn} = {},
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
      x_pc:x_pc, y_pc:y_pc, w_pc:w_pc, h_pc:h_pc, arc_rad:arc_rad, 
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

class VertLabelBars extends DisplayObject {
  // display rolling average for period length
  constructor( {display, doName, x_pc, y_pc, w_pc, h_pc, arc_rad, col_ink, col_bk, alpha, fontSize, col_bbox, dbgOn} = {} )
  {
    super({ display:display, doName:doName, 
      x_pc:x_pc, y_pc:y_pc, w_pc:w_pc, h_pc:h_pc, arc_rad:arc_rad, 
      col_ink:col_ink, col_bk:col_bk, alpha:alpha, fontSize:fontSize, col_bbox:col_bbox, dbgOn:dbgOn});
      this.fontSize = fontSize;
  }

  draw(){
    super.draw();
    let periodWindow  = chartSettings.chartWidthDays;
    let endIndex      = chartSettings.endIndex;
    let startIndex    = endIndex - periodWindow;

    for (let pwPos = 0; pwPos < periodWindow; pwPos++){
      let dsObjConfig = { display:this.display, doName:'vBar', 
      //x_pc:80, y_pc:0, w_pc:20, h_pc:100, arc_rad:0, 
      col_ink:'black', col_bk:'white', alpha:0.1, fontSize:this.fontSize, col_bbox:'cyan', dbgOn:false};
      
      let dataIdxOffset = startIndex+pwPos;
      let dayShort = dtkChartData[dataIdxOffset].dtk_rcp.dt_day.slice(0,2);;
      let dayNum = dtkChartData[dataIdxOffset].dtk_rcp.dt_date_readable.slice(-2); // last 2 chars
      let vBar = new VertLabelBar(dsObjConfig, dayShort, dayNum, pwPos+1, periodWindow );
      vBar.draw();
    }
  }
}


class YAxisNumbering extends DisplayObject {
  constructor({display, doName, x_pc, y_pc, w_pc, h_pc, arc_rad, col_ink, col_bk, alpha, fontSize, col_bbox, dbgOn} = {},
              dtkChart)
  {
    super({ display, doName,
            x_pc, y_pc, w_pc, h_pc, arc_rad,
            col_ink, col_bk, alpha, fontSize,
            col_bbox, dbgOn
    });
    this.fontSize = fontSize + 4;
    this.dtkChart = dtkChart;
    this.getBoundaryValues();
  }

  getBoundaryValues() {
    if (this.dtkChart){
      const {periodWindow, endIndex, startIndex, xIncrement_pc, dataMin, dataMax, yAxisMinVal, yAxisMaxVal, yAxisRange} = this.dtkChart;
      Object.assign(this, {periodWindow, endIndex, startIndex, xIncrement_pc, dataMin, dataMax, yAxisMinVal, yAxisMaxVal, yAxisRange});
    }
  }

  getIntegersBetween(a, b) { // [103, 104, 105, 106, 107]
    let start = Math.ceil(a);
    let end = Math.floor(b);
    let result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
  }

  getIntegersBetweenReverse(a, b) { // [107, 106, 105, 104, 103]
    let start = Math.ceil(a);
    let end = Math.floor(b);
    let result = [];
    for (let i = end; i >= start; i--) {
        result.push(i);
    }
    return result;
  }  

  draw(){
    // this.yAxisMinVal = y = 100%
    // this.yAxisMaxVal = y = 0%
    // this.yAxisRange  = canvas 100%

    this.getBoundaryValues();

    let labels = this.getIntegersBetweenReverse(this.yAxisMinVal, this.yAxisMaxVal); // REF in func no PASS
    
    super.draw();
    let ctx = this.display.canvas.getContext("2d");
    let cH = this.display.canvas.height;
    let cW = this.display.canvas.width;

    let noOfhMarks = labels.length;    
    let yScaling = cH / (this.yAxisRange);
    let offset = 0; //yScaling / 2;


    let y1 = offset;
    let x2 = cW;

    for (let mkNo = 0; mkNo < noOfhMarks; mkNo++ ){
      let yLabelText = labels[mkNo]; //baselines[mkNo+2];
      //console.log(ctx.measureText(yLabelText));
      let x1 = ctx.measureText(yLabelText).width + this.fontSize;

      //console.log(`cH:${cH} scaling[${yScaling}] - lab:${labels[mkNo]}`);
      //console.log(`mkNo:${mkNo} > x1: ${x1}, y1: ${y1}  to  x2: ${x2}, y1: ${y1} lab:${labels[mkNo]}`);
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      y1 = offset + (yScaling * mkNo);  
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.strokeStyle = this.col_ink;
      ctx.lineWidth = 1;      
      ctx.setLineDash([5, 15]); // dash gap - eg [5, 10, 15, 20]
      ctx.stroke();
      this.placeCentreTextNoMk(ctx, yLabelText, 0, x1, y1 - this.fontSize, this.col_ink, this.fontSize, 'center', 'middle');
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    }
    
  }
}


class DataPoint extends DisplayObject {
  static CIRCLE   = 1;
  static SQUARE   = 2;
  static DIAMOND  = 3;
  static CROSS    = 4;
  static CROSSX   = 5;

  // display rolling average for period length
  constructor( {display, doName, x_pc, y_pc, w_pc, h_pc, radius_pc, arc_rad, col_ink, col_bk, alpha, fontSize, col_bbox, dbgOn} = {},
                yVal, pointType=DataPoint.CIRCLE )
  {
    super({ display, doName,
      x_pc, y_pc, w_pc, h_pc, radius_pc, arc_rad,
      col_ink, col_bk, alpha, fontSize,
      col_bbox, dbgOn
    });    
    this.fontSize   = fontSize;
    this.pointType  = pointType;
    this.yVal       = yVal;
  }

  draw(){
    super.draw(); // scale x_pc,y_pc
    let ctx = this.display.canvas.getContext("2d");

    if (this.pointType == DataPoint.CIRCLE) {
      this.drawCircle(this.x,this.y,this.w/2,this.col_ink);
    } else if (this.pointType == DataPoint.SQUARE) {
      this.drawCircle(this.x,this.y,this.w/2,this.col_ink);
    } else if (this.pointType == DataPoint.DIAMOND) {
      this.drawCircle(this.x,this.y,this.w/2,this.col_ink);
    } else if (this.pointType == DataPoint.CROSS) {
      this.drawCircle(this.x,this.y,this.w/2,this.col_ink);
    } else if (this.pointType == DataPoint.CROSSX) {
      this.drawCircle(this.x,this.y,this.w/2,this.col_ink);
    }
    // TODO write value next to plot point
    let xl = this.x + this.radius_pc*4;
    let pointLabelText = `${this.yVal.toFixed(1)}`;
    let xr = xl + ctx.measureText(pointLabelText).width;
    this.placeCentreTextNoMk(ctx, pointLabelText, xl, xr, this.y - this.fontSize, this.col_ink, this.fontSize, 'center', 'middle');

    
  }
}

class DataPlot extends DisplayObject {
  // display rolling average for period length
  constructor( {display, doName, x_pc, y_pc, w_pc, h_pc, arc_rad, col_ink, col_bk, alpha, fontSize, col_bbox, dbgOn} = {},
                dtkChart, dataSourceKey, label='#', pointType=DataPoint.CIRCLE  )
  {
    super({ display, doName,
      x_pc, y_pc, w_pc, h_pc, arc_rad,
      col_ink, col_bk, alpha, fontSize,
      col_bbox, dbgOn
    });

    //          / - - - dataSourceKey
    // {       /
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
    this.dtkChart       = dtkChart;
    this.dataSourceKey  = dataSourceKey;
    this.label          = label;    
    this.getBoundaryValues();    
    this.radius_pc      = this.xIncrement_pc / 6;

    console.log(`min: ${this.yAxisMinVal}, max: ${this.yAxisMaxVal}, range: ${this.yAxisRange} <`);
  }  // olive navy maroon lime  

  getBoundaryValues() {
    if (this.dtkChart){
      const {periodWindow, endIndex, startIndex, xIncrement_pc, dataMin, dataMax, yAxisMinVal, yAxisMaxVal, yAxisRange} = this.dtkChart;
      Object.assign(this, {periodWindow, endIndex, startIndex, xIncrement_pc, dataMin, dataMax, yAxisMinVal, yAxisMaxVal, yAxisRange});
    }
  }
  
  // 
  draw(){
    this.getBoundaryValues();
    console.log(`xIncrement_pc: ${this.xIncrement_pc}, dataMin: ${this.dataMin}, dataMax: ${this.dataMax},\nyAxisRange: ${this.yAxisRange}, yAxisMinVal: ${this.yAxisMinVal}, yAxisMaxVal: ${this.yAxisMaxVal}`);
    
    super.draw();

    //console.log(`cH:${cH} scaling[${yScaling}] - lab:${labels[mkNo]}`);
    
    //console.log(`pwPos:${pwPos} > yVal: ${yVal}  x2: ${x2}, y1: ${y1} lab:${labels[mkNo]} , y1: ${y1}`);

    let xPos = this.xIncrement_pc / 3;    
    for (let pwPos = this.startIndex; pwPos < this.endIndex; pwPos++){
      // place in range (range 104.0 to 108.0) 105.2 = 1.2
      let yVal = parseFloat(dtkChartData[pwPos][this.dataSourceKey]);
      let yPos_pc  = yVal - this.yAxisMinVal; 
      // this.yAxisRange (range 104.0 to 108.0) range = 4.0
      let y_pc  = 100 - ((yPos_pc / this.yAxisRange) * 100);   // 100 - y_pc to invert because 0,0 is at the top!

      let dsObjConfig = { display:this.display, doName:`${yPos_pc}`, 
          x_pc:xPos, y_pc:y_pc, radius_pc:this.radius_pc, 
          col_ink:'black', col_bk:'white', alpha:1, fontSize:this.fontSize,
          col_bbox:'cyan', dbgOn:true};

      let point = new DataPoint(dsObjConfig, yVal, this.pointType);
      point.draw();
      xPos += this.xIncrement_pc;
    }
  }
}

class SummaryBar extends DisplayObject {
  // display rolling average for period length
  constructor( {display, doName, x_pc, y_pc, w_pc, h_pc, arc_rad, col_ink, col_bk, alpha, fontSize, col_bbox, dbgOn} = {},
                nix_time_day, ave_for_period, ave_last_period, min, max, pos_LR='right' )
  {
    super({ display:display, doName:doName, 
            x_pc:x_pc, y_pc:y_pc, w_pc:w_pc, h_pc:h_pc, arc_rad:arc_rad, 
            col_ink:col_ink, col_bk:col_bk, alpha:alpha, fontSize:fontSize, col_bbox:col_bbox, dbgOn:dbgOn});
        
  }  // olive navy maroon lime  
}

class DtkChart extends DisplayObject { // hold curent state
  constructor( {display, doName, x_pc, y_pc, w_pc, h_pc, arc_rad, col_ink, col_bk, alpha, fontSize, col_bbox, dbgOn} = {},
                settings )
  {         
    super({ display:display, doName:doName, 
            x_pc:x_pc, y_pc:y_pc, w_pc:w_pc, arc_rad:arc_rad, 
            col_ink:col_ink, col_bk:col_bk, alpha:alpha, fontSize:fontSize, col_bbox:col_bbox, dbgOn:dbgOn})

    // this.periodWindow   = null;   // no of days in the display chart
    // this.endIndex       = null;
    // this.startIndex     = null;
    // this.xIncrement_pc  = null;
    
    // this.dataMin        = null;
    // this.dataMax        = null;
    // this.yAxisMinVal    = null;    
    // this.yAxisMaxVal    = null;
    // this.yAxisRange     = null;

    this.calculateBoundaries(); // calculates above values

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
                        x_pc:x_pc, y_pc:y_pc, w_pc:w_pc, arc_rad:arc_rad, 
                        col_ink:col_ink, col_bk:col_bk, alpha:alpha, fontSize:fontSize, col_bbox:col_bbox, dbgOn:dbgOn}

    // dsObjConfig = Object.assign(dsObjConfig, {doName:'a1', x_pc:10, y_pc:10, w_pc:10, h_pc:10, arc_rad:0, col_ink:'lime', col_bbox:'magenta'});
    // let a1 = new DisplayObject(dsObjConfig);
    // this.zList.push(a1);

    // dsObjConfig = Object.assign(dsObjConfig, {doName:'a2', x_pc:10, y_pc:80, w_pc:10, h_pc:10, arc_rad:0, col_ink:'yellowgreen', col_bbox:'magenta'});
    // let a2 = new DisplayObject(dsObjConfig);
    // this.zList.push(a2);

    // dsObjConfig = Object.assign(dsObjConfig, {doName:'a3', x_pc:80, y_pc:80, w_pc:10, h_pc:10, arc_rad:0, col_ink:'purple', col_bbox:'magenta'});
    // let a3 = new DisplayObject(dsObjConfig);
    // this.zList.push(a3);

    // dsObjConfig = Object.assign(dsObjConfig, {doName:'a4', x_pc:80, y_pc:10, w_pc:10, h_pc:10, arc_rad:0, col_ink:'orangered', col_bbox:'magenta'});
    // let a4 = new DisplayObject(dsObjConfig);
    // this.zList.push(a4);

    dsObjConfig = { display:display, doName:'sBar', 
                    //x_pc:80, y_pc:0, w_pc:20, h_pc:100, arc_rad:0, 
                    x_pc:80, y_pc:0, w_pc:20, h_pc:80, arc_rad:0, 
                    col_ink:'maroon', col_bk:col_bk, alpha:alpha, fontSize:fontSize, col_bbox:'magenta', dbgOn:true}
    let sBar = new SummaryBar(dsObjConfig);
    //this.zList.push(sBar);

    dsObjConfig = { display:display, doName:'vBarS', 
                    x_pc:0, y_pc:0, w_pc:100, h_pc:100, arc_rad:0, 
                    col_ink:'orangeRed', col_bk:col_bk, alpha:alpha, fontSize:chartSettings.fontSize, col_bbox:'purple', dbgOn:true}
    let verticalLabelBars = new VertLabelBars(dsObjConfig);
    this.zList.push(verticalLabelBars);

    // get ylimits of each data source so composite plots match yAxisNumbering
    // for dataSource in dataSources: new DataPlot(dataSource);
    let dataSource = chartSettings.selectedDataSources[0];

    dsObjConfig = { display:display, doName:'pData', 
                    x_pc:0, y_pc:0, w_pc:100, h_pc:100, arc_rad:0, 
                    col_ink:'blue', col_bk:col_bk, alpha:alpha, fontSize:chartSettings.fontSize, col_bbox:'purple', dbgOn:false}

    let singlePlot = new DataPlot(dsObjConfig, this, dataSource, 'test label');
    this.zList.push(singlePlot);

    
    dsObjConfig = { display:display, doName:'yAxNum', 
                    x_pc:0, y_pc:0, w_pc:15, h_pc:100, arc_rad:0, 
                    col_ink:'black', col_bk:col_bk, alpha:0.5, fontSize:chartSettings.fontSize, col_bbox:'orange', dbgOn:true}
    let yAxisNumbering = new YAxisNumbering(dsObjConfig, this);
    this.zList.push(yAxisNumbering);    

  } // olive navy maroon lime

  calculateBoundaries() {
    // iterate through datasources to calculate composite limits/boundaries
    let dataSources = chartSettings.selectedDataSources;
    let dataSourceKey = dataSources[0];

    // scan data for min & max to scale data
    this.periodWindow   = chartSettings.chartWidthDays;    
    this.endIndex       = chartSettings.endIndex;
    this.startIndex     = this.endIndex - this.periodWindow;
    this.xIncrement_pc  = (100 / this.periodWindow);
    
    let min = parseFloat(dtkChartData[this.startIndex][dataSourceKey]);
    let max = parseFloat(dtkChartData[this.startIndex][dataSourceKey]);
    
    for (let i = this.startIndex; i < this.endIndex; i++){
      console.log(`[i]: [${i}] <`);
      console.log(dtkChartData[i]);
      let dataPoint = parseFloat(dtkChartData[i][dataSourceKey]);
      if (min > dataPoint) min = dataPoint;
      if (max < dataPoint) max = dataPoint;
    }

    // when iterating data sources 
    // TODO H - comapare with current values before settign new ones

    this.dataMin      = min;          // mark axis values starting at whole number between dataMin & AxisMin
    this.yAxisMinVal  = min -1;
    this.dataMax      = max;
    this.yAxisMaxVal  = max +1;
    this.yAxisRange   = this.yAxisMaxVal - this.yAxisMinVal;

    console.log(`periodWindow: ${this.periodWindow}\tstartIndex:  ${this.startIndex}\tthis.endIndex: ${this.endIndex}`);
    console.log(`dataMax:      ${this.dataMax}\tyAxisMaxVal: ${this.yAxisMaxVal}`);
    console.log(`dataMin:      ${this.dataMin}\tyAxisMinVal: ${this.yAxisMinVal}`);
    // console.log(`myvar:${myvar}`);
  }


  update(){
    this.calculateBoundaries();
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
      x:0, y:0, w:cnv_width, h:cnv_height,
      col_ink:'black', col_bk:'white', alpha:'100', fontSize:10, col_bbox:'olive', dbgOn:true },
    chartSettings ) ;

  progressChart.update(); // pass in state: 7day, 14d, 21d, 1m, 3m, 6m, 1y, 2y, plus new dimensions

  // runAnimation(time => {
  //   // pass in state: 7day, 14d, 21d, 1m, 3m, 6m, 1y, 2y
  //   progressChart.update();
  //   display.sync();  
  // });
  return progressChart;
};


