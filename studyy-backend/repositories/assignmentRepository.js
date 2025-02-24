const Assignment = require("../models/assignmentModel")
const constants = require("../helpers/constants")

const assignmentRepository = {
    async getAssignmentsByCourseId(courseId) {
        return await Assignment.find({ course: courseId })
            .populate({
                path: "course",
                select: "title",
            })
            .select("title dueDate description course submissions");
    },

    async createAssignment(assignmentData) {
        const assignment = new Assignment(assignmentData);
        return await assignment.save();
    },

    async updateAssignmentById(id, updateFields) {
        const updatedAssignment = await Assignment.findByIdAndUpdate(id, updateFields, { new: true });
        if (!updatedAssignment) {
            throw new Error(constants.ASSIGNMENT_NOT_FOUND);
        }
        return updatedAssignment;
    },

    async deleteAssignmentById(id) {
        const assignment = await Assignment.findByIdAndDelete(id);
        if (!assignment) {
            throw new Error(constants.ASSIGNMENT_NOT_FOUND);
        }
        return assignment;
    },

    async getAssignments() {
        return await Assignment.find().populate({
            path: "course",
            select: "title"
        });
    },
    async findAssignmentsByCourseIds(courseIds, { page, limit }) {
        return await Assignment.find({ course: { $in: courseIds } })
            .populate({
                path: "course",
                select: "title"
            })
            .select("title dueDate description course submissions")
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
    },

    async findAssignmentById(assignmentId) {
        return await Assignment.findById(assignmentId).populate('submissions.student', 'name');
    }



}

module.exports = assignmentRepository