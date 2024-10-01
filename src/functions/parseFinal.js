import { loadJSONFromFile, saveJSONToFile } from "../utilities/file_management.js";

async function parseUniqueRouteList()
{
    const kmbRouteListJson = await loadJSONFromFile('./download/kmb/output/routeList_kmb.json');
    const ctbRouteListJson = await loadJSONFromFile('./download/ctb/output/routeList_ctb.json');
    const mtrbusRouteListJson = await loadJSONFromFile('./download/mtrbus/output/routeList_mtrbus.json');
    const nlbRouteListJson = await loadJSONFromFile('./download/nlb/output/routeList_nlb.json');

    const uniqueRouteList = {};

    for (var i = 0; i < kmbRouteListJson.length; i++)
    {
        const route = kmbRouteListJson[i]['route'];
        uniqueRouteList[route] = route;
    }

    for (var j = 0; j < ctbRouteListJson.length; j++)
    {
        const route = ctbRouteListJson[j]['route'];
        uniqueRouteList[route] = route;
    }

    for (var k = 0; k < mtrbusRouteListJson.length; k++)
    {
        const route = mtrbusRouteListJson[k]['route'];
        uniqueRouteList[route] = route;
    }

    for (var m = 0; m < nlbRouteListJson.length; m++)
    {
        const route = nlbRouteListJson[m]['route'];
        uniqueRouteList[route] = route;
    }

    const saveFilePath = './download/finalOutput/uniqueRouteList.json';
    await saveJSONToFile(saveFilePath, uniqueRouteList);
}

async function parseUniqueRouteMap()
{
    const uniqueRouteList = await loadJSONFromFile('./download/finalOutput/uniqueRouteList.json');

    const uniqueRouteMap = {};

    for (const key in uniqueRouteList)
    {
        if (key.length >= 2)
        {
            const firstLetter = key.substring(0, 1);
            const secondLetter = key.substring(1, 2);

            if (firstLetter in uniqueRouteMap)
            {
                uniqueRouteMap[firstLetter][secondLetter] = secondLetter;
            }
            else
            {
                const newObj = {};
                newObj[secondLetter] = secondLetter;
                uniqueRouteMap[firstLetter] = newObj;
            }
        }

        if (key.length >= 3)
        {
            const firstTwoLetter = key.substring(0, 2);
            const thirdLetter = key.substring(2, 3);

            if (firstTwoLetter in uniqueRouteMap)
            {
                uniqueRouteMap[firstTwoLetter][thirdLetter] = thirdLetter;
            }
            else
            {
                const newObj = {};
                newObj[thirdLetter] = thirdLetter;
                uniqueRouteMap[firstTwoLetter] = newObj;
            }
        }

        if (key.length >= 4)
        {
            const firstThreeLetter = key.substring(0, 3);
            const fourthLetter = key.substring(3, 4);

            if (firstThreeLetter in uniqueRouteMap)
            {
                uniqueRouteMap[firstThreeLetter][fourthLetter] = fourthLetter;
            }
            else
            {
                const newObj = {};
                newObj[fourthLetter] = fourthLetter;
                uniqueRouteMap[firstThreeLetter] = newObj;
            }
        }
    }

    const saveFilePath = './download/finalOutput/uniqueRouteMap.json';
    await saveJSONToFile(saveFilePath, uniqueRouteMap);
}

async function parseUniqueRouteStopList()
{
    const kmbRouteStopListJson = await loadJSONFromFile('./download/kmb/output/routeStopList_kmb.json');
    const ctbRouteStopListJson = await loadJSONFromFile('./download/ctb/output/routeStopList_ctb.json');
    const mtrbusRouteStopListJson = await loadJSONFromFile('./download/mtrbus/output/routeStopList_mtrbus.json');
    const nlbRouteStopListJson = await loadJSONFromFile('./download/nlb/output/routeStopList_nlb.json');
    const kmbctbRouteStopListJson = await loadJSONFromFile('./download/kmbctb/output/routeStopList_kmbctb.json');

    const uniqueRouteStopList = {};

    for (const key in kmbRouteStopListJson)
    {
        uniqueRouteStopList[key] = kmbRouteStopListJson[key];
    }

    for (const key in ctbRouteStopListJson)
    {
        uniqueRouteStopList[key] = ctbRouteStopListJson[key];
    }

    for (const key in mtrbusRouteStopListJson)
    {
        uniqueRouteStopList[key] = mtrbusRouteStopListJson[key];
    }

    for (const key in nlbRouteStopListJson)
    {
        uniqueRouteStopList[key] = nlbRouteStopListJson[key];
    }

    for (const key in kmbctbRouteStopListJson)
    {
        uniqueRouteStopList[key] = kmbctbRouteStopListJson[key];
    }


    const saveFilePath = './download/finalOutput/uniqueRouteStopList.json';
    await saveJSONToFile(saveFilePath, uniqueRouteStopList);
}

export { parseUniqueRouteList, parseUniqueRouteMap, parseUniqueRouteStopList }

