import { downloadJSONFile, loadJSONFromFile, saveJSONToFile, deleteFilesInFolder } from './functions_utilities.js';
import { coopRoutes } from '../config.js';

async function downloadKmbRoutList(){
    const url = 'https://data.etabus.gov.hk/v1/transport/kmb/route/';
    const downloadFilePath = './download/kmb/RAW_route_list.json';
    await downloadJSONFile(url, downloadFilePath);

    const readFilePath = './download/kmb/RAW_route_list.json';
    const RAW_route_list = await loadJSONFromFile(readFilePath);
    
    var ARRAYStopList = {};
    for (var i=0 ; i<RAW_route_list['data'].length ; i++)
    {
        if (RAW_route_list['data'][i]['route'] in ARRAYStopList == false)
        {
            ARRAYStopList[RAW_route_list['data'][i]['route']] = 
            {
                "orig_en": RAW_route_list['data'][i]['orig_en'],
                "orig_tc": RAW_route_list['data'][i]['orig_tc'],
                "orig_sc": RAW_route_list['data'][i]['orig_sc'],
                "dest_en": RAW_route_list['data'][i]['dest_en'],
                "dest_tc": RAW_route_list['data'][i]['dest_tc'],
                "dest_sc": RAW_route_list['data'][i]['dest_sc']
            }
        }
    }

    const saveFilePath = './download/kmb/ARRAY_route_list.json';
    await saveJSONToFile(saveFilePath, ARRAYStopList);
}

async function downloadKmbRouteStopFiles(){
    const readFilePath = './download/kmb/ARRAY_route_list.json';
    const ARRAY_route_list = await loadJSONFromFile(readFilePath);

    const objectCount = Object.keys(ARRAY_route_list).length;
    var downloadCount = 1;

    for(const key in ARRAY_route_list)
    {
        const url1 = 'https://data.etabus.gov.hk/v1/transport/kmb/route-stop/'+key+'/inbound/1';
        const downloadFilePath1 = './download/kmb/routes/'+key+'_inbound.json';
        await downloadJSONFile(url1, downloadFilePath1);

        const url2 = 'https://data.etabus.gov.hk/v1/transport/kmb/route-stop/'+key+'/outbound/1';
        const downloadFilePath2 = './download/kmb/routes/'+key+'_outbound.json';
        await downloadJSONFile(url2, downloadFilePath2);

        console.log('Downloaded ' + downloadCount + '/' + objectCount);
        downloadCount++;
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
    
    var arrayStopList = {};
    for(const key in ARRAY_route_list)
    {
        const readFilePath1 = './download/kmb/routes/'+key+'_inbound.json';
        const routeStopList1 = await loadJSONFromFile(readFilePath1);

        for (var i=0 ; i<routeStopList1['data'].length ; i++)
        {
            arrayStopList[routeStopList1['data'][i]['stop']] = routeStopList1['data'][i]['stop'];
        }

        const readFilePath2 = './download/kmb/routes/'+key+'_outbound.json';
        const routeStopList2 = await loadJSONFromFile(readFilePath2);

        for (var i=0 ; i<routeStopList2['data'].length ; i++)
        {
            arrayStopList[routeStopList2['data'][i]['stop']] = routeStopList2['data'][i]['stop'];
        }
    }

    const saveFilePath = './download/kmb/ARRAY_stop_list.json';
    await saveJSONToFile(saveFilePath, arrayStopList);
}

async function downloadKmbStopFiles(){
    const readFilePath = './download/kmb/ARRAY_stop_list.json';
    const ARRAY_stop_list = await loadJSONFromFile(readFilePath);

    const objectCount = Object.keys(ARRAY_stop_list).length;
    var downloadCount = 1;

    for (const key in ARRAY_stop_list)
    {
        const url1 = 'https://data.etabus.gov.hk/v1/transport/kmb/stop/'+key;
        const downloadFilePath1 = './download/kmb/stops/'+key+'.json';
        await downloadJSONFile(url1, downloadFilePath1);

        console.log('Downloaded ' + downloadCount + '/' + objectCount);
        downloadCount++;
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
}

async function createKmbRouteList()
{
    const readFilePath = './download/kmb/ARRAY_route_list.json';
    const ARRAY_route_list = await loadJSONFromFile(readFilePath);
    
    var newRouteList = {};

    for (const key in ARRAY_route_list)
    {
        await createKmbRouteSingleItem('inbound', key, ARRAY_route_list, newRouteList);
        await createKmbRouteSingleItem('outbound', key, ARRAY_route_list, newRouteList);
    }
    
    const filePath = './download/kmb/TEMP_route_list.json';
    await saveJSONToFile(filePath, newRouteList);
}

async function createKmbRouteStopList()
{
    const readFilePath = './download/kmb/ARRAY_route_list.json';
    const ARRAY_route_list = await loadJSONFromFile(readFilePath);
    var newRouteStopList = {};

    for (const key in ARRAY_route_list)
    {
        await createKmbRouteStopSingleItem('inbound', key, ARRAY_route_list, newRouteStopList);
        await createKmbRouteStopSingleItem('outbound', key, ARRAY_route_list, newRouteStopList);
    }

    const filePath = './download/kmb/TEMP_route_stop_list.json';
    await saveJSONToFile(filePath, newRouteStopList);
}

async function createKmbRouteSingleItem(direction, key, ARRAY_route_list, newRouteList)
{
    const readFilePath = './download/kmb/routes/' + key + '_' + direction + '.json';
    const ARRAY_route_stop_list = await loadJSONFromFile(readFilePath);

    if (ARRAY_route_stop_list['data'].length > 0)
    {
        var currItem = {};
        var company = key in coopRoutes ? 'kmbctb' : 'kmb';
        var direction_short = direction == 'inbound' ? 'I':'O';
        const route_id = company + key + '_' + direction_short + '1'; 

        currItem['company'] = company;
        currItem['route_id'] = route_id;
        // currItem['route_name_tc'] = key;
        // currItem['route_name_sc'] = key;
        // currItem['route_name_en'] = key;
        currItem['route'] = key;
        currItem['direction'] = direction_short;
        // currItem['service_type'] = '1';

        if (direction == 'inbound')
        {
            currItem['orig_en'] = ARRAY_route_list[key]['dest_en'];
            currItem['orig_tc'] = ARRAY_route_list[key]['dest_tc'];
            currItem['orig_sc'] = ARRAY_route_list[key]['dest_sc'];
            currItem['dest_en'] = ARRAY_route_list[key]['orig_en'];
            currItem['dest_tc'] = ARRAY_route_list[key]['orig_tc'];
            currItem['dest_sc'] = ARRAY_route_list[key]['orig_sc'];
        }
        else
        {
            currItem['orig_en'] = ARRAY_route_list[key]['orig_en'];
            currItem['orig_tc'] = ARRAY_route_list[key]['orig_tc'];
            currItem['orig_sc'] = ARRAY_route_list[key]['orig_sc'];
            currItem['dest_en'] = ARRAY_route_list[key]['dest_en'];
            currItem['dest_tc'] = ARRAY_route_list[key]['dest_tc'];
            currItem['dest_sc'] = ARRAY_route_list[key]['dest_sc'];
        }

        newRouteList[route_id] = currItem;
    }
}

async function createKmbRouteStopSingleItem(direction, key, ARRAY_route_list, newRouteStopList)
{
    const readFilePath = './download/kmb/routes/' + key + '_' + direction + '.json';
    const ARRAY_route_stop_list = await loadJSONFromFile(readFilePath);

    for (var i=0 ; i<ARRAY_route_stop_list['data'].length ; i++)
    {
        var currItem = {};
        var company = key in coopRoutes ? 'kmbctb' : 'kmb';
        var direction_short = direction == 'inbound' ? 'I':'O';

        const route_id = company + key + '_' + direction_short + '1';  
        
        currItem['company'] = company;
        currItem['route_id'] = route_id;
        // currItem['route_name_tc'] = key;
        // currItem['route_name_sc'] = key;
        // currItem['route_name_en'] = key;
        currItem['route'] = key;
        currItem['direction'] = direction_short;
        // currItem['service_type'] = '1';
        
        if (direction == 'inbound')
        {
            currItem['orig_en'] = ARRAY_route_list[key]['dest_en'];
            currItem['orig_tc'] = ARRAY_route_list[key]['dest_tc'];
            currItem['orig_sc'] = ARRAY_route_list[key]['dest_sc'];
            currItem['dest_en'] = ARRAY_route_list[key]['orig_en'];
            currItem['dest_tc'] = ARRAY_route_list[key]['orig_tc'];
            currItem['dest_sc'] = ARRAY_route_list[key]['orig_sc'];
        }
        else
        {
            currItem['orig_en'] = ARRAY_route_list[key]['orig_en'];
            currItem['orig_tc'] = ARRAY_route_list[key]['orig_tc'];
            currItem['orig_sc'] = ARRAY_route_list[key]['orig_sc'];
            currItem['dest_en'] = ARRAY_route_list[key]['dest_en'];
            currItem['dest_tc'] = ARRAY_route_list[key]['dest_tc'];
            currItem['dest_sc'] = ARRAY_route_list[key]['dest_sc'];
        }

        currItem['seq'] = ARRAY_route_stop_list['data'][i]['seq'];
        currItem['stop'] = ARRAY_route_stop_list['data'][i]['stop'];

        try
        {
            const stop = ARRAY_route_stop_list['data'][i]['stop'];
            const Path_currStop = './download/kmb/stops/' + stop + '.json';
            const JSON_currStop = await loadJSONFromFile(Path_currStop);

            currItem['name_en'] = JSON_currStop['data']['name_en'];
            currItem['name_tc'] = JSON_currStop['data']['name_tc'];
            currItem['name_sc'] = JSON_currStop['data']['name_sc'];
            currItem['lat'] = JSON_currStop['data']['lat'];
            currItem['long'] = JSON_currStop['data']['long'];
        }
        catch(error)
        {
            currItem['name_en'] = 'NA';
            currItem['name_tc'] = 'NA';
            currItem['name_sc'] = 'NA';
            currItem['lat'] = '22.31559008428172';
            currItem['long'] = '114.1764298283177';
        }

        if (route_id in newRouteStopList)
        {
            newRouteStopList[route_id].push(currItem);
        }
        else
        {
            newRouteStopList[route_id] = [];
            newRouteStopList[route_id].push(currItem);
        }
    }
}

export { downloadKmbRoutList, downloadKmbRouteStopFiles, downloadKmbStopFiles, createKmbRouteList, createKmbRouteStopList }