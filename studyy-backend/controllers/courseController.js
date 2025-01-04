const courseService = require("../services/courseService")
const moduleService = require("../services/moduleService")
const assignmentService = require("../services/assignmentService")
const quizService = require("../services/quizService")
const classService = require("../services/classService")
const HttpStatus = require("../helpers/httpStatus");


exports.getStudents = async (req, res) => {
    try {
        const users = await courseService.getStudents()
        res.status(HttpStatus.OK).json({ users, message: "student list for teacher" })
    } catch (error) {
        if (error.message === "students not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error("Error get students:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Server error"
        });
    }
}

exports.getCourses = async (req, res) => {
    const teacherId = req.user._id;
    try {
        const { courses } = await courseService.getTeacherCourses(teacherId)
        res.status(HttpStatus.OK).json({ courses, message: "Course list for teacher" });
    } catch (error) {
        if (error.message === "courses not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error("Get courses error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
}

exports.createCourse = async (req, res) => {
    const { title, description, userId } = req.body
    try {
        const newCourse = await courseService.createCourse(userId, { title, description })
        res.status(HttpStatus.OK).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        if (error.message === "Unauthorized. Please log in." || error.message === "Only verified teachers can create a course.  Wait for your verification!") {
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
        console.log("course deleted")
        res.status(HttpStatus.OK).json({ message: "course deleted successfully" })
    } catch (error) {
        if (error.message === "course not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error("delete course error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
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
        if (error.message === "no course found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(`Get course error (courseId: ${courseId}):`, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};

exports.EditCourse = async (req, res) => {
    const courseId = req.params.id;
    const { title, description } = req.body;

    try {
        const updatedCourse = await courseService.editCourse(courseId, { title, description });
        res.status(HttpStatus.OK).json({ course: updatedCourse, message: "Course updated successfully" });
    } catch (error) {
        if (error.message === "Course not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ status: "notok", message: error.message });
        }
        console.error(`Update course error (courseId: ${courseId}):`, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
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
        if (error.message === "PDF file is required") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        if (error.message === "Course not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error creating module:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};


exports.DeleteModule = async (req, res) => {
    const moduleId = req.params.id;

    try {
        await moduleService.deleteModule(moduleId);
        console.log(`Deleted module (moduleId: ${moduleId})`);
        res.status(HttpStatus.OK).json({ message: "Module deleted successfully" });
    } catch (error) {
        if (error.message === "Module not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(`Delete module error (moduleId: ${moduleId}):`, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
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
        if (error.message === "Module not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error(`Update module error (moduleId: ${moduleId}):`, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};


exports.AdmingetCourses = async (req, res) => {
    try {
        const courses = await courseService.getCoursesForAdmin();
        res.status(HttpStatus.OK).json({ courses, message: "Courses for admin" });
    } catch (error) {
        console.error("Admin get courses error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};

exports.AdmingetCourse = async (req, res) => {
    const courseId = req.params.id;

    try {
        const { course, modules } = await courseService.getCourseForAdmin(courseId);
        res.status(HttpStatus.OK).json({ course, modules, message: "Fetched course successfully" });
    } catch (error) {
        if (error.message === "Course not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Admin get course error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};

exports.GetAssignments = async (req, res) => {
    const courseId = req.params.id;

    try {
        const { assignments, courseTitle } = await assignmentService.getAssignmentsForCourse(courseId);
        res.status(HttpStatus.OK).json({ assignments, course: courseTitle });
    } catch (error) {
        if (error.message.startsWith("No assignments found")) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Get assignments error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
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
        if (error.message === "Course not found.") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error creating assignment:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while creating the assignment." });
    }
};

exports.EditAssignment = async (req, res) => {
    const assignmentId = req.params.id;
    const { title, description, dueDate } = req.body;

    try {
        const updatedAssignment = await assignmentService.updateAssignment(assignmentId, { title, description, dueDate });
        res.status(HttpStatus.OK).json({
            status: "ok",
            assignment: updatedAssignment,
            message: "Assignment updated successfully",
        });
    } catch (error) {
        if (error.message === "Assignment not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ status: "notok", message: error.message });
        }
        console.error("Update assignment error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};

exports.DeleteAssignment = async (req, res) => {
    const assignmentId = req.params.id;

    try {
        await assignmentService.deleteAssignment(assignmentId);
        console.log("Assignment deleted successfully");
        res.status(HttpStatus.OK).json({ message: "Assignment deleted successfully" });
    } catch (error) {
        if (error.message === "Assignment not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Delete assignment error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};

exports.addQuiz = async (req, res) => {
    const { title, courseId, questions } = req.body;

    try {
        await quizService.addQuiz({ title, course: courseId, questions });
        console.log("Quiz created successfully");
        res.status(HttpStatus.OK).json({ status: "ok", message: "Quiz created successfully" });
    } catch (error) {
        console.error("Error adding quiz:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: "error", message: "Failed to create quiz" });
    }
};

exports.getQuizzes = async (req, res) => {
    const courseId = req.params.id;
    console.log("Course ID from getQuizzes:", courseId);

    try {
        const { quizzes, courseName } = await quizService.getQuizzes(courseId);
        console.log("Quizzes retrieved:", quizzes);
        res.status(HttpStatus.OK).json({ status: "ok", quizzes, courseName });
    } catch (error) {
        if (error.message === "No quizzes found for this course.") {
            return res.status(HttpStatus.BAD_REQUEST).json({ status: "error", message: error.message });
        }
        console.error("Error retrieving quizzes:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: "error", message: "Failed to retrieve quizzes." });
    }
};

exports.DeleteQuiz = async (req, res) => {
    const quizId = req.params.id;
    console.log("Quiz ID from DeleteQuiz:", quizId);

    try {
        await quizService.deleteQuiz(quizId);
        console.log("deleted quiz");
        res.status(HttpStatus.OK).json({
            status: "ok",
            message: "quiz deleted successfully"
        });
    } catch (error) {
        if (error.message === "Quiz not found.") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }
        console.error("Error deleting quiz:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Failed to delete quiz."
        });
    }
};

exports.GetQuiz = async (req, res) => {
    const quizId = req.params.id;

    try {
        const quiz = await quizService.getQuiz(quizId);
        res.status(HttpStatus.OK).json({
            status: "ok",
            quiz
        });
    } catch (error) {
        if (error.message === "quiz not found") {
            return res.status(HttpStatus.NOT_FOUND).json({
                status: "error",
                message: error.message
            });
        }
        console.error("get quiz error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Server error"
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
            status: "ok",
            message: "Quiz updated successfully",
            quiz: updatedQuiz
        });
    } catch (error) {
        console.error("Error updating quiz:", error.message);

        if (error.message === "Quiz not found" || error.message === "course not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Server error"
        });
    }
};

exports.adminGetQuizzes = async (req, res) => {
    try {
        const quizzes = await quizService.getAdminQuizzes();

        res.status(HttpStatus.OK).json({
            status: "ok",
            message: "fetched quizzes",
            quizzes
        });
    } catch (error) {
        console.error("Error admin get quizzes:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Server error"
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
        if (error.message === "Quiz not found.") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }
        console.error("Error deleting quiz:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Failed to delete quiz."
        });
    }
}

exports.adminGetAssignments = async (req, res) => {
    try {
        const assignments = await assignmentService.getAssignments();

        if (assignments.length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No assignments found.' });
        }

        res.status(HttpStatus.OK).json({ status: 'ok', assignments });
    } catch (error) {
        console.error("get assignments error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
}

exports.adminDeleteAssignment = async (req, res) => {
    const assignmentId = req.params.id;
    try {
        await assignmentService.adminDeleteAssignment(assignmentId);
        console.log("deleted assignment");
        res.status(HttpStatus.OK).json({ message: "assignment deleted successfully" });
    } catch (error) {
        if (error.message === "Assignment not found.") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }
        console.error("Error deleting assignment:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Failed to delete assignment."
        });
    }
}

exports.studentEnrollment = async (req, res) => {
    const { courseId, studentId } = req.body;
    try {
        await courseService.studentEnrollment(courseId, studentId);
        res.status(HttpStatus.OK).json({ message: "Student enrollment success" });
    } catch (error) {
        if (error.message === "Course or student not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }
        console.error("Student enrollment error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Server error"
        });
    }
}

exports.studentGetAssignments = async (req, res) => {
    const studentId = req.params.id;
    try {
        const assignments = await assignmentService.studentGetAssignments(studentId);
        res.status(HttpStatus.OK).json({ message: "Fetched the assignments", assignments });
    } catch (error) {
        if (error.message === "Student not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }
        console.error("Error fetching assignments:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Server error"
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
        if (error.message === "Assignment not found" || error.message === "The assignment due date has passed. You cannot submit the assignment." || error.message === "File is required for submission") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }

        console.error("Error submitting assignment:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Server error"
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
        if (error.message === "Student not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }

        console.error("Error fetching quizzes:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Server error"
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
        if (error.message === "User not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }

        console.error("Error fetching enrolled courses:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Server error"
        });
    }
};

exports.submitQuiz = async (req, res) => {
    const { userId, quizId, score } = req.body;

    try {
        const submission = await quizService.submitQuiz(userId, quizId, score);
        res.status(HttpStatus.OK).json({ message: "Quiz submitted successfully", submission });
    } catch (error) {
        if (error.message === "Quiz not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message
            });
        }

        console.error("Error submitting quiz:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Failed to submit quiz"
        });
    }
};

exports.getClasses = async (req, res) => {
    const courseId = req.params.id;

    try {
        const classes = await classService.getClassesByCourse(courseId);
        res.status(HttpStatus.OK).json({ status: 'ok', classes });
    } catch (error) {
        if (error.message === "No classes found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: 'error',
                message: error.message
            });
        }

        console.error("Error fetching classes:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to fetch classes'
        });
    }
};

exports.createClass = async (req, res) => {
    const { courseId, title, date, time, duration, teacherId } = req.body;

    try {
        await classService.createNewClass({ courseId, title, date, time, duration, teacherId });
        res.status(HttpStatus.OK).json({ status: 'ok', message: 'Class added successfully' });
    } catch (error) {
        if (error.message === "All fields are required to create a class.") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: 'error',
                message: error.message
            });
        }

        console.error("Error creating class:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to add class'
        });
    }
};

exports.studentGetClasses = async (req, res) => {
    const studentId = req.params.id;

    try {
        const classes = await classService.getStudentClasses(studentId);
        res.status(HttpStatus.OK).json({ message: "Fetched the classes", classes });
    } catch (error) {
        if (error.message === "Student not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error("Error fetching classes:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Server error"
        });
    }
};

exports.sendNotification = async (req, res) => {
    const { courseId, userId, message } = req.body;

    try {
        const notification = await courseService.sendNotification({ courseId, userId, message });
        res.status(HttpStatus.OK).json({ message: 'Notification sent successfully', notification });
    } catch (error) {
        if (error.message === "Course not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            });
        }
        console.error("Error sending notification:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Server error'
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
        if (error.message === "Student not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error fetching notifications:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};

exports.markNotificationsAsRead = async (req, res) => {
    const { notificationIds, studentId } = req.body;

    try {
        await courseService.markAsRead(notificationIds, studentId);
        res.status(HttpStatus.OK).json({ message: 'Notifications marked as read' });
    } catch (error) {
        if (error.message === "No notifications were updated") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error marking notifications as read:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
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
        if (error.message === "Class not found" || error.message === "Course not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error updating class:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};

exports.EditClass = async (req, res) => {
    const classId = req.params.id;
    const { title, time, date, duration, status } = req.body;

    try {
        const updatedClass = await classService.editClassDetails(classId, { title, time, date, duration, status });

        res.status(HttpStatus.OK).json({
            status: "ok",
            message: "Class updated successfully",
            class: updatedClass,
        });
    } catch (error) {
        if (error.message === "Class not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error updating class:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};

exports.deleteClass = async (req, res) => {
    const classId = req.params.id;

    try {
        await classService.removeClass(classId);

        res.status(HttpStatus.OK).json({
            status: "ok",
            message: "Class deleted successfully",
        });
    } catch (error) {
        if (error.message === "Class not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Delete class error:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
};

exports.getAssignmentSubmissions = async (req, res) => {
    const assId = req.params.id;

    try {
        const submissions = await assignmentService.getAssignmentSubmissions(assId);
        res.status(HttpStatus.OK).json({ submissions });
    } catch (error) {
        if (error.message === "Assignment not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error fetching submissions:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};

exports.getQuizSubmissions = async (req, res) => {
    const quizId = req.params.id;

    try {
        const submissions = await quizService.getQuizSubmissions(quizId);
        res.status(HttpStatus.OK).json({ submissions });
    } catch (error) {
        if (error.message === "Quiz not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error fetching quiz submissions:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};

exports.getCourseStudents = async (req, res) => {
    const courseId = req.params.id;

    try {
        const students = await courseService.getCourseStudents(courseId);
        res.status(HttpStatus.OK).json({ students });
    } catch (error) {
        if (error.message === "Course not found") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        console.error("Error fetching course students:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
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
        if (error.message === 'Course not found') {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }

        console.error('Error sending email notifications:', error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to send email notifications.' });
    }
};

exports.setClassStatusEnded = async (req, res) => {
    const classId = req.params.id;

    try {
        const updatedClass = await classService.setClassStatusEnded(classId);
        res.status(HttpStatus.OK).json({ message: 'Class status updated successfully', class: updatedClass });
    } catch (error) {
        console.error('Error setting class status as ended:', error.message);
        if (error.message === 'Class not found') {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error setting class status as ended.' });
    }
};

exports.getModuleData = async (req, res) => {
    const moduleId = req.params.id;

    try {
        const moduleData = await moduleService.getModuleData(moduleId);
        res.status(HttpStatus.OK).json({ message: 'Fetched module data', module: moduleData });
    } catch (error) {
        console.error('Error getting module data:', error.message);
        if (error.message === 'Module not found') {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error getting module data.' });
    }
};

exports.homeCourses = async (req, res) => {
    const userId = req.params.id;

    try {
        const courses = await courseService.getHomeCourses(userId);
        res.status(HttpStatus.OK).json({
            status: "ok",
            courses,
            message: "Fetched courses successfully",
        });
    } catch (error) {
        console.error('Get courses error:', error.message);
        if (error.message === 'User not found') {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        if (error.message === 'No courses available') {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
}



