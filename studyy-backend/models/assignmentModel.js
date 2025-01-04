const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      filePath: { type: String, required: true },
      submittedAt: { type: Date, default: Date.now }
    }
  ],
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
