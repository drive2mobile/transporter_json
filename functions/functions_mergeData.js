import { coopRoutes, reverseDir } from '../config.js';
import { downloadJSONFile, loadJSONFromFile, saveJSONToFile, deleteFilesInFolder, calculateDistance } from './functions_utilities.js';

async function createTEMPKmbRouteStopList()
{
    const PathKmbRouteStop = './download/kmb/TEMP_route_stop_list.json';
    const JSONKmbRouteStop = await loadJSONFromFile(PathKmbRouteStop);
    const PathCtbRouteStop = './download/ctb/TEMP_route_stop_list.json';
    const JSONCtbRouteStop = await loadJSONFromFile(PathCtbRouteStop);

    if (JSONKmbRouteStop) 
    {
        var newRouteList = {};

        for(const key in JSONKmbRouteStop)
        {
            var ARRAY_currRoute = JSONKmbRouteStop[key];
    
            for (var i=0 ; i<ARRAY_currRoute.length ; i++)
            {
                if (ARRAY_currRoute[i]['route'] in coopRoutes)
                {
                    var coopDirection = ARRAY_currRoute[i]['direction'];
                    if (ARRAY_currRoute[i]['route'] in reverseDir) 
                    { 
                        if (coopDirection == 'I') { coopDirection = 'O'; }
                        else if (coopDirection == 'O') { coopDirection = 'I'; }
                    }

                    var ctb_route_id = 'ctb' + ARRAY_currRoute[i]['route'] + '_' + coopDirection + '1';
                    if (!JSONCtbRouteStop[ctb_route_id])
                    {
                        console.log(ctb_route_id);
                    }
                    var coopStop = await findNearestCoopStop(ARRAY_currRoute[i]['lat'], ARRAY_currRoute[i]['long'], JSONCtbRouteStop[ctb_route_id]);

                    ARRAY_currRoute[i]['coopStop'] = coopStop;
                    ARRAY_currRoute[i]['coopDir'] = coopDirection;
                }
            }

            newRouteList[key] = ARRAY_currRoute;

            // if (key == 'kmbctb101_I1')
            //     break;
        }

        const filePath = './download/kmb/TEMP_route_stop_list.json';
        await saveJSONToFile(filePath, newRouteList);
    }
}

async function createTEMPCtbRouteStopList()
{
    const PathCtbRouteStop = './download/ctb/TEMP_route_stop_list.json';
    const JSONCtbRouteStop = await loadJSONFromFile(PathCtbRouteStop);

    var newRouteStopList = {};

    for(const key in JSONCtbRouteStop)
    {
        const currRoute = JSONCtbRouteStop[key][0]['route'];
        if (currRoute in coopRoutes == false)
        {
            newRouteStopList[key] = JSONCtbRouteStop[key];
        }
    }

    const filePath = './download/ctb/TEMP_route_stop_list.json';
    await saveJSONToFile(filePath, newRouteStopList);
}

async function createTEMPCtbRouteList()
{
    const PathCtbRoute = './download/ctb/TEMP_route_list.json';
    const JSONCtbRoute = await loadJSONFromFile(PathCtbRoute);

    var newRouteList = {};

    for (const key in JSONCtbRoute)
    {
        const currRoute = JSONCtbRoute[key]['route'];
        if (currRoute in coopRoutes == false)
        {
            newRouteList[key] = JSONCtbRoute[key];
        }
    }

    const filePath = './download/ctb/TEMP_route_list.json';
    await saveJSONToFile(filePath, newRouteList);
}

async function mergeUniqueRouteList()
{
    const PathCtbRouteList = './download/ctb/TEMP_route_list.json';
    const JSONCtbRouteList = await loadJSONFromFile(PathCtbRouteList);
    const PathKmbRouteList = './download/kmb/TEMP_route_list.json';
    const JSONKmbRouteList = await loadJSONFromFile(PathKmbRouteList);
    const PathMtrbusRouteList = './download/mtrbus/TEMP_route_list.json';
    const JSONMtrbusRouteList = await loadJSONFromFile(PathMtrbusRouteList);

    var finalRouteList = {...JSONKmbRouteList, ...JSONCtbRouteList, ...JSONMtrbusRouteList};
    var sortedMap = {};

    for (const key in finalRouteList)
    {
        const currRoute = finalRouteList[key]['route'];
        var currKey = '';

        if (isNaN(currRoute.charAt(0)))
            currKey = currRoute.charAt(0);
        else
            currKey = currRoute.replace(/[a-zA-Z]/g, '');
        
        if (currKey in sortedMap)
        {
            sortedMap[currKey].push(finalRouteList[key]);
        }
        else
        {
            var newArr = [finalRouteList[key]];
            sortedMap[currKey] = newArr;
        }
    }

    var finalRouteListData = [];
    var finalRouteListMap = {}
    for (const key in sortedMap)
    {
        const currObj = sortedMap[key];
        
        currObj.sort((a, b) => {
            const routeA = a.route;
            const routeB = b.route;
          
            return routeA.localeCompare(routeB, undefined, { numeric: true });
        });

        for (var j=0 ; j<currObj.length ; j++)
        {
            const currRoute = currObj[j]['route'];

            if ((currRoute in finalRouteListMap) == false)
            {
                finalRouteListMap[currRoute] = currRoute;
                finalRouteListData.push(currRoute);
            }
        }
    }

    const filePath = './download/output/FINAL_unique_route_list.json';
    await saveJSONToFile(filePath, finalRouteListData);
}

async function findNearestCoopStop(lat, lon, routeStopList)
{
    return new Promise((resolve, reject) => {
        var distance = 10000;
        var closestStop = '';
    
        for (var i=0 ; i<routeStopList.length ; i++)
        {
            var currDistance = calculateDistance(parseFloat(lat), parseFloat(lon), parseFloat(routeStopList[i]['lat']), parseFloat(routeStopList[i]['long']));
            if (currDistance < distance)
            {
                distance = currDistance;
                closestStop = routeStopList[i]['stop'];
            }
        }
    
        resolve(closestStop);
    })
}

async function mergeRouteList()
{
    const PathKmbRouteList = './download/kmb/TEMP_route_list.json';
    const JSONKmbRouteList = await loadJSONFromFile(PathKmbRouteList);
    const PathCtbRouteList = './download/ctb/TEMP_route_list.json';
    const JSONCtbRouteList = await loadJSONFromFile(PathCtbRouteList);
    const PathMtrbusRouteList = './download/mtrbus/TEMP_route_list.json';
    const JSONMtrbusRouteList = await loadJSONFromFile(PathMtrbusRouteList);
    const PathMtrRouteList = './download/mtr/TEMP_route_list.json';
    const JSONMtrRouteList = await loadJSONFromFile(PathMtrRouteList);

    var finalRouteList = {...JSONKmbRouteList, ...JSONCtbRouteList, ...JSONMtrbusRouteList};
    var sortedMap = {};

    for (const key in finalRouteList)
    {
        const currRoute = finalRouteList[key]['route'];
        var currKey = '';

        if (isNaN(currRoute.charAt(0)))
            currKey = currRoute.charAt(0);
        else
            currKey = currRoute.replace(/[a-zA-Z]/g, '');
        
        if (currKey in sortedMap)
        {
            sortedMap[currKey].push(finalRouteList[key]);
        }
        else
        {
            var newArr = [finalRouteList[key]];
            sortedMap[currKey] = newArr;
        }
    }

    var finalRouteListData = [];
    for (const key in sortedMap)
    {
        const currObj = sortedMap[key];
        
        currObj.sort((a, b) => {
            const routeA = a.route;
            const routeB = b.route;
          
            return routeA.localeCompare(routeB, undefined, { numeric: true });
        });

        for (var j=0 ; j<currObj.length ; j++)
        {
            finalRouteListData.push(currObj[j]);
        }
    }

    for (const key in JSONMtrRouteList)
    {
        finalRouteListData.push(JSONMtrRouteList[key]);
    }

    const filePath = './download/output/FINAL_route_list.json';
    await saveJSONToFile(filePath, finalRouteListData);
}

async function mergeRouteStopList()
{
    const PathKmbRouteStopList = './download/kmb/TEMP_route_stop_list.json';
    const JSONKmbRouteStopList = await loadJSONFromFile(PathKmbRouteStopList);
    const PathCtbRouteStopList = './download/ctb/TEMP_route_stop_list.json';
    const JSONCtbRouteStopList = await loadJSONFromFile(PathCtbRouteStopList);
    const PathMtrbusRouteStopList = './download/mtrbus/TEMP_route_stop_list.json';
    const JSONMtrbusRouteStopList = await loadJSONFromFile(PathMtrbusRouteStopList);
    const PathMtrRouteStopList = './download/mtr/TEMP_route_stop_list.json';
    const JSONMtrRouteStopList = await loadJSONFromFile(PathMtrRouteStopList);

    var finalRouteStopList = {...JSONKmbRouteStopList, ...JSONCtbRouteStopList, ...JSONMtrbusRouteStopList, ...JSONMtrRouteStopList};

    const filePath = './download/output/FINAL_route_stop_list.json';
    await saveJSONToFile(filePath, finalRouteStopList);
}

export { createTEMPKmbRouteStopList, createTEMPCtbRouteStopList, createTEMPCtbRouteList, mergeUniqueRouteList, mergeRouteList, mergeRouteStopList }

