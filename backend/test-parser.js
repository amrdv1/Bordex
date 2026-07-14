// Parser logic for Telegram messages
const text = `
🇺🇦↔🇲🇩 Кордон Україна — Молдова
🕐 09:00 | 14.07

▸ З УКРАЇНИ 🇺🇦→🇲🇩
🚗 Легкові
  Маяки — Удобне — 6 автомобілів ↑
  Мамалига, Кельменці, Сокиряни — черга відсутня
🚌 Автобуси
  Маяки — Удобне — 27 автобусів ↑ 🟡
  Мамалига, Кельменці, Могилів-Подільський — черга відсутня
🚶 Пішохідні
  Мамалига — черга відсутня

▸ В УКРАЇНУ 🇲🇩→🇺🇦
🚗 Легкові
  Паланка — 15 автомобілів ↑
  Отач — 2 автомобілі
  Унгурь — 1 автомобіль
`;

function parseTelegramMessage(text) {
  // We only care about leaving Ukraine for now
  const leavingUkraineSectionMatch = text.match(/▸ З УКРАЇНИ[^▸]*(?:▸|$)/);
  if (!leavingUkraineSectionMatch) return [];

  const section = leavingUkraineSectionMatch[0];
  
  // Split into lines
  const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
  
  const results = [];
  let currentCategory = 'unknown';

  for (const line of lines) {
    if (line.includes('Легкові')) {
      currentCategory = 'cars';
      continue;
    }
    if (line.includes('Автобуси')) {
      currentCategory = 'buses';
      continue;
    }
    if (line.includes('Пішохідні')) {
      currentCategory = 'pedestrians';
      continue;
    }
    if (line.includes('Вантажні')) {
      currentCategory = 'trucks';
      continue;
    }
    
    // Parse queue lines
    // Case 1: "Point — X автомобілів/автобусів"
    const queueMatch = line.match(/(.+)—\s*(\d+)\s*(?:автомобіл|автобус)/i);
    if (queueMatch) {
      const point = queueMatch[1].trim();
      const count = parseInt(queueMatch[2], 10);
      results.push({ point, category: currentCategory, count });
      continue;
    }
    
    // Case 2: "Point1, Point2 — черга відсутня"
    if (line.includes('черга відсутня')) {
      const pointsPart = line.split('—')[0];
      const points = pointsPart.split(',').map(p => p.trim());
      points.forEach(point => {
        results.push({ point, category: currentCategory, count: 0 });
      });
      continue;
    }
  }

  return results;
}

console.log(JSON.stringify(parseTelegramMessage(text), null, 2));
