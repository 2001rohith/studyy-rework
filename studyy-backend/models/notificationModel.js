const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateSent: {
        type: Date,
        default: Date.now
    },
    read: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: { type: Date, default: Date.now, index: true },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
