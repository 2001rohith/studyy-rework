import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserService } from '../../utils/userService'
import { useUser } from "../../UserContext"
import API_URL from '../../axiourl';



function Login() {
    const { handleLogin } = useUserService()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { user, login } = useUser();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin-home', { replace: true });
            } else if (user.role === 'teacher') {
                navigate('/teacher-home', { replace: true });
            } else {
                navigate('/student-home', { replace: true });
            }
        }
    }, [user, navigate]);

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            if (!email && !password) {
                setMessage('Enter the details');
                return;
            }
            if (email.length < 2) {
                setMessage('Too short for email');
                return;
            }
            if (password.length < 6) {
                setMessage('Too short for password');
                return;
            }

            const data = await handleLogin(email, password); 
            if (!data || !data.user || !data.token) {
                setMessage(data.message || "Login failed!");
            }
            setMessage(data.message || "Login successful!");
            login(data.user, data.token)
            if (data.user.role === 'admin') {
                navigate('/admin-home', { state: { user: data.user }, replace: true });
            } else if (data.user.role === 'teacher') {
                navigate('/teacher-home', { state: { user: data.user }, replace: true });
            } else {
                navigate('/student-home', { state: { user: data.user }, replace: true });
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    const googleLogin = () => {
        window.location.href = `${API_URL}/user/auth/google`
    };

    return (
        <>
            <div className='wrapper'>
                <div className='container login-boxx'>
                    <div className='login-items'>
                        <h2 className="login-title">Studyy</h2>
                        <h5 className='heading'>Welcome Back!</h5>
                        <div className='input'>
                            {message && (
                                <div className="alert alert-danger" role="alert">
                                    {message}
                                </div>
                            )}
                            <form>
                                <input
                                    className='form-control text-start text-dark input'
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    name='email'
                                    placeholder='Enter Email'
                                />
                                <input
                                    className='form-control text-dark input'
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    name='password'
                                    placeholder='Enter Password'
                                />
                                <button className='btn btn-primary sign-in-button my-1' onClick={handlesubmit}>
                                    Sign In
                                </button>
                            </form>
                            <div className='mt-3 text-center other-options'>
                                <span className='sign-in-up-link'>
                                    <Link to={"/forgot-password"}>Forgot password?</Link>
                                </span>
                                <button className='btn text-light mb-2' onClick={googleLogin}>
                                    <i className="fa-brands fa-google"></i> Google
                                </button>
                                <div className='d-flex'>
                                    <span className='signup-link'>New User?</span>
                                    <span className='sign-in-up-link ms-1'>
                                        <Link to={"/signup"}>Sign Up</Link>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;