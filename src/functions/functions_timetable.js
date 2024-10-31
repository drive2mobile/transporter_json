import fs from 'fs';
import { saveJSONToFile } from '../utilities/file_management.js';

async function processTimetable()
{
    const data1 = fs.readFileSync('./download/timetable/frequencies.txt', 'utf8');
    const lines1 = data1.split(/\r?\n/);

    // Generate frequency map: e.g. [frequencyID]:{ startTime: '07:10-08:00, 'frequency':'25' }
    var frequencyMap = {};
    lines1.forEach((line, index) =>
    {
        if (index != 0)
        {
            const currLine = line.split(',');
            const frequencyID = currLine[0] != undefined ? currLine[0] : "";
            const timeFrom = currLine[1] != undefined ? currLine[1].substring(0, 5) : "";
            const timeTo = currLine[2] != undefined ? currLine[2].substring(0, 5) : "";
            const frequency = currLine[3] != undefined ? Math.round(parseInt(currLine[3]) / 60) : 0;

            frequencyMap[frequencyID] = { 'timeRange': timeFrom + ' - ' + timeTo, 'frequency': frequency };
        }
    });
    const filePath0 = './download/timetable/TEMP_frequencyMap.json';
    await saveJSONToFile(filePath0, frequencyMap);


    // Generate route map: [routeID]: { 'meta':'kmb12A', 'from':'ABC', 'to':'DEF' }]
    const data2 = fs.readFileSync('./download/timetable/routes.txt', 'utf8');
    const lines2 = data2.split(/\r?\n/);

    var routesMap = {};
    lines2.forEach((line, index) =>
    {
        if (index != 0)
        {
            const currLine = line.split(',');
            const routeID = currLine[0] != undefined ? currLine[0] : "";
            var company = currLine[1] != undefined ? currLine[1] : "";

            if (company == 'CTB') { company = 'ctb'; }
            else if (company == 'GMB') { company = 'gmb'; }
            else if (company == 'KMB') { company = 'kmb'; }
            else if (company == 'KMB+CTB') { company = 'kmbctb'; }
            else if (company == 'LRTFeeder') { company = 'mtrbus'; }
            else if (company == 'LWB') { company = 'kmb'; }

            const routeNumber = currLine[2] != undefined ? currLine[2] : "";
            const from = currLine[3] != undefined ? currLine[3].split(' - ')[0] : "";
            const to = currLine[3] != undefined ? currLine[3].split(' - ')[1] : "";
            routesMap[routeID] = { 'meta': company + '_' + routeNumber, 'from': from, 'to': to };
        }
    });
    const filePath1 = './download/timetable/TEMP_routeMap.json';
    await saveJSONToFile(filePath1, routesMap);


    // Mapping frequency to route 
    const data3 = fs.readFileSync('./download/timetable/trips.txt', 'utf8');
    const lines3 = data3.split(/\r?\n/);

    var timeTableMap = {};
    lines3.forEach((line, index) =>
    {
        if (index != 0)
        {
            const currLine = line.split(',');

            const routeID = currLine[0] != undefined ? currLine[0] : "";
            const weekday = currLine[1] != undefined ? currLine[1] : "";
            const tripID = currLine[2] != undefined ? currLine[2] : "";

            var time = "";
            var dir = "";
            var key = "";
            try { time = tripID.split('-')[3].slice(0, 2) + ':' + tripID.split('-')[3].slice(2); } catch (e) { }
            try { dir = tripID.split('-')[1]; } catch (e) { }
            try { key = routesMap[routeID]['meta'] + '_' + dir; } catch (e) { }

            if (key in timeTableMap == false)
            {
                if (dir == '1')
                    timeTableMap[key] = { 'from': routesMap[routeID]['from'], 'schedule':{} };
                else
                    timeTableMap[key] = { 'from': routesMap[routeID]['to'], 'schedule':{} };
            }

            if (weekday in timeTableMap[key]['schedule'] == false)
            {
                var newArray = [];
                timeTableMap[key]['schedule'][weekday] = newArray;
            }

            if (tripID in frequencyMap)
            {
                timeTableMap[key]['schedule'][weekday].push(
                    {
                        'weekday': weekday,
                        'type':'timeRange',
                        'time': frequencyMap[tripID]['time'],
                        'frequency': frequencyMap[tripID]['frequency']
                    }
                );
            }
            else
                timeTableMap[key]['schedule'][weekday].push({ 'weekday': weekday, 'type':'departure', 'time': time });
        }
    });

    const filePath = './download/timetable/FINAL_timetable.json';
    await saveJSONToFile(filePath, timeTableMap);

    // return routesMap;

    // return timeTableMap;

    // return frequencyMap;
}

export { processTimetable }