const Quiz = require("../models/quizModel")

const quizRepository = {
    async createQuiz(quizData) {
        const quiz = new Quiz(quizData);
        return await quiz.save();
    },

    async getQuizzesByCourse(courseId) {
        return await Quiz.find({ course: courseId }).populate('course', 'name');
    },

    async deleteQuiz(quizId) {
        const quiz = await Quiz.findByIdAndDelete(quizId);
        return quiz
    },

    async getQuizById(quizId) {
        return await Quiz.findById(quizId);
    },

    async updateQuiz(quizId, updateData) {
        return await Quiz.findByIdAndUpdate(
            quizId,
            {
                title: updateData.title,
                questions: updateData.questions,
                $set: { submissions: [] }
            },
            { new: true, runValidators: true }
        );
    },

    async getAllQuizzesWithCourse() {
        return await Quiz.find().populate({
            path: "course",
            select: "title"
        });
    },

    async findQuizzesForCourses(courseIds) {
        return await Quiz.find({ course: { $in: courseIds } }).populate({
            path: "course",
            select: "title"
        });
    },

    async saveQuiz(quiz) {
        return await quiz.save();
    }

}

module.exports = quizRepository