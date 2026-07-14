// Search for open Telegram channels about border queues
const https = require('https');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400) {
        return resolve({ status: res.statusCode, data: '', redirect: res.headers.location });
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

(async () => {
  // Try various border-related channels
  const channels = [
    'zahidniy_kordon',      // ДПСУ Західний кордон
    'dpsu_gov_ua',          // Офіційний ДПСУ
    'kordon_ua',
    'bordex_ua',
    'shehyni',              // Шегині community
    'krakivets_korchova',   // Краківець-Корчова
    'chergy_na_kordoni',    // Шегині-Медика пішоходи
    'customs_gov_ua',       // Митна служба
  ];

  for (const ch of channels) {
    try {
      const { status, data, redirect } = await fetchPage(`https://telegram.me/s/${ch}`);
      
      if (status === 302) {
        // Channel exists but preview disabled, check via bot API
        const botRes = await fetch(`https://api.telegram.org/bot8920456156:AAElvh5sRxGI4KoZGH1uwePaQnrGPP7U5uo/getChat?chat_id=@${ch}`);
        const botData = await botRes.json();
        if (botData.ok) {
          const hasProtected = botData.result.has_protected_content;
          console.log(`@${ch}: EXISTS (preview ${hasProtected ? 'BLOCKED' : 'OK'}) - "${botData.result.title}"`);
        } else {
          console.log(`@${ch}: ${status} redirect, bot can't access`);
        }
        continue;
      }

      // Parse messages
      const msgRegex = /<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
      const messages = [];
      let match;
      while ((match = msgRegex.exec(data)) !== null) {
        const clean = match[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        messages.push(clean);
      }

      if (messages.length > 0) {
        console.log(`@${ch}: ✅ OPEN! ${messages.length} messages`);
        console.log(`  Last: ${messages[messages.length-1].substring(0, 150)}`);
      } else {
        console.log(`@${ch}: ${status}, no messages`);
      }
    } catch(e) {
      console.log(`@${ch}: ERROR - ${e.message}`);
    }
  }
})();
