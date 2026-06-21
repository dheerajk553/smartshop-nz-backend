const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const c = require('../controllers/dealAlertController');

router.post('/',              auth, c.createAlert);
router.get('/',                auth, c.getAlerts);
router.delete('/:id',          auth, c.deleteAlert);
router.post('/register-token', auth, c.registerToken);

module.exports = router;