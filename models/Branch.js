const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  store: {
    type: String,
    required: true,
    enum: ['paknsave', 'newworld', 'woolworths'],
    set: (v) => (typeof v === 'string' ? v.toLowerCase() : v)
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  suburb: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// One branch name per store should be unique (e.g. "paknsave" + "Royal Oak")
branchSchema.index({ store: 1, name: 1 }, { unique: true });

module.exports = mongoose.models.Branch || mongoose.model('Branch', branchSchema);