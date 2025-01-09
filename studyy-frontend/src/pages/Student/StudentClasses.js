import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext";

function StudentClasses() {
    const { studentGetClasses } = useCourseService()
    const navigate = useNavigate();
    const { user, token } = useUser();
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6

    const totalPages = Math.max(1, Math.ceil(classes.length / itemsPerPage));
    const currentClasses = classes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
            const getClasses = async () => {
                try {
                    if (!user || !user.id) {
                        setError('User information not found');
                        return;
                    }
        
                    const data = await studentGetClasses(user.id);
                    setClasses(data.classes);
                } catch (error) {
                    console.error("Error fetching classes:", error);
                    setError(error.message || 'An unexpected error occurred while fetching classes.');
                } finally {
                    setLoading(false);
                }
            };
        
        getClasses();
    }, [user.id, navigate]);

    const HandleJoinClass = (id, peerId, status, title) => {
        if (!peerId) {
            console.error("Peer ID missing for this class");
            return;
        }
        if (status === "Ended") {
            setShowToast(true);
            setToastMessage("Class Ended!");
            return;
        }
        if (status !== "Started") {
            setShowToast(true);
            setToastMessage("Class Not Started!");
            return;
        }
        setToastMessage("");
        navigate("/join-class", { state: { classId: id, peerId, title } });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="spinner-border text-primary spinner2" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    return (
        <>
            <div className="row">
                <div className="col text-light side-bar">
                    <StudentSidebar />
                </div>
                <div className="col text-dark">
                    <div className="row headers">
                        <h4>Live Classes</h4>
                    </div>
                    <div className="row table-content">
                        <div className="row mt-3 text-dark">
                            <h5 className="mb-3">All Classes</h5>
                            <div className="scroll-container">
                                {currentClasses.length === 0 ? (
                                    <p>No class found</p>
                                ) : (
                                    currentClasses.map((Class) => (
                                        <div
                                            className="card course-card mx-2"
                                            style={{ width: "20rem", height: "30rem" }}
                                            key={Class._id}
                                        >
                                            <img
                                                src="/banner11.jpg"
                                                className="card-img-top"
                                                alt={`${Class.title} banner`}
                                                style={{
                                                    height: "200px",
                                                    objectFit: "cover",
                                                    borderRadius: "15px",
                                                }}
                                            />
                                            <div className="card-body text-center">
                                                <h5 className="card-title">{Class.title}</h5>
                                                <h6>{Class.course}</h6>
                                                <h6>{new Date(Class.date).toLocaleDateString()}</h6>
                                                <h6>{Class.time}</h6>
                                            </div>
                                            <div className="text-center">
                                                <button
                                                    className="btn table-button mb-4"
                                                    onClick={() =>
                                                        HandleJoinClass(Class._id, Class.peerId, Class.status, Class.title)
                                                    }
                                                >
                                                    Join
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Pagination controls */}
                    <div className="pagination-controls text-center mt-4">
                        {[...Array(totalPages).keys()].map((_, index) => (
                            <button
                                key={index}
                                className={`btn mx-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {showToast && (
                <div
                    className="toast show position-fixed bottom-0 end-0 m-3"
                    style={{ borderRadius: "15px", backgroundColor: "#0056b3", color: "white" }}
                >
                    <div className="toast-body">
                        {toastMessage}
                        <button type="button" className="btn-close ms-2 mb-1" onClick={() => setShowToast(false)}></button>
                    </div>
                </div>
            )}
        </>
    );
}

export default StudentClasses;
