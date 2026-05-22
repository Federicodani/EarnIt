const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  status: { type: String, enum: ['in_progress', 'submitted', 'approved', 'rejected'], default: 'in_progress' },
  submissionData: { type: Object },
  reward: { type: Number },
  feedback: { type: String },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('UserTask', userTaskSchema);
