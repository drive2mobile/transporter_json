import { calculateDistance } from "./file_management.js";

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

export { findNearestCoopStop }