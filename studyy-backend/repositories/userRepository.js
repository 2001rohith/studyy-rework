const User = require("../models/userModel")
const constants = require("../helpers/constants")

const userRepository = {

    async findByEmail(email) {
        return await User.findOne({ email })
    },

    async createUser(userData) {
        const user = new User(userData)
        return await user.save();
    },

    async findById(id) {
        return await User.findById(id)
    },

    async updateUser(id, updateData) {
        const updatedUser =  await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        if (!updatedUser) {
            throw new Error(constants.USER_NOT_FOUND);
        }
        
        return updatedUser
    },

    async getUsers() {
        return await User.find({ role: { $ne: 'admin' } })
    },

    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id)
        if(!user){
            throw new Error(constants.USER_NOT_FOUND)
        }
        return user
    },

    async getTeachers() {
        return await User.find({ role: "teacher" })
    },

    async resetPassword(passwordResetToken, passwordResetExpires,) {
        return await User.findOne({ passwordResetToken, passwordResetExpires })
    },

    async verifyUserOtp(userId) {
        return await User.findByIdAndUpdate(
            userId,
            {
                isVerified: true,
                otp: null,
                otpExpires: null
            },
            { new: true }
        );
    },

    async updateUserOtp(phone, otp, otpExpires) {
        return await User.findOneAndUpdate(
            { phone },
            { otp, otpExpires },
            { new: true }
        );
    },

    async updateUserRole(userId, updateData) {
        return await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );
    },

    async getUserBasicInfo(userId) {
        const user = await User.findById(userId).select('_id email name role peerId');
        return user;
    },

    async clearOtp(userId) {
        return await User.findByIdAndUpdate(userId, { otp: null }, { new: true })
    },

    async updatePeerId(userId, peerId) {
        return await User.findByIdAndUpdate(
            userId,
            { peerId },
            { new: true }
        );
    },
    
    async blockUser(userId){
        const user = await User.findById(userId)
        if(!user){
            throw new Error(constants.USER_NOT_FOUND)
        }
        user.isBlocked = !user.isBlocked
        return await user.save()
    },

    async verifyTeacher(userId){
        const user = await User.findById(userId)
        if(!user){
            throw new Error(constants.USER_NOT_FOUND)
        }
        user.isTeacherVerified = !user.isTeacherVerified
        return await user.save()
    },

    async savePasswordResetToken(user){
        return await user.save({validateBeforeSave:false})
    },

    async findByResetToken(hashedToken) {
        return await User.findOne({ 
            passwordResetToken: hashedToken, 
            passwordResetExpires: { $gt: Date.now() } 
        });
    },

    async updatePasswordAndClearResetToken(userId, hashedPassword) {
        return await User.findByIdAndUpdate(
            userId,
            {
                password: hashedPassword,
                passwordResetToken: undefined,
                passwordResetExpires: undefined
            },
            { new: true }
        );
    },

    async updatePassword(userId, newPassword) {
        const user = await User.findById(userId);
        user.password = newPassword;
        return await user.save();
    },
    

}

module.exports = userRepository