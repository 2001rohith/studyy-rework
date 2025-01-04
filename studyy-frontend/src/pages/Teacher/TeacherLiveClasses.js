import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherSidebar from '../components/TeacherSidebar';
import io from 'socket.io-client';
import { useApiClient } from "../../utils/apiClient";
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext";

const socket = io(`${API_URL}`);

function TeacherLiveClasses() {
    const apiClient = useApiClient();
    const navigate = useNavigate();
    const location = useLocation();
    const courseId = location.state?.id;
    const { user } = useUser();

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [classesPerPage] = useState(5);

    const fetchClasses = async () => {
        try {
            const response = await apiClient.get(`/course/teacher-get-classes/${courseId}`);
            const data = response.data;

            if (response.status === 200) {
                setClasses(data.classes);
            } else {
                setError('No live classes found or failed to fetch!');
            }
        } catch (err) {
            setError('Server error, please try again later');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await apiClient.delete(`/course/teacher-delete-class/${selectedClass._id}`);
            const data = response.data;

            if (response.status === 200) {
                setClasses(classes.filter(cls => cls._id !== selectedClass._id));
                setMessage(data.message);
            } else {
                setError('Failed to delete the class!');
            }
        } catch (err) {
            setError('Server error, please try again later');
        } finally {
            setShowModal(false);
            setShowToast(true);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        if (courseId) fetchClasses();
    }, [courseId, user]);

    const handleAddClass = () => {
        navigate("/add-live-class", { state: { id: courseId } });
    };

    const handleEdit = (cls) => {
        navigate("/edit-class", { state: { Class: cls, courseId } });
    };

    const handleStartClass = (classId, status) => {
        if (status === "Ended") {
            setMessage("Class ended!");
            setShowToast(true);
            return;
        }

        socket.emit('notificationAdded', {
            courseId: courseId,
            teacherId: user.id,
        });
        navigate(`/teacher-live-class`, { state: { classId, courseId } });
    };

    // Pagination Logic
    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    const currentClasses = classes.slice(indexOfFirstClass, indexOfLastClass);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className='row'>
                <div className='col text-light side-bar'>
                    <TeacherSidebar />
                </div>
                <div className='col text-light'>
                    <div className='row headers'>
                        <h4>Live Classes</h4>
                    </div>
                    <div className='row table-content'>
                        <button className='btn regular-button mt-3 mb-3 ms-4' onClick={handleAddClass}>Add</button>
                        {loading ? (
                            <div className="spinner-border text-primary spinner" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : error ? (
                            <p className='text-dark'>{error}</p>
                        ) : classes.length === 0 ? (
                            <p className='text-dark'>No classes available</p>
                        ) : (
                            <table className="table table-default table-hover table-responsive table-striped-columns table-borderless mt-2 ms-4">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentClasses.map((classItem) => (
                                        <tr key={classItem._id}>
                                            <td>{classItem.title}</td>
                                            <td>{new Date(classItem.date).toLocaleDateString()}</td>
                                            <td>{classItem.time}</td>
                                            <td>{classItem.duration} mins</td>
                                            <td>{classItem.status}</td>
                                            <td>
                                                <button className='btn table-button ms-1' onClick={() => handleStartClass(classItem._id, classItem.status)}>Start</button>
                                                <button className='btn table-button ms-1' onClick={() => handleEdit(classItem)}>Edit</button>
                                                <button className='btn table-button ms-1' onClick={() => { setShowModal(true); setSelectedClass(classItem); }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                      
                       
                            <nav>
                                <ul className="pagination">
                                    {Array.from({ length: Math.ceil(classes.length / classesPerPage) }, (_, i) => (
                                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <button onClick={() => paginate(i + 1)} className="page-link">
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this class?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showToast && (
                <div className="toast show position-fixed bottom-0 end-0 m-3" style={{ borderRadius: "15px", backgroundColor: "#0056b3", color: "white" }}>
                    <div className="toast-body">
                        {message}
                        <button type="button" className="btn-close ms-2 mb-1" onClick={() => setShowToast(false)}></button>
                    </div>
                </div>
            )}
        </>
    );
}

export default TeacherLiveClasses;
