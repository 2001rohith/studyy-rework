const courseService = require("../services/courseService")
const classService = require("../services/classService")
const HttpStatus = require("../helpers/httpStatus");
const constants = require("../helpers/constants")

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
}