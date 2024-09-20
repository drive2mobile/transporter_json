import { downloadCsvAndConvertJson, loadJSONFromFile, saveJSONToFile } from "../src/utilities/file_management.js";

async function downloadRouteStopListMtrBus()
{
    const url = 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fopendata.mtr.com.hk%2Fdata%2Fmtr_bus_stops.csv';
    const downloadFilePath = './download/mtrbus/raw/routeStop/routeStopList.json';
    await downloadCsvAndConvertJson(url, downloadFilePath);
}

async function parseJsonMtrBus(lang)
{
    const readFilePath = './download/mtrbus/raw/routeStop/routeStopList.json';
    const routeStopListJson = await loadJSONFromFile(readFilePath);
    
    var routeStopListMap = {};

    for(var i=0 ; i<routeStopListJson.length ; i++)
    {
        const currItem = routeStopListJson[i];
        const route_id_temp = currItem['ROUTE_ID'] + '_' + currItem['DIRECTION']; 

        if (route_id_temp in routeStopListMap)
            routeStopListMap[route_id_temp].push(currItem);
        else
        {
            var newArr = [currItem];
            routeStopListMap[route_id_temp] = newArr;
        }
    }

    var newRouteList = []
    for (const key in routeStopListMap)
    {
        var currArray = routeStopListMap[key];
        var firstStop = currArray[0];
        var lastStop = currArray[currArray.length-1];

        const route_id = 'mtrbus_' + firstStop['ROUTE_ID'] + '_' + firstStop['DIRECTION'];
        var item = {};
        item['company'] = 'mtrbus';
        item['route_id'] = route_id;
        item['route'] = firstStop['ROUTE_ID'];
        item['dir'] = firstStop['DIRECTION'];
        item['from'] = firstStop[`STATION_NAME_${lang == 'tc' ? 'CHI' :'ENG'}`];
        item['to'] = lastStop[`STATION_NAME_${lang == 'tc' ? 'CHI' :'ENG'}`];

        newRouteList.push(item);
    }

    const filePath = `./download/mtrbus/output/routeList_mtrbus_${lang}.json`;
    await saveJSONToFile(filePath, newRouteList);

    var newRouteStopList = {}
    for (const key in routeStopListMap)
    {
        var currArray = routeStopListMap[key];
        var firstStop = currArray[0];
        var lastStop = currArray[currArray.length-1];
        const route_id = 'mtrbus_' + firstStop['ROUTE_ID'] + '_' + firstStop['DIRECTION'];

        var newRouteArray = [];
        for (var j=0 ; j<currArray.length ; j++)
        {
            var newStop = {};
            newStop['company'] = 'mtrbus';
            newStop['route_id'] = route_id;
            newStop['route'] = firstStop['ROUTE_ID'];
            newStop['dir'] = firstStop['DIRECTION'];
            newStop['from'] = firstStop[`STATION_NAME_${lang == 'tc' ? 'CHI' :'ENG'}`];
            newStop['to'] = lastStop[`STATION_NAME_${lang == 'tc' ? 'CHI' :'ENG'}`];
            newStop['name'] = currArray[j][`STATION_NAME_${lang == 'tc' ? 'CHI' :'ENG'}`];
            newStop['seq'] = currArray[j]['STATION_SEQNO'];
            newStop['stop'] = currArray[j]['STATION_ID'];
            newStop['lat'] = currArray[j]['STATION_LATITUDE'];
            newStop['long'] = currArray[j]['STATION_LONGITUDE'];

            newRouteArray.push(newStop);
        }

        newRouteStopList[route_id] = newRouteArray;
    }

    const filePath2 = `./download/mtrbus/output/routeStopList_mtrbus_${lang}.json`;
    await saveJSONToFile(filePath2, newRouteStopList);
}

export {downloadRouteStopListMtrBus, parseJsonMtrBus}