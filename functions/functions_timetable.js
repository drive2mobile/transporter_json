import fs from 'fs';
import { saveJSONToFile } from './functions_utilities.js';

async function processTimetable(){
    const data1 = fs.readFileSync('./download/timetable/frequencies.txt', 'utf8');
    const lines1 = data1.split(/\r?\n/);

    var frequencyMap = {};
    lines1.forEach((line, index) => {
        if (index != 0)
        {
            const currLine = line.split(',');
            const frequencyID = currLine[0] != undefined ? currLine[0] : "";
            const timeFrom = currLine[1] != undefined ? currLine[1].substring(0,5) : "";
            const timeTo = currLine[2] != undefined ? currLine[2].substring(0,5) : "";
            const frequency = currLine[3] != undefined ? Math.round(parseInt(currLine[3])/60) : 0;

            frequencyMap[frequencyID] = {'startTime': timeFrom + ' - ' + timeTo, 'frequency': frequency};
        }
    });
    const filePath0 = './download/timetable/TEMP_frequencyMap.json';
    await saveJSONToFile(filePath0, frequencyMap);

    const data2 = fs.readFileSync('./download/timetable/routes.txt', 'utf8');
    const lines2 = data2.split(/\r?\n/);

    var routesMap = {};
    lines2.forEach((line, index) => {
        if (index != 0)
        {
            const currLine = line.split(',');
            const routeID = currLine[0] != undefined ? currLine[0] : "";
            var company = currLine[1] != undefined ? currLine[1] : "";
            if (company == 'KMB+CTB') { company = 'kmbctb'; }
            else if (company == 'CTB') { company = 'ctb'; }
            else if (company == 'KMB') { company = 'kmb'; }
            else if (company == 'LWB') { company = 'kmb'; }
            const routeNumber = currLine[2] != undefined ? currLine[2] : "";

            routesMap[routeID] = company+routeNumber;
        }
    });
    const filePath1 = './download/timetable/TEMP_routeMap.json';
    await saveJSONToFile(filePath1, routesMap);

    const data3 = fs.readFileSync('./download/timetable/trips.txt', 'utf8');
    const lines3 = data3.split(/\r?\n/);

    var timeTableMap = {};
    lines3.forEach((line, index) => {
        if (index != 0)
        {
            const currLine = line.split(',');

            const routeID = currLine[0] != undefined ? currLine[0] : "";
            const weekday = currLine[1] != undefined ? currLine[1] : "";
            const tripID = currLine[2] != undefined ? currLine[2] : "";

            var startTime = "";
            var dir = "";
            var key = "";
            try { startTime =  tripID.split('-')[3].slice(0, 2) + ':' + tripID.split('-')[3].slice(2); } catch(e) {}
            try { dir = tripID.split('-')[1] == '1' ? 'O' : 'I'; } catch(e) {}
            try { key = routesMap[routeID] + '_' + dir + '1'; } catch(e) {}

            if (key in timeTableMap == false)
            {
                timeTableMap[key] = {};
            }

            if (weekday in timeTableMap[key] == false)
            {
                var newArray = [];
                timeTableMap[key][weekday] = newArray;
            }

            if (tripID in frequencyMap)
            {
                timeTableMap[key][weekday].push(
                    {'weekday':weekday, 
                    'startTime':frequencyMap[tripID]['startTime'], 
                    'frequency':frequencyMap[tripID]['frequency']}
                );
            }
            else
                timeTableMap[key][weekday].push({'weekday':weekday, 'startTime':startTime});
        }
    });

    const filePath = './download/output/FINAL_timetable.json';
    await saveJSONToFile(filePath, timeTableMap);

    // return routesMap;

    // return timeTableMap;

    // return frequencyMap;
}

export {processTimetable}