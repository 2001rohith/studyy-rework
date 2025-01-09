import { useApiClient } from "./apiClient";
import statusCode from "./statusCode";

export const useUserService = () => {
    const apiClient = useApiClient()

    const adminFetchUsers = async () => {
        try {
            const response = await apiClient.get('/user/get-users');
            if (response.status === statusCode.OK) {
                return response.data.users || []
            } else {
                throw new Error(response.data.message || "Error getiing users")
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const adminDeleteUser = async (id) => {
        try {
            const response = await apiClient.delete(`/user/admin-delete-user/${id}`);
            if (response.status === statusCode.OK) {
                return true
            } else {
                throw new Error(response.data.message || "Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const adminBloackUser = async (id) => {
        try {
            const response = await apiClient.put(`/user/admin-block-user/${id}`);
            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || "Failed to block user.");
            }
        } catch (error) {
            console.error("Error blocking user:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const adminFetchTeachers = async () => {
        try {
            const response = await apiClient.get('/user/get-teachers');
            if (response.status === statusCode.OK) {
                return response.data.users || []
            } else {
                throw new Error(response.data.message || "Error getiing teachers")
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const adminVerifyTeacher = async (id) => {
        try {
            const response = await apiClient.put(`/user/admin-verify-teacher/${id}`);
            if (response.status === statusCode.OK) {
                return true
            } else {
                throw new Error(response.data.message || "Failed to verify teacher.");
            }
        } catch (error) {
            console.error("Error verification teacher:", error);
            throw new Error("Server error. Please try again later.");
        }
    }

    const forgotPassword = async (email) => {
        try {
            const response = await apiClient.post("/user/forgot-password", { email })
            if (response.status === statusCode.OK) {
                return response.data
            }
        } catch (error) {
            console.error("Error on forgetpassword:", error);
        }
    }

    const handleLogin = async (email, password) => {
        try {
            const response = await apiClient.post('/user/login', { email, password });
            return response.data
        } catch (error) {
            console.error("Error on forgetpassword:", error);
        }
    }

    const verifyOTP = async (email, phone, otp) => {
        try {
            const response = await apiClient.post('/user/verify-otp', { email, phone, otp });
            return response.data
        } catch (error) {
            console.error("Error on forgetpassword:", error);
        }
    }

    const resendOTP = async (email) => {
        try {
            const response = await apiClient.post('/user/resend-otp', { email });
            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error("Error resending otp")
            }
        } catch (error) {
            console.error("Error on forgetpassword:", error);
        }
    }

    const ResetPassword = async (token, password, confirmPassword) => {
        try {
            const response = await apiClient.post(`/user/reset-password/${token}`, {
                password,
                confirmPassword,
            });
            return response.data
        } catch (error) {
            console.error("Error resetting password", error);
            throw new Error("Error resending otp")
        }
    }

    const roleSelection = async (role, certificate) => {
        try {
            const formData = new FormData();
            formData.append('role', role);
            if (certificate) {
                formData.append('certificate', certificate);
            }

            const response = await apiClient.post('/user/select-role', formData);

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to select role.');
            }
        } catch (error) {
            console.error('Error during role selection API call:', error);
            throw error.response?.data?.message || 'Error during role selection, please try again.';
        }
    }

    const handleSignup = async (name, email, phone, password) => {
        try {
            const response = await apiClient.post('/user/signup', {
                name,
                email,
                phone,
                password,
            });

            if (response.status === statusCode.OK) {
                return response.data
            } else {
                throw new Error(response.data.message || 'Signup failed.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            throw error.response?.data?.message || 'Error during signup. Please try again.';
        }
    }

    const fetchProfileData = async (userId) => {
        try {
            const response = await apiClient.get(`/user/get-profile-data/${userId}`);

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Failed to fetch profile data");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching profile data");
        }
    }

    const updatePassword = async (userId, currentPassword, newPassword) => {
        try {
            const response = await apiClient.post(`/user/change-password/${userId}`, {
                currentPassword,
                newPassword,
            });

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Password change failed");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error changing password");
        }
    }

    const editProfileDetails = async (userId, name) => {
        try {
            const response = await apiClient.put(`/user/edit-profile/${userId}`, { name });

            if (response.status === statusCode.OK) {
                return response.data;
            } else {
                throw new Error(response.data.message || "Profile update failed");
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error updating profile");
        }
    };


    return {
        adminFetchUsers, adminDeleteUser,
        adminBloackUser, adminFetchTeachers,
        adminVerifyTeacher, forgotPassword,
        handleLogin, verifyOTP, resendOTP,
        ResetPassword, roleSelection, handleSignup,
        fetchProfileData, updatePassword, editProfileDetails,

    }
}