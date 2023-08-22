import { dtk_test_record } from './dtk_data.js';


const sortedArray = Object.keys(dtk_test_record)
.sort((a, b) => a - b)
.map(key => dtk_test_record[key]);

console.log(sortedArray);

// TODO
// scanForGaps - insert missing days into data
// interpolate data from start/end points of gap
function scanForGaps(){
    console.log(`scanning for gaps - [${Object.keys(dtk_test_record).length}]`);
    return dtk_test_record;
}

function addRollingAverageData(){
    console.log(`adding rolling average data - [${Object.keys(dtk_test_record).length}]`);
    return scanForGaps();
}

function processDataSet(){
    console.log(`processDataSet - [${Object.keys(dtk_test_record).length}]`);
    return addRollingAverageData();
}

export let dtk_chart_info = processDataSet()