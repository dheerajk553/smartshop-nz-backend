const mongoose = require('mongoose');

const PriceRecordSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  store: { 
    type: String, 
    required: true,
    enum: ['paknsave', 'newworld', 'woolworths']
  },
  price: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('PriceRecord', PriceRecordSchema);