import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApiClient } from "../../utils/apiClient"
import API_URL from '../../axiourl';

function SignUp() {
    const apiClient = useApiClient()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState("")
    const [password, SetPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handlesubmit = async (e) => {
        e.preventDefault();
        console.log("name:", name)
        console.log("email:", email)
        console.log("password:", password)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedPhone = phone.trim()

        try {
            if (!trimmedName) {
                setMessage("Enter the name")
                return
            }
            if (trimmedName.length < 2) {
                setMessage("Too short for name")
                return
            }
            if (!trimmedEmail) {
                setMessage("Enter the name")
                return
            }
            if (trimmedEmail.length < 2) {
                setMessage("Too short for email")
                return
            }
            if (!trimmedPassword) {
                setMessage("Enter the name")
                return
            }
            if (!passwordRegex.test(trimmedPassword)) {
                setMessage("Password must be at least 6 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number")
                return
            }
            if (!phoneRegex.test(trimmedPhone)) {
                setMessage("Phone number is not valid")
                return
            }

            const response = await apiClient.post('/user/signup', {
                name: trimmedName,
                email: trimmedEmail,
                phone: trimmedPhone,
                password: trimmedPassword,
            });

            const data = response.data;
            setMessage(data.message)
            console.log("status :", data.status)
            console.log("message :", data.message)
            if (response.status === 200) {
                navigate("/otp", { state: { trimmedPhone,trimmedEmail } })
            }

            console.log("signup-response", data);
        } catch (error) {
            console.error("Error during signup:", error);
        }
    };

    const googleAuth = () => {
        window.location.href = `${API_URL}/user/auth/google`;
    };

    return (
        <>
            <div className='wrapper'>
                <div className='container login-boxx'>
                    <div className='login-items'>
                        <h2 className="login-title">Studyy</h2>
                        <h5 className='heading'>Get started!</h5>
                        <div className='input'>
                            <h6 className='warning-text text-center'>{message}</h6>
                            <form className='form'>
                                <input className='form-control text-start text-dark' onChange={(e) => setName(e.target.value)} type="text" name='name' placeholder='Enter Name' />
                                <input className='form-control text-start text-dark' onChange={(e) => setEmail(e.target.value)} type="email" name='email' placeholder='Enter Email' />
                                <input className='form-control text-start text-dark' onChange={(e) => setPhone(e.target.value)} type="number" name='phone' placeholder='Enter Phone number' />
                                <input className='form-control text-dark' onChange={(e) => SetPassword(e.target.value)} type="password" name='password' placeholder='Enter Password' />
                                <button className='btn btn-primary sign-in-button my-1' onClick={handlesubmit}>Sign Up</button>
                            </form>
                            <div className='mt-3 text-center other-options'>
                                <button className='btn google-button text-light mb-2' onClick={googleAuth}><i className="fa-brands fa-google"></i> Google</button>
                                <span>Already have account?</span>
                                <span className='sign-in-up-link'><Link to={"/"} >Login</Link></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp