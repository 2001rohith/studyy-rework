const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const crypto = require("crypto");
const { type } = require('os');
const { required } = require('nodemon/lib/config');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isTeacherVerified: {
        type: Boolean,
        default: false
    },
    teacherCertificatePath: {
        type: String
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    googleId: {
        type: String
    },
    peerId: {
        type: String,
        default: null
    },
    deviceToken: {
        type: String,
        default: null
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date, default: Date.now
    },
    updatedAt: {
        type: Date, default: Date.now
    },
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password); // bcrypt's compare function
};

UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

module.exports = mongoose.model('User', UserSchema);
