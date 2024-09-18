import { downloadJSONFile, loadJSONFromFile, saveJSONToFile } from "../src/utilities/file_management.js";

async function downloadRouteList()
{
    const url = 'https://rt.data.gov.hk/v2/transport/citybus/route/ctb';
    const downloadFilePath = './download/ctb/raw/routeList/routeList.json';
    await downloadJSONFile(url, downloadFilePath);
}

async function downloadRouteStops()
{
    const readFilePath = './download/ctb/raw/routeList/routeList.json';
    const routeListJson = await loadJSONFromFile(readFilePath);

    var jobCount = routeListJson['data'].length;
    var downloadedCount = 0;

    for (var i = 0; i < routeListJson['data'].length; i++)
    {
        const url1 = 'https://rt.data.gov.hk/v2/transport/citybus/route-stop/ctb/' + routeListJson['data'][i]['route'] + '/inbound';
        const downloadFilePath1 = './download/ctb/raw/routeStop/' + routeListJson['data'][i]['route'] + '_inbound.json';
        await downloadJSONFile(url1, downloadFilePath1);

        const url2 = 'https://rt.data.gov.hk/v2/transport/citybus/route-stop/ctb/' + routeListJson['data'][i]['route'] + '/outbound';
        const downloadFilePath2 = './download/ctb/raw/routeStop/' + routeListJson['data'][i]['route'] + '_outbound.json';
        await downloadJSONFile(url2, downloadFilePath2);

        downloadedCount++;
        console.log('Downloaded ' + downloadedCount + '/' + jobCount);

        if (i % 5 == 0)
        {
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
    }
}

async function downloadStops()
{
    const readFilePath = './download/ctb/raw/routeList/routeList.json';
    const routeListJson = await loadJSONFromFile(readFilePath);

    var stopIDArray = [];
    var stopIDObject = {};

    for (var i = 0; i < routeListJson['data'].length; i++)
    {
        const readFilePath_inbound = `./download/ctb/raw/routeStop/${routeListJson['data'][i]['route']}_inbound.json`;
        const routeStopJson_inbound = await loadJSONFromFile(readFilePath_inbound);

        if (routeStopJson_inbound['data'].length > 0)
        {
            for (var j = 0; j < routeStopJson_inbound['data'].length; j++)
            {
                if (routeStopJson_inbound['data'][j]['stop'] in stopIDObject == false)
                {
                    stopIDArray.push(routeStopJson_inbound['data'][j]['stop']);
                    stopIDObject[routeStopJson_inbound['data'][j]['stop']] = routeStopJson_inbound['data'][j]['stop'];
                }
            }
        }

        const readFilePath_outbound = `./download/ctb/raw/routeStop/${routeListJson['data'][i]['route']}_outbound.json`;
        const routeStopJson_outbound = await loadJSONFromFile(readFilePath_outbound);

        if (routeStopJson_outbound['data'].length > 0)
        {
            for (var k = 0; k < routeStopJson_outbound['data'].length; k++)
            {
                if (routeStopJson_outbound['data'][k]['stop'] in stopIDObject == false)
                {
                    stopIDArray.push(routeStopJson_outbound['data'][k]['stop']);
                    stopIDObject[routeStopJson_outbound['data'][k]['stop']] = routeStopJson_outbound['data'][k]['stop'];
                }
            }
        }
    }

    var jobCount = stopIDArray.length
    var downloadedCount = 0;
    for (var m = 0; m < stopIDArray.length; m++)
    {
        const url1 = 'https://rt.data.gov.hk/v2/transport/citybus/stop/' + stopIDArray[m];
        const downloadFilePath1 = './download/ctb/raw/stop/' + stopIDArray[m] + '.json';
        await downloadJSONFile(url1, downloadFilePath1);

        downloadedCount++;
        console.log('Downloaded ' + downloadedCount + '/' + jobCount);

        if (i % 5 == 0)
        {
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
    }
}

async function parseJson(lang)
{
    const readFilePath = './download/ctb/raw/routeList/routeList.json';
    const routeListJson = await loadJSONFromFile(readFilePath);

    const routeList = [];
    const routeStopList = {};

    for (var i = 0; i < routeListJson['data'].length; i++)
    {
        // if (i == 10) { break ;}
        const currRoute = routeListJson['data'][i];

        const readFilePath_inbound = `./download/ctb/raw/routeStop/${currRoute['route']}_inbound.json`;
        const routeStopJson_inbound = await loadJSONFromFile(readFilePath_inbound);

        if (routeStopJson_inbound['data'] && routeStopJson_inbound['data'].length > 0)
        {
            const newRoute = {
                'id': `CTB_${currRoute['route']}_I`,
                'company': 'CTB',
                'route': currRoute['route'],
                'from': currRoute[`dest_${lang}`],
                'to': currRoute[`orig_${lang}`],
                'dir': 'I'
            }

            routeList.push(newRoute);

            const currRouteStopList = [];
            for (var j = 0; j < routeStopJson_inbound['data'].length; j++)
            {
                const currStop = routeStopJson_inbound['data'][j];

                const readFilePath_stop = `./download/ctb/raw/stop/${currStop['stop']}.json`;
                const stopJson = await loadJSONFromFile(readFilePath_stop);

                const newStop = {
                    'company': 'CTB',
                    'route': currStop['route'],
                    'from': currRoute[`dest_${lang}`],
                    'to': currRoute[`orig_${lang}`],
                    'dir': currStop['dir'],
                    'seq': currStop['seq'],
                    'stop': currStop['stop'],
                    'name': stopJson['data'][`name_${lang}`],
                    'lat': stopJson['data']['lat'],
                    'long': stopJson['data']['long'],
                }

                currRouteStopList.push(newStop);
            }

            routeStopList[`CTB_${currRoute['route']}_I`] = currRouteStopList;
        }

        const readFilePath_outbound = `./download/ctb/raw/routeStop/${currRoute['route']}_outbound.json`;
        const routeStopJson_outbound = await loadJSONFromFile(readFilePath_outbound);

        if (routeStopJson_outbound['data'] && routeStopJson_outbound['data'].length > 0)
        {
            const newRoute = {
                'id': `CTB_${currRoute['route']}_O`,
                'company': 'CTB',
                'route': currRoute['route'],
                'from': currRoute[`orig_${lang}`],
                'to': currRoute[`dest_${lang}`],
                'dir': 'O'
            }

            routeList.push(newRoute);

            const currRouteStopList = [];
            for (var j = 0; j < routeStopJson_outbound['data'].length; j++)
            {
                const currStop = routeStopJson_outbound['data'][j];

                const readFilePath_stop = `./download/ctb/raw/stop/${currStop['stop']}.json`;
                const stopJson = await loadJSONFromFile(readFilePath_stop);

                const newStop = {
                    'company': 'CTB',
                    'route': currStop['route'],
                    'from': currRoute[`orig_${lang}`],
                    'to': currRoute[`dest_${lang}`],
                    'dir': currStop['dir'],
                    'seq': currStop['seq'],
                    'stop': currStop['stop'],
                    'name': stopJson['data'][`name_${lang}`],
                    'lat': stopJson['data']['lat'],
                    'long': stopJson['data']['long'],
                }

                currRouteStopList.push(newStop);
            }

            routeStopList[`CTB_${currRoute['route']}_O`] = currRouteStopList;
        }
    }

    const saveFilePath1 = './download/ctb/output/routes.json';
    await saveJSONToFile(saveFilePath1, routeList);

    const saveFilePath2 = './download/ctb/output/routeStops.json';
    await saveJSONToFile(saveFilePath2, routeStopList);
}

export { downloadRouteList, downloadRouteStops, downloadStops, parseJson }