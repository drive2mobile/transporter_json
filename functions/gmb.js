import { downloadJSONFile, loadJSONFromFile, saveAndReturnJSONFile, saveJSONToFile } from "../src/utilities/file_management.js";

async function downloadRouteListGmb(lang)
{
    const url = `https://data.etagmb.gov.hk/route`;
    const downloadFilePath = `./download/gmb/raw/route/routeList.json`;
    await downloadJSONFile(url, downloadFilePath);

    const routeListSimple = `./download/gmb/raw/route/routeList.json`;
    const routeListSimpleJson = await loadJSONFromFile(routeListSimple);

    await downloadDetailRouteList('HKI', lang);
    await downloadDetailRouteList('KLN', lang);
    await downloadDetailRouteList('NT', lang);

    async function downloadDetailRouteList(region, lang)
    {
        const routeList = [];
        const routeStopList = {};

        // iterate each route number
        const routes = routeListSimpleJson['data']['routes'][region];
        for (var i = 0; i < routes.length; i++)
        {
            if (i == 10) { break; }

            // download route detail json
            const url = `https://data.etagmb.gov.hk/route/${region}/${routes[i]}`;
            const saveFilePath = `./download/gmb/raw/route/${region}_${routes[i]}.json`;
            const routeJson = await saveAndReturnJSONFile(url, saveFilePath);

            // iterate each route detail
            for (var j = 0; j < routeJson['data'].length; j++)
            {
                const currRoute = routeJson['data'][j];
                const route_id = currRoute['route_id'];
                const directions = currRoute['directions'];

                // === start prepare rotue list json output ===
                const newRoute = {
                    'company': 'gmb',
                    'route': currRoute['route_code'],
                    'route_id': currRoute['route_id'],
                    'region': region,
                }
                // === end prepare rotue list json output ===

                // for each route detail, iterate direction and download route stop list
                for (var k = 0; k < directions.length; k++)
                {
                    const url = `https://data.etagmb.gov.hk/route-stop/${route_id}/${directions[k]['route_seq']}`;
                    const downloadFilePath = `./download/gmb/raw/routeStop/${region}_${routes[i]}_${route_id}_${directions[k]['route_seq']}.json`;
                    const routeStopJson = await saveAndReturnJSONFile(url, downloadFilePath);

                    // iterate each stops
                    for (var m = 0; m < routeStopJson['data']['route_stops'].length; m++)
                    {
                        const currStop = routeStopJson['data']['route_stops'][m];
                        const id = `gmb_${region}_${routes[i]}_${route_id}_${directions[k]['route_seq']}`;

                        

                        const newStop = {
                            'company': 'gmb',
                            'region': region,
                            'route_id': currRoute['route_id'],
                            'route': currRoute['route_code'],
                            'route_seq': directions[k]['route_seq'],
                            'from': directions[k][`orig_${lang}`],
                            'to': directions[k][`dest_${lang}`],
                            'stop': currStop['stop_id'],
                            'stop_seq': currStop['stop_seq'],
                            'name': currStop[`name_${lang}`],
                        }

                        if (id in routeStopList == false)
                        {
                            const newArray = [newStop];
                            routeStopList[id] = newArray;
                        }
                        else
                        {
                            routeStopList[id].push(newStop);
                        }
                    }

                    // === start prepare rotue list json output ===
                    newRoute['route_seq'] = directions[k]['route_seq'];
                    newRoute['from'] = directions[k][`orig_${lang}`];
                    newRoute['to'] = directions[k][`dest_${lang}`];
                    routeList.push(newRoute);
                    // === end prepare rotue list json output ===

                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            }
        }

        const saveFilePath1 = `./download/gmb/output/routeList_${region}_${lang}.json`;
        await saveJSONToFile(saveFilePath1, routeList);

        const saveFilePath2 = `./download/gmb/output/routeStopList_${region}_${lang}.json`;
        await saveJSONToFile(saveFilePath2, routeStopList);
    }
}

export { downloadRouteListGmb }