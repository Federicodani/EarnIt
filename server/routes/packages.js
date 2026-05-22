const express = require('express');
const router = express.Router();
const PackagePurchase = require('../models/PackagePurchase');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const PACKAGES = {
  starter:  { id: 'starter',  name: 'Starter Package',  price: 500,  dailyTaskLimit: 15 },
  standard: { id: 'standard', name: 'Standard Package', price: 1000, dailyTaskLimit: 25 },
  premium:  { id: 'premium',  name: 'Premium Package',  price: 1500, dailyTaskLimit: 40 },
};

// GET /api/packages — list available packages (public)
router.get('/', (req, res) => {
  res.json({ success: true, packages: Object.values(PACKAGES), tillNumber: '5377179' });
});

// GET /api/packages/my — current user's package status
router.get('/my', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const purchase = await PackagePurchase.findOne({ user: req.user._id, status: { $in: ['pending', 'active'] } }).sort('-createdAt');
    const isActive = user.activePackage !== 'none' && user.packageExpiresAt && new Date(user.packageExpiresAt) > new Date();
    res.json({ success: true, activePackage: user.activePackage, isActive, packageExpiresAt: user.packageExpiresAt, dailyTaskLimit: user.dailyTaskLimit, dailyTasksUsed: user.dailyTasksUsed, pendingPurchase: purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/packages/purchase — submit M-Pesa payment proof
router.post('/purchase', protect, async (req, res) => {
  const { packageId, mpesaNumber, mpesaTransactionCode } = req.body;
  if (!PACKAGES[packageId]) return res.status(400).json({ success: false, message: 'Invalid package' });
  if (!mpesaNumber || !mpesaTransactionCode) return res.status(400).json({ success: false, message: 'M-Pesa number and transaction code are required' });
  try {
    // Check no pending purchase already waiting
    const pending = await PackagePurchase.findOne({ user: req.user._id, status: 'pending' });
    if (pending) return res.status(400).json({ success: false, message: 'You already have a pending payment being reviewed. Please wait for approval.' });

    const pkg = PACKAGES[packageId];
    const purchase = await PackagePurchase.create({
      user: req.user._id,
      packageId,
      packageName: pkg.name,
      price: pkg.price,
      dailyTaskLimit: pkg.dailyTaskLimit,
      mpesaNumber,
      mpesaTransactionCode: mpesaTransactionCode.toUpperCase(),
    });
    res.status(201).json({ success: true, purchase, message: 'Payment submitted! Your package will be activated within 1–2 hours after verification.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/packages/purchases — Admin: all purchases
router.get('/purchases', protect, adminOnly, async (req, res) => {
  try {
    const purchases = await PackagePurchase.find().populate('user', 'fullName email phone').sort('-createdAt');
    res.json({ success: true, purchases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/packages/purchases/:id/approve — Admin: approve a purchase
router.put('/purchases/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const purchase = await PackagePurchase.findById(req.params.id).populate('user');
    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });
    if (purchase.status === 'active') return res.status(400).json({ success: false, message: 'Already approved' });

    purchase.status = 'active';
    purchase.activatedAt = new Date();
    purchase.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    purchase.reviewedBy = req.user._id;
    await purchase.save();

    // Update user
    await User.findByIdAndUpdate(purchase.user._id, {
      activePackage: purchase.packageId,
      packageExpiresAt: purchase.expiresAt,
      dailyTaskLimit: purchase.dailyTaskLimit,
      dailyTasksUsed: 0,
      dailyTasksResetAt: new Date()
    });

    res.json({ success: true, purchase, message: 'Package activated for user.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/packages/purchases/:id/reject — Admin: reject a purchase
router.put('/purchases/:id/reject', protect, adminOnly, async (req, res) => {
  try {
    const purchase = await PackagePurchase.findByIdAndUpdate(req.params.id, {
      status: 'rejected', rejectionReason: req.body.reason || 'Payment could not be verified', reviewedBy: req.user._id
    }, { new: true });
    res.json({ success: true, purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
module.exports.PACKAGES = PACKAGES;
