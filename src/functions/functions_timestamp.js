import { downloadJSONFile, loadJSONFromFile, saveJSONToFile, deleteFilesInFolder, calculateDistance } from './functions_utilities.js';


async function generateTimestamp()
{
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const dateString = `${year}${month}${day}`;
    const timestampArr = {dateString:dateString};

    const filePath = './download/output/FINAL_timestamp.json';
    await saveJSONToFile(filePath, timestampArr);
}

export { generateTimestamp }