import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiClient } from "../../utils/apiClient"


function ResetPassword() {
    const apiClient = useApiClient()
    const { token } = useParams();
    const [message, setMessage] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post(`/user/reset-password/${token}`, {
                password,
                confirmPassword,
            });

            const data = response.data;
            if (response.status === 200) {
                setMessage(data.message);
                alert(data.message);
            } else {
                setMessage(data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setMessage("Error resetting password, please try again.");
        }
    };

    return (
        <div className='wrapper'>
            <div className='container login-boxx'>
                <div className='login-items'>
                    <h2 className='heading'>Reset password</h2>
                    <h6>Enter new password</h6>
                    <div className='input'>
                        <h6 className='warning-text text-center'>{message}</h6>

                        <form onSubmit={handleSubmit}>
                            <input
                                className='form-control text-start text-dark'
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                name='password'
                                placeholder='Enter new password'
                                required
                            />
                            <input
                                className='form-control text-start text-dark'
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                name='confirmPassword'
                                placeholder='Confirm password'
                                required
                            />
                            <button className='btn btn-primary sign-in-button my-1' type="submit">Reset</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
