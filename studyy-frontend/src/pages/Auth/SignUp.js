import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserService } from '../../utils/userService'
import API_URL from '../../axiourl';
import { signupValidation } from "../../utils/signupValidation"

function SignUp() {
  const { handleSignup } = useUserService()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState("")
  const [password, SetPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("name:", name);
    console.log("email:", email);
    console.log("password:", password);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedPhone = phone.trim();

    const validationErrors = signupValidation(trimmedName, trimmedEmail, trimmedPhone, trimmedPassword)

    if (Object.keys(validationErrors).length > 0) {
      setMessage(Object.values(validationErrors).join(", "));
      return;
    }

    try {
      const response = await handleSignup(trimmedName, trimmedEmail, trimmedPhone, trimmedPassword);
      setMessage(response.data.message);
      console.log("status:", response.data.status);
      console.log("message:", response.data.message);
      navigate("/otp", { state: { trimmedPhone, trimmedEmail } });
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage(error.message || 'Something went wrong during signup.');
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
                <button className='btn btn-primary sign-in-button my-1' onClick={handleSubmit}>Sign Up</button>
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