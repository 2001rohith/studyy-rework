const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth")
const { upload } = require("../middlewares/uploadMiddleware")
const { createCourse, getCourses, DeleteCourse, getCourse, EditCourse,
    createModule, DeleteModule, EditModule, AdmingetCourses, AdmingetCourse, studentEnrollment,
    enrolledCourses, sendNotification, getNotifications,
    markNotificationsAsRead, getCourseStudents,
    sendEmailNotification, getModuleData, homeCourses } = require("../controllers/courseController")

const { GetAssignments, CreateAssignment, EditAssignment, DeleteAssignment,
    adminGetAssignments, adminDeleteAssignment, studentGetAssignments, studentsubmitAssignment,
    getAssignmentSubmissions } = require("../controllers/assignmentController")
const { addQuiz, getQuizzes, DeleteQuiz, GetQuiz, EditQuiz, adminGetQuizzes, adminDeleteQuiz,
    studentGetQuizzes, submitQuiz, getQuizSubmissions } = require("../controllers/quizController")
const { getClasses, createClass, studentGetClasses, addClassPeerId, EditClass, deleteClass, setClassStatusEnded } = require("../controllers/classController")
const Endpoints = require("../helpers/endPoints")

//Teacher routes
router.post(Endpoints.TEACHER.CREATE_COURSE, createCourse)
router.get(Endpoints.TEACHER.GET_COURSES, authMiddleware, getCourses)
router.delete(Endpoints.TEACHER.DELETE_COURSE, DeleteCourse)
router.get(Endpoints.TEACHER.GET_COURSE, getCourse)
router.put(Endpoints.TEACHER.EDIT_COURSE, EditCourse)
router.post(Endpoints.TEACHER.ADD_MODULE, upload.fields([{ name: "pdf", maxCount: 1 }, { name: "video", maxCount: 1 }]), createModule)
router.delete(Endpoints.TEACHER.DELETE_MODULE, DeleteModule)
router.put(Endpoints.TEACHER.EDIT_MODULE, upload.fields([{ name: "pdf", maxCount: 1 }, { name: "video", maxCount: 1 }]), EditModule)
router.get(Endpoints.TEACHER.GET_MODULE_DATA, getModuleData)
router.post(Endpoints.TEACHER.CREATE_ASSIGNMENT, CreateAssignment)
router.get(Endpoints.TEACHER.GET_ASSIGNMENTS, GetAssignments);
router.put(Endpoints.TEACHER.EDIT_ASSIGNMENT, EditAssignment)
router.delete(Endpoints.TEACHER.DELETE_ASSIGNMENT, DeleteAssignment)
router.post(Endpoints.TEACHER.ADD_QUIZ, addQuiz)
router.get(Endpoints.TEACHER.GET_QUIZZES, getQuizzes)
router.delete(Endpoints.TEACHER.DELETE_QUIZ, DeleteQuiz)
router.get(Endpoints.TEACHER.GET_QUIZ, GetQuiz)
router.put(Endpoints.TEACHER.EDIT_QUIZ, EditQuiz)
router.get(Endpoints.TEACHER.GET_CLASSES, getClasses)
router.post(Endpoints.TEACHER.SEND_NOTIFICATION, sendNotification)
router.post(Endpoints.TEACHER.ADD_CLASS, createClass)
router.put(Endpoints.TEACHER.ADD_PEER_ID, addClassPeerId)
router.put(Endpoints.TEACHER.EDIT_CLASS, EditClass)
router.delete(Endpoints.TEACHER.DELETE_CLASS, deleteClass)
router.get(Endpoints.TEACHER.GET_ASSIGNMENT_SUBMISSION, getAssignmentSubmissions)
router.get(Endpoints.TEACHER.GET_QUIZ_SUBMISSION, getQuizSubmissions)
router.get(Endpoints.TEACHER.GET_COURSE_STUDENTS, getCourseStudents)
router.post(Endpoints.TEACHER.SEND_EMAIL_NOTIFICATION, sendEmailNotification)
router.put(Endpoints.TEACHER.UPDATE_CLASS_STATUS, setClassStatusEnded)

//Admin routes
router.get(Endpoints.ADMIN.GET_COURSES, AdmingetCourses)
router.get(Endpoints.ADMIN.GET_COURSE, AdmingetCourse)
router.get(Endpoints.ADMIN.GET_QUIZZES, adminGetQuizzes)
router.delete(Endpoints.ADMIN.DELETE_QUIZ, adminDeleteQuiz)
router.get(Endpoints.ADMIN.GET_ASSIGNMENTS, adminGetAssignments)
router.delete(Endpoints.ADMIN.DELETE_ASSIGNMENT, adminDeleteAssignment)

//Student routes
router.get(Endpoints.STUDENT.GET_COURSES, homeCourses)
router.post(Endpoints.STUDENT.ENROLL, studentEnrollment)
router.get(Endpoints.STUDENT.ENROLLED_COURSES, enrolledCourses)
router.get(Endpoints.STUDENT.GET_ASSIGNMENTS, studentGetAssignments)
router.post(Endpoints.STUDENT.SUBMIT_ASSIGNMENT, upload.single("file"), studentsubmitAssignment)
router.get(Endpoints.STUDENT.GET_QUIZZES, studentGetQuizzes)
router.post(Endpoints.STUDENT.SUBMIT_QUIZ, submitQuiz)
router.get(Endpoints.STUDENT.GET_CLASSES, studentGetClasses)
router.get(Endpoints.STUDENT.GET_NOTIFICATIONS, getNotifications)
router.post(Endpoints.STUDENT.MARK_NOTIFICATIONS_AS_READ, markNotificationsAsRead)

module.exports = router