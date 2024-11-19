import { downloadCsvAndConvertJson, loadJSONFromFile, saveJSONToFile } from "../utilities/file_management.js";


const downloadList = [
    {
        job: '中環 - 坪洲 (英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_central_pc_timetable_eng.csv',
        path: './download/ferry/raw/central_pc_en.json'
    },

    {
        job: '中環 - 坪洲 (繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_central_pc_timetable_chi.csv',
        path: './download/ferry/raw/central_pc_tc.json'
    },

    {
        job: '中環 - 榕樹灣渡輪服務(收費表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_central_ysw_timetable_eng.csv',
        path: './download/ferry/raw/central_ysw_en.json'
    },

    {
        job: '中環 - 榕樹灣渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_central_ysw_timetable_chi.csv',
        path: './download/ferry/raw/central_ysw_tc.json'
    },

    {
        job: '中環 - 索罟灣渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_central_skw_timetable_eng.csv',
        path: './download/ferry/raw/central_skw_en.json'
    },

    {
        job: '中環 - 索罟灣渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_central_skw_timetable_chi.csv',
        path: './download/ferry/raw/central_skw_tc.json'
    },

    {
        job: '中環 — 梅窩渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_central_mw_timetable_eng.csv',
        path: './download/ferry/raw/central_mw_en.json'
    },

    {
        job: '中環 — 梅窩渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_central_mw_timetable_chi.csv',
        path: './download/ferry/raw/central_mw_tc.json'
    },

    {
        job: '坪洲 - 梅窩 - 芝蔴灣 - 長洲渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_pc_mw_cmw_cc_timetable_eng.csv',
        path: './download/ferry/raw/pc_mw_cmw_cc_en.json'
    },

    {
        job: '坪洲 - 梅窩 - 芝蔴灣 - 長洲渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_pc_mw_cmw_cc_timetable_chi.csv',
        path: './download/ferry/raw/pc_mw_cmw_cc_tc.json'
    },

    {
        job: '中環 - 長洲渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_central_cc_timetable_eng.csv',
        path: './download/ferry/raw/central_cc_en.json'
    },

    {
        job: '中環 - 長洲渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_central_cc_timetable_chi.csv',
        path: './download/ferry/raw/central_cc_tc.json'
    },

    {
        job: '中環 - 愉景灣渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_central_db_timetable_eng.csv',
        path: './download/ferry/raw/central_db_en.json'
    },

    {
        job: '中環 - 愉景灣渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_central_db_timetable_chi.csv',
        path: './download/ferry/raw/central_db_tc.json'
    },

    {
        job: '馬灣 - 中環渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_mawan_c_timetable_eng.csv',
        path: './download/ferry/raw/mawan_c_en.json'
    },

    {
        job: '馬灣 - 中環渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_mawan_c_timetable_chi.csv',
        path: './download/ferry/raw/mawan_c_tc.json'
    },

    {
        job: '馬灣 - 荃灣渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_mawan_tw_timetable_eng.csv',
        path: './download/ferry/raw/mawan_tw_en.json'
    },

    {
        job: '馬灣 - 荃灣渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_mawan_tw_timetable_eng.csv',
        path: './download/ferry/raw/mawan_tw_tc.json'
    },

    {
        job: '北角 - 紅磡渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_np_hh_timetable_eng.csv',
        path: './download/ferry/raw/np_hh_en.json'
    },

    {
        job: '北角 - 紅磡渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_np_hh_timetable_chi.csv',
        path: './download/ferry/raw/np_hh_tc.json'
    },

    {
        job: '北角 - 九龍城渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_np_klnc_timetable_eng.csv',
        path: './download/ferry/raw/np_klnc_en.json'
    },

    {
        job: '北角 - 九龍城渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_np_klnc_timetable_chi.csv',
        path: './download/ferry/raw/np_klnc_tc.json'
    },

    {
        job: '北角 - 觀塘 - 啟德渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_np_ktak_timetable_eng.csv',
        path: './download/ferry/raw/np_ktak_en.json'
    },

    {
        job: '北角 - 觀塘 - 啟德渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_np_ktak_timetable_chi.csv',
        path: './download/ferry/raw/np_ktak_tc.json'
    },

    {
        job: '西灣河 - 觀塘渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_swh_kt_timetable_eng.csv',
        path: './download/ferry/raw/swh_kt_en.json'
    },

    {
        job: '西灣河 - 觀塘渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_swh_kt_timetable_chi.csv',
        path: './download/ferry/raw/swh_kt_tc.json'
    },

    {
        job: '西灣河 - 三家村渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_swh_skt_timetable_eng.csv',
        path: './download/ferry/raw/swh_skt_en.json'
    },

    {
        job: '西灣河 - 三家村渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_swh_skt_timetable_chi.csv',
        path: './download/ferry/raw/swh_skt_tc.json'
    },

    {
        job: '愉景灣—梅窩渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_db_mw_timetable_eng.csv',
        path: './download/ferry/raw/db_mw_en.json'
    },

    {
        job: '愉景灣—梅窩渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_db_mw_timetable_chi.csv',
        path: './download/ferry/raw/db_mw_tc.json'
    },

    {
        job: '屯門—東涌—沙螺灣—大澳渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_tm_tc_slw_to_timetable_eng.csv',
        path: './download/ferry/raw/tm_tc_slw_to_en.json'
    },

    {
        job: '屯門—東涌—沙螺灣—大澳渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_tm_tc_slw_to_timetable_chi.csv',
        path: './download/ferry/raw/tm_tc_slw_to_tc.json'
    },

    {
        job: '香港仔—索罟灣（經模達）渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_abd_skw_timetable_eng.csv',
        path: './download/ferry/raw/abd_skw_en.json'
    },

    {
        job: '香港仔—索罟灣（經模達）渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_abd_skw_timetable_chi.csv',
        path: './download/ferry/raw/abd_skw_tc.json'
    },

    {
        job: '香港仔—北角村—榕樹灣渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_abd_ysw_timetable_eng.csv',
        path: './download/ferry/raw/abd_ysw_en.json'
    },

    {
        job: '香港仔—北角村—榕樹灣渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_abd_ysw_timetable_chi.csv',
        path: './download/ferry/raw/abd_ysw_tc.json'
    },
    {
        job: '中環—紅磡渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_c_hh_timetable_eng.csv',
        path: './download/ferry/raw/c_hh_en.json'
    },
    {
        job: '中環—紅磡渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_c_hh_timetable_chi.csv',
        path: './download/ferry/raw/c_hh_tc.json'
    },
    {
        job: '馬料水—塔門渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_4912%2Fopendata%2Fferry_mls_tm_timetable_eng.csv',
        path: './download/ferry/raw/mls_tm_en.json'
    },
    {
        job: '馬料水—塔門渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_4912%2Fopendata%2Fferry_mls_tm_timetable_chi.csv',
        path: './download/ferry/raw/mls_tm_tc.json'
    },
    {
        job: '馬料水—東平洲渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_4912%2Fopendata%2Fferry_mls_tpc_timetable_eng.csv',
        path: './download/ferry/raw/mls_tpc_en.json'
    },
    {
        job: '馬料水—東平洲渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_4912%2Fopendata%2Fferry_mls_tpc_timetable_chi.csv',
        path: './download/ferry/raw/mls_tpc_tc.json'
    },
    {
        job: '塔門—黃石碼頭渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_4912%2Fopendata%2Fferry_tm_wsp_timetable_eng.csv',
        path: './download/ferry/raw/tm_wsp_en.json'
    },
    {
        job: '塔門—黃石碼頭渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_4912%2Fopendata%2Fferry_tm_wsp_timetable_chi.csv',
        path: './download/ferry/raw/tm_wsp_tc.json'
    },
    {
        job: '北角／觀塘–梅窩( 危險品車輛 )渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_npkt_mw_timetable_eng.csv',
        path: './download/ferry/raw/npkt_mw_en.json'
    },
    {
        job: '北角／觀塘–梅窩( 危險品車輛 )渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_npkt_mw_timetable_chi.csv',
        path: './download/ferry/raw/npkt_mw_tc.json'
    },
    {
        job: '北角–觀塘 ( 危險品車輛 )渡輪服務(航班時間表)(英文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Fen%2Fcontent_1408%2Fopendata%2Fferry_np_kt_timetable_eng.csv',
        path: './download/ferry/raw/np_kt_dangerous_en.json'
    },
    {
        job: '北角–觀塘 ( 危險品車輛 )渡輪服務(航班時間表)(繁體中文)',
        url: 'https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.td.gov.hk%2Ffilemanager%2Ftc%2Fcontent_1408%2Fopendata%2Fferry_np_kt_timetable_chi.csv',
        path: './download/ferry/raw/np_kt_dangerous_tc.json'
    }
]

async function downloadFerryJson()
{
    for (var i = 0; i < downloadList.length; i++)
    {
        const url = downloadList[i].url;
        const path = downloadList[i].path;
        await downloadCsvAndConvertJson(url, path);
    }
}

async function parseRouteStopListFerry()
{
    const masterList = {};
    const serviceDayList = [];
    const serviceDayObject = {};
    const locationList = [];
    const locationObject = {};

    for (var i = 0; i < downloadList.length; i++)
    {
        if (downloadList[i].job.includes('繁體中文'))
        {
            const readFilePath = downloadList[i].path;
            const jsonObject = await loadJSONFromFile(readFilePath);

            for (var j = 0; j < jsonObject.length; j++)
            {
                const direction = jsonObject[j]['方向'];
                const serviceDay = jsonObject[j]['服務日子'];
                const serviceTime = jsonObject[j]['服務時段'] || jsonObject[j]['班次'];

                if (direction && serviceDay && serviceTime)
                {
                    if (serviceDay in serviceDayObject == false)
                    {
                        serviceDayList.push(serviceDay);
                        serviceDayObject[serviceDay] = serviceDay;
                    }

                    const locationArray = direction.split(' 至 ');
                    if (locationArray[0] in locationObject == false)
                    {
                        locationList.push(locationArray[0]);
                        locationObject[locationArray[0]] = locationArray[0];
                    }
                    if (locationArray[1] in locationObject == false)
                    {
                        locationList.push(locationArray[1]);
                        locationObject[locationArray[1]] = locationArray[1];
                    }

                    if (direction in masterList == false) 
                    {
                        masterList[direction] = {};
                    }

                    if (serviceDay in masterList[direction] == false)
                    {
                        masterList[direction][serviceDay] = [];
                    }

                    masterList[direction][serviceDay].push(serviceTime);
                }
            }
        }
    }

    await saveJSONToFile(`./download/ferry/output/routeStopListFerry.json`, masterList);
    await saveJSONToFile(`./download/ferry/output/serviceDayList.json`, serviceDayList);
    await saveJSONToFile(`./download/ferry/output/locationList.json`, locationList);
}

export { downloadFerryJson, parseRouteStopListFerry }