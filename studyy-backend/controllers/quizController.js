const courseService = require("../services/courseService")
const quizService = require("../services/quizService")
const HttpStatus = require("../helpers/httpStatus");
const constants = require("../helpers/constants")

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