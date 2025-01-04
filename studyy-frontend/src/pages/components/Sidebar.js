import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false)

    const showConfirmation = () => {
        setShowModal(true)
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate("/", { replace: true });
    };

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
                <span onClick={showConfirmation} className="logout-link text-light mt-1" style={{ cursor: 'pointer' }}>Log out</span>
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

