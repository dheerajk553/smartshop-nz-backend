const cron = require('node-cron');
const { fetchAndSaveWoolworths } = require('./woolworthsFetcher');

// Har raat 2 baje automatically run karo
cron.schedule('0 2 * * *', async () => {
  console.log('🔄 Auto price update started...');
  for (const q of ['milk', 'bread', 'cheese', 'eggs', 'butter']) {
    await fetchAndSaveWoolworths(q);
  }
  console.log('✅ Prices updated!');
});