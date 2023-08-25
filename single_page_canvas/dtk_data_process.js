import { dtkTestRecord } from './dtk_data.js';


const sortedArray = Object.keys(dtkTestRecord)
.sort((a, b) => a - b)
.map(key => dtkTestRecord[key]);

console.log(sortedArray);

// TODO
// scanForGaps - insert missing days into data
// interpolate data from start/end points of gap
function scanForGaps(){
    console.log(`scanning for gaps - [${Object.keys(dtkTestRecord).length}]`);
    return sortedArray;
}

function addRollingAverageData(){
    console.log(`adding rolling average data - [${Object.keys(dtkTestRecord).length}]`);
    return scanForGaps();
}

function processDataSet(){
    console.log(`processDataSet - [${Object.keys(dtkTestRecord).length}]`);
    return addRollingAverageData();
}

export let dtkChartInfo = processDataSet()