const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:      { type: String, required: true },
  quantity:  { type: Number, default: 1 },
  checked:   { type: Boolean, default: false },
  store:     { type: String },
});

const shoppingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:   { type: String, default: 'My Shopping List' },
  items:  [itemSchema],
}, { timestamps: true });

module.exports = mongoose.model('ShoppingList', shoppingListSchema);