import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext"



function StudentCheckCourse() {
    const { getCourseDetails, enrollCourse } = useCourseService()
    const navigate = useNavigate()
    const location = useLocation()
    const { user, token } = useUser();
    const [courseId] = useState(location.state?.courseId)
    console.log("user id from checkout page:", user.id)
    console.log("course id from checkout page:", courseId)
    const [course, setCourse] = useState()
    const [loading, setLoading] = useState(true)
    const [modules, setModules] = useState()
    const [teacher, setTeacher] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    console.log("course id", courseId)

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        const fetchCourse = async () => {
            try {
                const data = await getCourseDetails(courseId);
    
                setCourse(data.course);
                setModules(data.modules || []);
                setTeacher(data.teacher);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course details:", error);
                setLoading(false);
            }
        };
    
        fetchCourse();
    }, [courseId, user, navigate]);

    const confirmEnroll = () => {
        setConfirmModal(true)
    }

    const enroll = async () => {
        try {
            const data = await enrollCourse(user.id, courseId);
            
            setConfirmModal(false);
            setShowModal(true);
            setLoading(false);
        } catch (error) {
            console.error("Error enrolling in course:", error);
            alert(error.message); 
            setLoading(false);
        }
    };

    const handleNavigate = () => {
        setShowModal(false)
        navigate("/student-view-course", { state: { courseId } })
    }

    const viewCourse = () => {
        navigate("/student-view-course", { state: { courseId } })
    }


    if (loading) {
        return <div className="spinner-border text-primary spinner2" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    }

    return (
        <>
            <div className='row'>
                <div className='col text-light side-bar'>
                    <StudentSidebar />
                </div>
                <div className='col text-light content'>
                    <div className='row headers ms-2'>
                        <h4>View Course</h4>
                    </div>
                    <div className='row student-banner ms-2'>
                        {course ? (
                            <>
                                <h2>{course.title}</h2>
                                <p>{course.description}</p>
                                <p>course by : {teacher.name}</p>
                            </>
                        ) : (
                            <p>No course found</p>
                        )}
                        <div className='d-flex'>
                            {course.studentsEnrolled && course.studentsEnrolled.includes(user.id) ? (
                                <button className='btn table-button' onClick={() => viewCourse(course.id)}>View</button>
                            ) : (
                                <button className='btn table-button mt-2' onClick={confirmEnroll} style={{ borderRadius: "10px" }}>Enroll</button>
                            )}
                        </div>
                    </div>

                    <div className='row text-dark pt-3 ms-3'>
                        <h5 className='mt-2'>Modules</h5>

                        <div className='row mt-3'>
                            {Array.isArray(modules) && modules.map((mod, index) => (
                                <div className='col-md-4 mb-4' key={mod._id}>
                                    <div className='card text-dark bg-light'>
                                        <img src="/banner6.jpg" className="card-img-top" alt="module image" style={{ height: '200px', objectFit: 'cover', borderRadius: "15px" }} />
                                        <div className='card-body'>
                                            <h5 className='card-title'>{mod.title}</h5>
                                            <p className='card-text'>{mod.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {confirmModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Enrollment confirmation</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>You wish to enroll this course?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn table-button" onClick={() => setConfirmModal(false)}>cancel</button>
                                <button type="button" className="btn table-button" onClick={enroll}>Confirm</button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Enrollment success</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>You have enrolled this Course...Congrats!</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn table-button" onClick={handleNavigate}>Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default StudentCheckCourse