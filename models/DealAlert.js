const mongoose = require('mongoose');

const dealAlertSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  targetPrice:  { type: Number, required: true },   // alert when price drops to/below this
  active:       { type: Boolean, default: true },
  lastNotified: { type: Date, default: null },       // avoid repeated alerts for same drop
}, { timestamps: true });

module.exports = mongoose.model('DealAlert', dealAlertSchema);