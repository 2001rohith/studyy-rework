const userService = require("../services/userService")
const HttpStatus = require("../helpers/httpStatus");
const userRepository = require("../repositories/userRepository");
const constants = require("../helpers/constants")

exports.signUp = async (req, res) => {
    const { name, email, password, phone } = req.body;
    console.log(name, email, password)

    try {
        await userService.registerUser({ name, email, password, phone });
        res.status(HttpStatus.OK).json({
            message: "User registered, OTP sent via SMS"
        });
    } catch (error) {
        console.log(error.message);

        if (error.message === constants.INVALID_PHONE ||
            error.message === constants.USER_EXISTS) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const { token } = await userService.verifyOtp(email, otp);

        res.status(HttpStatus.OK).json({
            token,
            message: "OTP verified"
        });
    } catch (error) {
        console.log(error.message);

        if (error.message === constants.USER_NOT_FOUND ||
            error.message === constants.ENTER_VALID_OTP ||
            error.message === constants.OTP_EXPIRED) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.resendOtp = async (req, res) => {
    const { phone } = req.body;

    try {
        await userService.resendOtp(phone);

        res.status(HttpStatus.OK).json({
            message: "New OTP has been sent via SMS"
        });
    } catch (error) {
        console.error(error.message);

        if (error.message === constants.INVALID_PHONE ||
            error.message === constants.USER_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.selectRole = async (req, res) => {
    const { role } = req.body;
    const certificatePath = req.file ? req.file.path : null;
    console.log("certificate path:", certificatePath);

    try {
        const result = await userService.selectRole(
            req.user._id,
            role,
            certificatePath
        );

        res.status(HttpStatus.OK).json({
            ...result,
            message: "user role added"
        });
    } catch (error) {
        console.log(error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await userService.login(email, password);

        res.status(HttpStatus.OK).json({ ...result, message: "Login success" });
    } catch (error) {
        console.error("Login error:", error.message);

        if (error.message === constants.USER_NOT_FOUND ||
            error.message === constants.VERIFY_EMAIL_BEFORE_LOGIN ||
            error.message === constants.INVALID_DETAILS ||
            error.message === constants.ACCOUNT_BLOCKED) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers()
        res.status(HttpStatus.OK).json({ users, message: "user list for admin" })
    } catch (error) {
        console.error("get users error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR })
    }
}

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    try {
        const updatedUser = await userService.updateUser(userId, {
            name,
            email,
            role
        });

        res.status(HttpStatus.OK).json({
            user: updatedUser,
            message: "User updated successfully"
        });
    } catch (error) {
        console.error("Update user error:", error.message);

        if (error.message === constants.USER_NOT_FOUND ||
            error.message === constants.MISSING_FIELDS) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.DeleteUser = async (req, res) => {
    const userId = req.params.id
    try {
        await userService.deleteUser(userId)
        console.log("deleted user")
        res.status(HttpStatus.OK).json({ message: "User deleted successfully" })
    } catch (error) {
        console.error("delete user error:", error.message);

        if (error.message === constants.USER_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
}

exports.blockUser = async (req, res) => {
    const userId = req.params.id
    try {
        const { message } = await userService.toggleBlockUser(userId)
        res.status(HttpStatus.OK).json({ message });
    } catch (error) {
        console.log("error on blocking user:", error)
        if (error.message === constants.USER_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
}

exports.getTeachers = async (req, res) => {
    try {
        const users = await userService.getTeachers()
        res.status(HttpStatus.OK).json({ users, message: "teachers list for admin" })
    } catch (error) {
        console.error("get teacher error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR })
    }
}

exports.verifyTeacher = async (req, res) => {
    const userId = req.params.id
    try {
        const { message } = await userService.teacherVerification(userId)
        res.status(HttpStatus.OK).json({ message });
    } catch (error) {
        console.log("error on verifying teacher:", error)
        if (error.message === constants.USER_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR});
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const { message } = await userService.forgotPassword(email)
        res.status(HttpStatus.OK).json({ message });
    } catch (error) {

    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        await userService.initiatePasswordReset(email);

        res.status(HttpStatus.OK).json({
            message: 'Password reset link sent to your email'
        });
    } catch (error) {
        console.error("Error in forgot password:", error);

        if (error.message === constants.USER_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
}

exports.resetPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    const token = req.params.token;

    try {
        await userService.resetPassword(token, password, confirmPassword);

        res.status(HttpStatus.OK).json({
            message: "Password has been reset successfully"
        });
    } catch (error) {
        console.error("Error in reset password:", error);

        if (error.message === constants.PASSWORD_AND_CONFIRM_MISMATCH ||
            error.message === constants.TOKEN_EXPIRED) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.userChangePassword = async (req, res) => {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    try {
        await userService.changePassword(userId, currentPassword, newPassword);

        res.status(HttpStatus.OK).json({
            message: "Password has been reset successfully"
        });
    } catch (error) {
        console.error("Error in reset password:", error);

        if (error.message === constants.USER_NOT_FOUND ||
            error.message === constants.WRONG_PASSWORD) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.getProfieData = async (req, res) => {
    const userId = req.params.id
    try {
        const { user, isVerified } = await userService.getDataForProfile(userId)
        console.log("is verified:",isVerified)
        res.status(HttpStatus.OK).json({ message: "User data fetched", user, isVerified })
    } catch (error) {
        console.error("Error in forgot password:", error);

        if (error.message === constants.USER_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
}

exports.editProfile = async (req, res) => {
    const userId =  req.params.id
    const {name} = req.body
    try {
        const user = await userService.editProfile(userId,{name})
        res.status(HttpStatus.OK).json({ message: "Changes applied", user })
    } catch (error) {
        if (error.message === constants.USER_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error("Error in edit profile:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
}
