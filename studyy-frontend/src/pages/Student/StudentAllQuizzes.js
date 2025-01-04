import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import { useApiClient } from "../../utils/apiClient";
import { useUser } from "../../UserContext";

function StudentAllQuizzes() {
    const apiClient = useApiClient();
    const navigate = useNavigate();
    const { user, token } = useUser();
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Number of quizzes per page

    // Calculate pagination details
    const totalPages = Math.max(1, Math.ceil(quizzes.length / itemsPerPage)); // Always show at least one page
    const currentQuizzes = quizzes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        const getQuizzes = async () => {
            if (!user) {
                navigate('/');
                return;
            }
            try {
                const response = await apiClient.get(`/course/student-get-quizzes/${user.id}`);
                const data = response.data;

                if (response.status === 200) {
                    setQuizzes(data.quizzes);
                    setLoading(false);
                } else {
                    console.log("Something went wrong:", data.message);
                }
            } catch (error) {
                console.log("Error in fetching quizzes:", error);
            }
        };
        getQuizzes();
    }, [user, navigate, apiClient]);

    const handleAttend = (quiz) => {
        navigate("/attend-quiz", { state: { quiz } });
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

    return (
        <>
            <div className="row">
                <div className="col text-light side-bar">
                    <StudentSidebar />
                </div>
                <div className="col text-dark">
                    <div className="row headers">
                        <h4>Quizzes</h4>
                    </div>
                    <div className="row table-content">
                        <div className="row mt-3 text-dark">
                            <h5 className="mb-3">All Quizzes</h5>
                            <div className="scroll-container">
                                {currentQuizzes.length === 0 ? (
                                    <p>There are no quizzes</p>
                                ) : (
                                    currentQuizzes.map((quiz) => (
                                        <div
                                            className="card course-card mx-2"
                                            style={{ width: '20rem', height: '30rem' }}
                                            key={quiz._id}
                                        >
                                            <img
                                                src="/banner5.jpg"
                                                className="card-img-top"
                                                alt="..."
                                                style={{ height: '200px', objectFit: 'cover', borderRadius: '15px' }}
                                            />
                                            <div className="card-body text-center">
                                                <h5 className="card-title">{quiz.title}</h5>
                                                <h6>{quiz.course}</h6>
                                            </div>
                                            <div className="text-center">
                                                {!quiz.alreadySubmitted ? (
                                                    <button
                                                        className="btn button mb-4"
                                                        style={{ width: '100px' }}
                                                        onClick={() => handleAttend(quiz)}
                                                    >
                                                        Attend
                                                    </button>
                                                ) : (
                                                    <>
                                                        <h5 style={{ color: '#9C09FF' }}>
                                                            Score {quiz.score}/{quiz.numberOfQuestions}
                                                        </h5>
                                                        <h6 className="mb-4" style={{ color: '#28A804' }}>
                                                            Submitted!
                                                        </h6>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    
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
        </>
    );
}

export default StudentAllQuizzes;
