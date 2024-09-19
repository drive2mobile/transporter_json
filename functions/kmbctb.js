import { coopRoutes } from "../src/utilities/constants";

async function parseJsonKmbCtb(lang)
{
    const readFilePath1 = `./download/kmb/output/routeStopList_${lang}.json`;
    const routeStopListKmb = await loadJSONFromFile(readFilePath1);

    const readFilePath2 = `./download/ctb/output/routeStopList_${lang}.json`;
    const routeStopListCtb = await loadJSONFromFile(readFilePath2);

    const newRouteStopListKmb = {};

    for (const key in routeStopListKmb)
    {
        const currRouteList = routeStopListKmb[key];
        


        if (currRouteList[0]['route'] in coopRoutes)
        {

        }
    }
}

export { parseJsonKmbCtb }