import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "../../UserContext"

function Sidebar() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false)
    const { user, logout } = useUser();

    // const showConfirmation = () => {
    //     setShowModal(true)
    // }

    // const handleLogout = () => {
    //     logout()
    //     navigate("/", { replace: true });
    //     window.history.pushState(null, '', '/');
    //     window.onpopstate = function (event) {
    //         window.history.pushState(null, '', '/');
    //     }
    //     window.location.reload();
    // }
    const handleLogout = () => {
        logout();
        window.localStorage.clear();
        window.history.pushState(null, '', '/');
        window.location.replace('/');
    }

    return (
        <div className="sidebar">
            <h4 className="sidebar-title mb-4">studdy</h4>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/admin-home" className="sidebar-item">Users</Link>
                </li>
                <li>
                    <Link to="/admin-teachers" className="sidebar-item">Teachers</Link>
                </li>
                <li>
                    <Link to="/admin-courses" className="sidebar-item">Courses</Link>
                </li>
                <li>
                    <Link to="/admin-assignments" className="sidebar-item">Assignments</Link>
                </li>
                <li>
                    <Link to="/admin-quizzes" className="sidebar-item">Quizzes</Link>
                </li>
            </ul>
            <div className="sidebar-footer1 ms-3">
                <span onClick={()=>setShowModal(true)} className="logout-link text-light mt-1" style={{ cursor: 'pointer' }}>Log out</span>
            </div>
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Logout</h5>
                            </div>
                            <div className="modal-body text-dark">
                                <p>Are you sure you want to logout?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn table-button logout-button" onClick={() => { handleLogout(); setShowModal(false) }}>Logout</button>
                                <button type="button" className="btn table-button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;