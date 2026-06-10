const mongoose = require('mongoose');

const priceRecordSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  store: { 
    type: String, 
    enum: ['paknsave', 'countdown', 'newworld'], 
    required: true 
  },
  price:    { type: Number, required: true },
  date:     { type: Date, default: Date.now },
});

module.exports = mongoose.model('PriceRecord', priceRecordSchema);