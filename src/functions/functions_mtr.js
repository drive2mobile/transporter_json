import { mtrRouteNameEn, mtrRouteNameTc, stationLocation } from "./mtrMetaData.js";
import { downloadCsvAndConvertJson, downloadJSONFile, loadJSONFromFile, saveJSONToFile } from "../utilities/file_management.js";

async function downloadMtrRoutStopList()
{
    const url = 'https://opendata.mtr.com.hk/data/mtr_lines_and_stations.csv';
    const downloadFilePath = './download/mtr/raw/routeStopList.json';
    await downloadCsvAndConvertJson(url, downloadFilePath);
}

async function createMtrRouteList()
{
    const readFilePath = './download/mtr/raw/routeStopList.json';
    const RAW_stop_list = await loadJSONFromFile(readFilePath);

    const addedStationMap = {};
    const routeStopListUnsorted = {};

    for (var i = 0; i < RAW_stop_list.length; i++)
    {
        const currItem = RAW_stop_list[i];
        if (currItem['Line Code'] != '')
        {
            const directionArr = currItem['Direction'].split('-');
            var id_temp = '';
            var stop_id_temp = '';

            if (directionArr.length == 2)
            {
                id_temp = 'mtr_' + currItem['Line Code'];
                stop_id_temp = currItem['Line Code'] + '_' + currItem['Station Code'];
            }
            else
            {
                id_temp = 'mtr_' + currItem['Line Code'];
                stop_id_temp = currItem['Line Code'] + '_' + currItem['Station Code'];
            }

            var insertItem = {}
            try
            {
                insertItem = {
                    "company": "mtr",
                    "stop_id": `mtr_${currItem['Line Code']}_${currItem['Station Code']}_${currItem['Sequence'].toString().split('.')[0]}`,
                    "id": id_temp,
                    "route": currItem['Line Code'],
                    "route_name_tc": mtrRouteNameTc[currItem['Line Code']],
                    "route_name_en": mtrRouteNameEn[currItem['Line Code']],
                    "name_en": currItem['English Name'],
                    "name_tc": currItem['Chinese Name'],
                    "seq": currItem['Sequence'].toString().split('.')[0],
                    "stop": currItem['Station Code'],
                    "lat": stationLocation[currItem['Station Code']]['lat'],
                    "long": stationLocation[currItem['Station Code']]['long']
                }
            }
            catch (error)
            {
                console.log(error);
                console.log(currItem);
            }

            if (stop_id_temp in addedStationMap == false)
            {
                if (id_temp in routeStopListUnsorted)
                    routeStopListUnsorted[id_temp].push(insertItem);
                else
                {
                    var newArr = [insertItem];
                    routeStopListUnsorted[id_temp] = newArr;
                }

                addedStationMap[stop_id_temp] = stop_id_temp;
            }
        }
    }

    const routeStopListSorted = {};
    for (const key in routeStopListUnsorted)
    {
        const currArray = routeStopListUnsorted[key];
        const sorted = [...currArray].sort((a, b) => {
            return parseInt(a.seq) - parseInt(b.seq);
        });
        routeStopListSorted[key] = sorted;
    }

    const filePath2 = './download/mtr/output/routeStopList_mtr.json';
    await saveJSONToFile(filePath2, routeStopListSorted);

    // PARSE ROUTE LIST
    var newRouteList = [];
    for (const key in routeStopListSorted)
    {
        var currArray = routeStopListSorted[key];
        var firstStop1 = currArray[0];
        var firstStop2 = currArray[0]['seq'] == currArray[1]['seq'] ? currArray[1] : null;
        var lastStop1 = currArray[currArray.length-1];
        var lastStop2 = currArray[currArray.length-1]['seq'] == currArray[currArray.length-2]['seq'] ? currArray[currArray.length-2] : null;


        var insertItem = {};
        insertItem['company'] = 'mtr';
        insertItem['id'] = firstStop1['id'];
        insertItem['route'] = firstStop1['route'];
        insertItem['direction'] = firstStop1['direction'];
        insertItem['from_en'] = firstStop1['name_en'] + (firstStop2 ? `/${firstStop2['name_en']}` : '');
        insertItem['from_tc'] = firstStop1['name_tc'] + (firstStop2 ? `/${firstStop2['name_tc']}` : '');
        insertItem['to_en'] = lastStop1['name_en'] + (lastStop2 ? `/${lastStop2['name_en']}` : '');
        insertItem['to_tc'] = lastStop1['name_tc'] + (lastStop2 ? `/${lastStop2['name_tc']}` : '');

        newRouteList.push(insertItem);
    }

    const filePath = './download/mtr/output/routeList_mtr.json';
    await saveJSONToFile(filePath, newRouteList);
}

export { downloadMtrRoutStopList, createMtrRouteList }