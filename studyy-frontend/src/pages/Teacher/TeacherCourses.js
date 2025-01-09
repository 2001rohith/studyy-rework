import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TeacherSidebar from '../components/TeacherSidebar'
import io from 'socket.io-client'
import { useCourseService } from '../../utils/courseService';
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext"
import Table from '../components/Table'

const socket = io(`${API_URL}`);

function TeacherCourses() {
  const { getCourses, deleteCourse, createNotification, createEmailNotification } = useCourseService()
  const navigate = useNavigate()
  const { user, token } = useUser();
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [coursePerPage] = useState(5)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [notifationMessage, setNotificationMessage] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState("")
  const [students, setStudents] = useState([]);
  const [modal, setModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false)
  console.log("user from local storage:", user)



  const fetchCourses = async () => {
    try {
      const data = await getCourses()

      setCourses(data.courses)
    } catch (error) {
      console.log("error in fetching courses for teacher", error)
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

    fetchCourses()
  }, [])

  const indexOfLastCourse = currentPage * coursePerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursePerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addCourse = async () => {
    navigate("/teacher-add-course", { state: { user } })
    getCourses()
  }

  const handleDelete = async (id) => {
    try {
      const data = await deleteCourse(selectedCourse)

      setMessage(data.message)
      setCourses(courses.filter(course => course.id !== selectedCourse))
      setDeleteModal(!deleteModal)
      setShowToast(!showToast)
    } catch (error) {
      console.log("Error in deleting course", error)
    }
  }
  const setNotificationModal = (id) => {
    setShowModal(!showModal)
    setSelectedCourse(id)
  }

  const closeModal = () => {
    setShowModal(!showModal)
    setNotificationMessage('');
    setSelectedCourse("")
    setMessage("")
  }



  const sendNotification = async (e) => {
    e.preventDefault()
    try {
      const data = await createNotification(notifationMessage, selectedCourse, user.id)
      setMessage(data.message)

      socket.emit('notificationAdded', {
        courseId: selectedCourse,
        teacherId: user.id,
      });

      setSelectedCourse("")
      setTimeout(() => {
        setNotificationMessage("")
        setMessage("")
        closeModal()
      }, 1000)
    } catch (error) {
      console.log(data.message)
      setMessage(data.message);
    }
  }

  const sendEmail = async (e) => {
    e.preventDefault()
    try {
      const data = await createEmailNotification(emailMessage, selectedCourse)
      setMessage(data.message)
      setSelectedCourse("")
      setTimeout(() => {
        setEmailMessage("")
        setMessage("")
        closeEmailModal()
      }, 1000)
    } catch (error) {
      setMessage(data.message);
    }
  }

  const handleEmailModal = (id) => {
    setEmailModal(!emailModal)
    setSelectedCourse(id)
  }

  const closeEmailModal = () => {
    setEmailModal(!emailModal)
    setEmailMessage('');
    setSelectedCourse("")
    setMessage("")
  }

  const confirmDelete = (id) => {
    setDeleteModal(!deleteModal)
    setSelectedCourse(id)
  }


  const handleView = (id) => {
    navigate("/teacher-view-course", { state: { id } })
  }
  const handleEdit = (course) => {
    navigate("/teacher-edit-course", { state: { course } })
  }

  const handleViewStudents = async (id) => {
    try {

      const response = await apiClient.get(`/course/get-course-students/${id}`);

      const data = response.data;
      if (response.status === 200) {
        setStudents(data.students);
        setModal(true);
      } else {
        console.error(data.message || 'Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Server error, please try again later');
    }
  };

  const columns = [
    {
      header: '#',
      render: (_, index) => index // The index is now passed correctly from the Table component
    },
    {
      header: 'CourseId',
      accessor: 'courseId',
      minWidth: '120px' // Optional: set minimum width for columns
    },
    {
      header: 'Title',
      accessor: 'title',
      minWidth: '200px'
    },
    {
      header: 'Students',
      accessor: 'studentCount',
      minWidth: '100px'
    },
    {
      header: 'Assignments',
      accessor: 'assignmentCount',
      minWidth: '100px'
    }
  ];

  const renderRowActions = (course) => (
    <>
      <button className='btn table-button mx-1' onClick={() => handleView(course.id)}>View</button>
      <button className='btn table-button mx-1' onClick={() => handleEdit(course)}>Edit</button>
      <button className='btn table-button mx-1' onClick={() => handleViewStudents(course.id)}>Students</button>
      <button className='btn table-button mx-1' onClick={() => confirmDelete(course.id)}>Delete</button>
      <button className='btn table-button mx-1' onClick={() => setNotificationModal(course.id)}>Send notification</button>
      <button className='btn table-button mx-1' onClick={() => handleEmailModal(course.id)}>Send email</button>
    </>
  );

  return (
    <>
      <div className='row'>
        <div className='col text-light side-bar'>
          <TeacherSidebar />
        </div>
        <div className='col text-light'>
          <div className='row headers'>
            <h4>Courses</h4>
          </div>

          <div className='row table-content text-dark'>
            <button className='btn btn-secondary regular-button mx-4 mt-4 mb-3' onClick={addCourse}>Add</button>

            {loading ? (
              <div className="spinner-border text-primary spinner" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : error ? (
              <p className='ms-2'>{error}</p>
            ) : courses.length === 0 ? (
              <p className='mt-3 ms-3'>No courses available. Add a course to get started.</p>
            ) : (
              <Table
                columns={columns}
                data={currentCourses}
                loading={loading}
                error={error}
                emptyMessage="No courses available. Add a course to get started."
                rowActions={renderRowActions}
                currentPage={currentPage}
                itemsPerPage={coursePerPage}
                onPageChange={paginate}
                totalItems={courses.length}
              />
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
            {showModal && (
              <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Send Notification</h5>

                    </div>
                    <div className="modal-body">
                      <form onSubmit={sendNotification}>
                        {message && <div className="alert alert-info">{message}</div>}
                        <div className="form-group mb-3">
                          <label>Enter message</label>
                          <input
                            type="text"
                            className="form-control"
                            value={notifationMessage}
                            onChange={(e) => setNotificationMessage(e.target.value)}
                            required
                          />
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn table-button" onClick={closeModal}>Cancel</button>
                          <button type="submit" className="btn table-button">Send</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {emailModal && (
              <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Send Email Notification</h5>

                    </div>
                    <div className="modal-body">
                      <form onSubmit={sendEmail}>
                        {message && <div className="alert alert-info">{message}</div>}
                        <div className="form-group mb-3">
                          <label>Enter message</label>
                          <input
                            type="text"
                            className="form-control"
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            required
                          />
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn table-button" onClick={closeEmailModal}>Cancel</button>
                          <button type="submit" className="btn table-button">Send</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {modal && (
        <div className="modal show d-block text-dark" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Students</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)}></button>
              </div>
              <div className="modal-body noti-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {students.length > 0 ? (
                  <>

                    <table className='table table-default table-hover table-responsive table-striped-columns'>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      {students.map((student, index) => (
                        <tbody>
                          <tr>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                          </tr>
                        </tbody>
                      ))}
                    </table>

                  </>
                ) : (
                  <p>No students available.</p>
                )}
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
                <p>Are you sure you want to delete this course?</p>
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
        <div className="toast show position-fixed  bottom-0 end-0 m-3" style={{ borderRadius: "15px", backgroundColor: "#0056b3", color: "white" }}>
          <div className="toast-body">
            {message}
            <button type="button" className="btn-close ms-2 mb-1" onClick={() => setShowToast(false)}></button>
          </div>
        </div>
      )}
    </>
  )
}

export default TeacherCourses
