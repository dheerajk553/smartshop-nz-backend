const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');
const PriceRecord = require('../models/PriceRecord');
const Branch = require('../models/Branch');

// Branch-specific prices, looked up by barcode (same pattern as seedPakNSave.js).
// Mainland Mild Cheese 1kg prices reflect the same product used throughout A2
// (chain-level: Pak'nSave $12.99, New World $13.99). Branch-level entries here
// are illustrative examples consistent with the real $0.40/kg banana variation
// documented in A2 Section 4.3 (Royal Oak vs Mt Albert).
const branchPriceData = [
  {
    barcode: '9300633105404', // Mainland Mild Cheese 1kg
    entries: [
      { store: 'paknsave', branchName: 'Royal Oak', price: 13.49 },
      { store: 'paknsave', branchName: 'Mt Albert',  price: 12.79 },
      { store: 'newworld', branchName: 'Mt Roskill', price: 14.29 },
    ]
  },
];

async function seedBranchPrices() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI not found in .env file');

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { family: 4 });
    console.log('Connected.');

    let createdCount = 0;
    let skippedCount = 0;

    for (const item of branchPriceData) {
      const product = await Product.findOne({ barcode: item.barcode });
      if (!product) {
        console.log(`Skipped (product not found): barcode ${item.barcode}`);
        continue;
      }

      for (const entry of item.entries) {
        const branch = await Branch.findOne({ store: entry.store, name: entry.branchName });
        if (!branch) {
          console.log(`Skipped (branch not found): ${entry.store} - ${entry.branchName}. Run seedBranches.js first.`);
          continue;
        }

        const existing = await PriceRecord.findOne({
          productId: product._id,
          branchId: branch._id
        });

        if (existing) {
          console.log(`Skipped (already exists): ${product.name} @ ${entry.branchName}`);
          skippedCount++;
          continue;
        }

        await PriceRecord.create({
          productId: product._id,
          store: entry.store,
          branchId: branch._id,
          price: entry.price
        });
        console.log(`Created: ${product.name} @ ${entry.branchName} (${entry.store}) — $${entry.price}`);
        createdCount++;
      }
    }

    console.log('\n--- Seed Summary ---');
    console.log(`Created: ${createdCount}`);
    console.log(`Skipped: ${skippedCount}`);
  } catch (error) {
    console.error('Error seeding branch prices:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedBranchPrices();