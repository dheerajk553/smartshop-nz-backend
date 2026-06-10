const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

router.get('/',           priceController.getAllProducts);
router.post('/',          priceController.addProduct);
router.get('/:id/prices', priceController.getPriceComparison);
router.get('/:id/history',priceController.getPriceHistory);
router.post('/:id/prices',priceController.addPrice);

module.exports = router;