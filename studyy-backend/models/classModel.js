const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true, 
    },
    duration: {
        type: Number,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    peerId: { 
        type: String,
        default:null
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    }],
    status: {
        type: String,
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
