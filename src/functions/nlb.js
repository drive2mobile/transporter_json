import { downloadJSONFile, loadJSONFromFile, saveJSONToFile } from "../utilities/file_management.js";


async function downloadRouteListNlb()
{
    const url = 'https://rt.data.gov.hk/v2/transport/nlb/route.php?action=list';
    const downloadFilePath = './download/nlb/raw/route/routeList.json';
    await downloadJSONFile(url, downloadFilePath);
}

async function downloadRouteStopNlb()
{
    const readFilePath = './download/nlb/raw/route/routeList.json';
    const routeListJson = await loadJSONFromFile(readFilePath);

    var jobCount = routeListJson['routes'].length;
    var downloadedCount = 0;

    for (var i = 0; i < routeListJson['routes'].length; i++)
    {
        // if (i == 10) { break; }
        const url1 = `https://rt.data.gov.hk/v2/transport/nlb/stop.php?action=list&routeId=${routeListJson['routes'][i]['routeId']}`;
        const downloadFilePath1 = `./download/nlb/raw/routeStop/${routeListJson['routes'][i]['routeId']}.json`;
        await downloadJSONFile(url1, downloadFilePath1);

        downloadedCount++;
        console.log('Downloaded ' + downloadedCount + '/' + jobCount);

        if (i % 5 == 0)
        {
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
    }
}

async function parseJsonNlb(lang)
{
    const readFilePath = './download/nlb/raw/route/routeList.json';
    const routeListJson = await loadJSONFromFile(readFilePath);

    const routeList_tc = [];
    const routeList_en = [];
    const routeStopList_tc = {};
    const routeStopList_en = {};

    for (var i = 0; i < routeListJson['routes'].length; i++)
    {
        if (i == 10) { break ;}
        const currRoute = routeListJson['routes'][i];
        var id = `nlb_${currRoute['routeId']}_${currRoute['routeNo']}`;

        const newRoute_tc = {
            id: id,
            company: 'nlb',
            route: currRoute['routeNo'],
            from: currRoute['routeName_c'].split('>')[0].trim(),
            to: currRoute['routeName_c'].split('>')[1].trim(),
        }
        routeList_tc.push(newRoute_tc);

        const newRoute_en = {
            id: id,
            company: 'nlb',
            route: currRoute['routeNo'],
            from: currRoute['routeName_e'].split('>')[0].trim(),
            to: currRoute['routeName_e'].split('>')[1].trim(),
        }
        routeList_en.push(newRoute_en);


        const readFilePath = `./download/nlb/raw/routeStop/${currRoute['routeId']}.json`;
        const routeStopJson = await loadJSONFromFile(readFilePath);

        for (var j = 0; j < routeStopJson['stops'].length; j++)
        {
            const currStop = routeStopJson['stops'][j];

            const newStop_tc = {
                'company': 'nlb',
                'route': currRoute['routeNo'],
                'from': currRoute['routeName_c'].split('>')[0].trim(),
                'to': currRoute['routeName_c'].split('>')[1].trim(),
                'stop': currStop['stopId'],
                'name': currStop['stopName_c'],
                'lat': currStop['latitude'],
                'long': currStop['longitude'],
            }

            if (id in routeStopList_tc)
            {
                routeStopList_tc[id].push(newStop_tc);
            }
            else
            {
                const newArr = [newStop_tc];
                routeStopList_tc[id] = newArr;
            }

            const newStop_en = {
                'company': 'nlb',
                'route': currRoute['routeNo'],
                'from': currRoute['routeName_e'].split('>')[0].trim(),
                'to': currRoute['routeName_e'].split('>')[1].trim(),
                'stop': currStop['stopId'],
                'name': currStop['stopName_e'],
                'lat': currStop['latitude'],
                'long': currStop['longitude'],
            }


            if (id in routeStopList_en)
            {
                routeStopList_en[id].push(newStop_en);
            }
            else
            {
                const newArr = [newStop_en];
                routeStopList_en[id] = newArr;
            }
        }
    }

    const saveFilePath1 = `./download/nlb/output/routeList_nlb_tc.json`;
    await saveJSONToFile(saveFilePath1, routeList_tc);
    const saveFilePath2 = `./download/nlb/output/routeList_nlb_en.json`;
    await saveJSONToFile(saveFilePath2, routeList_en);

    const saveFilePath3 = `./download/nlb/output/routeStopList_nlb_tc.json`;
    await saveJSONToFile(saveFilePath3, routeStopList_tc);
    const saveFilePath4 = `./download/nlb/output/routeStopList_nlb_en.json`;
    await saveJSONToFile(saveFilePath4, routeStopList_en);
}

export { downloadRouteListNlb, downloadRouteStopNlb, parseJsonNlb }