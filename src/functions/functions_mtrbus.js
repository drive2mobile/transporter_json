import { downloadCsvAndConvertJson, downloadJSONFile, loadJSONFromFile, saveJSONToFile } from "./functions_utilities.js";

async function downloadMtrbusRoutStopList(){
    const url = 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fopendata.mtr.com.hk%2Fdata%2Fmtr_bus_stops.csv';
    const downloadFilePath = './download/mtrbus/RAW_route_stop_list.json';
    await downloadCsvAndConvertJson(url, downloadFilePath);
}

async function createMtrbusRouteList()
{
    const readFilePath = './download/mtrbus/RAW_route_stop_list.json';
    const ARRAY_route_stop_list = await loadJSONFromFile(readFilePath);
    
    var routeStopListMap = {};

    for(var i=0 ; i<ARRAY_route_stop_list.length ; i++)
    {
        const currItem = ARRAY_route_stop_list[i];
        const route_id_temp = currItem['ROUTE_ID'] + '_' + currItem['DIRECTION']; 

        if (route_id_temp in routeStopListMap)
            routeStopListMap[route_id_temp].push(currItem);
        else
        {
            var newArr = [currItem];
            routeStopListMap[route_id_temp] = newArr;
        }
    }

    var newRouteList = {}
    for (const key in routeStopListMap)
    {
        var currArray = routeStopListMap[key];
        var firstStop = currArray[0];
        var lastStop = currArray[currArray.length-1];

        const route_id = 'mtrbus' + firstStop['ROUTE_ID'] + '_' + firstStop['DIRECTION'] + '1';
        var item = {};
        item['company'] = 'mtrbus';
        item['route_id'] = route_id;
        item['route'] = firstStop['ROUTE_ID'];
        item['direction'] = firstStop['DIRECTION'];
        item['orig_en'] = firstStop['STATION_NAME_ENG'];
        item['orig_tc'] = firstStop['STATION_NAME_CHI'];
        item['orig_sc'] = firstStop['STATION_NAME_CHI'];
        item['dest_en'] = lastStop['STATION_NAME_ENG'];
        item['dest_tc'] = lastStop['STATION_NAME_CHI'];
        item['dest_sc'] = lastStop['STATION_NAME_CHI'];

        newRouteList[route_id] = item;
    }

    const filePath = './download/mtrbus/TEMP_route_list.json';
    await saveJSONToFile(filePath, newRouteList);

    var newRouteStopList = {}
    for (const key in routeStopListMap)
    {
        var currArray = routeStopListMap[key];
        var firstStop = currArray[0];
        var lastStop = currArray[currArray.length-1];
        const route_id = 'mtrbus' + firstStop['ROUTE_ID'] + '_' + firstStop['DIRECTION'] + '1';

        var newRouteArray = [];
        for (var j=0 ; j<currArray.length ; j++)
        {
            var newStop = {};
            newStop['company'] = 'mtrbus';
            newStop['route_id'] = route_id;
            newStop['route'] = firstStop['ROUTE_ID'];
            newStop['direction'] = firstStop['DIRECTION'];
            newStop['orig_en'] = firstStop['STATION_NAME_ENG'];
            newStop['orig_tc'] = firstStop['STATION_NAME_CHI'];
            newStop['orig_sc'] = firstStop['STATION_NAME_CHI'];
            newStop['dest_en'] = lastStop['STATION_NAME_ENG'];
            newStop['dest_tc'] = lastStop['STATION_NAME_CHI'];
            newStop['dest_sc'] = lastStop['STATION_NAME_CHI'];
            newStop['name_en'] = currArray[j]['STATION_NAME_ENG'];
            newStop['name_tc'] = currArray[j]['STATION_NAME_CHI'];
            newStop['name_sc'] = currArray[j]['STATION_NAME_CHI'];
            newStop['seq'] = currArray[j]['STATION_SEQNO'];
            newStop['stop'] = currArray[j]['STATION_ID'];
            newStop['lat'] = currArray[j]['STATION_LATITUDE'];
            newStop['long'] = currArray[j]['STATION_LONGITUDE'];

            newRouteArray.push(newStop);
        }

        newRouteStopList[route_id] = newRouteArray;
    }

    const filePath2 = './download/mtrbus/TEMP_route_stop_list.json';
    await saveJSONToFile(filePath2, newRouteStopList);
}

export { downloadMtrbusRoutStopList, createMtrbusRouteList }