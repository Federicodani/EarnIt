const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['shipping', 'ecommerce', 'document', 'quality'], default: 'shipping' },
  country: { type: String, required: true },
  reward: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  estimatedTime: { type: Number, default: 5 }, // minutes
  totalSlots: { type: Number, default: 100 },
  filledSlots: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
