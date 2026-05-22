const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const UserTask = require('../models/UserTask');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/tasks - Get all available tasks
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true, filledSlots: { $lt: mongoose.Types.Mixed } }).sort('-createdAt');
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/tasks/available
router.get('/available', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true }).sort('-createdAt');
    const userTaskIds = await UserTask.find({ user: req.user._id }).distinct('task');
    const available = tasks.filter(t => !userTaskIds.map(id => id.toString()).includes(t._id.toString()));
    res.json({ success: true, tasks: available });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/tasks/:id/start
router.post('/:id/start', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user has an active package
    const hasActivePackage = user.activePackage !== 'none' && user.packageExpiresAt && new Date(user.packageExpiresAt) > new Date();
    if (!hasActivePackage) {
      return res.status(403).json({ success: false, message: 'No active package. Please purchase a package to access tasks.', requiresPackage: true });
    }

    // Reset daily count if it's a new day
    const now = new Date();
    const lastReset = user.dailyTasksResetAt ? new Date(user.dailyTasksResetAt) : null;
    if (!lastReset || now.toDateString() !== lastReset.toDateString()) {
      user.dailyTasksUsed = 0;
      user.dailyTasksResetAt = now;
    }

    // Check daily limit
    if (user.dailyTasksUsed >= user.dailyTaskLimit) {
      return res.status(403).json({ success: false, message: `Daily task limit of ${user.dailyTaskLimit} reached. Your limit resets tomorrow.`, limitReached: true });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    const existing = await UserTask.findOne({ user: req.user._id, task: req.params.id });
    if (existing) return res.status(400).json({ success: false, message: 'Already started this task' });

    const userTask = await UserTask.create({ user: req.user._id, task: req.params.id, reward: task.reward });
    task.filledSlots += 1;
    await task.save();

    user.dailyTasksUsed += 1;
    await user.save();

    res.status(201).json({ success: true, userTask, dailyTasksUsed: user.dailyTasksUsed, dailyTaskLimit: user.dailyTaskLimit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/tasks/:id/submit
router.put('/:id/submit', protect, async (req, res) => {
  try {
    const userTask = await UserTask.findOne({ user: req.user._id, task: req.params.id });
    if (!userTask) return res.status(404).json({ success: false, message: 'Task not found in your list' });
    userTask.status = 'submitted';
    userTask.submissionData = req.body.submissionData;
    userTask.submittedAt = new Date();
    await userTask.save();
    res.json({ success: true, userTask });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/tasks/my-tasks
router.get('/my-tasks', protect, async (req, res) => {
  try {
    const userTasks = await UserTask.find({ user: req.user._id }).populate('task').sort('-createdAt');
    res.json({ success: true, userTasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Create task
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Approve/reject task submission
router.put('/review/:userTaskId', protect, adminOnly, async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const userTask = await UserTask.findById(req.params.userTaskId).populate('user task');
    if (!userTask) return res.status(404).json({ success: false, message: 'Submission not found' });
    userTask.status = status;
    userTask.feedback = feedback;
    userTask.reviewedAt = new Date();
    await userTask.save();
    if (status === 'approved') {
      await User.findByIdAndUpdate(userTask.user._id, {
        $inc: { balance: userTask.reward, totalEarned: userTask.reward, tasksCompleted: 1 }
      });
    }
    res.json({ success: true, userTask });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
