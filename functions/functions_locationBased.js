import { downloadJSONFile, deleteFilesInFolder, loadJSONFromFile, saveJSONToFile, roundDownLatLong } from './functions_utilities.js';

async function parseLocationBasedRouteStopList()
{
    var locationBased = {};
    var company_list = ['kmb', 'ctb'];

    for (var j=0 ; j<company_list.length ; j++)
    {
        const routeStopListPath = './download/' + company_list[j] + '/FINAL_route_stop_list.json';
        const routeStopListJson = await loadJSONFromFile(routeStopListPath);
    
        for (const key in routeStopListJson)
        {
            for (var i=0 ; i<routeStopListJson[key].length ; i++)
            {
                const currItem = routeStopListJson[key][i];
    
                var lat = currItem['lat'];
                var lon = currItem['long'];
    
                var lat_roundDown = roundDownLatLong(lat);
                var lon_roundDown = roundDownLatLong(lon);
    
                var latLonKey = lat_roundDown + ',' + lon_roundDown;
    
                if (locationBased[latLonKey])
                {
                    locationBased[latLonKey].push(currItem);
                }
                else
                {
                    locationBased[latLonKey] = [];
                    locationBased[latLonKey].push(currItem);
                }
            }
        }    
    }
    
    const filePath = './download/location/location_based_route_stop_list.json';
    await saveJSONToFile(filePath, locationBased);
}

export { parseLocationBasedRouteStopList };