import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApiClient } from "../../utils/apiClient"

function Otp() {
    const apiClient = useApiClient()
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('OTP has been sent via SMS!');
    const [timer, setTimer] = useState(120);
    const [isResendDisabled, setResendDisabled] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const phone = location.state?.trimmedPhone;
    const email = location.state?.trimmedEmail;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            if (!otp) {
                setMessage("Enter the OTP");
                return;
            }
            if (otp.length < 6) {
                setMessage("Too short for OTP");
                return;
            }
    
            const response = await apiClient.post('/user/verify-otp', { email, phone, otp });
            const data = response.data;
            setMessage(data.message)
            if (response.status === 200) {
                const token = data.token;
                navigate("/select-role", { state: { email, token } });
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || "An error occurred while verifying OTP");
            } else {
                setMessage("Network error or server not reachable");
            }
            console.error("Error during OTP verification:", error);
        }
    };
    

    useEffect(() => {
        let countdown = null;
        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            setResendDisabled(false);
        }

        return () => clearInterval(countdown);
    }, [timer]);

    const handleResendOtp = async () => {
        try {
            setResendDisabled(true);
            setTimer(120);

            const response = await apiClient.post('/user/resend-otp', { email });
            const data = response.data;
            setMessage(data.message);
        } catch (error) {
            console.error("Error during resending OTP:", error);
        }
    };

    return (
        <div className='wrapper'>
            <div className='container login-boxx'>
                <div className='login-items'>
                    <h2 className='heading'>Verify OTP</h2>
                    <div className='input'>
                        <h6 className='warning-text text-center'>{message}</h6>
                        <form className='form'>
                            <input
                                className='form-control text-start text-dark'
                                onChange={(e) => setOtp(e.target.value)}
                                type="text"
                                name='otp'
                                placeholder='Enter OTP'
                            />
                            <button className='btn btn-primary sign-in-button my-1' onClick={handleSubmit}>
                                Verify
                            </button>
                        </form>
                    </div>
                    {timer > 0 ? (
                        <p>Resend OTP in {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)} minutes</p>
                    ) : (
                        <p>OTP expired, you can resend it now.</p>
                    )}
                    <button
                        className='btn btn-secondary my-1'
                        onClick={handleResendOtp}
                        disabled={isResendDisabled}
                    >
                        Resend
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Otp;
