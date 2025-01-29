const courseService = require("../services/courseService")
const assignmentService = require("../services/assignmentService")
const HttpStatus = require("../helpers/httpStatus");
const constants = require("../helpers/constants")

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
}

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