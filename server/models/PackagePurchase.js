const mongoose = require('mongoose');

const packagePurchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: String, enum: ['starter', 'standard', 'premium'], required: true },
  packageName: { type: String, required: true },
  price: { type: Number, required: true }, // in KES
  dailyTaskLimit: { type: Number, required: true },
  mpesaNumber: { type: String, required: true },
  mpesaTransactionCode: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'expired', 'rejected'], default: 'pending' },
  activatedAt: { type: Date },
  expiresAt: { type: Date },
  rejectionReason: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchasedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PackagePurchase', packagePurchaseSchema);
