const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({ name: String, barcode: String, category: String }, { timestamps: true });
const priceRecordSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId },
  store: { type: String, enum: ['paknsave', 'countdown', 'newworld', 'woolworths'] },
  price: Number,
  date: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const PriceRecord = mongoose.models.PriceRecord || mongoose.model('PriceRecord', priceRecordSchema);

const priceData = [
  { barcode: '94154672',       paknsave: 2.79, newworld: 3.09 },
  { barcode: '9414905000143',  paknsave: 3.49, newworld: 3.79 },
  { barcode: '9300633105404',  paknsave: 12.99, newworld: 13.99 },
  { barcode: '9414742036509',  paknsave: 2.69, newworld: 2.99 },
  { barcode: '9414742036462',  paknsave: 2.69, newworld: 2.99 },
  { barcode: '94160512',       paknsave: 2.79, newworld: 3.09 },
  { barcode: '9414742036714',  paknsave: 2.59, newworld: 2.89 },
  { barcode: '9400597022002',  paknsave: 1.99, newworld: 2.29 },
  { barcode: '9414742036455',  paknsave: 2.69, newworld: 2.99 },
];

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(async () => {
    console.log('✅ MongoDB connected');
    let count = 0;

    for (const item of priceData) {
      const product = await Product.findOne({ barcode: item.barcode });
      if (!product) { console.log(`⚠️ Not found: ${item.barcode}`); continue; }

      await PriceRecord.create({ productId: product._id, store: 'paknsave', price: item.paknsave });
      await PriceRecord.create({ productId: product._id, store: 'newworld', price: item.newworld });
      console.log(`✅ ${product.name} → PaknSave: $${item.paknsave} | NewWorld: $${item.newworld}`);
      count++;
    }

    console.log(`\n🎉 Done! ${count} products updated.`);
    process.exit(0);
  })
  .catch(err => { console.error('❌', err.message); process.exit(1); });