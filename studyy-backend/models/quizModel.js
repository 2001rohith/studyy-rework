const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true }, 
    options: { type: [String], required: true, validate: v => v.length === 2 }, 
    answer: { type: String, required: true } 
});

const submissionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true }, 
    submittedAt: { type: Date, default: Date.now } 
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, 
    questions: [questionSchema],
    submissions: [submissionSchema] 
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
