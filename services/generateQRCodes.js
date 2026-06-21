const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
require('dotenv').config();
const Zone = require('../models/Zone');

const OUTPUT_DIR = path.join(__dirname, '..', 'qr-codes');

async function generateQRCodes() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI not found in .env file');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`Created output directory: ${OUTPUT_DIR}`);
    }

    const zones = await Zone.find({});

    if (zones.length === 0) {
      console.log('No zones found in DB. Run seedZones.js first.');
      return;
    }

    let generatedCount = 0;

    for (const zone of zones) {
      const filePath = path.join(OUTPUT_DIR, `${zone.qrCode}.png`);

      // QR code encodes the qrCode string itself (e.g. "ZONE-MILK-01").
      // The mobile scanner will read this string and look up the zone.
      await QRCode.toFile(filePath, zone.qrCode, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      console.log(`Generated: ${zone.qrCode}.png  (Zone: ${zone.name}, Aisle: ${zone.aisle})`);
      generatedCount++;
    }

    console.log('\n--- Generation Summary ---');
    console.log(`Generated: ${generatedCount} QR code images`);
    console.log(`Saved to: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('Error generating QR codes:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

generateQRCodes();