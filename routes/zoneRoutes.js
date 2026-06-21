const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const c = require('../controllers/zoneController');

router.get('/',                  auth, c.getZones);
router.get('/:qrCode',           auth, c.getZoneByQRCode);
router.get('/:qrCode/qr-image',  auth, c.getZoneQRImage);

module.exports = router;