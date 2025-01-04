const courseRepository = require("../repositories/courseRepository")
const moduleRepository = require("../repositories/moduleRepository")
const userRepository = require("../repositories/userRepository")
const sendEmail = require("../helpers/sendEmail")

const courseService = {
    async getStudents() {
        const users = await courseRepository.getStudents()
        if (!users) throw new Error("students not found")
        return users
    },

    async getTeacherCourses(teacherId) {
        const courses = await courseRepository.getCoursesByTeacher(teacherId)

        if (!courses) {
            throw new Error("courses not found")
        }

        const coursesToSend = courses.map(course => ({
            id: course._id,
            courseId: course.courseId,
            title: course.title,
            description: course.description,
            teacher: course.teacher,
            studentCount: course.studentsEnrolled.length || 0,
            assignmentCount: course.assignments.length || 0
        }));
        return {
            courses: coursesToSend
        }
    },

    async generateRandomId(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },

    async createCourse(teacherId, courseData) {
        const { title, description } = courseData
        if (!teacherId) {
            throw new Error("Unauthorized. Please log in.")
        }
        const teacher = await courseRepository.getTeacher(teacherId)
        if (teacher.isTeacherVerified === false) {
            throw new Error("Only verified teachers can create a course.  Wait for your verification!")
        }
        const newCourse = {
            courseId: await this.generateRandomId(6),
            title,
            description,
            teacher: teacherId
        }

        return await courseRepository.createCourse(newCourse)
    },

    async deleteCourse(courseId) {
        await courseRepository.deleteCourse(courseId)
    },

    async getCourseDetails(courseId) {
        if (!courseId) {
            throw new Error("Invalid course ID");
        }

        const course = await courseRepository.findCourseById(courseId);
        if (!course) {
            throw new Error("no course found");
        }

        const modules = await moduleRepository.findModulesByCourse(courseId);
        const teacher = await userRepository.findById(course.teacher);

        return { course, modules, teacher };
    },

    async editCourse(courseId, courseData) {
        if (!courseId) {
            throw new Error("Invalid course ID");
        }
        const updatedCourse = await courseRepository.updateCourse(courseId, courseData);
        return updatedCourse;
    },

    async getCoursesForAdmin() {
        const courses = await courseRepository.getAllCourses();

        const courseToSend = await Promise.all(
            courses.map(async (course) => {
                const teacher = await courseRepository.getTeacher(course.teacher);
                return {
                    id: course._id,
                    courseId: course.courseId,
                    title: course.title,
                    teacher: teacher ? teacher.name : "Unknown",
                    studentCount: course.studentsEnrolled.length || 0,
                };
            })
        );

        return courseToSend;
    },

    async getCourseForAdmin(courseId) {
        if (!courseId) {
            throw new Error("Invalid course ID");
        }

        const course = await courseRepository.findCourseById(courseId);
        if (!course) {
            throw new Error("Course not found");
        }

        const modules = await courseRepository.getModulesByCourseId(courseId);
        const teacher = await courseRepository.getTeacher(course.teacher);

        return {
            course: {
                title: course.title,
                description: course.description,
                teacher: teacher ? teacher.name : "Unknown",
            },
            modules,
        };
    },

    async studentEnrollment(courseId, studentId) {
        const student = await userRepository.findById(studentId);
        const course = await courseRepository.findCourseById(courseId);

        if (!student || !course) {
            throw new Error("Course or student not found");
        }

        if (!course.studentsEnrolled.includes(studentId)) {
            course.studentsEnrolled.push(studentId);
            await courseRepository.updateCourseForEnrollment(course);
        }

        if (!student.enrolledCourses.includes(courseId)) {
            student.enrolledCourses.push(courseId);
            await courseRepository.updateStudent(student);
        }
    },

    async getEnrolledCourses(userId) {
        const student = await courseRepository.findStudentById(userId);
        if (!student) {
            throw new Error("User not found");
        }
        return student.enrolledCourses;
    },

    async sendNotification({ courseId, userId, message }) {
        const teacher = await userRepository.findById(userId);
        const course = await courseRepository.findCourseById(courseId);

        if (!course) {
            throw new Error("Course not found");
        }

        const notificationData = {
            course: courseId,
            message,
            sender: userId
        };

        const notification = await courseRepository.createNotification(notificationData);


        return notification;
    },

    async getStudentNotifications(studentId) {
        const student = await courseRepository.findStudentById(studentId)

        if (!student) {
            throw new Error("Student not found");
        }

        const courseIds = student.enrolledCourses.map(course => course._id);
        const notifications = await courseRepository.getNotificationsByCourseIds(courseIds);

        return notifications.map(notification => ({
            ...notification.toObject(),
            isRead: notification.read.includes(studentId),
        }));
    },

    async markAsRead(notificationIds, studentId) {
        const result = await courseRepository.markNotificationsAsRead(notificationIds, studentId);

        if (result.modifiedCount === 0) {
            throw new Error("No notifications were updated");
        }

        return result;
    },

    async getCourseStudents(courseId) {
        const course = await courseRepository.findCourseById(courseId);

        if (!course) {
            throw new Error("Course not found");
        }

        return course.studentsEnrolled;
    },

    async sendEmailNotification(courseId, message) {
        const course = await courseRepository.findCourseById(courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        const studentEmails = course.studentsEnrolled.map(student => student.email);

        const emailPromises = studentEmails.map(email =>
            sendEmail(email, `Notification from ${course.title}`, message)
        );

        const results = await Promise.allSettled(emailPromises);

        const failedEmails = results.filter(result => result.status === 'rejected');

        return { failedEmails, totalEmails: studentEmails.length };
    },

    async getHomeCourses(userId) {
        const courses = await courseRepository.findCoursesNotEnrolledByUser(userId);

        if (courses.length === 0) {
            throw new Error('No courses available');
        }

        return courses;
    }



}

module.exports = courseService