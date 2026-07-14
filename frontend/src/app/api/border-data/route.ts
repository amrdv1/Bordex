import { NextResponse } from 'next/server';

const NAKORDONI_API_KEY = 'NKD-DEV-KA7T-54NN-5PBE';

// Every border point mapped to its Nakordoni PPIDs
// Entry PPIDs = traffic entering Ukraine, Exit PPIDs = traffic leaving Ukraine
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

export async function GET() {
  try {
    // Collect all unique PPIDs
    const allPpids = [...new Set(BORDER_POINTS.flatMap(p => p.ppids).filter(Boolean))];
    
    // Split into batches of 10 (Nakordoni API limit)
    const batches: string[][] = [];
    for (let i = 0; i < allPpids.length; i += 10) {
      batches.push(allPpids.slice(i, i + 10));
    }

    // Fetch all batches in parallel
    const nakordoniData: Record<string, any> = {};
    
    const batchResults = await Promise.allSettled(
      batches.map(async (batch) => {
        const response = await fetch(
          `https://nakordoni.eu/api/v1/data/multi?ppids=${batch.join(',')}`,
          {
            headers: { 'Authorization': `Bearer ${NAKORDONI_API_KEY}` },
            next: { revalidate: 5400 }, // 1.5 hours (avoids hitting 200 requests/day limit)
          }
        );
        if (!response.ok) {
          console.error(`Nakordoni batch failed with ${response.status} for ppids: ${batch.join(',')}`);
          return {};
        }
        const apiData = await response.json();
        return apiData?.data || {};
      })
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        Object.assign(nakordoniData, result.value);
      }
    }

    if (Object.keys(nakordoniData).length === 0) {
      throw new Error('Nakordoni API returned no data across all batches. Likely blocked or rate limited.');
    }

    // Map each border point to its queue data
    const points = BORDER_POINTS.map(point => {
      let bestQueue = 0;
      let bestWaitMin = 0;
      let latestUpdate: string | null = null;
      let hasData = false;

      // Collect all valid PPID data for this point
      const validEntries: { queueNow: number; waitMin: number; ageMin: number; updatedAt: string }[] = [];

      for (const ppid of point.ppids) {
        const pd = nakordoniData[ppid];
        if (pd?.queue?.found) {
          hasData = true;
          const queueNow = pd.queue.queue_now || 0;
          const waitMin = pd.queue.wait_min || 0;
          const ageMin = pd.queue.age_min || 999;
          const updatedAt = pd.queue.updated_at || '';

          // Skip aggregate PPIDs with unrealistic wait times (>24 hours)
          if (waitMin > 1440) continue;

          validEntries.push({ queueNow, waitMin, ageMin, updatedAt });
        }
      }

      if (validEntries.length > 0) {
        // Pick the freshest entry (lowest age_min)
        validEntries.sort((a, b) => a.ageMin - b.ageMin);
        const best = validEntries[0];
        bestQueue = best.queueNow;
        bestWaitMin = best.waitMin;
        latestUpdate = best.updatedAt;
      }

      return {
        id: point.id,
        name: point.name,
        lat: point.lat,
        lng: point.lng,
        country: { name: point.country },
        isOpen: hasData || point.ppids.length === 0,
        queueData: {
          cars: bestQueue,
          trucks: 0,
          buses: 0,
          pedestrians: 0,
          waitTimeMins: bestWaitMin,
          lastUpdated: latestUpdate,
        }
      };
    });

    return NextResponse.json(points);
  } catch (error: any) {
    console.error('Failed to fetch Nakordoni data:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch border data', details: error.message },
      { status: 500 }
    );
  }
}
