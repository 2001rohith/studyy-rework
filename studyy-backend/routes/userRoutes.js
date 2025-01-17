const express = require("express")
const router = express.Router()
const passport = require("passport")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middlewares/auth")
const { signUp, verifyOtp, resendOtp, selectRole, login, getUsers, UpdateUser, DeleteUser, blockUser, getTeachers, verifyTeacher, forgotPassword, resetPassword, userChangePassword, editProfile, getProfieData } = require("../controllers/userController")
const isAdmin = require("../middlewares/isAdmin")
const { upload } = require("../middlewares/uploadMiddleware")
const Endpoints = require("../helpers/endPoints")

//user
router.post(Endpoints.AUTH.SIGNUP, signUp)
router.post(Endpoints.AUTH.VERIFY_OTP, verifyOtp)
router.post(Endpoints.AUTH.RESEND_OTP, resendOtp)
router.post(Endpoints.AUTH.LOGIN, login)
// router.get(Endpoints.AUTH.USER_INFO, authMiddleware, getProfile)
router.get(Endpoints.AUTH.AUTH_GOOGLE, passport.authenticate("google", { scope: ["profile", "email"] }))
router.get(Endpoints.AUTH.GOOGLE_CALLBACK,
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);
router.post(Endpoints.AUTH.SELECT_ROLE, upload.single("certificate"), authMiddleware, selectRole)
router.post(Endpoints.AUTH.FORGOT_PASSWORD, forgotPassword);
router.post(Endpoints.AUTH.RESET_PASSWORD, resetPassword);
router.post(Endpoints.AUTH.CHANGE_PASSWORD, userChangePassword);
router.put(Endpoints.AUTH.EDIT_PROFILE, editProfile)
router.get(Endpoints.AUTH.GET_PROFILE_DATA, authMiddleware, getProfieData)

//admin
router.get(Endpoints.ADMIN.GET_USERS, getUsers)
router.get(Endpoints.ADMIN.GET_TEACHERS, getTeachers)
router.delete(Endpoints.ADMIN.DELETE_USER, DeleteUser)
router.put(Endpoints.ADMIN.BLOCK_USER, blockUser)
router.put(Endpoints.ADMIN.VERIFY_TEACHER, verifyTeacher)

// router.put("/admin-update-user/:id", UpdateUser)
// router.get("/get-students", getStudents)

module.exports = router