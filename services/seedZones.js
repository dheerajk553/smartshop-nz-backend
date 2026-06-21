const mongoose = require('mongoose');
require('dotenv').config();
const Zone = require('../models/Zone');

const zones = [
  {
    name: 'Milk & Dairy Drinks',
    qrCode: 'ZONE-MILK-01',
    categories: ['milk', 'dairy'],
    aisle: 1,
    description: 'Milk, flavoured milk, and dairy drinks'
  },
  {
    name: 'Cheese',
    qrCode: 'ZONE-CHEESE-02',
    categories: ['cheese'],
    aisle: 2,
    description: 'Block, sliced, and grated cheese'
  },
  {
    name: 'Butter & Spreads',
    qrCode: 'ZONE-BUTTER-03',
    categories: ['butter'],
    aisle: 3,
    description: 'Butter, margarine, and spreads'
  },
  {
    name: 'Eggs',
    qrCode: 'ZONE-EGGS-04',
    categories: ['eggs'],
    aisle: 4,
    description: 'Free-range, organic, and standard eggs'
  },
  {
    name: 'Bakery & Bread',
    qrCode: 'ZONE-BREAD-05',
    categories: ['bread'],
    aisle: 5,
    description: 'Bread, rolls, and bakery items'
  }
];

async function seedZones() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI not found in .env file');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    let createdCount = 0;
    let skippedCount = 0;

    for (const zoneData of zones) {
      const existing = await Zone.findOne({ qrCode: zoneData.qrCode });

      if (existing) {
        console.log(`Skipped (already exists): ${zoneData.qrCode} - ${zoneData.name}`);
        skippedCount++;
        continue;
      }

      const zone = new Zone(zoneData);
      await zone.save();
      console.log(`Created: ${zoneData.qrCode} - ${zoneData.name}`);
      createdCount++;
    }

    console.log('\n--- Seed Summary ---');
    console.log(`Created: ${createdCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Total zones in DB: ${await Zone.countDocuments()}`);
  } catch (error) {
    console.error('Error seeding zones:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedZones();