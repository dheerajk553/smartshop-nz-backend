const PriceRecord = require('../models/PriceRecord');
const mongoose = require('mongoose');

class PriceRepository {
  async getHistory(productId, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return await PriceRecord.find({
      productId: new mongoose.Types.ObjectId(productId),
      date: { $gte: since }
    }).sort({ date: -1 });
  }

  async getLatestByStore(productId) {
    return await PriceRecord.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $sort: { date: -1 } },
      { $group: { 
          _id: '$store', 
          price: { $first: '$price' }, 
          date: { $first: '$date' } 
      }}
    ]);
  }

  async save(data) {
    const record = new PriceRecord(data);
    return await record.save();
  }

  // Sprint 4 — Price Optimisation Engine support.
  // Returns the latest price per store for a product, preferring a
  // branch-specific record over the chain-level average when a
  // branchId is supplied and a matching record exists.
  async getLatestByStoreForBranch(productId, branchIdsByStore = {}) {
    const objectId = new mongoose.Types.ObjectId(productId);

    // Chain-level latest price per store (branchId: null), same as before.
    const chainLevel = await PriceRecord.aggregate([
      { $match: { productId: objectId, branchId: null } },
      { $sort: { date: -1 } },
      { $group: {
          _id: '$store',
          price: { $first: '$price' },
          date: { $first: '$date' }
      } }
    ]);

    const result = {};
    for (const row of chainLevel) {
      result[row._id] = { price: row.price, date: row.date, branchSpecific: false };
    }

    // Override with branch-specific prices where the caller has selected
    // a branch for that store and a price record exists for it.
    const storesWithBranch = Object.keys(branchIdsByStore).filter(
      (store) => branchIdsByStore[store]
    );

    if (storesWithBranch.length > 0) {
      const branchObjectIds = storesWithBranch.map(
        (store) => new mongoose.Types.ObjectId(branchIdsByStore[store])
      );

      const branchLevel = await PriceRecord.aggregate([
        { $match: { productId: objectId, branchId: { $in: branchObjectIds } } },
        { $sort: { date: -1 } },
        { $group: {
            _id: '$store',
            price: { $first: '$price' },
            date: { $first: '$date' }
        } }
      ]);

      for (const row of branchLevel) {
        result[row._id] = { price: row.price, date: row.date, branchSpecific: true };
      }
    }

    return result; // e.g. { paknsave: { price, date, branchSpecific }, ... }
  }
}

module.exports = new PriceRepository();