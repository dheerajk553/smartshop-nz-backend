const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

// Direct schema define karo — file import mat karo
const priceRecordSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  store: { type: String, enum: ['paknsave', 'countdown', 'newworld', 'woolworths'], required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  category: { type: String },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const PriceRecord = mongoose.models.PriceRecord || mongoose.model('PriceRecord', priceRecordSchema);

async function fetchWoolworths(query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.woolworths.co.nz',
      path: `/api/v1/products?target=search&search=${encodeURIComponent(query)}&inStockProductsOnly=false&pg=1&ps=10`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.woolworths.co.nz/shop/search?q=' + query,
        'x-requested-with': 'OnlineShopping.WebApp',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        try {
          const json = JSON.parse(data);
          const items = json.products?.items || [];
          console.log(`Found ${items.length} items for "${query}"`);

          for (const p of items) {
            if (!p.barcode || !p.price) continue;
            const price = p.price.salePrice || p.price.originalPrice;
            if (!price || price <= 0) continue;

            let product = await Product.findOne({ barcode: p.barcode });
            if (!product) {
              product = await Product.create({ name: p.name, barcode: p.barcode, category: query });
              console.log(`✅ Saved: ${p.name}`);
            }

            await PriceRecord.create({ productId: product._id, store: 'woolworths', price });
            console.log(`💰 ${p.name} → $${price}`);
          }
          resolve();
        } catch (e) {
          console.error('Parse error:', e.message);
          resolve();
        }
      });
    });
    req.on('error', (e) => { console.error('Request error:', e.message); resolve(); });
    req.end();
  });
}

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(async () => {
    console.log('✅ MongoDB connected');
    for (const q of ['milk', 'bread', 'cheese', 'eggs', 'butter']) {
      console.log(`\n🔍 ${q}`);
      await fetchWoolworths(q);
    }
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch(err => { console.error('❌', err.message); process.exit(1); });