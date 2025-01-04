import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from "socket.io-client"

const socket = io("http://localhost:8000")

function StudentSidebar() {
    const navigate = useNavigate();
    const [notificationModal, setNotificationModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/course/get-notifications/${user.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            const data = await response.json();
            if (response.ok) {
                setNotifications(data.notifications);
                const unreadExists = data.notifications.some((notification) => !notification.isRead);
                setHasUnread(unreadExists);
            } else {
                console.log('Error fetching notifications:', data.message);
            }
        } catch (error) {
            console.log('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markNotificationsAsRead = async () => {
        try {
            const unreadIds = notifications
                .filter((notification) => !notification.isRead)
                .map((notification) => notification._id);

            if (unreadIds.length > 0) {
                await fetch(`http://localhost:8000/course/mark-notifications-as-read`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        notificationIds: unreadIds,
                        studentId: user.id
                    }),
                });

                setNotifications((prev) =>
                    prev.map((notification) => ({
                        ...notification,
                        isRead: true,
                    }))
                );
                setHasUnread(false);
            }
        } catch (error) {
            console.log('Error marking notifications as read:', error);
        }
    };

    const showNotificationModal = () => {
        setNotificationModal(true);
        markNotificationsAsRead();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate("/", { replace: true });
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="sidebar">
            <h4 className="sidebar-title mb-4">studyy</h4>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/student-home" className="sidebar-item">Home</Link>
                </li>
                <li>
                    <Link to="/student-view-courses" className="sidebar-item">Courses</Link>
                </li>
                <li>
                    <Link to="/student-enrolled-courses" className="sidebar-item">My courses</Link>
                </li>
                <li>
                    <Link to="/student-view-assignments" className="sidebar-item">Assignments</Link>
                </li>
                <li>
                    <Link to="/student-view-quizzes" className="sidebar-item">Quizzes</Link>
                </li>
                <li>
                    <Link to="/student-view-classes" className="sidebar-item">Live Classes</Link>
                </li>
                <li>
                    <a href="#!" onClick={showNotificationModal} className="sidebar-item">
                        Notifications
                        {hasUnread && <span className="red-dot"></span>}
                    </a>
                </li>
                <li>
                    <Link to="/student-view-profile" className="sidebar-item">Profile</Link>
                </li>
            </ul>
            <div className="sidebar-footer ms-3">
                <span onClick={() => setShowModal(true)} className="logout-link text-light mt-4" style={{ cursor: 'pointer' }}>Log out</span>
            </div>

            {/* Modal for Notifications */}
            {notificationModal && (
                <div className="modal show d-block text-dark" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Notifications</h5>
                                <button type="button" className="btn-close" onClick={() => setNotificationModal(false)}></button>
                            </div>
                            <div className="modal-body noti-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {loading ? (
                                    <p>Loading notifications...</p>
                                ) : notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div key={notification._id} className="notification-item">
                                            <p><strong>{notification.course.title}:</strong> {notification.message}</p>
                                            <small className='noti-time'>{new Date(notification.dateSent).toLocaleString()}</small>
                                        </div>
                                    ))
                                ) : (
                                    <p>No notifications available</p>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn table-button" onClick={() => setNotificationModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
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
                                <button type="button" className="btn table-button logout-button" onClick={() => { handleLogout(); setShowModal(false); }}>Logout</button>
                                <button type="button" className="btn table-button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentSidebar;
