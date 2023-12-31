const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  price:{
    type: Number,
  },
  status: {
    type: String,
    enum: ['processing','active', 'canceled', 'expired'],
    default: 'processing',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    default:'pending'
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
