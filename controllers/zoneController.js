const Zone = require('../models/Zone');

// GET /v1/zones - get all zones
exports.getZones = async (req, res) => {
  try {
    const zones = await Zone.find({});
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /v1/zones/:qrCode - look up a zone by its QR code
// This is the main endpoint the mobile scanner will call after scanning a QR code.
exports.getZoneByQRCode = async (req, res) => {
  try {
    const zone = await Zone.findOne({ qrCode: req.params.qrCode });

    if (!zone) {
      return res.status(404).json({ error: 'Zone not found for this QR code' });
    }

    res.json(zone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /v1/zones/:qrCode/qr-image - generate and return a QR code PNG on the fly
exports.getZoneQRImage = async (req, res) => {
  try {
    const QRCode = require('qrcode');
    const zone = await Zone.findOne({ qrCode: req.params.qrCode });

    if (!zone) {
      return res.status(404).json({ error: 'Zone not found for this QR code' });
    }

    const buffer = await QRCode.toBuffer(zone.qrCode, {
      width: 500,
      margin: 2
    });

    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};