const courseService = require("../services/courseService")
const moduleService = require("../services/moduleService")
const assignmentService = require("../services/assignmentService")
const quizService = require("../services/quizService")
const classService = require("../services/classService")
const HttpStatus = require("../helpers/httpStatus");
const constants = require("../helpers/constants")

exports.getStudents = async (req, res) => {
    try {
        const users = await courseService.getStudents()
        res.status(HttpStatus.OK).json({ users, message: "student list for teacher" })
    } catch (error) {
        if (error.message === constants.STUDENTS_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.GET_STUDENTS_ERROR, error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
}

exports.getCourses = async (req, res) => {
    const teacherId = req.user._id;
    try {
        const { courses } = await courseService.getTeacherCourses(teacherId)
        res.status(HttpStatus.OK).json({ courses, message: "Course list for teacher" });
    } catch (error) {
        if (error.message === constants.COURSES_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.COURSES_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
}

exports.createCourse = async (req, res) => {
    const { title, description, userId } = req.body
    try {
        const newCourse = await courseService.createCourse(userId, { title, description })
        res.status(HttpStatus.OK).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        if (error.message === constants.UNAUTHORISED || error.message === constants.VERIFIED_TEACHER_ONLY) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
}

exports.DeleteCourse = async (req, res) => {
    const courseId = req.params.id
    try {
        await courseService.deleteCourse(courseId)
        res.status(HttpStatus.OK).json({ message: "course deleted successfully" })
    } catch (error) {
        if (error.message === constants.NO_COURSE_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.COURSES_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
}

exports.getCourse = async (req, res) => {
    const courseId = req.params.id;
    try {
        const { course, modules, teacher } = await courseService.getCourseDetails(courseId);
        res.status(HttpStatus.OK).json({ course, modules, teacher, message: "Fetched course successfully" });
    } catch (error) {
        if (error.message === constants.NO_COURSE_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.COURSES_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.EditCourse = async (req, res) => {
    const courseId = req.params.id;
    const { title, description } = req.body;
    try {
        const updatedCourse = await courseService.editCourse(courseId, { title, description });
        res.status(HttpStatus.OK).json({ course: updatedCourse, message: "Course updated successfully" });
    } catch (error) {
        if (error.message === constants.NO_COURSE_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.COURSES_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.createModule = async (req, res) => {
    const { courseId, title, description } = req.body;
    const pdfFile = req.files?.pdf?.[0] || null;
    const videoFile = req.files?.video?.[0] || null;
    try {
        const newModule = await moduleService.createModule(
            { courseId, title, description },
            { pdf: pdfFile, video: videoFile }
        );
        res.status(HttpStatus.OK).json({ message: "Module created successfully", module: newModule });
    } catch (error) {
        if (error.message === constants.PDF_REQUIRED) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        if (error.message === constants.NO_COURSE_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.MODULE_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.DeleteModule = async (req, res) => {
    const moduleId = req.params.id;
    try {
        await moduleService.deleteModule(moduleId);
        res.status(HttpStatus.OK).json({ message: "Module deleted successfully" });
    } catch (error) {
        if (error.message === constants.MODULE_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.MODULE_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.EditModule = async (req, res) => {
    const moduleId = req.params.id;
    const { title, description } = req.body;
    const pdfFile = req.files?.pdf?.[0] || null;
    const videoFile = req.files?.video?.[0] || null;
    try {
        const updatedModule = await moduleService.editModule(
            moduleId,
            { title, description },
            { pdf: pdfFile, video: videoFile }
        );
        res.status(HttpStatus.OK).json({ module: updatedModule, message: "Module updated successfully" });
    } catch (error) {
        if (error.message === constants.MODULE_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.MODULE_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.AdmingetCourses = async (req, res) => {
    try {
        const courses = await courseService.getCoursesForAdmin();
        res.status(HttpStatus.OK).json({ courses, message: "Courses for admin" });
    } catch (error) {
        console.error(constants.COURSES_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.AdmingetCourse = async (req, res) => {
    const courseId = req.params.id;
    try {
        const { course, modules } = await courseService.getCourseForAdmin(courseId);
        res.status(HttpStatus.OK).json({ course, modules, message: "Fetched course successfully" });
    } catch (error) {
        if (error.message === constants.NO_COURSE_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.COURSES_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.studentEnrollment = async (req, res) => {
    const { courseId, studentId } = req.body;
    try {
        await courseService.studentEnrollment(courseId, studentId);
        res.status(HttpStatus.OK).json({ message: "Student enrollment success" });
    } catch (error) {
        if (error.message === constants.COURSE_OR_STUDENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.COURSES_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
}

exports.enrolledCourses = async (req, res) => {
    const userId = req.params.id;
    console.log("User ID from get enrolled courses:", userId);
    try {
        const enrolledCourses = await courseService.getEnrolledCourses(userId);
        res.status(HttpStatus.OK).json({ courses: enrolledCourses, message: "Fetched enrolled courses" });
    } catch (error) {
        if (error.message === constants.USER_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error(constants.COURSES_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.sendNotification = async (req, res) => {
    const { courseId, userId, message } = req.body;
    try {
        const notification = await courseService.sendNotification({ courseId, userId, message });
        res.status(HttpStatus.OK).json({ message: 'Notification sent successfully', notification });
    } catch (error) {
        if (error.message === constants.NO_COURSE_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error sending notification:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.getNotifications = async (req, res) => {
    const studentId = req.params.id;
    try {
        const notifications = await courseService.getStudentNotifications(studentId);
        res.status(HttpStatus.OK).json({ notifications, message: 'Fetched notifications successfully', });
    } catch (error) {
        if (error.message === constants.STUDENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error fetching notifications:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.markNotificationsAsRead = async (req, res) => {
    const { notificationIds, studentId } = req.body;
    try {
        await courseService.markAsRead(notificationIds, studentId);
        res.status(HttpStatus.OK).json({ message: 'Notifications marked as read' });
    } catch (error) {
        if (error.message === constants.NOTIFICATION_NOT_UPDATED) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error marking notifications as read:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.getCourseStudents = async (req, res) => {
    const courseId = req.params.id;
    try {
        const students = await courseService.getCourseStudents(courseId);
        res.status(HttpStatus.OK).json({ students });
    } catch (error) {
        if (error.message === constants.COURSES_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error fetching course students:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.sendEmailNotification = async (req, res) => {
    const { courseId, message } = req.body;
    try {
        const { failedEmails, totalEmails } = await courseService.sendEmailNotification(courseId, message);
        if (failedEmails.length > 0) {
            console.error('Failed to send emails:', failedEmails);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Some emails failed to send.',
                failedCount: failedEmails.length,
                totalCount: totalEmails,
            });
        }
        console.log('Email notifications sent successfully');
        res.status(HttpStatus.OK).json({ message: 'Email notifications sent successfully!' });
    } catch (error) {
        if (error.message === constants.NO_COURSE_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
        console.error('Error sending email notifications:', error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.getModuleData = async (req, res) => {
    const moduleId = req.params.id;
    try {
        const moduleData = await moduleService.getModuleData(moduleId);
        res.status(HttpStatus.OK).json({ module: moduleData });
    } catch (error) {
        console.error('Error getting module data:', error.message);
        if (error.message === constants.MODULE_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.homeCourses = async (req, res) => {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const search = req.query.search || "";
    const modulesFilter = req.query.modulesFilter || "";
    try {
        const { courses, totalCourses, totalPages } = await courseService.getHomeCourses(userId, {
            search,
            modulesFilter,
            page,
            limit
        });
        res.status(HttpStatus.OK).json({
            courses, totalPages, totalCourses, currentPage: page
        });
    } catch (error) {
        console.error('Get courses error:', error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};