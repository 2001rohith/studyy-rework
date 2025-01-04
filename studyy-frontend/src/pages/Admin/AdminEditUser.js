// import React, { useState } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'


// function AdminEditUser() {
//     const navigate = useNavigate()
//     const location = useLocation()
//     const user = location.state?.user

//     const [name, setName] = useState(user.name || "")
//     const [email, setEmail] = useState(user.email || "")
//     const [role, setRole] = useState(user.role || "")
//     const token = localStorage.getItem("token")
//     console.log("token from edit user:", token)

//     const handlesubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`http://localhost:8000/user/admin-update-user/${user._id}`, {
//                 method: 'PUT',
//                 crossDomain: true,
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     name,
//                     email,
//                     role
//                 }),
//             });
//             if (response.ok) {
//                 navigate("/admin-home")
//             } else {
//                 alert("failed to update user")
//             }
//         } catch (error) {
//             console.error("Error during update:", error);
//         }
//     };

//     return (
//         <>
//             <div className='wrapper'>
//                 <div className='container login-boxx'>
//                     <div className='login-items'>
//                         <h2 className='heading'>Edit User</h2>
//                         <div className='input'>
//                             <form className='form' onSubmit={handlesubmit}>
//                                 <input className='form-control text-start text-secondary' value={name} onChange={(e) => setName(e.target.value)} type="text" name='name' />
//                                 <input className='form-control text-start text-secondary' value={email} onChange={(e) => setEmail(e.target.value)} type="email" name='email' />
//                                 <div className="dropdown">
//                                     <button
//                                         className="btn btn-secondary dropdown-toggle"
//                                         type="button"
//                                         id="dropdownMenuButton"
//                                         data-bs-toggle="dropdown"
//                                         aria-expanded="false"
//                                     >
//                                         {role ? role : "Select Role"}
//                                     </button>
//                                     <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
//                                         <li>
//                                             <button className="dropdown-item" type="button" onClick={() => setRole('student')}>
//                                                 Student
//                                             </button>
//                                         </li>
//                                         <li>
//                                             <button className="dropdown-item" type="button" onClick={() => setRole('teacher')}>
//                                                 Teacher
//                                             </button>
//                                         </li>
//                                     </ul>
//                                 </div>
//                                 <button className='btn btn-primary sign-in-button my-1' type="submit">Submit</button>
//                             </form>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default AdminEditUser