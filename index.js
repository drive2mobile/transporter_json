import express from "express";
import cors from "cors"
import { downloadRouteListCtb, downloadRouteStopCtb, downloadStopCtb, parseJsonCtb } from "./src/functions/ctb.js";
import { downloadRouteListKmb, downloadRouteStopListKmb, downloadStopListKmb, parseJsonKmb, } from "./src/functions/kmb.js";
import { deleteNonCoop, parseJsonKmbCtb } from "./src/functions/kmbctb.js";
import { downloadRouteStopListMtrBus, parseJsonMtrBus } from "./src/functions/mtrbus.js";
import { downloadGmbRouteList, downloadGmbRouteListGmb, downloadRouteStopListGmb, downloadStopGmb, mergeStopCoordinateToRouteStopGmb, parseRouteListGmb, parseRouteStopListGmb } from "./src/functions/gmb.js";
import { downloadRouteListNlb, downloadRouteStopNlb, parseJsonNlb } from "./src/functions/nlb.js";
import { generateVersion, parseUniqueRouteList, parseUniqueRouteMap, parseUniqueRouteStopList, parseUniqueRouteStopListByLocation } from "./src/functions/parseFinal.js";
import { processTimetable } from "./src/functions/timetable.js";
import { createMtrRouteList, downloadMtrRoutStopList } from "./src/functions/functions_mtr.js";

const app = express();
app.use(cors({
    origin: '*',
    methods: ['POST', 'GET'],
    credentials: true
}));

app.get(('/ctb'), async (req, res) =>
{
    await downloadRouteListCtb();
    await downloadRouteStopCtb();
    await downloadStopCtb();
    await parseJsonCtb();

    res.send('done');
})

app.get(('/kmb'), async (req, res) =>
{
    await downloadRouteListKmb();
    await downloadRouteStopListKmb();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await downloadStopListKmb();
    await parseJsonKmb();

    res.send('done');
})

app.get(('/kmbctb'), async (req, res) =>
{
    await parseJsonKmbCtb();
    await deleteNonCoop('kmb');
    await deleteNonCoop('ctb');

    res.send('done');
})

app.get(('/mtrbus'), async (req, res) =>
{
    await downloadRouteStopListMtrBus();
    await parseJsonMtrBus('tc');

    res.send('done');
})

app.get(('/gmb'), async (req, res) =>
{
    await downloadGmbRouteList();
    await downloadGmbRouteListGmb();
    await parseRouteListGmb();
    await downloadRouteStopListGmb();
    await parseRouteStopListGmb();
    await downloadStopGmb();
    await mergeStopCoordinateToRouteStopGmb();
    res.send('done');
})

app.get(('/nlb'), async (req, res) =>
{
    await downloadRouteListNlb();
    await downloadRouteStopNlb();
    await parseJsonNlb();

    res.send('done');
})


app.get(('/mtr'), async (req, res) =>
{
    await downloadMtrRoutStopList();
    await createMtrRouteList();

    res.send('done');
})

app.get(('/parseFinalOutput'), async (req, res) =>
{
    await parseUniqueRouteList();
    await parseUniqueRouteMap();
    await parseUniqueRouteStopList();
    await parseUniqueRouteStopListByLocation();
    await processTimetable();
    await generateVersion();

    res.send('done');
})

// ===== LOCALHOST TESTING SERVER =====
app.listen('8081', () =>
{
    console.log('port at 8081');
});

