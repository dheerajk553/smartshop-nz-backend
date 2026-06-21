const DealAlert = require('../models/DealAlert');
const User = require('../models/User');

// POST /v1/alerts - create a new deal alert
exports.createAlert = async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    const alert = await DealAlert.create({
      userId: req.user.id,
      productId,
      targetPrice
    });
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /v1/alerts - get all alerts for the logged-in user
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await DealAlert.find({ userId: req.user.id }).populate('productId');
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /v1/alerts/:id - remove an alert
exports.deleteAlert = async (req, res) => {
  try {
    await DealAlert.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /v1/alerts/register-token - save the user's FCM device token
exports.registerToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    await User.findByIdAndUpdate(req.user.id, { fcmToken });
    res.json({ message: 'Token registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};