import { useApiClient } from "./apiClient";
import statusCode from "./statusCode"

export const useCourseService = () => {
    const apiClient = useApiClient()

    const adminFetchCourses = async () => {
        try {
            const response = await apiClient.get(`/course/admin-get-courses`);
            if (response.status === statusCode.OK) {
                return response.data.courses || [];
            } else {
                throw new Error(response.data.message || "Failed to fetch courses.");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            throw new Error("Server error. Please try again later.");
        }
    };

    const adminFetchCourse = async (id) => {
        try {
            const response = await apiClient.get(`/course/admin-get-course/${id}`);
            if (response.status === statusCode.OK) {
                return response.data || [];
            } else {
                throw new Error(response.data.message || "Failed to fetch course.");
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            throw new Error("Server error. Please try again later.");
        }
    };

    const deleteCourse = async (id) => {
        try {
            const response = await apiClient.delete(`/course/teacher-delete-course/${id}`);
            if (response.status === statusCode.OK) {
                return true
            } else {
                throw new Error(response.data.message || "Failed to delete course.");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            throw new Error("Server error. Please try again later.");
        }
    };

    const adminFetchAssignments = async () => {
        try {
            const response = await apiClient.get('/course/admin-get-assignments')
            if (response.status === statusCode.OK) {
                return response.data.assignments || []
            } else {
                throw new Error(response.data.message || "Failed to fetch assignents")
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const adminDeleteAssignment = async (id) => {
        try {
            const response = await apiClient.delete(`/course/admin-delete-assignment/${id}`);
            if (response.status === statusCode.OK) {
                return true
            } else {
                throw new Error(response.data.message || "Failed to delete assignment.");
            }
        } catch (error) {
            console.error("Error deleting assignment:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const adminFetchQuizzes = async () => {
        try {
            const response = await apiClient.get('/course/admin-get-quizzes');
            if (response.status === statusCode.OK) {
                return response.data.quizzes || []
            } else {
                throw new Error(response.data.message || "Failed to get Quizzes.");
            }
        } catch (error) {
            console.error("Error getting quizzes:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const adminDeleteQuiz = async (id) => {
        try {
            const response = await apiClient.delete(`/course/admin-delete-quiz/${id}`);
            if (response.status === statusCode.OK) {
                return true
            } else {
                throw new Error(response.data.message || "Failed to get quiz.");
            }
        } catch (error) {
            console.error("Error getting quiz:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const deleteModule = async (id) => {
        try {
            const response = await apiClient.delete(`/course/teacher-delete-module/${id}`);
            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || "Failed to delete module.");
            }
        } catch (error) {
            console.error("Error deleting module:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const studentFetchAssignments = async (userId) => {
        try {
            const response = await apiClient.get(`/course/student-get-assignments/${userId}`);
            if (response.status === statusCode.OK) {
                return response.data.assignments;
            } else {
                throw new Error(response.data.message || "Failed to fetch assignments.");
            }
        } catch (error) {
            throw new Error("Error fetching assignments: " + error.message);
        }
    }

    const submitAssignment = async (assignmentId, userId, token, file) => {
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("studentId", userId);

        try {
            const response = await apiClient.post(`/course/submit-assignment/${assignmentId}`, formData);
            if (response.status === statusCode.OK) {
                return { success: true, message: "Assignment uploaded successfully" };
            } else {
                throw new Error(response.data.message || "Failed to upload assignment.");
            }
        } catch (error) {
            throw new Error("Error submitting assignment: " + error.message);
        }
    }

    const fetchCourses = async (userId, { page = 1, limit = 4, search = "", modulesFilter = "" }) => {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: search,
                modulesFilter: modulesFilter,
            });
    
            const response = await apiClient.get(`/course/home-get-courses/${userId}?${queryParams.toString()}`);
    
            if (response.status === statusCode.OK) {
                return {
                    courses: response.data.courses || [],
                    totalPages: response.data.totalPages || 1,
                };
            } else {
                throw new Error("Failed to fetch courses.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching courses.");
        }
    };
    

    const studentFetchQuizzes = async (userId) => {
        try {
            const response = await apiClient.get(`/course/student-get-quizzes/${userId}`);
            if (response.status === statusCode.OK) {
                return response.data.quizzes || [];
            } else {
                throw new Error(response.data.message || "Failed to fetch quizzes.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching quizzes.");
        }
    }

    const submitQuiz = async (userId, quizId, score) => {
        const submissionData = {
            userId,
            quizId,
            score,
        };

        try {
            const response = await apiClient.post('/course/student-submit-quiz', submissionData);

            if (response.status === statusCode.OK) {
                return true;
            } else {
                throw new Error(response.data.message || "Failed to submit quiz.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error submitting quiz.");
        }
    };

    const getCourseDetails = async (courseId) => {
        try {
            const response = await apiClient.get(`/course/get-course/${courseId}`);

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error("Failed to fetch course details.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching course details.");
        }
    }

    const enrollCourse = async (studentId, courseId) => {
        try {
            const response = await apiClient.post(`/course/student-enroll`, { studentId, courseId });

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error("Failed to enroll in course.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error enrolling in course.");
        }
    }

    const studentGetClasses = async (userId) => {
        try {
            const response = await apiClient.get(`/course/student-get-classes/${userId}`);

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Failed to fetch classes");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching classes");
        }
    }

    const fetchEnrolledCourses = async (userId) => {
        try {
            const response = await apiClient.get(`/course/enrolled-courses/${userId}`);

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Failed to fetch enrolled courses");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching enrolled courses");
        }
    }

    const createAssignment = async (assignmentData) => {
        try {
            const response = await apiClient.post(`/course/create-assignment`, assignmentData);

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Failed to create assignment.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error occurred while creating the assignment.");
        }
    }

    const createCourse = async (courseData) => {
        try {
            const response = await apiClient.post(`/course/create`, courseData);

            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error("Failed to create course.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error occurred while creating the course.");
        }
    };

    const addModule = async (moduleData) => {
        try {
            const response = await apiClient.post(`/course/teacher-add-module`, moduleData);

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error("Failed to add module.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error occurred while adding the module.");
        }
    }

    const addClass = async (classData) => {
        try {
            const response = await apiClient.post(`/course/add-class`, classData);

            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || "Failed to add the class.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Server error, please try again later.");
        }
    };

    const addModuleL = async (formData, onUploadProgress) => {
        try {
            const response = await apiClient.post(`/course/teacher-add-module`, formData, {
                onUploadProgress,
            });

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Failed to add module.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error uploading files. Please try again.");
        }
    }

    const createQuiz = async (quizData) => {
        try {
            const response = await apiClient.post(`/course/add-quiz`, quizData);
            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || "Error occurred while creating the quiz.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Server error. Please try again.");
        }
    };

    const getCourses = async () => {
        try {
            const response = await apiClient.get(`/course/get-courses`);

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Failed to fetch courses");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching courses");
        }
    }

    const fetchAssignments = async (id) => {
        try {
            const response = await apiClient.get(`/course/get-assignments/${id}`);

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Failed to fetch assignments");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching assignments");
        }
    }

    const deleteAssignment = async (id) => {
        try {
            const response = await apiClient.delete(`/course/teacher-delete-assignment/${id}`);
            if (response.status === statusCode.OK) {
                return true
            } else {
                throw new Error(response.data.message || "Failed to delete assignment.");
            }
        } catch (error) {
            console.error("Error deleting assignment:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const getAssignmentSubmission = async (id) => {
        try {
            const response = await apiClient.get(`/course/get-assignment-submissions/${id}`);

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Failed to fetch assignments");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching assignments");
        }
    }

    const createNotification = async (message, courseId, userId) => {
        try {
            const response = await apiClient.post(`/course/send-notification`, {
                message,
                courseId,
                userId
            });
            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || "Error occurred while creating the notification.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Server error. Please try again.");
        }
    };

    const createEmailNotification = async (message, courseId) => {
        try {
            const response = await apiClient.post(`/course/send-email-notification`, {
                message,
                courseId
            });

            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || "Error occurred while creating the email notification.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Server error. Please try again.");
        }
    }

    const updateAssignment = async (assignmentId, assignmentData) => {
        try {
            const response = await apiClient.put(`/course/teacher-edit-assignment/${assignmentId}`, assignmentData);
            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Failed to update assignment.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Server error. Please try again later.");
        }
    }

    const updateClass = async (classId, classData) => {
        try {
            const response = await apiClient.put(`/course/teacher-edit-class/${classId}`, classData);
            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || "Failed to update class.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Server error. Please try again later.");
        }
    }

    const updateCourse = async (courseId, courseData) => {
        try {
            const response = await apiClient.put(`/course/teacher-edit-course/${courseId}`, courseData);
            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || "Failed to update the course.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Server error. Please try again later.");
        }
    }

    const fetchModuleData = async (moduleId) => {
        try {
            const response = await apiClient.get(`/course/get-module-data/${moduleId}`);
            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || "Failed to fetch module data.");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Server error. Please try again later.");
        }
    }

    const updateModule = async (moduleId, formData, onUploadProgress) => {
        try {
            const response = await apiClient.put(`/course/teacher-edit-module/${moduleId}`,
                formData,
                { onUploadProgress }
            );

            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || "Failed to update the module");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Server error. Please try again.");
        }
    }

    const getQuizDetails = async (quizId) => {
        try {
            const response = await apiClient.get(`/course/get-quiz/${quizId}`);
            if (response.status === statusCode.OK) {
                return response.data.quiz; 
            } else {
                throw new Error(response.data.message || "Failed to load quiz details");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error loading quiz details");
        }
    }

    const updateQuiz = async (quizId, quizData) => {
    try {
        const response = await apiClient.put(`/course/teacher-edit-quiz/${quizId}`, quizData);
        if (response.status === statusCode.OK) {
            return response.data
        } else {
            throw new Error(response.data.message || "Error occurred while updating the quiz.");
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || "Server error. Please try again.");
    }
};

const savePeerId = async (classId, peerId) => {
    try {
        const response = await apiClient.put(`/course/add-peerid/${classId}`, { peerId });
        if (response.status === statusCode.OK) {
            console.log("Peer ID saved successfully");
        } else {
            throw new Error("Failed to save Peer ID");
        }
    } catch (error) {
        console.error("Error saving Peer ID:", error.message || error);
        throw error;
    }
}

const updateClassStatus = async (classId) => {
    try {
        const response = await apiClient.put(`/course/update-class-status/${classId}`);
        if (response.status === statusCode.OK) {
            console.log("Class status updated");
        } else {
            throw new Error("Failed to update class status");
        }
    } catch (error) {
        console.error("Failed to update class status:", error.message || error);
        throw error;
    }
}

const getClasses = async (courseId) => {
    try {
        const response = await apiClient.get(`/course/teacher-get-classes/${courseId}`);
        if (response.status === statusCode.OK) {
            return response.data.classes;
        } else {
            throw new Error("No live classes found or failed to fetch!");
        }
    } catch (err) {
        console.error("Error fetching classes:", err.message || err);
        throw err;
    }
}

const deleteClass = async (classId) => {
    try {
        const response = await apiClient.delete(`/course/teacher-delete-class/${classId}`);
        if (response.status === statusCode.OK) {
            return response.data.message;
        } else {
            throw new Error("Failed to delete the class!");
        }
    } catch (err) {
        console.error("Error deleting class:", err.message || err);
        throw err;
    }
}

const fetchQuizzes = async (courseId) => {
    try {
        const response = await apiClient.get(`/course/get-quizzes/${courseId}`);
        if (response.status === statusCode.OK) {
            return {
                quizzes: response.data.quizzes,
                courseName: response.data.courseName,
            };
        } else {
            throw new Error(response.data.message || "Failed to fetch quizzes");
        }
    } catch (error) {
        console.error("Error fetching quizzes:", error.message || error);
        throw error;
    }
}

const deleteQuiz = async (quizId) => {
    try {
        const response = await apiClient.delete(`/course/teacher-delete-quiz/${quizId}`);
        if (response.status === statusCode.OK) {
            return response.data.message;
        } else {
            throw new Error("Failed to delete quiz");
        }
    } catch (error) {
        console.error("Error deleting quiz:", error.message || error);
        throw error;
    }
}

const fetchQuizSubmissions = async (quizId) => {
    try {
        const response = await apiClient.get(`/course/get-quiz-submissions/${quizId}`);
        if (response.status === 200) {
            return response.data.submissions;
        } else {
            throw new Error("Failed to fetch submissions");
        }
    } catch (error) {
        console.error("Error fetching quiz submissions:", error.message || error);
        throw error;
    }
};



    return {
        adminFetchCourses, deleteCourse,
        adminFetchAssignments, adminDeleteAssignment,
        adminFetchQuizzes, adminDeleteQuiz, adminFetchCourse,
        deleteModule, studentFetchAssignments, submitAssignment,
        fetchCourses, studentFetchQuizzes, submitQuiz,
        getCourseDetails, enrollCourse, studentGetClasses,
        fetchEnrolledCourses, createAssignment, createCourse,
        addModule, addClass, addModuleL, createQuiz, getCourses,
        fetchAssignments, deleteAssignment, getAssignmentSubmission,
        createNotification, createEmailNotification, updateAssignment,
        updateClass, updateCourse, fetchModuleData, updateModule,
        getQuizDetails, updateQuiz, savePeerId, updateClassStatus,
        getClasses, deleteClass, fetchQuizzes, deleteQuiz, 
        fetchQuizSubmissions, 
    }
}