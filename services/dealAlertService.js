const admin = require('firebase-admin');
const DealAlert = require('../models/DealAlert');
const User = require('../models/User');

// Call this whenever a new price record is saved
async function checkAndNotify(productId, newPrice) {
  try {
    // Find all active alerts for this product where target price is met
    const matchingAlerts = await DealAlert.find({
      productId,
      active: true,
      targetPrice: { $gte: newPrice }
    }).populate('userId');

    for (const alert of matchingAlerts) {
      const user = alert.userId;
      if (!user || !user.fcmToken) continue;

      // Avoid spamming - only notify once every 6 hours for the same alert
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      if (alert.lastNotified && alert.lastNotified > sixHoursAgo) continue;

      const message = {
        token: user.fcmToken,
        notification: {
          title: 'Price Drop Alert',
          body: `A product you're watching dropped to $${newPrice.toFixed(2)}!`
        },
        data: {
          productId: productId.toString(),
          price: newPrice.toString()
        }
      };

      try {
        await admin.messaging().send(message);
        alert.lastNotified = new Date();
        await alert.save();
        console.log(`Notification sent to ${user.email} for product ${productId}`);
      } catch (sendErr) {
        console.error('FCM send error:', sendErr.message);
      }
    }
  } catch (err) {
    console.error('Deal alert check error:', err.message);
  }
}

module.exports = { checkAndNotify };