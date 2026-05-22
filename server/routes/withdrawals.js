const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @POST /api/withdrawals - Request withdrawal
router.post('/', protect, async (req, res) => {
  const { amount, method, accountDetails } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (amount < 50) return res.status(400).json({ success: false, message: 'Minimum withdrawal is $50' });
    if (user.balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });
    user.balance -= amount;
    await user.save();
    const withdrawal = await Withdrawal.create({ user: req.user._id, amount, method, accountDetails });
    res.status(201).json({ success: true, withdrawal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/withdrawals/my - User's withdrawal history
router.get('/my', protect, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Get all withdrawals
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find().populate('user', 'fullName email').sort('-createdAt');
    res.json({ success: true, withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Update withdrawal status
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findByIdAndUpdate(req.params.id, { status: req.body.status, transactionId: req.body.transactionId, processedAt: new Date() }, { new: true });
    res.json({ success: true, withdrawal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
