import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

// ============================================================
// DATA SOURCES CONFIGURATION
// ============================================================

const NAKORDONI_API_KEY = 'NKD-DEV-KA7T-54NN-5PBE';
const GRANICA_SOAP_URL = 'https://granica.gov.pl/Services/czasyService/soap_granica.php';

// Mapping: Ukrainian border point name → Polish name for granica.gov.pl SOAP API
const GRANICA_MAPPING: Record<string, string> = {
  '1':  'Dorohusk',     // Ягодин
  '2':  'Zosin',        // Устилуг
  '3':  'Dolhobyczow',  // Угринів
  '4':  'Hrebenne',     // Рава-Руська
  '5':  'Budomierz',    // Грушів
  '6':  'Korczowa',     // Краківець
  '7':  'Medyka',       // Шегині
  '8':  'Kroscienko',   // Смільниця
  '35': 'Malhowice',    // Нижанковичі
};

// Every border point mapped to its Nakordoni PPIDs
const BORDER_POINTS = [
  { id: '1',  name: 'Ягодин',              lat: 51.2185, lng: 23.8058, country: 'Польща',    ppids: ['id_59', 'id_64'] },
  { id: '2',  name: 'Устилуг',             lat: 50.8587, lng: 24.1561, country: 'Польща',    ppids: ['id_2', 'id_3', 'id_67', 'id_68'] },
  { id: '3',  name: 'Угринів',             lat: 50.5843, lng: 24.1039, country: 'Польща',    ppids: ['id_4', 'id_5', 'id_102', 'id_103'] },
  { id: '4',  name: 'Рава-Руська',         lat: 50.2588, lng: 23.5936, country: 'Польща',    ppids: ['id_7', 'id_8', 'id_105', 'id_106'] },
  { id: '5',  name: 'Грушів',              lat: 50.1215, lng: 23.3276, country: 'Польща',    ppids: ['id_10', 'id_11', 'id_108', 'id_109'] },
  { id: '6',  name: 'Краківець',           lat: 49.9575, lng: 23.0232, country: 'Польща',    ppids: ['id_13', 'id_14', 'id_111', 'id_112'] },
  { id: '7',  name: 'Шегині',              lat: 49.7981, lng: 22.9511, country: 'Польща',    ppids: ['id_15', 'id_16', 'id_17', 'id_114', 'id_115'] },
  { id: '8',  name: 'Смільниця',           lat: 49.4673, lng: 22.7845, country: 'Польща',    ppids: ['id_19', 'id_20', 'id_118', 'id_119'] },
  { id: '35', name: 'Нижанковичі',         lat: 49.6800, lng: 22.7800, country: 'Польща',    ppids: ['id_18', 'id_344', 'id_346', 'id_348'] },
  { id: '9',  name: 'Ужгород',             lat: 48.6083, lng: 22.2514, country: 'Словаччина', ppids: ['id_24', 'id_25', 'id_350', 'id_622'] },
  { id: '10', name: 'Малий Березний',      lat: 48.8872, lng: 22.4283, country: 'Словаччина', ppids: ['id_21', 'id_22', 'id_23'] },
  { id: '11', name: 'Чоп (Тиса)',          lat: 48.4239, lng: 22.1818, country: 'Угорщина',  ppids: ['id_27', 'id_28', 'id_266'] },
  { id: '12', name: 'Лужанка',             lat: 48.1678, lng: 22.6567, country: 'Угорщина',  ppids: ['id_29', 'id_30', 'id_268'] },
  { id: '32', name: 'Вилок',               lat: 48.1068, lng: 22.8251, country: 'Угорщина',  ppids: ['id_35', 'id_36'] },
  { id: '33', name: 'Косино',              lat: 48.2415, lng: 22.4729, country: 'Угорщина',  ppids: ['id_31', 'id_32'] },
  { id: '34', name: 'Дзвінкове',           lat: 48.2861, lng: 22.3168, country: 'Угорщина',  ppids: ['id_29', 'id_30'] },
  { id: '13', name: 'Дякове',              lat: 48.0125, lng: 23.0456, country: 'Румунія',   ppids: ['id_37', 'id_251', 'id_353'] },
  { id: '14', name: 'Порубне',             lat: 48.0142, lng: 26.0628, country: 'Румунія',   ppids: ['id_40', 'id_41', 'id_42', 'id_351'] },
  { id: '31', name: 'Красноїльськ',        lat: 47.9868, lng: 25.5686, country: 'Румунія',   ppids: ['id_43', 'id_44', 'id_157'] },
  { id: '17', name: 'Орлівка',             lat: 45.2751, lng: 28.4526, country: 'Румунія',   ppids: ['id_230', 'id_436'] },
  { id: '15', name: 'Паланка',             lat: 46.4089, lng: 30.0921, country: 'Молдова',   ppids: ['id_268', 'id_412'] },
  { id: '16', name: 'Маяки-Удобне',        lat: 46.4161, lng: 30.2503, country: 'Молдова',   ppids: ['id_269', 'id_413'] },
  { id: '18', name: 'Рені',                lat: 45.4262, lng: 28.2120, country: 'Молдова',   ppids: ['id_187', 'id_359'] },
  { id: '19', name: 'Виноградівка',        lat: 45.6961, lng: 28.5713, country: 'Молдова',   ppids: [] },
  { id: '20', name: 'Табаки',              lat: 45.7483, lng: 28.6128, country: 'Молдова',   ppids: ['id_184'] },
  { id: '21', name: 'Серпневе 1',          lat: 46.3028, lng: 29.0205, country: 'Молдова',   ppids: ['id_684'] },
  { id: '22', name: 'Старокозаче',         lat: 46.4353, lng: 29.8327, country: 'Молдова',   ppids: ['id_283', 'id_414'] },
  { id: '23', name: 'Кучурган',            lat: 46.7328, lng: 29.9825, country: 'Молдова',   ppids: [] },
  { id: '24', name: 'Платонове',           lat: 47.3821, lng: 29.3512, country: 'Молдова',   ppids: [] },
  { id: '25', name: 'Могилів-Подільський', lat: 48.4414, lng: 27.7954, country: 'Молдова',   ppids: ['id_165', 'id_227', 'id_355'] },
  { id: '26', name: 'Бронниця',            lat: 48.4239, lng: 27.9150, country: 'Молдова',   ppids: ['id_232', 'id_234'] },
  { id: '27', name: 'Сокиряни',            lat: 48.4356, lng: 27.4206, country: 'Молдова',   ppids: ['id_56', 'id_57', 'id_58'] },
  { id: '28', name: 'Кельменці',           lat: 48.4716, lng: 26.8378, country: 'Молдова',   ppids: ['id_50', 'id_51', 'id_52'] },
  { id: '29', name: 'Росошани',            lat: 48.3732, lng: 26.9692, country: 'Молдова',   ppids: ['id_53', 'id_54', 'id_55'] },
  { id: '30', name: 'Мамалига',            lat: 48.2612, lng: 26.6025, country: 'Молдова',   ppids: ['id_47', 'id_48', 'id_49', 'id_360'] },
];

// ============================================================
// SOURCE 1: Official Polish Border API (granica.gov.pl)
// Free, unlimited, official SOAP Web Service
// Returns wait times in HOURS for cars, trucks, buses
// ============================================================

interface GranicaData {
  carsWaitHours: number;
  trucksWaitHours: number;
  busesWaitHours: number;
  date: string;
  hour: string;
}

const xmlParser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });

async function fetchGranicaData(): Promise<Record<string, GranicaData>> {
  const result: Record<string, GranicaData> = {};
  const now = new Date();
  const rok = now.getFullYear().toString();
  const miesiac = (now.getMonth() + 1).toString().padStart(2, '0');
  const dzien = now.getDate().toString().padStart(2, '0');
  const godzina = now.getHours().toString().padStart(2, '0');

  const entries = Object.entries(GRANICA_MAPPING);

  // Fetch all crossings in parallel
  const results = await Promise.allSettled(
    entries.map(async ([pointId, polishName]) => {
      const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns1="granicaServiceOriginal"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
  SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <SOAP-ENV:Body>
    <ns1:getCzasyWszystko>
      <dane_in_wszystko xsi:type="ns1:getCzasyReq">
        <jednostka xsi:type="xsd:string">${polishName}</jednostka>
        <rok xsi:type="xsd:string">${rok}</rok>
        <miesiac xsi:type="xsd:string">${miesiac}</miesiac>
        <dzien xsi:type="xsd:string">${dzien}</dzien>
        <godzina xsi:type="xsd:string">${godzina}</godzina>
      </dane_in_wszystko>
    </ns1:getCzasyWszystko>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

      const response = await fetch(GRANICA_SOAP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'SOAPAction': 'getCzasyWszystko',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        body: soapBody,
        next: { revalidate: 1800 }, // Cache for 30 min
      });

      const text = await response.text();
      if (text === 'blad' || !response.ok) return { pointId, data: null };

      const parsed = xmlParser.parse(text);
      const d = parsed?.Envelope?.Body?.getCzasyWszystkoResponse?.dane_out_wszystko;
      if (!d) return { pointId, data: null };

      // Extract values - they come as {#text: value, @_type: "xsd:string"}
      const getVal = (field: any): number => {
        const v = field?.['#text'];
        if (v === undefined || v === null || v === '-' || v === '') return 0;
        return parseFloat(v) || 0;
      };

      return {
        pointId,
        data: {
          // "wyjazd" = exit from Poland = entering Ukraine (what Ukrainian users care about most)
          carsWaitHours: getVal(d.czas_osobowe_wyjazd),
          trucksWaitHours: getVal(d.czas_ciezarowe_wyjazd),
          busesWaitHours: getVal(d.czas_autokary_wyjazd),
          date: d.data?.['#text'] || '',
          hour: d.godzina?.['#text']?.toString() || '',
        } as GranicaData,
      };
    })
  );

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value.data) {
      result[r.value.pointId] = r.value.data;
    }
  }

  console.log(`[Granica] Fetched data for ${Object.keys(result).length}/${entries.length} Polish crossings`);
  return result;
}

// ============================================================
// SOURCE 2: Nakordoni API (nakordoni.eu)
// Used for non-Polish borders (Slovakia, Hungary, Romania, Moldova)
// Cached for 1.5 hours to stay within 200 requests/day free tier
// ============================================================

interface NakordoniPointData {
  queue: number;
  waitMin: number;
  updatedAt: string | null;
  found: boolean;
}

async function fetchNakordoniData(): Promise<Record<string, NakordoniPointData>> {
  const result: Record<string, NakordoniPointData> = {};

  // Only fetch PPIDs for NON-Polish points (Polish data comes from Granica)
  const nonPolishPoints = BORDER_POINTS.filter(p => p.country !== 'Польща');
  const allPpids = [...new Set(nonPolishPoints.flatMap(p => p.ppids).filter(Boolean))];

  if (allPpids.length === 0) return result;

  // Split into batches of 10
  const batches: string[][] = [];
  for (let i = 0; i < allPpids.length; i += 10) {
    batches.push(allPpids.slice(i, i + 10));
  }

  const nakordoniRaw: Record<string, any> = {};

  const batchResults = await Promise.allSettled(
    batches.map(async (batch) => {
      const response = await fetch(
        `https://nakordoni.eu/api/v1/data/multi?ppids=${batch.join(',')}`,
        {
          headers: { 'Authorization': `Bearer ${NAKORDONI_API_KEY}` },
          next: { revalidate: 5400 }, // 1.5 hours
        }
      );
      if (!response.ok) {
        console.error(`[Nakordoni] Batch failed: ${response.status}`);
        return {};
      }
      const apiData = await response.json();
      return apiData?.data || {};
    })
  );

  for (const r of batchResults) {
    if (r.status === 'fulfilled') {
      Object.assign(nakordoniRaw, r.value);
    }
  }

  // Process per border point
  for (const point of nonPolishPoints) {
    const validEntries: { queueNow: number; waitMin: number; ageMin: number; updatedAt: string }[] = [];
    let hasData = false;

    for (const ppid of point.ppids) {
      const pd = nakordoniRaw[ppid];
      if (pd?.queue?.found) {
        hasData = true;
        const queueNow = pd.queue.queue_now || 0;
        const waitMin = pd.queue.wait_min || 0;
        const ageMin = pd.queue.age_min || 999;
        const updatedAt = pd.queue.updated_at || '';

        if (waitMin > 1440) continue; // Skip unrealistic values
        validEntries.push({ queueNow, waitMin, ageMin, updatedAt });
      }
    }

    if (validEntries.length > 0) {
      validEntries.sort((a, b) => a.ageMin - b.ageMin);
      const best = validEntries[0];
      result[point.id] = {
        queue: best.queueNow,
        waitMin: best.waitMin,
        updatedAt: best.updatedAt,
        found: true,
      };
    } else {
      result[point.id] = { queue: 0, waitMin: 0, updatedAt: null, found: hasData };
    }
  }

  console.log(`[Nakordoni] Fetched data for ${Object.keys(result).length} non-Polish crossings`);
  return result;
}

// ============================================================
// MAIN: Merge all data sources and return unified response
// ============================================================

export async function GET() {
  try {
    // Fetch from all sources in parallel
    const [granicaData, nakordoniData] = await Promise.all([
      fetchGranicaData().catch(err => {
        console.error('[Granica] Failed:', err.message);
        return {} as Record<string, GranicaData>;
      }),
      fetchNakordoniData().catch(err => {
        console.error('[Nakordoni] Failed:', err.message);
        return {} as Record<string, NakordoniPointData>;
      }),
    ]);

    const hasGranica = Object.keys(granicaData).length > 0;
    const hasNakordoni = Object.keys(nakordoniData).length > 0;

    if (!hasGranica && !hasNakordoni) {
      throw new Error('All data sources failed. No live data available.');
    }

    const sources: string[] = [];
    if (hasGranica) sources.push('granica.gov.pl');
    if (hasNakordoni) sources.push('nakordoni.eu');

    // Build unified response
    const points = BORDER_POINTS.map(point => {
      const isPolish = point.country === 'Польща';

      if (isPolish) {
        // Use Granica data for Polish border crossings
        const gd = granicaData[point.id];
        if (gd) {
          return {
            id: point.id,
            name: point.name,
            lat: point.lat,
            lng: point.lng,
            country: { name: point.country },
            isOpen: true,
            source: 'granica.gov.pl',
            queueData: {
              cars: 0, // Granica doesn't provide queue count, only wait time
              trucks: 0,
              buses: 0,
              pedestrians: 0,
              carsWaitHours: gd.carsWaitHours,
              trucksWaitHours: gd.trucksWaitHours,
              busesWaitHours: gd.busesWaitHours,
              waitTimeMins: Math.round(gd.carsWaitHours * 60), // Convert hours to minutes for compatibility
              lastUpdated: `${gd.date} ${gd.hour}:00`,
            },
          };
        }
      }

      // Use Nakordoni data for non-Polish or fallback
      const nd = nakordoniData[point.id];
      if (nd) {
        return {
          id: point.id,
          name: point.name,
          lat: point.lat,
          lng: point.lng,
          country: { name: point.country },
          isOpen: nd.found || point.ppids.length === 0,
          source: 'nakordoni.eu',
          queueData: {
            cars: nd.queue,
            trucks: 0,
            buses: 0,
            pedestrians: 0,
            waitTimeMins: nd.waitMin,
            lastUpdated: nd.updatedAt,
          },
        };
      }

      // No data available for this point
      return {
        id: point.id,
        name: point.name,
        lat: point.lat,
        lng: point.lng,
        country: { name: point.country },
        isOpen: false,
        source: 'none',
        queueData: {
          cars: 0,
          trucks: 0,
          buses: 0,
          pedestrians: 0,
          waitTimeMins: 0,
          lastUpdated: null,
        },
      };
    });

    // Return with metadata about data sources
    return NextResponse.json(points, {
      headers: {
        'X-Data-Sources': sources.join(', '),
        'X-Cache-TTL': '1800',
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch border data:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch border data', details: error.message },
      { status: 500 }
    );
  }
}
