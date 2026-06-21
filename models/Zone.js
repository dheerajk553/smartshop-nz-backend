const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  qrCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  categories: {
    type: [String],
    required: true,
    set: function (arr) {
      // Normalize all categories to lowercase so legacy "Dairy" entries
      // still match against the lowercase "milk" category, etc.
      return arr.map((c) => c.toLowerCase());
    }
  },
  aisle: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Use the existing model if it's already compiled (avoids the
// "Cannot overwrite model" error you've hit before with Mongoose caching).
module.exports = mongoose.models.Zone || mongoose.model('Zone', zoneSchema);