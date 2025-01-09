import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import { useUserService } from '../../utils/userService'
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext"


function StudentProfile() {
    const { fetchProfileData, updatePassword, editProfileDetails, } = useUserService()
    const { fetchEnrolledCourses } = useCourseService()
    const { user, updateUser, token } = useUser();
    const navigate = useNavigate()
    const [userId, setUserId] = useState(user.id)
    console.log("user id:", userId)
    const [loading, setLoading] = useState(true)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [message, setMessage] = useState('')
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [newCourses, setNewCourses] = useState([])
    const [error, setError] = useState(null)
    const [userData, setUserdata] = useState()

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const data = await fetchProfileData(user.id);
                setUserdata(data.user);
                setLoading(false);
            } catch (error) {
                setError(error.message || 'Server error, please try again later');
            }
        };

        getProfileData();
    }, [user]);



    const setPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("New password and confirm password mismatch!");
            return;
        }

        try {
            const data = await updatePassword(user.id, currentPassword, newPassword);
            setMessage(data.message);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                closeModal();
            }, 2000);
        } catch (error) {
            setMessage(error.message || 'Server error. Please try again later.');
        }
    };


    const editProfile = async (e) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            setMessage("Enter the name");
            return;
        }
        if (trimmedName.length < 2) {
            setMessage("Too short for name");
            return;
        }

        try {
            const data = await editProfileDetails(user.id, name);
            setMessage(data.message);

            if (data.status === 200) {
                updateUser(data.user);
                setName("");
                setTimeout(() => {
                    fetchProfileData();
                    closeEditModal();
                }, 1000);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage(error.message || 'Server error. Please try again later.');
        }
    };


    const setModal = () => setShowPasswordModal(!showPasswordModal)
    const setEditModal = () => {
        setName(user.name)
        // setEmail(user.email)
        setShowEditModal(!showEditModal)
    }
    const closeModal = () => {
        setShowPasswordModal(!showPasswordModal)
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage("")
    }
    const closeEditModal = () => {
        setShowEditModal(!showEditModal)
        setName('');
        // setEmail('');
        setMessage("")
    }

    const newCourse = async () => {
        try {
            const data = await fetchEnrolledCourses(userId);
            setNewCourses(data.courses);
        } catch (error) {
            console.error('Error in fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        newCourse()
    }, [])

    const viewCourse = (id) => {
        navigate("/student-view-course", { state: { courseId: id } })
    }

    if (loading) {
        return <div className="spinner-border text-primary spinner2" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    }
    return (
        <>
            <div className='row'>
                <div className='col text-light side-bar'>
                    <StudentSidebar />
                </div>
                <div className='col text-light'>
                    <div className='row headers'>
                        <h4>Profile</h4>
                    </div>
                    <div>
                        <div className='row student-profile-banner ms-5'>
                            {user ? (
                                <>
                                    <h2>{user.name}</h2>
                                    <p>{user.email}</p>
                                </>
                            ) : (
                                <p>No user found</p>
                            )}
                            <div className='d-flex'>
                                <button className='btn table-button mx-1' onClick={setEditModal} style={{ borderRadius: "10px" }}>Edit</button>
                                <button className='btn table-button mx-1' onClick={setModal} style={{ borderRadius: "10px" }}>Change Password</button>
                            </div>
                        </div>
                        <div className="row mt-3 text-dark profile-course">
                            <h5 className='mb-2 mt-2'>Enrolled Courses</h5>
                            {!newCourses ? (
                                <p>You have no enrolled courses</p>
                            ) : (
                                newCourses.map((course) => (
                                    <div className="card course-card mx-2" style={{ width: '20rem', height: "25rem" }} key={course._id}>
                                        <img src="/banner7.jpg" className="card-img-top" alt="..." style={{ height: '200px', objectFit: 'cover', borderRadius: "15px" }} />
                                        <div className="card-body">
                                            <h5 className="card-title">{course.title}</h5>
                                            <small className="card-text mb-1">{course.description}</small>
                                            <div className='text-center'>
                                                <button className="btn table-button mt-5" onClick={() => viewCourse(course._id)}>View</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>
                    </div>
                </div>
            </div>
            {showPasswordModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change Password</h5>

                            </div>
                            <div className="modal-body">
                                <form onSubmit={setPassword}>
                                    {message && <div className="alert alert-info">{message}</div>}
                                    <div className="form-group mb-3">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn table-button" onClick={closeModal}>Cancel</button>
                                        <button type="submit" className="btn table-button">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit profile</h5>

                            </div>
                            <div className="modal-body">
                                <form onSubmit={editProfile}>
                                    {message && <div className="alert alert-info">{message}</div>}
                                    <div className="form-group mb-3">
                                        <label>Change Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn table-button" onClick={closeEditModal}>Cancel</button>
                                        <button type="submit" className="btn table-button">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default StudentProfile
