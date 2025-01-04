import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import { useApiClient } from "../../utils/apiClient";
import { useUser } from "../../UserContext";

function StudentEnrolledCourses() {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [loading, setLoading] = useState(true);
  const [newCourses, setNewCourses] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of courses per page

  // Calculate pagination details
  const totalPages = Math.max(1, Math.ceil(newCourses.length / itemsPerPage));
  const currentCourses = newCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) {
        navigate('/');
        return;
      }
      try {
        const response = await apiClient.get(`/course/enrolled-courses/${user.id}`);
        const data = response.data;
        setNewCourses(data.courses);
        setLoading(false);
      } catch (error) {
        console.log('Error in fetching courses:', error);
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, [user.id]);

  const viewCourse = (id) => {
    navigate('/student-view-course', { state: { courseId: id } });
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
            <h4>My Courses</h4>
          </div>
          <div className="row table-content">
            <div className="row mt-3 text-dark">
              <h5 className="mb-3">Enrolled Courses</h5>
              <div className="scroll-container">
                {currentCourses.length > 0 ? (
                  currentCourses.map((course) => (
                    <div
                      className="card course-card mx-2"
                      style={{ width: '20rem', height: '25rem' }}
                      key={course._id}
                    >
                      <img
                        src="/course-card1.jpg"
                        className="card-img-top"
                        alt={course.title}
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '15px',
                        }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <small className="card-text mb-1">
                          {course.description}
                        </small>
                        <div className="text-center">
                          <button
                            className="btn button mt-5"
                            onClick={() => viewCourse(course._id)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <p>No courses found. Enroll in a course to view it here.</p>
                  </div>
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
    </>
  );
}

export default StudentEnrolledCourses;
