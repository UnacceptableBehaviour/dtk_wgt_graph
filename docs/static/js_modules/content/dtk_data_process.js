//import { dtkTestRecord } from './dtk_data_bk.js';   // all data
import { dtkTestRecord } from '/static/data/dtk_data.js';      // 2 weeks

const sortedArray = Object.keys(dtkTestRecord)
.sort((a, b) => a - b)
.map(key => dtkTestRecord[key]);

console.log(sortedArray);

const MS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
console.log(`MS_IN_ONE_DAY: ${MS_IN_ONE_DAY}`);


// gapsFilledWithSyntheticBlank - insert missing days into data
function gapsFilledWithSyntheticBlank(data){
    console.log(`scanning for gaps - [${Object.keys(dtkTestRecord).length}]`);
    // Sort the keys (timestamps)
    let keys = Object.keys(data).sort();

    // Initialize the result with the first day's data
    let result = { [keys[0]]: data[keys[0]] };

    // Iterate over the sorted keys
    for (let i = 1; i < keys.length; i++) {
        // Get the current and previous dates
        let currentDate = new Date(parseInt(keys[i]));
        let previousDate = new Date(parseInt(keys[i - 1]));

        // Add the current day's data to the result
        result[keys[i]] = data[keys[i]];

        // Check if a day is missing
        while ((currentDate - previousDate) > MS_IN_ONE_DAY) {
            // Subtract one day from the current date
            currentDate.setDate(currentDate.getDate() - 1);

            // Create a new timestamp for the missing day at 5AM
            let newTimestamp = currentDate.setHours(5, 0, 0, 0);            

            // currentDate.toISOString() returns (YYYY-MM-DDTHH:mm:ss.sssZ   OR   ±YYYYYY-MM-DDTHH:mm:ss.sssZ)
            let currentDateReadable = currentDate.toISOString().split('T')[0].replace(/-/g, ' ');

            if (currentDateReadable === data[keys[i-1]].dtk_rcp.dt_date_readable ){
                console.log(`OVERLAP - ${currentDateReadable} === ${data[keys[i-1]].dtk_rcp.dt_date_readable} - NOT adding synthetic data`);
                break;
            }
            // Add a new object for the missing day to the result            
            result[newTimestamp] = {
                synthetic: true,
                dtk_rcp: {
                    dt_date: newTimestamp,
                    dt_date_readable: currentDateReadable,
                    dt_day: currentDate.toString().split(' ')[0].toLowerCase()                    
                },
            };
        }
    }

    return result;
}

// interpolate data from start/end points of gap
function addInterpolatedDataToGaps(){
    console.log(`adding rolling average data - BEFORE: [${Object.keys(dtkTestRecord).length}]`);
    const data = gapsFilledWithSyntheticBlank(dtkTestRecord); // 
    console.log(data);
    console.log(`adding rolling average data - AFTER: [${Object.keys(data).length}]`);

    // Sort the keys (timestamps)
    let keys = Object.keys(data).sort();

    // Initialize the result with the first day's data
    let result = { [keys[0]]: data[keys[0]] };

    // Initialize variables to store the start and end points for interpolation
    let start = null;
    let end = null;

    // Iterate over the sorted keys
    for (let i = 0; i < keys.length; i++) {
        // If the current entry is synthesized
        if (data[keys[i]].synthetic) {
            // If this is the first synthesized entry in a sequence
            if (start === null) {
                start = data[keys[i - 1]];
                start.i = i;
            }

            // Add the current entry to the result without modifying it
            result[keys[i]] = data[keys[i]];
        } else {
            // If this is the end of a sequence of synthesized entries
            if (start !== null) {
                end = data[keys[i]];
                end.i = i;

                // Calculate the number of steps for interpolation
                //let steps = (end.dtk_rcp.dt_date - start.dtk_rcp.dt_date) / MS_IN_ONE_DAY;
                let steps = end.i - start.i + 1;

                // Interpolate the values for each synthesized entry in the sequence
                for (let j = 1, alt_i = start.i; j < steps; j++, alt_i++) {
                    //let timestamp = start.dtk_rcp.dt_date + j * MS_IN_ONE_DAY;
                    let timestamp = keys[alt_i];

                    result[timestamp].dtk_pc_fat = parseFloat( parseFloat(start.dtk_pc_fat) + j * (parseFloat(end.dtk_pc_fat) - parseFloat(start.dtk_pc_fat)) / steps).toFixed(1);
                    result[timestamp].dtk_pc_h2o = parseFloat( parseFloat(start.dtk_pc_h2o) + j * (parseFloat(end.dtk_pc_h2o) - parseFloat(start.dtk_pc_h2o)) / steps).toFixed(1);
                    result[timestamp].dtk_weight = parseFloat( parseFloat(start.dtk_weight) + j * (parseFloat(end.dtk_weight) - parseFloat(start.dtk_weight)) / steps).toFixed(1);
                }

                // Reset the start and end points for interpolation
                start = null;
                end = null;
            }

            // Add the current entry to the result without modifying it
            result[keys[i]] = data[keys[i]];
        }
    }

    return result;
}

function addH2OFatInKGtoDataPointsARRAY() {
    let data = addInterpolatedDataToGaps();

    return data.map(item => {
        let weight = parseFloat(item.dtk_weight);
        let pc_fat = parseFloat(item.dtk_pc_fat);
        let pc_h2o = parseFloat(item.dtk_pc_h2o);
        
        item.dtk_kg_fat = (pc_fat / 100 * weight).toFixed(1);
        item.dtk_kg_h2o = (pc_h2o / 100 * weight).toFixed(1);
        
        return item;
    });
}

function addH2OFatInKGtoDataPointsOBJECT() {
    let data = addInterpolatedDataToGaps();

    for (let key in data) {
        let item = data[key];
        let weight = parseFloat(item.dtk_weight);
        let pc_fat = parseFloat(item.dtk_pc_fat);
        let pc_h2o = parseFloat(item.dtk_pc_h2o);
        
        item.dtk_kg_fat = (pc_fat / 100 * weight).toFixed(1);
        item.dtk_kg_h2o = (pc_h2o / 100 * weight).toFixed(1);
    }
    return data;
}


// TODO create some test data for this - ESP: start of / end of set
function add7DayRollingAverages() {
    let data = addH2OFatInKGtoDataPointsOBJECT();

    let keysToAverage = ["dtk_pc_fat", "dtk_pc_h2o", "dtk_weight", "dtk_kg_fat", "dtk_kg_h2o"];
    let sortedKeys = Object.keys(data).sort();
    
    for (let i = 0; i < sortedKeys.length; i++) {
        let item = data[sortedKeys[i]];
        
        for (let key of keysToAverage) {
            let sum = 0;
            let count = 0;
            
            for (let j = i - 1; j >= 0 && j >= i - 7; j--) {
                let prevItem = data[sortedKeys[j]];
                
                if (prevItem[key]) {
                    sum += parseFloat(prevItem[key]);
                    count++;
                }
            }
            
            if (count > 0) {
                item[key + "_av7"] = (sum / count).toFixed(1);
            }
        }
    }
    
    return data;
}





function processDataSet(){
    console.log(`processDataSet - [${Object.keys(dtkTestRecord).length}]`);
    //let data = addH2OFatInKGtoDataPointsOBJECT();
    let data = add7DayRollingAverages();

    const sortedArray = Object.keys(data)
    .sort((a, b) => a - b)
    .map(key => data[key]);

    return sortedArray;
}

export let dtkChartData = processDataSet();
//export let dtkChartData = sortedArray;

console.log('dtkChartData');
console.log(dtkChartData);


