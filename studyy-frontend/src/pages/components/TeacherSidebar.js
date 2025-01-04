import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "../../UserContext"

function TeacherSidebar() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout } = useUser();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const showConfirmation = () => {
        setShowModal(true);
    };

    const handleLogout = () => {
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        logout()
        navigate("/", { replace: true });
        window.history.pushState(null, '', '/');
        window.onpopstate = function(event) {
            window.history.pushState(null, '', '/');
        };
    };

    return (
        <>
            <button 
                className="toggle-button" 
                onClick={toggleSidebar} 
                style={{
                    position: 'fixed',
                    top: '15px',
                    left: isSidebarOpen ? '10px' : '2px',
                    zIndex: 1000,
                    backgroundColor: '#112A46',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 15px',
                    cursor: 'pointer',
                    transition: 'left 0.4s ease',
                    borderRadius:"0px 10px 10px 0px"
                }}
            >
                {isSidebarOpen ? <i className="fa-solid fa-chevron-left"></i> : <i className="fa-solid fa-chevron-right"></i>}</button>

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <h4 className="sidebar-title mb-4">studyy</h4>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="/teacher-home" className="sidebar-item">Home</Link>
                    </li>
                    <li>
                        <Link to="/teacher-view-courses" className="sidebar-item">Courses</Link>
                    </li>
                    <li>
                        <Link to="/teacher-view-assignment-courses" className="sidebar-item">Assignments</Link>
                    </li>
                    <li>
                        <Link to="/teacher-view-quiz-courses" className="sidebar-item">Quizzes</Link>
                    </li>
                    <li>
                        <Link to="/teacher-view-class-course" className="sidebar-item">Live classes</Link>
                    </li>
                    <li>
                        <Link to="/teacher-view-profile" className="sidebar-item">Profile</Link>
                    </li>
                </ul>
                <div className="sidebar-footer ms-3">
                    <span onClick={showConfirmation} className="logout-link text-light mt-4" style={{ cursor: 'pointer' }}>Log out</span>
                </div>
            </div>
            {showModal && (
                    <div className="modal show d-block logout-modal" tabIndex="-1">
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
        </>
    );
}

export default TeacherSidebar;
