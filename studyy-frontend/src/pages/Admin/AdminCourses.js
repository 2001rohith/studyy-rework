import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar2 from '../components/Sidebar2';
import { useApiClient } from "../../utils/apiClient"
import { useUser } from "../../UserContext"



function AdminCourses() {
  const apiClient = useApiClient()
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursePerPage] = useState(5);
  const [courseID, setCourseID] = useState('');
  const [currentCourses, setCurrentCourses] = useState([]);

 

  const getCourses = async () => {
    try {
      const response = await apiClient.get(`/course/admin-get-courses`);

      const data = response.data;
      if (response.status === 200) {
        setCourses(data.courses || []);
        setAllCourses(data.courses || [])
        setLoading(false);
      } else {
        setError(data.message || 'Failed to fetch courses.');
        setLoading(false);
      }
    } catch (err) {
      console.error("Error in fetching courses:", err);
      setError('Server error. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) {
      navigate('/');
      return;
    }
    getCourses();
  }, []);

  useEffect(() => {
    const indexOfLastCourse = currentPage * coursePerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursePerPage;

    const filteredCourses = courseID
      ? allCourses.filter(course =>
        course.courseId?.toLowerCase().includes(courseID.toLowerCase())
      )
      : allCourses;

    setCurrentCourses(filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse));
  }, [allCourses, currentPage, courseID, coursePerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await apiClient.delete(`/course/teacher-delete-course/${id}`);

      if (response.status === 200) {
        alert("Course deleted successfully");
        const updatedCourses = courses.filter(course => course.id !== id);
        setCourses(updatedCourses);
        setAllCourses(updatedCourses);
      } else {
        alert("Failed to delete course");
      }
    } catch (err) {
      console.error("Error in deleting course:", err);
    }
  };

  const handleView = (id) => {
    navigate("/admin-view-course", { state: { id } });
  };

  return (
    <div className='row'>
      <div className='col text-light side-bar'>
        <Sidebar2 />
      </div>
      <div className='col text-light'>
        <div className='row headers'>
          <h4>Courses</h4>
        </div>

        <div className='row table-content text-dark'>
          <div className='search-bar'>
            <input
              type="text"
              placeholder="Search by courseId..."
              value={courseID}
              onChange={(e) => setCourseID(e.target.value)}
            />
            <button className='btn search-bar-button' onClick={() => setCourseID('')}>Clear</button>
          </div>

          {loading ? (
            <div className="spinner-border text-primary spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : error ? (
            <p className='ms-2'>{error}</p>
          ) : currentCourses.length > 0 ? (
            <table className="table table-default table-hover table-responsive table-striped-columns table-borderless mt-2">
              <thead>
                <tr>
                  <th>#</th>
                  <th>CourseId</th>
                  <th>Title</th>
                  <th>Students</th>
                  <th>Teacher</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.map((course, index) => (
                  <tr key={course.id}>
                    <td>{(currentPage - 1) * coursePerPage + index + 1}</td>
                    <td>{course.courseId}</td>
                    <td>{course.title}</td>
                    <td>{course.studentCount}</td>
                    <td>{course.teacher}</td>
                    <td>
                      <button className='btn table-button mx-1' onClick={() => handleView(course.id)}>View</button>
                      <button className='btn table-button mx-1' onClick={() => handleDelete(course.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='ms-2'>No courses found.</p>
          )}

          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(allCourses.length / coursePerPage) }, (_, i) => (
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

export default AdminCourses;
