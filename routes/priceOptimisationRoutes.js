const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const c = require('../controllers/priceOptimisationController');

router.get('/branches',     auth, c.getBranches);
router.get('/:listId',      auth, c.optimiseList);

module.exports = router;