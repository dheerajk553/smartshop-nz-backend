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
  // Sprint 4: optional branch reference. When present, this price record
  // applies to one specific physical branch rather than the chain average.
  // Existing records without a branchId are treated as chain-level prices,
  // so nothing already in the database breaks.
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    default: null
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

module.exports = mongoose.models.PriceRecord || mongoose.model('PriceRecord', PriceRecordSchema);