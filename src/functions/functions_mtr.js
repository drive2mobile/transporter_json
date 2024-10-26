import { mtrRouteNameEn, mtrRouteNameTc, routeName, stationLocation } from "./mtrMetaData.js";
import { downloadCsvAndConvertJson, downloadJSONFile, loadJSONFromFile, saveJSONToFile } from "./functions_utilities.js";

async function downloadMtrRoutStopList(){
    const url = 'https://opendata.mtr.com.hk/data/mtr_lines_and_stations.csv';
    const downloadFilePath = './download/mtr/RAW_route_stop_list.json';
    await downloadCsvAndConvertJson(url, downloadFilePath);
}

async function createMtrRouteList()
{
    const readFilePath = './download/mtr/RAW_route_stop_list.json';
    const ARRAY_route_stop_list = await loadJSONFromFile(readFilePath);
    
    var routeStopListMap = {};

    for(var i=0 ; i<ARRAY_route_stop_list.length ; i++)
    {
        const currItem = ARRAY_route_stop_list[i];
        if (currItem['Line Code'] != '')
        {
            const route_id_temp = currItem['Line Code'] + '_' + currItem['Direction']; 

            if (route_id_temp in routeStopListMap)
                routeStopListMap[route_id_temp].push(currItem);
            else
            {
                var newArr = [currItem];
                routeStopListMap[route_id_temp] = newArr;
            }
        }
    }

    var newRouteList = {}
    for (const key in routeStopListMap)
    {
        var currArray = routeStopListMap[key];
        var firstStop = currArray[0];
        var lastStop = currArray[currArray.length-1];

        const directionArr = firstStop['Direction'].split('-');
        var route_id = '';
        var route = '';
        var direction = ''
        if (directionArr.length == 2)
        {
            route = firstStop['Line Code'] + '-' + directionArr[0];
            direction = directionArr[1] == 'UT' ? 'UP' : 'DOWN';
            route_id = 'mtr' + firstStop['Line Code']+'-'+directionArr[0] + '_' + direction + '1';
        }
        else
        {
            route = firstStop['Line Code'];
            direction = firstStop['Direction'] == 'UT' ? 'UP' : 'DOWN';
            route_id = 'mtr' + firstStop['Line Code'] + '_' + direction + '1';
        }

        var item = {};
        item['company'] = 'mtr';
        item['route_id'] = route_id;
        item['route'] = route;
        item['direction'] = direction;
        item['orig_en'] = firstStop['English Name'] + ' (' + mtrRouteNameEn[route] + ')';
        item['orig_tc'] = firstStop['Chinese Name'] + ' (' + mtrRouteNameTc[route] + ')';
        item['orig_sc'] = firstStop['Chinese Name'] + ' (' + mtrRouteNameTc[route] + ')';
        item['dest_en'] = lastStop['English Name'] + ' (' + mtrRouteNameEn[route] + ')';
        item['dest_tc'] = lastStop['Chinese Name'] + ' (' + mtrRouteNameTc[route] + ')';
        item['dest_sc'] = lastStop['Chinese Name'] + ' (' + mtrRouteNameTc[route] + ')';

        newRouteList[route_id] = item;
    }

    const filePath = './download/mtr/TEMP_route_list.json';
    await saveJSONToFile(filePath, newRouteList);

    var newRouteStopList = {}
    for (const key in routeStopListMap)
    {
        var currArray = routeStopListMap[key];
        var firstStop = currArray[0];
        var lastStop = currArray[currArray.length-1];

        var newRouteArray = [];
        for (var j=0 ; j<currArray.length ; j++)
        {
            const directionArr = firstStop['Direction'].split('-');
            var route_id = '';
            var route = '';
            var direction = ''
            if (directionArr.length == 2)
            {
                route = firstStop['Line Code'] + '-' + directionArr[0];
                direction = directionArr[1] == 'UT' ? 'UP' : 'DOWN';
                route_id = 'mtr' + firstStop['Line Code']+'-'+directionArr[0] + '_' + direction + '1';
            }
            else
            {
                route = firstStop['Line Code'];
                direction = firstStop['Direction'] == 'UT' ? 'UP' : 'DOWN';
                route_id = 'mtr' + firstStop['Line Code'] + '_' + direction + '1';
            }

            var newStop = {};
            newStop['company'] = 'mtr';
            newStop['route_id'] = route_id;
            newStop['route'] = route;
            newStop['direction'] = direction;
            newStop['orig_en'] = firstStop['English Name'] + ' (' + mtrRouteNameEn[route] + ')';
            newStop['orig_tc'] = firstStop['Chinese Name'] + ' (' + mtrRouteNameTc[route] + ')';
            newStop['orig_sc'] = firstStop['Chinese Name'] + ' (' + mtrRouteNameTc[route] + ')';
            newStop['dest_en'] = lastStop['English Name'] + ' (' + mtrRouteNameEn[route] + ')';
            newStop['dest_tc'] = lastStop['Chinese Name'] + ' (' + mtrRouteNameTc[route] + ')';
            newStop['dest_sc'] = lastStop['Chinese Name'] + ' (' + mtrRouteNameTc[route] + ')';
            newStop['name_en'] = currArray[j]['English Name'];
            newStop['name_tc'] = currArray[j]['Chinese Name'];
            newStop['name_sc'] = currArray[j]['Chinese Name'];
            newStop['seq'] = currArray[j]['Sequence'].substring(0, currArray[j]['Sequence'].length - 3);;
            newStop['stop'] = currArray[j]['Station Code'];
            var currStationLatLong = stationLocation[currArray[j]['Station Code']];
            newStop['lat'] = currStationLatLong['lat'];
            newStop['long'] = currStationLatLong['long'];
           
            newRouteArray.push(newStop);
        }

        newRouteStopList[route_id] = newRouteArray;
    }

    const filePath2 = './download/mtr/TEMP_route_stop_list.json';
    await saveJSONToFile(filePath2, newRouteStopList);
}

export { downloadMtrRoutStopList, createMtrRouteList }