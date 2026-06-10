const PriceRecord = require('../models/PriceRecord');

class PriceRepository {
  async getHistory(productId, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return await PriceRecord.find({
      productId,
      date: { $gte: since }
    }).sort({ date: -1 });
  }

  async getLatestByStore(productId) {
    return await PriceRecord.aggregate([
      { $match: { productId: require('mongoose').Types.ObjectId(productId) } },
      { $sort: { date: -1 } },
      { $group: { _id: '$store', price: { $first: '$price' }, date: { $first: '$date' } } }
    ]);
  }

  async save(data) {
    const record = new PriceRecord(data);
    return await record.save();
  }
}

module.exports = new PriceRepository();