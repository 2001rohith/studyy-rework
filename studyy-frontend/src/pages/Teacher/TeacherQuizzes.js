import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherSidebar from '../components/TeacherSidebar';
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext";

function TeacherQuizzes() {
    const { fetchQuizzes, deleteQuiz, fetchQuizSubmissions } = useCourseService()
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const [courseId] = useState(location.state?.id || "");
    const [quizzes, setQuizzes] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [submissions, setSubmissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [quizzesPerPage] = useState(5);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');
    const [quizId, setQuizId] = useState("");

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const getQuizzes = async () => {
            setLoading(true);
            try {
                const { quizzes, courseName } = await fetchQuizzes(courseId);
                setQuizzes(quizzes);
                setCourseName(courseName);
            } catch (error) {
                setError(error.message || "Server error, please try again later");
            } finally {
                setLoading(false);
            }
        };

        getQuizzes();
    }, [courseId, user, navigate]);

    const addQuiz = () => navigate("/teacher-add-quiz", { state: { id: courseId } });

    const handleEdit = (quiz) => navigate("/teacher-edit-quiz", { state: { quiz, courseId } });

    const confirmDelete = (id) => {
        setDeleteModal(true);
        setQuizId(id);
    };

    const handleDelete = async () => {
        try {
            const message = await deleteQuiz(quizId);
            setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
            setMessage(message);
            setShowToast(true);
        } catch (error) {
            setError(error.message || "Server error, please try again later");
        } finally {
            setDeleteModal(false);
            setQuizId("");
        }
    };

    const getSubmissions = async (quizId) => {
        try {
            const submissions = await fetchSubmissions(quizId);
            setSubmissions(submissions);
            setModal(true);
        } catch (error) {
            setError(error.message || "Server error, please try again later");
        }
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastQuiz = currentPage * quizzesPerPage;
    const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
    const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

    return (
        <div className='row'>
            <div className='col text-light side-bar'>
                <TeacherSidebar />
            </div>
            <div className='col text-light'>
                <div className='row headers'>
                    <h4>Quizzes {"- " + courseName}</h4>
                </div>
                <div className='row table-content text-dark'>
                    <button className='btn btn-secondary regular-button mx-4 mt-4 mb-3' onClick={addQuiz}>Add</button>

                    {loading ? (
                        <div className="spinner-border text-primary spinner" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : error ? (
                        <p className='ms-3'>{error}</p>
                    ) : quizzes.length === 0 ? (
                        <p className='mt-3'>No quizzes available.</p>
                    ) : (
                        <>
                            <table className="table table-default table-hover table-responsive table-striped-columns table-borderless mt-2 ms-4">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Course</th>
                                        <th>Submissions</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentQuizzes.map((quiz, index) => (
                                        <tr key={quiz._id}>
                                            <td>{indexOfFirstQuiz + index + 1}</td>
                                            <td>{quiz.title}</td>
                                            <td>{courseName}</td>
                                            <td>
                                                <button className='btn table-button mx-1' onClick={() => getSubmissions(quiz._id)}>View</button>
                                            </td>
                                            <td>
                                                <button className='btn table-button mx-1' onClick={() => handleEdit(quiz)}>Edit</button>
                                                <button className='btn table-button mx-1' onClick={() => confirmDelete(quiz._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <nav className="pagination-container">
                                <ul className="pagination">
                                    {Array.from({ length: Math.ceil(quizzes.length / quizzesPerPage) }, (_, i) => (
                                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </>
                    )}
                </div>
            </div>
            {modal && (
                <div className="modal show d-block text-dark" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Quiz Submissions</h5>
                                <button type="button" className="btn-close" onClick={() => setModal(false)}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <table className='table table-default table-hover table-responsive table-striped-columns'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Score</th>
                                            <th>Submitted At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map((submission, index) => (
                                            <tr key={index}>
                                                <td>{submission.name}</td>
                                                <td>{submission.score}</td>
                                                <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {deleteModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this quiz?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDeleteModal(false)}>Cancel</button>
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
        </div>
    );
}

export default TeacherQuizzes;
