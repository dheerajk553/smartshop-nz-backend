const Product = require('../models/Product');
const PriceRepository = require('../repositories/PriceRepository');
const { checkAndNotify } = require('../services/dealAlertService');

// GET /v1/products - all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /v1/products/:id/prices - price comparison (all stores)
exports.getPriceComparison = async (req, res) => {
  try {
    const prices = await PriceRepository.getLatestByStore(req.params.id);
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /v1/products/:id/history?days=30 - price history
exports.getPriceHistory = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const history = await PriceRepository.getHistory(req.params.id, days);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /v1/products - add a new product
exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// POST /v1/products/:id/prices - add a new price record
exports.addPrice = async (req, res) => {
  try {
    const record = await PriceRepository.save({
      productId: req.params.id,
      ...req.body
    });
    res.status(201).json(record);

    // Check if any user's deal alert matches this new price
    checkAndNotify(req.params.id, record.price);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};