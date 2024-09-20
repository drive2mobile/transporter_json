import { downloadJSONFile, loadJSONFromFile, returnJson, saveAndReturnJSONFile, saveJSONToFile } from "../src/utilities/file_management.js";


async function downloadAndParseRouteListGmb()
{
    const url1 = `https://data.etagmb.gov.hk/route`;
    const routeListSimple = await returnJson(url1);

    const routeList_tc = [];
    const routeList_en = [];

    await subFunction('HKI');
    await subFunction('KLN');
    await subFunction('NT');

    async function subFunction(region)
    {
        const routes = routeListSimple['data']['routes'][region];

        for (var i = 0; i < routes.length; i++)
        {
            // if (i == 10) { break; }
            const url2 = `https://data.etagmb.gov.hk/route/${region}/${routes[i]}`;
            const route = await returnJson(url2);

            const routeData = route['data'];
            for (var j = 0; j < routeData.length; j++)
            {
                const newRouteItem_tc = {
                    'route_id': routeData[j]['route_id'],
                    'region': region,
                    'route': routeData[j]['route_code'],
                }

                const newRouteItem_en = {
                    'route_id': routeData[j]['route_id'],
                    'region': region,
                    'route': routeData[j]['route_code'],
                }


                const routeDirection = routeData[j]['directions'];
                for (var k = 0; k < routeDirection.length; k++)
                {
                    newRouteItem_tc['route_seq'] = routeDirection[k]['route_seq'];
                    newRouteItem_tc['from'] = routeDirection[k][`orig_tc`];
                    newRouteItem_tc['to'] = routeDirection[k][`dest_tc`];
                    routeList_tc.push(newRouteItem_tc);

                    newRouteItem_en['route_seq'] = routeDirection[k]['route_seq'];
                    newRouteItem_en['from'] = routeDirection[k][`orig_en`];
                    newRouteItem_en['to'] = routeDirection[k][`dest_en`];
                    routeList_en.push(newRouteItem_en);
                }
            }

            console.log(`Processing ${i}/${routes.length}`);
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }

    const saveFilePath1 = `./download/gmb/output/routeList_tc.json`;
    await saveJSONToFile(saveFilePath1, routeList_tc);

    const saveFilePath2 = `./download/gmb/output/routeList_en.json`;
    await saveJSONToFile(saveFilePath2, routeList_en);
}

async function downloadAndParseRouteStopListGmb()
{
    const readFilePath1 = `./download/gmb/output/routeList_tc.json`;
    const routes_tc = await loadJSONFromFile(readFilePath1);

    const readFilePath2 = `./download/gmb/output/routeList_en.json`;
    const routes_en = await loadJSONFromFile(readFilePath2);

    const routeStopList_tc = {};
    const routeStopList_en = {};

    for (var i = 0; i < routes_tc.length; i++)
    {
        // if (i == 10 ) { break; }
        const url = `https://data.etagmb.gov.hk/route-stop/${routes_tc[i]['route_id']}/${routes_tc[i]['route_seq']}`;
        const routeStops = await returnJson(url);

        const routeStopData = routeStops['data']['route_stops'];
        for (var j = 0; j < routeStopData.length; j++)
        {
            const id = `gmb_${routes_tc[i]['region']}_${routes_tc[i]['route']}_${routes_tc[i]['route_seq']}`;

            const newStop_tc = {
                'route_id': routes_tc[i]['route_id'],
                'company': 'gmb',
                'region': routes_tc[i]['region'],
                'route': routes_tc[i]['route'],
                'route_seq': routes_tc[i]['route_seq'],
                'from': routes_tc[i]['from'],
                'to': routes_tc[i]['to'],
                'name': routeStopData[j][`name_tc`],
                'stop_seq': routeStopData[j]['stop_seq'],
                'stop': routeStopData[j]['stop_id'],
            }

            const newStop_en = {
                'route_id': routes_en[i]['route_id'],
                'company': 'gmb',
                'region': routes_en[i]['region'],
                'route': routes_en[i]['route'],
                'route_seq': routes_en[i]['route_seq'],
                'from': routes_en[i]['from'],
                'to': routes_en[i]['to'],
                'name': routeStopData[j][`name_en`],
                'stop_seq': routeStopData[j]['stop_seq'],
                'stop': routeStopData[j]['stop_id'],
            }

            if (id in routeStopList_tc == false)
            {
                const newArray_tc = [newStop_tc];
                routeStopList_tc[id] = newArray_tc;

                const newArray_en = [newStop_en];
                routeStopList_en[id] = newArray_en;
            }
            else
            {
                routeStopList_tc[id].push(newStop_tc);

                routeStopList_en[id].push(newStop_en);
            }
        }

        console.log(`Processing ${i}/${routes_tc.length}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const saveFilePath1 = `./download/gmb/output/routeStopList_tc.json`;
    await saveJSONToFile(saveFilePath1, routeStopList_tc);

    const saveFilePath2 = `./download/gmb/output/routeStopList_en.json`;
    await saveJSONToFile(saveFilePath2, routeStopList_en);
}

async function downloadStopGmb()
{
    const readFilePath1 = `./download/gmb/output/routeStopList_tc.json`;
    const routeStopList = await loadJSONFromFile(readFilePath1);

    const stops_object = {};
    const stops_array = [];

    for (const key in routeStopList)
    {
        const currRoute = routeStopList[key];

        for (var i = 0; i < currRoute.length; i++)
        {
            if (currRoute[i]['stop'] in stops_object == false)
            {
                stops_object[currRoute[i]['stop']] = currRoute[i]['stop'];
                stops_array.push(currRoute[i]['stop']);
            }
        }
    }

    console.log(stops_array)

    for (var k = 0; k < stops_array.length; k++)
    {
        const url1 = `https://data.etagmb.gov.hk/stop/${stops_array[k]}`;
        const downloadFilePath = './download/gmb/raw/stop/' + stops_array[k] + '.json';
        await downloadJSONFile(url1, downloadFilePath);

        console.log(`Processing ${k}/${stops_array.length}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}

async function mergeStopCoordinateToRouteStopGmb()
{
    const readFilePath1 = `./download/gmb/output/routeStopList_tc.json`;
    const routeStopList_tc = await loadJSONFromFile(readFilePath1);

    const readFilePath2 = `./download/gmb/output/routeStopList_en.json`;
    const routeStopList_en = await loadJSONFromFile(readFilePath2);

    const newRouteStopList_tc = {}
    const newRouteStopList_en = {}

    for (const key in routeStopList_tc)
    {
        const currRoute = routeStopList_tc[key];

        for (var i = 0; i < currRoute.length; i++)
        {
            const readFilePath2 = `./download/gmb/raw/stop/${currRoute[i]['stop']}.json`;
            const stopJson = await loadJSONFromFile(readFilePath2);

            const stop = currRoute[i];
            stop['lat'] = stopJson['data']['coordinates']['wgs84']['latitude'];
            stop['long'] = stopJson['data']['coordinates']['wgs84']['longitude'];

            if (key in newRouteStopList_tc)
            {
                newRouteStopList_tc[key].push(stop);
            }
            else
            {
                const newArray = [stop];
                newRouteStopList_tc[key] = newArray;
            }
        }
    }

    for (const key in routeStopList_en)
    {
        const currRoute = routeStopList_en[key];

        for (var i = 0; i < currRoute.length; i++)
        {
            const readFilePath2 = `./download/gmb/raw/stop/${currRoute[i]['stop']}.json`;
            const stopJson = await loadJSONFromFile(readFilePath2);

            const stop = currRoute[i];
            stop['lat'] = stopJson['data']['coordinates']['wgs84']['latitude'];
            stop['long'] = stopJson['data']['coordinates']['wgs84']['longitude'];

            if (key in newRouteStopList_en)
            {
                newRouteStopList_en[key].push(stop);
            }
            else
            {
                const newArray = [stop];
                newRouteStopList_en[key] = newArray;
            }
        }
    }

    const saveFilePath1 = `./download/gmb/output/routeStopList_merge_tc.json`;
    await saveJSONToFile(saveFilePath1, newRouteStopList_tc);

    const saveFilePath2 = `./download/gmb/output/routeStopList_merge_en.json`;
    await saveJSONToFile(saveFilePath2, newRouteStopList_en);
}



export { downloadAndParseRouteListGmb, downloadAndParseRouteStopListGmb, downloadStopGmb, mergeStopCoordinateToRouteStopGmb }