const Course = require("../models/courseModel")
const User = require("../models/userModel");
const Module = require("../models/moduleModel")
const Notification = require("../models/notificationModel")
const constants = require("../helpers/constants")

const courseRepository = {
    async getStudents() {
        return await User.find({ role: "student" });
    },

    async getCoursesByTeacher(teacherId) {
        return await Course.find({ teacher: teacherId })
            .populate('studentsEnrolled', 'name')
            .exec();
    },

    async getTeacher(userId) {
        return await User.findById(userId)
    },

    async createCourse(courseData) {
        const course = new Course(courseData)
        return await course.save()
    },

    async deleteCourse(courseId) {
        const course = await Course.findByIdAndDelete(courseId)
        if (!course) {
            throw new Error(constants.NO_COURSE_FOUND)
        }
        return course
    },

    async findCourseById(courseId) {
        return await Course.findById(courseId).populate("studentsEnrolled");
    },

    async updateCourse(courseId, updateData) {
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        if (!updatedCourse) {
            throw new Error(constants.NO_COURSE_FOUND);
        }
        return updatedCourse;
    },

    async addModuleToCourse(courseId, moduleId) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error(constants.NO_COURSE_FOUND);
        }
        course.modules.push(moduleId);
        return await course.save();
    },

    async getAllCourses() {
        return await Course.find().sort({ createdAt: -1 }).populate('teacher', 'name');
    },

    async getModulesByCourseId(courseId) {
        return await Module.find({ course: courseId });
    },

    async getCourseTitleById(courseId) {
        const course = await Course.findById(courseId).select("title");
        return course ? course.title : null;
    },

    async addAssignmentToCourse(courseId, assignmentId) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error(constants.NO_COURSE_FOUND);
        }
        if (!course.assignments.includes(assignmentId)) {
            course.assignments.push(assignmentId);
            await course.save();
        }
    },

    async createNotification(notificationData) {
        const notification = new Notification(notificationData);
        return await notification.save();
    },

    async updateStudent(student) {
        return await student.save();
    },

    async updateCourseForEnrollment(course) {
        return await course.save();
    },

    async findStudentById(studentId) {
        return await User.findById(studentId).populate('enrolledCourses');
    },

    async getNotificationsByCourseIds(courseIds) {
        return await Notification.find({ course: { $in: courseIds } })
            .populate('course', 'title')
            .populate('sender', 'name')
            .sort({ createdAt: -1 });
    },

    async markNotificationsAsRead(notificationIds, studentId) {
        return await Notification.updateMany(
            { _id: { $in: notificationIds } },
            { $addToSet: { read: studentId } }
        );
    },

    async createNotificationForClass(courseId, message, senderId) {
        const notification = new Notification({
            course: courseId,
            message,
            sender: senderId,
        });
        return await notification.save();
    },

    async findCoursesNotEnrolledByUser(userId, { search, modulesFilter, page, limit }) {
        try {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            
            const user = await User.findById(userId).populate('enrolledCourses', '_id');
            if (!user) {
                throw new Error(constants.USER_NOT_FOUND);
            }
        
            const enrolledCourseIds = user.enrolledCourses.map(course => course._id);
            let query = { _id: { $nin: enrolledCourseIds } };
        
            if (modulesFilter) {
                if (modulesFilter === 'Less') {
                    query.$expr = { 
                        $and: [
                            { $gte: [{ $size: "$modules" }, 1] },
                            { $lte: [{ $size: "$modules" }, 2] }
                        ]
                    };
                } else if (modulesFilter === 'Medium') {
                    query.$expr = { 
                        $and: [
                            { $gte: [{ $size: "$modules" }, 3] },
                            { $lte: [{ $size: "$modules" }, 4] }
                        ]
                    };
                } else if (modulesFilter === 'More') {
                    query.$expr = { 
                        $gt: [{ $size: "$modules" }, 4]
                    };
                }
            }
        
            if (search) {
                const searchCriteria = {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { courseId: { $regex: search, $options: 'i' } },
                    ]
                };
                
                query = {
                    $and: [
                        query,
                        searchCriteria
                    ]
                };
            }
    
            const debugQuery = JSON.parse(JSON.stringify(query));
            console.log('MongoDB Query:', debugQuery);
    
            const [courses, totalCourses] = await Promise.all([
                Course.find(query)
                    .sort({ createdAt: -1 })
                    .skip((pageNum - 1) * limitNum)
                    .limit(limitNum),
                Course.countDocuments(query)
            ]);
    
            return {
                courses,
                totalPages: Math.ceil(totalCourses / limitNum) || 1,
            };
        } catch (error) {
            console.error('Repository Error:', error);
            throw new Error(`Error finding courses: ${error.message}`);
        }
    }
    


}

module.exports = courseRepository