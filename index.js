#!/usr/bin/env node --experimental-modules
import express from "express";
import cors from "cors"
import fs from "fs";
import { downloadRouteList, downloadRouteStops, downloadStops, parseJsonCtb } from "./src/functions/ctb.js";
import { downloadRouteListKmb, downloadRouteStopListKmb, downloadStopListKmb, parseJsonKmb, } from "./src/functions/kmb.js";
import { downloadJSONFile } from "./src/utilities/file_management.js";
import { deleteNonCoop, parseJsonKmbCtb } from "./src/functions/kmbctb.js";
import { downloadRouteStopListMtrBus, parseJsonMtrBus } from "./src/functions/mtrbus.js";
import { downloadAndParseRouteListGmb, downloadAndParseRouteStopListGmb, downloadStopGmb, mergeStopCoordinateToRouteStopGmb } from "./src/functions/gmb.js";
import { downloadRouteListNlb, downloadRouteStopNlb, parseJsonNlb } from "./src/functions/nlb.js";

const app = express();
app.use(cors({
    origin: '*',
    methods: ['POST', 'GET'],
    credentials: true
}));

app.get(('/kmb'), async (req, res) =>
{
    // await downloadRouteListKmb();
    // await downloadRouteStopListKmb();
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // await downloadStopListKmb();

    await parseJsonKmb('en');
    await parseJsonKmb('tc');

    res.send('done');
})

app.get(('/ctb'), async (req, res) =>
{
    // await downloadRouteList();
    // await downloadRouteStops();
    // await downloadStops();

    await parseJsonCtb('en');
    await parseJsonCtb('tc');

    res.send('done');
})

app.get(('/kmbctb'), async (req, res) =>
{
    await parseJsonKmbCtb('tc');
    await parseJsonKmbCtb('en');

    // await deleteNonCoop('kmb', 'tc');
    // await deleteNonCoop('kmb', 'en');
    // await deleteNonCoop('ctb', 'tc');
    // await deleteNonCoop('ctb', 'en');

    res.send('done');
})

app.get(('/mtrbus'), async (req, res) =>
{
    // await downloadRouteStopListMtrBus();

    await parseJsonMtrBus('tc');
    await parseJsonMtrBus('en');

    res.send('done');
})

app.get(('/gmb'), async (req, res) =>
{
    // await downloadAndParseRouteListGmb();
    // await downloadAndParseRouteStopListGmb();
    // await downloadStopGmb();
    // await mergeStopCoordinateToRouteStopGmb();

    res.send('done');
})

app.get(('/nlb'), async (req, res) =>
{
    // await downloadRouteListNlb();
    // await downloadRouteStopNlb();
    await parseJsonNlb();

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
app.listen('8081', () =>
{
    console.log('port at 8081');
});

