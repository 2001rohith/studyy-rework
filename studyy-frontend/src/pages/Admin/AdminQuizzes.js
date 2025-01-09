import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar2 from '../components/Sidebar2';
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext"

function AdminQuizzes() {
  const { adminFetchQuizzes, adminDeleteQuiz } = useCourseService()
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [quizzes, setQuizzes] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizPerPage] = useState(5);
  const [courseName, setCourseName] = useState('');
  const [currentQuizzes, setCurrentQuizzes] = useState([]);

  const getQuizzes = async () => {
    try {
      const data = await adminFetchQuizzes()
      setQuizzes(data);
      setAllQuizzes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Server error, please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) {
      navigate('/');
      return;
    }
    getQuizzes();
  }, []);

  useEffect(() => {
    const indexOfLastQuiz = currentPage * quizPerPage;
    const indexOfFirstQuiz = indexOfLastQuiz - quizPerPage;

    if (courseName === '') {
      setCurrentQuizzes(allQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz));
    } else {
      const filteredQuizzes = allQuizzes.filter((quiz) =>
        quiz.course.toLowerCase().includes(courseName.toLowerCase())
      );
      setCurrentQuizzes(filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz));
    }
  }, [allQuizzes, currentPage, courseName, quizPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await adminDeleteQuiz(id);
      alert('Quiz deleted successfully');
      const updatedQuizzes = quizzes.filter((quiz) => quiz._id !== id);

      setQuizzes(updatedQuizzes);
      setAllQuizzes(updatedQuizzes);

      const indexOfLastQuiz = currentPage * quizPerPage;
      const indexOfFirstQuiz = indexOfLastQuiz - quizPerPage;
      setCurrentQuizzes(updatedQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz));
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleView = (quiz) => {
    navigate('/admin-view-quiz', { state: { quiz } });
  };

  return (
    <div className="row">
      <div className="col text-light side-bar">
        <Sidebar2 />
      </div>
      <div className="col text-light">
        <div className="row headers">
          <h4>Quizzes</h4>
        </div>

        <div className="row table-content text-dark">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by course name..."
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <button className="btn search-bar-button" onClick={() => setCourseName('')}>
              Clear
            </button>
          </div>
          {loading ? (
            <div className="spinner-border text-primary spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : error ? (
            <p className="ms-2">{error}</p>
          ) : currentQuizzes.length === 0 ? (
            <p className="ms-2">No quizzes available to display.</p>
          ) : (
            <table className="table table-default table-hover table-responsive table-striped-columns table-borderless mt-2">
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
                    <td>{index + 1}</td>
                    <td>{quiz.title}</td>
                    <td>{quiz.course}</td>
                    <td>{quiz.submissions}</td>
                    <td>
                      <button className="btn table-button mx-1" onClick={() => handleView(quiz)}>
                        View
                      </button>
                      <button
                        className="btn table-button mx-1"
                        onClick={() => handleDelete(quiz._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(allQuizzes.length / quizPerPage) }, (_, i) => (
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
  );
}

export default AdminQuizzes;
