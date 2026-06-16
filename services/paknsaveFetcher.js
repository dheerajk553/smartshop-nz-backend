const https = require('https');

const options = {
  hostname: 'www.newworld.co.nz',
  path: `/api/v1/products?target=search&search=milk&inStockProductsOnly=false&pg=1&ps=5`,
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Referer': 'https://www.newworld.co.nz/shop/search?q=milk',
    'x-requested-with': 'OnlineShopping.WebApp',
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('TOP KEYS:', Object.keys(json));
      console.log('First item:', JSON.stringify(json?.products?.items?.[0], null, 2));
    } catch(e) {
      console.log('Raw response:', data.slice(0, 300));
    }
  });
});
req.on('error', console.error);
req.end();