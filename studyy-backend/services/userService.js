const bcrypt = require("bcryptjs")
const userRepository = require("../repositories/userRepository")
const { sendOTP } = require("../helpers/sendSMS")
const { v4: uuidv4 } = require("uuid")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const constants = require("../helpers/constants")

const userService = {
    async validatePhone(phone) {
        const phoneRegex = /^[6-9]\d{9}$/
        return phoneRegex.test(phone)
    },

    async registerUser(userData) {
        if (!await this.validatePhone(userData.phone)) {
            throw new Error(constants.INVALID_PHONE);
        }

        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error(constants.USER_EXISTS);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const { otp, otpExpires } = await sendOTP(userData.phone);

        const newUser = await userRepository.createUser({
            ...userData,
            password: hashedPassword,
            otp,
            otpExpires
        });

        return newUser;
    },

    async verifyOtp(email, otp) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error(constants.USER_NOT_FOUND);
        }

        if (Date.now() > user.otpExpires) {
            throw new Error(constants.OTP_EXPIRED);
        }

        if (user.otp !== otp) {
            throw new Error(constants.INVALID_OTP);
        }

        const verifiedUser = await userRepository.verifyUserOtp(user._id);

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return { user: verifiedUser, token };
    },

    async resendOtp(phone) {
        if (!await this.validatePhone(phone)) {
            throw new Error(constants.INVALID_PHONE);
        }

        const user = await userRepository.findByPhone(phone);
        if (!user) {
            throw new Error(constants.USER_NOT_FOUND);
        }

        const { otp, otpExpires } = await sendOTP(phone);

        await userRepository.updateUserOtp(phone, otp, otpExpires);

        return true;
    },

    async selectRole(userId, role, certificatePath) {
        const updateData = { role };

        if (certificatePath && role === "teacher") {
            updateData.teacherCertificatePath = certificatePath;
            updateData.peerId = uuidv4();
        }

        const updatedUser = await userRepository.updateUserRole(userId, updateData);

        const token = jwt.sign(
            { id: updatedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const userInfo = await userRepository.getUserBasicInfo(updatedUser._id);

        return {
            role,
            token,
            user: {
                id: userInfo._id,
                email: userInfo.email,
                name: userInfo.name,
                role: userInfo.role,
                peerId: userInfo.peerId
            }
        };
    },

    async login(email, password) {
        const user = await userRepository.findByEmail(email)
        if (!user) {
            throw new Error(constants.USER_NOT_FOUND);
        }
        if (!user.isVerified) {
            throw new Error(constants.VERIFY_EMAIL_BEFORE_LOGIN);
        }
        if (user.otp !== null) {
            await userRepository.clearOtp(user._id)
        }
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            console.log(constants.WRONG_PASSWORD)
            throw new Error(constants.INVALID_DETAILS);
        }
        if (user.isBlocked === true) {
            console.log(constants.ACCOUNT_BLOCKED)
            throw new Error(constants.ACCOUNT_BLOCKED);
        }
        if (user.role === "teacher" && user.peerId === null) {
            user = await userRepository.updatePeerId(user._id, uuidv4());
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    },

    async getUsers() {
        const users = await userRepository.getUsers()
        if (!users) {
            throw new Error(constants.NO_USERS);
        }
        return users
    },

    async updateUser(userId, userData) {
        const { name, email, role } = userData
        if (!name || !email || !role) {
            throw new Error(constants.MISSING_FIELDS);
        }
        const updatedUser = await userRepository.updateUser(userId, { name, email, role })
        return updatedUser
    },

    async deleteUser(userId) {
        await userRepository.deleteUser(userId)
    },

    async toggleBlockUser(userId) {
        const user = await userRepository.blockUser(userId)
        return {
            isBlocked: user.isBlocked,
            message: user.isBlocked ? "User has been blocked" : "User has been unblocked"
        }
    },

    async getTeachers() {
        const users = await userRepository.getTeachers()
        if (!users) {
            throw new Error(constants.NO_USERS);
        }
        return users
    },

    async teacherVerification(userId) {
        const user = await userRepository.verifyTeacher(userId)
        return {
            isTeacherVerified: user.isTeacherVerified,
            message: user.isTeacherVerified ? "teacher has been verified" : "teacher has been unverified"
        }
    },

    async initiatePasswordReset(email) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error(constants.USER_NOT_FOUND);
        }

        const resetToken = user.createPasswordResetToken();
        await userRepository.savePasswordResetToken(user);

        const resetURL = `${process.env.FRONTEND_URL}/${resetToken}`;
        const message = `Forgot your password? Reset it here: ${resetURL}`;

        await sendEmail(
            email,
            "here is the link for reset password",
            message
        );

        return true;
    },

    async resetPassword(token, password, confirmPassword) {
        if (password !== confirmPassword) {
            throw new Error("Password and confirm password should be same!");
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await userRepository.findByResetToken(hashedToken);
        if (!user) {
            throw new Error(constants.TOKEN_EXPIRED);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userRepository.updatePasswordAndClearResetToken(
            user._id,
            hashedPassword
        );

        return true;
    },

    async changePassword(userId, currentPassword, newPassword) {
        const user = await userRepository.findById(userId);
        console.log("user from change password:", user);  // keeping your logging

        if (!user) {
            throw new Error(constants.USER_NOT_FOUND);
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new Error(constants.WRONG_PASSWORD);
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        await userRepository.updatePassword(userId, encryptedPassword);

        return true;
    },

    async getDataForProfile(userId) {
        const user = await userRepository.findById(userId)
        console.log("user profile:", user)
        if (!user) {
            throw new Error(constants.USER_NOT_FOUND);
        }
        return {
            user,
            isVerified: user.isTeacherVerified
        }
    },

    async editProfile(userId, userData) {
        const user = await userRepository.updateUser(userId, userData)
        if (!user) {
            throw new Error(constants.USER_NOT_FOUND)
        }
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    },
}

module.exports = userService