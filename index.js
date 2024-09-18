#!/usr/bin/env node --experimental-modules
import express from "express";
import cors from "cors"
import fs from "fs";
import { downloadRouteList, downloadRouteStops, downloadStops } from "./functions/ctb.js";


const app = express();
app.use(cors({
    origin: '*',
    methods: ['POST', 'GET'],
    credentials: true
}));

app.get(('/ctb'), async (req, res) => {
    // await downloadRouteList();
    // await downloadRouteStops();
    await downloadStops();
    res.send('done');
})

app.get(('/ctbtest'), async (req, res) => {
    await downloadStops();
    res.send('done');
})

// app.get(('/downloadCtb'), async (req, res) => {
//     // await deleteFilesInFolder('./download/ctb');
//     // console.log('delete ctb files finished');

//     // await downloadCtbRoutList();
//     // await downloadCtbRouteStopFiles();
//     // await downloadCtbStopFiles();

//     // await createCtbRouteList();
//     // await createCtbRouteStopList();

//     // res.send('done');
// })

// app.get(('/downloadmtrbus'), async(req, res) => {
//     // await deleteFilesInFolder('./download/mtrbus');
//     // console.log('delete mtrbus files finished');

//     await downloadMtrbusRoutStopList();
//     await createMtrbusRouteList();
//     res.send('done');
// })

// app.get(('/downloadmtr'), async(req, res) => {
//     // await deleteFilesInFolder('./download/mtr');
//     // console.log('delete mtr finished');

//     // await downloadMtrRoutStopList();
//     await createMtrRouteList();
//     res.send('done');
// })

// app.get(('/mergedata'), async (req, res) => {
//     await createTEMPKmbRouteStopList();
//     await createTEMPCtbRouteStopList();
//     await createTEMPCtbRouteList();

//     await mergeUniqueRouteList();
//     await mergeRouteList();
//     await mergeRouteStopList();
//     res.send('done');
// })

// app.get(('/processlocation'), async (req, res) => {
//     await parseLocationBasedRouteStopList();

//     res.send('done');
// })

// app.get(('/processtimetable'), async(req, res) => {
//     var map = await processTimetable();
//     // res.send(map);
//     res.send('done');
// })

// app.get(('/generatetimestamp'), async(req, res) => {
//     await generateTimestamp();
//     res.send('done');
// })

// // ===== RETRIEVE FUNCTIONS =====
// app.get(('/uniqueroutelist'), async(req, res) => {
//     const filePath = 'download/output/FINAL_unique_route_list.json';
//     const jsonFile = await loadJSONFromFile(filePath);

//     res.set('Content-Type', 'application/json');
//     res.json(jsonFile);
// })

// app.get(('/routelist'), async(req, res) => {
//     const filePath = 'download/output/FINAL_route_list.json';
//     const jsonFile = await loadJSONFromFile(filePath);

//     res.set('Content-Type', 'application/json');
//     res.json(jsonFile);
// })

// app.get(('/routestoplist'), async(req, res) => {
//     const filePath = 'download/output/FINAL_route_stop_list.json';
//     const jsonFile = await loadJSONFromFile(filePath);

//     res.set('Content-Type', 'application/json');
//     res.json(jsonFile);
// })

// app.get(('/gettimetable'), async(req, res) => {
//     const filePath = 'download/output/FINAL_timetable.json';
//     const jsonFile = await loadJSONFromFile(filePath);

//     res.set('Content-Type', 'application/json');
//     res.json(jsonFile);
// })

// app.get(('/getlatestversion'), async(req, res) => {
//     const filePath = 'download/output/FINAL_timestamp.json';
//     const jsonFile = await loadJSONFromFile(filePath);

//     res.set('Content-Type', 'application/json');
//     res.json(jsonFile);
// })

const options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.crt')
};

// ===== PRODUCTION HTTPS SERVER =====
// const server = https.createServer(options, app);
// server.listen(8081, () => {
//     console.log(`HTTPS server is running on port 8081`);
// });

// ===== LOCALHOST TESTING SERVER =====
app.listen('8081', () => {
    console.log('port at 8081');
});

