import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherSidebar from '../components/TeacherSidebar'
import { useApiClient } from "../../utils/apiClient"
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext"

function TeacherQuizCourses() {
    const apiClient = useApiClient()
    const navigate = useNavigate()
    const { user,token } = useUser();
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [coursePerPage] = useState(5)


    const getCourses = async () => {
        try {
            
            const response = await apiClient.get(`/course/get-courses`);

            const data = response.data;
            if (response.status === 200) {
                setCourses(data.courses)
            } else {
                setError('No courses or failed to fetch!')
            }

        } catch (error) {
            setError('Server error, please try again later')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        
    if (!user) {
        navigate('/');
        return;
    }
        getCourses()
    }, [])

    const indexOfLastCourse = currentPage * coursePerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursePerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleView = (id) => {
        console.log("course id from quiz courses", id)
        navigate("/teacher-view-quizzes", { state: { id } })
    }

    return (
        <>
            <div className='row'>
                <div className='col text-light side-bar'>
                    <TeacherSidebar />
                </div>
                <div className='col text-light'>
                    <div className='row headers'>
                        <h4>Quizzes</h4>
                    </div>

                    <div className='container'>
                        <div className='row content text-dark d-flex'>
                            <h5 className='mt-3'>Courses</h5>
                            {loading ? (
                                <div className="spinner-border text-primary spinner" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : courses.length === 0 ? (
                                <p>No courses available</p>
                            ) : (
                                <div className='row g-2 text-dark text-center ms-3'>
                                    {Array.isArray(courses) && courses.map((course) => (
                                        <div className='col-md-4' key={course.id}>
                                            <div className='card assignment-course-card text-dark bg-light'>
                                                <img src="/banner5.jpg" className="card-img-top" alt="module image" style={{ height: '200px', objectFit: 'cover', borderRadius: "20px 20px 10px 10px" }} />
                                                <div className='card-body'>
                                                    <h5 className='card-title'>{course.title}</h5>
                                                    <button className='btn table-button mt-3' onClick={() => handleView(course.id)}>View</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <nav>
                                <ul className="pagination">
                                    {Array.from({ length: Math.ceil(courses.length / coursePerPage) }, (_, i) => (
                                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <a onClick={() => paginate(i + 1)} className="page-link">
                                                {i + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeacherQuizCourses

