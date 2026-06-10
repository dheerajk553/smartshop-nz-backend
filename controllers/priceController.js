const Product = require('../models/Product');
const PriceRepository = require('../repositories/PriceRepository');

// GET /v1/products - sab products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /v1/products/:id/prices - price comparison (sabhi stores)
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

// POST /v1/products - naya product add karo
exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// POST /v1/products/:id/prices - naya price record add karo
exports.addPrice = async (req, res) => {
  try {
    const record = await PriceRepository.save({
      productId: req.params.id,
      ...req.body
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};