import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from "socket.io-client"
import { useApiClient } from "../../utils/apiClient"
import { useUser } from "../../UserContext"
import API_URL from '../../axiourl';

const socket = io(`${API_URL}`)

function StudentSidebar() {
    const apiClient = useApiClient()
    const navigate = useNavigate();
    const [notificationModal, setNotificationModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const { user, logout,token} = useUser();

    useEffect(() => {
        socket.emit('joinStudent', { studentId: user.id });

        socket.on('newNotification', ({ courseId }) => {
            console.log(`New notification for course: ${courseId}`);
            fetchNotifications()
            setHasUnread(true);
        });
        // fetchNotifications()

        return () => {
            socket.off('newNotification');
            socket.disconnect();
        };
    }, [user.id])

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/course/get-notifications/${user.id}`);

            const data = response.data;
            if (response.status === 200) {
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

                const response = await apiClient.post(`/course/mark-notifications-as-read`, {
                    notificationIds: unreadIds,
                    studentId: user.id
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
        markNotificationsAsRead();
        fetchNotifications()
        setNotificationModal(true);
        setHasUnread(false)
    };
    const closeModal = () => {
        setNotificationModal(false)
        markNotificationsAsRead()
    }

    const handleLogout = () => {
        logout()
        navigate("/", { replace: true });
        window.history.pushState(null, '', '/');
        window.onpopstate = function(event) {
            window.history.pushState(null, '', '/');
        };
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
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => closeModal()}
                                ></button>
                            </div>
                            <div
                                className="modal-body assignment-body"
                                style={{ maxHeight: '400px', overflowY: 'auto' }}
                            >
                                {loading ? (
                                    <p>Loading notifications...</p>
                                ) : notifications.length > 0 ? (
                                    notifications.map((notification) => (

                                        <div
                                            key={notification._id}
                                            className="card mb-3 shadow-sm "
                                        >
                                            <div className="card-body">
                                                <h6 className="card-title noti-title">
                                                    {notification.course.title}
                                                </h6>
                                                <div className="d-flex justify-content-between">
                                                    <small className="card-text noti-message text-secondary">{notification.message}</small>
                                                    <small className="text-muted small mb-0 noti-time">
                                                        {new Date(notification.dateSent).toLocaleString()}
                                                    </small>
                                                </div>

                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No notifications available</p>
                                )}
                            </div>
                            {/* <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn table-button"
                                    onClick={() => setNotificationModal(false)}
                                >
                                    Close
                                </button>
                            </div> */}
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
