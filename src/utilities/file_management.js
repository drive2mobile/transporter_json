import axios from "axios";
import fs from "fs";
import path from "path";
import csvtojson from "csvtojson";

const downloadCsvAndConvertJson = async(url, filePath) => {
    try {
        // Download the CSV file
        const response = await axios.get(url);
        const csvData = response.data;
    
        // Convert CSV to JSON
        const jsonArray = await csvtojson().fromString(csvData);
        const jsonString = JSON.stringify(jsonArray, null, 2);
    
        // Save JSON to a file
        fs.writeFileSync(filePath, jsonString, { flag: 'w' });
        // console.log('CSV converted to JSON and saved successfully!');
      } catch (error) 
      {
        console.error('Error:', error.message);
      }
}

const downloadJSONFile = async (url, filePath) => {
    try {
        const response = await axios.get(url);
        const jsonData = response.data;
        const jsonString = JSON.stringify(jsonData, null, 2);

        fs.writeFileSync(filePath, jsonString, { flag: 'w' });

        console.log('Downloaded: ' + filePath);
    } catch (error) {
        console.error('Error downloading: ' + filePath);
    }
};

const loadJSONFromFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (error, fileData) => {
            if (error) {
                console.error('Error loading JSON file:', error);
                reject(error);
                return;
            }

            try {
                const jsonData = JSON.parse(fileData);
                resolve(jsonData);
            } catch (parseError) {
                console.error('Error parsing JSON file:', parseError);
                reject(parseError);
            }
        });
    });
};

const saveJSONToFile = async (filePath, data) => {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(filePath, jsonData, 'utf-8', { flag: 'w' });
        console.log('JSON file saved successfully.');
    } catch (error) {
        console.error('Error saving JSON file:', error);
    }
};

const deleteFilesInFolder = async (folderPath) => {
    fs.readdirSync(folderPath).forEach((file) => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Recursively delete files in subfolders
            deleteFilesInFolder(filePath);
        } else {
            // Delete the file
            fs.unlinkSync(filePath);
            console.log('Deleted:', filePath);
        }
    });
};

function roundDownLatLong(lat){
    var first = lat.split('.')[0];
    var second = parseInt(lat.split('.')[1].substring(0, 5));

    var result1 = parseInt(second / 300);
    var result2 = result1 * 300;

    var output = first + '.' + result2.toString();
    return output;
}

function calculateDistance(lat1, lon1, lat2, lon2) 
{
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = earthRadius * c * 1000; // Distance in meters
    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export { downloadJSONFile, loadJSONFromFile, saveJSONToFile, deleteFilesInFolder, roundDownLatLong, calculateDistance, downloadCsvAndConvertJson };
