const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  country: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  balance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  membershipTier: { type: String, enum: ['basic', 'silver', 'gold', 'platinum'], default: 'basic' },
  telegramUsername: { type: String, default: '' },
  // Package / Subscription
  activePackage: { type: String, enum: ['none', 'starter', 'standard', 'premium'], default: 'none' },
  packageExpiresAt: { type: Date },
  dailyTaskLimit: { type: Number, default: 0 },
  dailyTasksUsed: { type: Number, default: 0 },
  dailyTasksResetAt: { type: Date },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
