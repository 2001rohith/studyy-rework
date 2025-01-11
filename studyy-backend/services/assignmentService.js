const assignmentRepository = require("../repositories/assignmentRepository")
const courseRepository = require("../repositories/courseRepository")
const constants = require("../helpers/constants")

const assignmentService = {
    async getAssignmentsForCourse(courseId) {
        if (!courseId) {
            throw new Error(constants.INVALID_COURSEID);
        }

        const assignments = await assignmentRepository.getAssignmentsByCourseId(courseId);
        const courseTitle = await courseRepository.getCourseTitleById(courseId);

        if (!assignments || assignments.length === 0) {
            throw new Error(constants.ASSIGNMENT_NOT_FOUND);
        }

        const assignmentsWithCourse = assignments.map((assignment) => ({
            _id: assignment._id,
            title: assignment.title,
            dueDate: assignment.dueDate,
            description: assignment.description,
            course: assignment.course ? assignment.course.title : "Unknown assignment",
            submissions: assignment.submissions,
        }));

        return {
            assignments: assignmentsWithCourse,
            courseTitle,
        };
    },

    async createAssignment({ title, description, dueDate, courseId }) {
        const course = await courseRepository.findCourseById(courseId);
        if (!course) {
            throw new Error(constants.NO_COURSE_FOUND);
        }

        const newAssignment = await assignmentRepository.createAssignment({
            title,
            description,
            dueDate,
            course: courseId,
        });

        await courseRepository.addAssignmentToCourse(courseId, newAssignment._id);

        return newAssignment;
    },

    async updateAssignment(assignmentId, updateFields) {
        return await assignmentRepository.updateAssignmentById(assignmentId, updateFields);
    },

    async deleteAssignment(assignmentId) {
        return await assignmentRepository.deleteAssignmentById(assignmentId);
    },

    async getAssignments() {
        const assignments = await assignmentRepository.getAssignments();

        return assignments.map(assignment => ({
            _id: assignment._id,
            title: assignment.title,
            deadline: assignment.dueDate,
            course: assignment.course ? assignment.course.title : "unknown assignment"
        }));
    },

    async adminDeleteAssignment(assignmentId) {
        const deletedAssignment = await assignmentRepository.deleteAssignmentById(assignmentId);
        return deletedAssignment;
    },

    async studentGetAssignments(studentId, { page, limit }) {
        const student = await courseRepository.findStudentById(studentId);

        if (!student) {
            throw new Error(constants.STUDENT_NOT_FOUND);
        }

        const courseIds = student.enrolledCourses.map(course => course._id);
        const assignments = await assignmentRepository.findAssignmentsByCourseIds(courseIds, { page, limit });

        return assignments.map(assignment => ({
            _id: assignment._id,
            title: assignment.title,
            deadline: assignment.dueDate,
            description: assignment.description,
            course: assignment.course ? assignment.course.title : "unknown assignment",
            submissions: assignment.submissions
        }));
    },

    async studentSubmitAssignment(assignmentId, studentId, file) {
        const assignment = await assignmentRepository.findAssignmentById(assignmentId);

        if (!assignment) {
            throw new Error(constants.ASSIGNMENT_NOT_FOUND);
        }

        const currentDate = new Date();
        const dueDate = new Date(assignment.dueDate);

        if (currentDate > dueDate) {
            throw new Error(constants.ASSIGNMENT_DUE_PASSED);
        }

        if (!file) {
            throw new Error(constants.FILE_IS_REQUIRED);
        }

        assignment.submissions.push({
            student: studentId,
            filePath: file.path
        });

        await assignmentRepository.saveAssignment(assignment);
        return { message: "Assignment submitted successfully" };
    },

    async getAssignmentSubmissions(assignmentId) {
        const assignment = await assignmentRepository.findAssignmentById(assignmentId);

        if (!assignment) {
            throw new Error(constants.ASSIGNMENT_NOT_FOUND);
        }

        return assignment.submissions.map(submission => ({
            name: submission.student.name,
            filePath: submission.filePath,
            submittedAt: submission.submittedAt,
        }));
    }

}

module.exports = assignmentService