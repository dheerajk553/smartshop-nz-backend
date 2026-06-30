const mongoose = require('mongoose');
require('dotenv').config();
const Branch = require('../models/Branch');

// Initial branches based on real branches checked during A2 validation
// (Royal Oak vs Mt Albert price difference documented in Section 4.3).
const branches = [
  { store: 'paknsave', name: 'Royal Oak', suburb: 'Royal Oak, Auckland' },
  { store: 'paknsave', name: 'Mt Albert', suburb: 'Mt Albert, Auckland' },
  { store: 'newworld', name: 'Mt Roskill', suburb: 'Mt Roskill, Auckland' }
];

async function seedBranches() {
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

    for (const branchData of branches) {
      const existing = await Branch.findOne({
        store: branchData.store,
        name: branchData.name
      });

      if (existing) {
        console.log(`Skipped (already exists): ${branchData.store} - ${branchData.name}`);
        skippedCount++;
        continue;
      }

      const branch = new Branch(branchData);
      await branch.save();
      console.log(`Created: ${branchData.store} - ${branchData.name}`);
      createdCount++;
    }

    console.log('\n--- Seed Summary ---');
    console.log(`Created: ${createdCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Total branches in DB: ${await Branch.countDocuments()}`);
  } catch (error) {
    console.error('Error seeding branches:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedBranches();