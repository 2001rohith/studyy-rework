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
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
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
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
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
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
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
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error(constants.COURSES_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
}

exports.getCourse = async (req, res) => {
    const courseId = req.params.id;

    try {
        const { course, modules, teacher } = await courseService.getCourseDetails(courseId);
        res.status(HttpStatus.OK).json({
            course,
            modules,
            teacher,
            message: "Fetched course successfully"
        });
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

exports.GetAssignments = async (req, res) => {
    const courseId = req.params.id;

    try {
        const { assignments, courseTitle } = await assignmentService.getAssignmentsForCourse(courseId);
        res.status(HttpStatus.OK).json({ assignments, course: courseTitle });
    } catch (error) {
        if (error.message === constants.ASSIGNMENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.ASSIGNMENT_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.CreateAssignment = async (req, res) => {
    const { title, description, dueDate, courseId } = req.body;

    try {
        const newAssignment = await assignmentService.createAssignment({ title, description, dueDate, courseId });
        res.status(HttpStatus.OK).json({
            message: "Assignment created successfully.",
            assignment: newAssignment,
        });
    } catch (error) {
        if (error.message === constants.NO_COURSE_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.ASSIGNMENT_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.EditAssignment = async (req, res) => {
    const assignmentId = req.params.id;
    const { title, description, dueDate } = req.body;

    try {
        const updatedAssignment = await assignmentService.updateAssignment(assignmentId, { title, description, dueDate });
        res.status(HttpStatus.OK).json({
            assignment: updatedAssignment,
            message: "Assignment updated successfully",
        });
    } catch (error) {
        if (error.message === constants.ASSIGNMENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.ASSIGNMENT_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.DeleteAssignment = async (req, res) => {
    const assignmentId = req.params.id;

    try {
        await assignmentService.deleteAssignment(assignmentId);
        res.status(HttpStatus.OK).json({ message: "Assignment deleted successfully" });
    } catch (error) {
        if (error.message === constants.ASSIGNMENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.ASSIGNMENT_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.addQuiz = async (req, res) => {
    const { title, courseId, questions } = req.body;

    try {
        await quizService.addQuiz({ title, course: courseId, questions });
        console.log("Quiz created successfully");
        res.status(HttpStatus.OK).json({ message: "Quiz created successfully" });
    } catch (error) {
        console.error(constants.QUIZ_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.getQuizzes = async (req, res) => {
    const courseId = req.params.id;
    console.log("Course ID from getQuizzes:", courseId);

    try {
        const { quizzes, courseName } = await quizService.getQuizzes(courseId);
        console.log("Quizzes retrieved:", quizzes);
        res.status(HttpStatus.OK).json({ quizzes, courseName });
    } catch (error) {
        if (error.message === constants.NO_QUIZ_FOR_COURSE) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(constants.QUIZ_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.DeleteQuiz = async (req, res) => {
    const quizId = req.params.id;
    console.log("Quiz ID from DeleteQuiz:", quizId);

    try {
        await quizService.deleteQuiz(quizId);
        console.log("deleted quiz");
        res.status(HttpStatus.OK).json({
            message: "quiz deleted successfully"
        });
    } catch (error) {
        if (error.message === constants.QUIZ_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error(constants.QUIZ_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.GetQuiz = async (req, res) => {
    const quizId = req.params.id;

    try {
        const quiz = await quizService.getQuiz(quizId);
        res.status(HttpStatus.OK).json({
            quiz
        });
    } catch (error) {
        if (error.message === constants.QUIZ_NOT_FOUND) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: error.message
            });
        }
        console.error(constants.QUIZ_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.EditQuiz = async (req, res) => {
    const quizId = req.params.id;
    const { title, questions, courseId, teacherId } = req.body;

    try {
        const updatedQuiz = await quizService.updateQuiz(quizId, {
            title,
            questions,
            courseId,
            teacherId
        });

        res.status(HttpStatus.OK).json({
            message: "Quiz updated successfully",
            quiz: updatedQuiz
        });
    } catch (error) {
        console.error(constants.QUIZ_ERROR, error.message);

        if (error.message === constants.QUIZ_NOT_FOUND || error.message === constants.NO_COURSE_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.adminGetQuizzes = async (req, res) => {
    try {
        const quizzes = await quizService.getAdminQuizzes();

        res.status(HttpStatus.OK).json({
            message: "fetched quizzes",
            quizzes
        });
    } catch (error) {
        console.error(constants.QUIZ_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.adminDeleteQuiz = async (req, res) => {
    const Id = req.params.id
    try {
        await quizService.adminDeleteQuiz(Id)
        console.log("deleted quiz")
        res.status(HttpStatus.OK).json({ message: "quiz deleted successfully" })
    } catch (error) {
        if (error.message === constants.QUIZ_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error(constants.QUIZ_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
}

exports.adminGetAssignments = async (req, res) => {
    try {
        const assignments = await assignmentService.getAssignments();

        if (assignments.length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: constants.ASSIGNMENT_NOT_FOUND });
        }

        res.status(HttpStatus.OK).json({ assignments });
    } catch (error) {
        console.error(constants.ASSIGNMENT_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
}

exports.adminDeleteAssignment = async (req, res) => {
    const assignmentId = req.params.id;
    try {
        await assignmentService.adminDeleteAssignment(assignmentId);
        console.log("deleted assignment");
        res.status(HttpStatus.OK).json({ message: "assignment deleted successfully" });
    } catch (error) {
        if (error.message === constants.ASSIGNMENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error(constants.ASSIGNMENT_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
}

exports.studentEnrollment = async (req, res) => {
    const { courseId, studentId } = req.body;
    try {
        await courseService.studentEnrollment(courseId, studentId);
        res.status(HttpStatus.OK).json({ message: "Student enrollment success" });
    } catch (error) {
        if (error.message === constants.COURSE_OR_STUDENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error(constants.COURSES_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
}

exports.studentGetAssignments = async (req, res) => {
    const studentId = req.params.id;
    const { page = 1, limit = 6 } = req.query
    try {
        const assignments = await assignmentService.studentGetAssignments(studentId, { page, limit });
        res.status(HttpStatus.OK).json({ message: "Fetched the assignments", assignments });
    } catch (error) {
        if (error.message === constants.STUDENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error(constants.ASSIGNMENT_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.studentsubmitAssignment = async (req, res) => {
    const assignmentId = req.params.id;
    const studentId = req.body.studentId;

    try {
        const response = await assignmentService.studentSubmitAssignment(assignmentId, studentId, req.file);
        res.status(HttpStatus.OK).json(response);
    } catch (error) {
        if (error.message === constants.ASSIGNMENT_NOT_FOUND || error.message === constants.ASSIGNMENT_DUE_PASSED || error.message === constants.FILE_IS_REQUIRED) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        console.error(constants.ASSIGNMENT_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.studentGetQuizzes = async (req, res) => {
    const studentId = req.params.id;
    console.log("Student ID from get quizzes:", studentId);

    try {
        const quizzes = await quizService.studentGetQuizzes(studentId);
        res.status(HttpStatus.OK).json({ message: "Fetched the quizzes", quizzes });
    } catch (error) {
        if (error.message === constants.STUDENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        console.error(constants.QUIZ_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

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

exports.submitQuiz = async (req, res) => {
    const { userId, quizId, score } = req.body;

    try {
        const submission = await quizService.submitQuiz(userId, quizId, score);
        res.status(HttpStatus.OK).json({ message: "Quiz submitted successfully", submission });
    } catch (error) {
        if (error.message === constants.QUIZ_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        console.error(constants.QUIZ_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.getClasses = async (req, res) => {
    const courseId = req.params.id;

    try {
        const classes = await classService.getClassesByCourse(courseId);
        res.status(HttpStatus.OK).json({ classes });
    } catch (error) {
        if (error.message === constants.CLASS_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error(constants.CLASS_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.createClass = async (req, res) => {
    const { courseId, title, date, time, duration, teacherId } = req.body;

    try {
        await classService.createNewClass({ courseId, title, date, time, duration, teacherId });
        res.status(HttpStatus.OK).json({ message: 'Class added successfully' });
    } catch (error) {
        if (error.message === constants.ALL_FIELD_REQUIRED_CLASS) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }

        console.error(constants.CLASS_ERROR, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: constants.SERVER_ERROR
        });
    }
};

exports.studentGetClasses = async (req, res) => {
    const studentId = req.params.id;

    try {
        const classes = await classService.getStudentClasses(studentId);
        res.status(HttpStatus.OK).json({ message: "Fetched the classes", classes });
    } catch (error) {
        if (error.message === constants.STUDENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error(constants.CLASS_ERROR, error.message);
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
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
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
        res.status(HttpStatus.OK).json({
            notifications,
            message: 'Fetched notifications successfully',
        });
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

exports.addClassPeerId = async (req, res) => {
    const classId = req.params.id;
    const { peerId } = req.body;

    try {
        const { updatedClass, notification } = await classService.addPeerIdAndNotify(classId, peerId);

        res.status(HttpStatus.OK).json({
            message: "Class updated successfully and notification sent",
            class: updatedClass,
            notification,
        });
    } catch (error) {
        if (error.message === constants.CLASS_NOT_FOUND || error.message === constants.NO_COURSE_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error updating class:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.EditClass = async (req, res) => {
    const classId = req.params.id;
    const { title, time, date, duration, status } = req.body;

    try {
        const updatedClass = await classService.editClassDetails(classId, { title, time, date, duration, status });

        res.status(HttpStatus.OK).json({
            message: "Class updated successfully",
            class: updatedClass,
        });
    } catch (error) {
        if (error.message === constants.CLASS_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error updating class:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.deleteClass = async (req, res) => {
    const classId = req.params.id;

    try {
        await classService.removeClass(classId);

        res.status(HttpStatus.OK).json({
            message: "Class deleted successfully",
        });
    } catch (error) {
        if (error.message === constants.CLASS_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Delete class error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.getAssignmentSubmissions = async (req, res) => {
    const assId = req.params.id;

    try {
        const submissions = await assignmentService.getAssignmentSubmissions(assId);
        res.status(HttpStatus.OK).json({ submissions });
    } catch (error) {
        if (error.message === constants.ASSIGNMENT_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error fetching submissions:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};

exports.getQuizSubmissions = async (req, res) => {
    const quizId = req.params.id;

    try {
        const submissions = await quizService.getQuizSubmissions(quizId);
        res.status(HttpStatus.OK).json({ submissions });
    } catch (error) {
        if (error.message === constants.QUIZ_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error fetching quiz submissions:", error.message);
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

exports.setClassStatusEnded = async (req, res) => {
    const classId = req.params.id;
    try {
        const updatedClass = await classService.setClassStatusEnded(classId);
        res.status(HttpStatus.OK).json({ message: 'Class status updated successfully', class: updatedClass });
    } catch (error) {
        console.error('Error setting class status as ended:', error.message);
        if (error.message === constants.CLASS_NOT_FOUND) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
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
            courses,
            totalPages,
            totalCourses,
            currentPage: page
        });
    } catch (error) {
        console.error('Get courses error:', error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.SERVER_ERROR });
    }
};




