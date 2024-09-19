import { downloadCsvAndConvertJson } from "../src/utilities/file_management.js";

async function downloadRouteStopListMtrBus()
{
    const url = 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fopendata.mtr.com.hk%2Fdata%2Fmtr_bus_stops.csv';
    const downloadFilePath = './download/mtrbus/raw/routeStop/routeStopList.json';
    await downloadCsvAndConvertJson(url, downloadFilePath);
}

async function parseJson(lang)
{
    
}

export {downloadRouteStopListMtrBus}