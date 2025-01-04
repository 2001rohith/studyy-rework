const classRepository = require("../repositories/classRepository");
const courseRepository = require("../repositories/courseRepository");

const classService = {
    async getClassesByCourse(courseId) {
        const classes = await classRepository.findClassesByCourse(courseId);
        if (!classes.length) {
            throw new Error("No classes found");
        }
        return classes;
    },

    async createNewClass({ courseId, title, date, time, duration, teacherId }) {
        if (!courseId || !title || !date || !time || !duration || !teacherId) {
            throw new Error("All fields are required to create a class.");
        }

        const classData = {
            course: courseId,
            title,
            date,
            time,
            duration,
            teacher: teacherId,
        };

        return await classRepository.createClass(classData);
    },

    async getStudentClasses(studentId) {
        const student = await courseRepository.findStudentById(studentId); // Reuse from userRepository
        if (!student) {
            throw new Error("Student not found");
        }

        const courseIds = student.enrolledCourses.map(course => course._id);

        const classes = await classRepository.getClassesForCourses(courseIds);

        return classes.map(cls => ({
            _id: cls._id,
            title: cls.title,
            date: cls.date,
            time: cls.time,
            course: cls.course ? cls.course.title : "unknown assignment",
            peerId: cls.peerId,
            status: cls.status
        }));
    },

    async addPeerIdAndNotify(classId, peerId) {
        const updatedClass = await classRepository.updateClassPeerId(classId, peerId);

        if (!updatedClass) {
            throw new Error("Class not found");
        }

        const course = await courseRepository.findCourseById(updatedClass.course);

        if (!course) {
            throw new Error("Course not found");
        }

        const notificationMessage = `${course.title} - Live class started`;
        const notification = await courseRepository.createNotificationForClass(
            updatedClass.course,
            notificationMessage,
            updatedClass.teacher
        );

        return { updatedClass, notification };
    },

    async editClassDetails(classId, updateData) {
        const updatedClass = await classRepository.updateClassDetails(classId, updateData);

        if (!updatedClass) {
            throw new Error("Class not found");
        }

        return updatedClass;
    },

    async removeClass(classId) {
        const classToDelete = await classRepository.deleteClassById(classId);

        if (!classToDelete) {
            throw new Error("Class not found");
        }

        return classToDelete;
    },

 async setClassStatusEnded(classId) {
        const selectedClass = await classRepository.findClassById(classId);

        if (!selectedClass) {
            throw new Error('Class not found');
        }

        return await classRepository.updateClassStatus(classId, 'Ended');
    }

}

module.exports = classService