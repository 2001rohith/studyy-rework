import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from "../../UserContext";
import axios from 'axios';
import API_URL from '../../axiourl';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});


function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useUser();

    useEffect(() => {
        const fetchUserAndRedirect = async () => {
            try {
                const token = searchParams.get('token');

                if (!token) {
                    console.error('No token found');
                    navigate('/', { replace: true });
                    return;
                }

                const response = await apiClient.get('/user/get-user-info', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userData = response.data.user;

                // Save user data and token in context
                login(userData, token);

                // Redirect based on role
                if (userData.role === 'teacher') {
                    navigate('/teacher-home', { replace: true });
                } else if (userData.role === 'student') {
                    navigate('/student-home', { replace: true });
                } else {
                    navigate('/select-role', { state: { token }, replace: true });
                }
            } catch (error) {
                console.error('Error in auth callback:', error);
                navigate('/', { replace: true });
            }
        };

        fetchUserAndRedirect();
    }, [searchParams, navigate, login, apiClient]);

    return (
        <div className="spinner-border text-primary spinner2" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );
}

export default AuthCallback;