const Class = require("../models/classModel")

const classRepository = {
    async findClassesByCourse(courseId) {
        return await Class.find({ course: courseId });
    },

    async createClass(classData) {
        const newClass = new Class(classData);
        return await newClass.save();
    },

    async getClassesForCourses(courseIds) {
        return await Class.find({ course: { $in: courseIds }, status: { $ne: "Ended" } })
            .populate({
                path: "course",
                select: "title"
            })
            .select("title course time date peerId status");
    },

    async updateClassPeerId(classId, peerId) {
        return await Class.findByIdAndUpdate(
            classId,
            { peerId, status: "Started" },
            { new: true, runValidators: true }
        );
    },

    async updateClassDetails(classId, updateData) {
        return await Class.findByIdAndUpdate(
            classId,
            updateData,
            { new: true, runValidators: true }
        );
    },

    async deleteClassById(classId) {
        return await Class.findByIdAndDelete(classId);
    },

    async findClassById(classId) {
        return await Class.findById(classId);
    },

    async updateClassStatus(classId, status) {
        return await Class.findByIdAndUpdate(classId, { status }, { new: true });
    }

}

module.exports = classRepository