const quizRepository = require("../repositories/quizRepository")
const courseRepository = require("../repositories/courseRepository")

const quizService = {
    async addQuiz(quizData) {
        return await quizRepository.createQuiz(quizData);
    },

    async getQuizzes(courseId) {
        const quizzes = await quizRepository.getQuizzesByCourse(courseId);
        const course = await courseRepository.findCourseById(courseId);

        if (!quizzes.length) {
            throw new Error("No quizzes found for this course.");
        }

        return { quizzes, courseName: course.title };
    },

    async deleteQuiz(quizId) {
        const quiz = await quizRepository.deleteQuiz(quizId)
        if (!quiz) {
            throw new Error("Quiz not found.")
        }
    },

    async getQuiz(quizId) {
        const quiz = await quizRepository.getQuizById(quizId);

        if (!quiz) {
            throw new Error("quiz not found");
        }

        return quiz;
    },

    async updateQuiz(quizId, updateData) {
        const quiz = await quizRepository.updateQuiz(quizId, updateData);
        if (!quiz) {
            throw new Error("Quiz not found");
        }

        const course = await courseRepository.findCourseById(updateData.courseId);
        if (!course) {
            throw new Error("course not found");
        }

        const teacher = await courseRepository.getTeacher(updateData.teacherId);
        if (!teacher) {
            throw new Error("Teacher not found");
        }

        const notificationData = {
            course: updateData.courseId,
            message: `Quiz ${updateData.title} has been updated, Please attend again!`,
            sender: updateData.teacherId
        };
        await courseRepository.createNotification(notificationData);

        return quiz;
    },

    async getAdminQuizzes() {
        const quizzes = await quizRepository.getAllQuizzesWithCourse();

        const quizWithCourse = quizzes.map(quiz => ({
            _id: quiz._id,
            title: quiz.title,
            questions: quiz.questions.map(q => ({
                question: q.question,
                options: q.options,
                answer: q.answer
            })),
            course: quiz.course ? quiz.course.title : "unknown course",
            submissions: quiz.submissions ? quiz.submissions.length : 0
        }));

        quizWithCourse.forEach((quiz, index) => {
            console.log(`Quiz ${index + 1} Questions:`, quiz.questions);
        });

        return quizWithCourse;
    },

    async adminDeleteQuiz(quizId) {
        const quiz = await quizRepository.deleteQuiz(quizId)
        if (!quiz) {
            throw new Error("Quiz not found.")
        }
    },

    async studentGetQuizzes(studentId) {
        const student = await courseRepository.findStudentById(studentId);

        if (!student) {
            throw new Error("Student not found");
        }

        const courseIds = student.enrolledCourses.map(course => course._id);
        const quizzes = await quizRepository.findQuizzesForCourses(courseIds);

        const quizWithCourse = quizzes.map(quiz => {
            const studentSubmission = quiz.submissions.find(sub => String(sub.student) === String(studentId));
            return {
                _id: quiz._id,
                title: quiz.title,
                questions: quiz.questions.map(q => ({
                    question: q.question,
                    options: q.options,
                    answer: q.answer
                })),
                course: quiz.course ? quiz.course.title : "unknown course",
                alreadySubmitted: Boolean(studentSubmission),
                numberOfQuestions: quiz.questions.length,
                score: studentSubmission ? studentSubmission.score : null,
                submissions: quiz.submissions.length
            };
        });

        return quizWithCourse;
    },

    async submitQuiz(userId, quizId, score) {
        const quiz = await quizRepository.getQuizById(quizId);
        if (!quiz) {
            throw new Error("Quiz not found");
        }

        const submission = {
            student: userId,
            score: score,
            submittedAt: new Date()
        };
        console.log("Submission data:", submission);

        quiz.submissions.push(submission);

        await quizRepository.saveQuiz(quiz);

        return submission;
    },

async getQuizSubmissions(quizId) {
    const quiz = await quizRepository.getQuizById(quizId);

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    return quiz.submissions.map(submission => ({
        name: submission.student.name,
        score: submission.score,
        submittedAt: submission.submittedAt,
    }));
}


}

module.exports = quizService