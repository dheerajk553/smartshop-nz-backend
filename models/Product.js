const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  barcode:  { type: String, required: true, unique: true },
  category: { type: String },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);