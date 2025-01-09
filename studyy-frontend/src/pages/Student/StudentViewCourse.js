import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import { useCourseService } from '../../utils/courseService';
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext"

function StudentViewCourse() {
    const { getCourseDetails } = useCourseService()
    const navigate = useNavigate()
    const location = useLocation()
    const { user, token } = useUser();
    const [courseId] = useState(location.state?.courseId)
    console.log("user id from checkout page:", user.id)
    console.log("course id from checkout page:", courseId)
    const [course, setCourse] = useState()
    const [loading, setLoading] = useState(true)
    const [modules, setModules] = useState()
    const [selectedModule, setSelectedModule] = useState(null)
    const [teacher, setTeacher] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [contentType, setContentType] = useState("")
    console.log("course id", courseId)



    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        const getCourse = async () => {
            console.log("course id again", courseId)

            try {
                const data = await getCourseDetails(courseId)
                console.log("data from check course", data)
                setCourse(data.course)
                setModules(data.modules || [])
                setTeacher(data.teacher)
                setLoading(false)
            } catch (error) {
                console.log("error in fetching course", error)
                setLoading(false)
            }
        }
        getCourse()
    }, [])

    const handleViewPDF = (mod) => {
        const backendOrigin = `${API_URL}`;
        const formattedPath = `${backendOrigin}/${mod.pdfPath.replace(/\\/g, '/')}`.replace(/^\/+/, "");

        setSelectedModule({ ...mod, pdfPath: formattedPath });
        setContentType("pdf")
        setShowModal(true);
    };
    const handleViewVideo = (mod) => {
        const backendOrigin = `${API_URL}`;
        const videoPath = `${backendOrigin}/${mod.videoPath.replace(/\\/g, '/')}`.replace(/^\/+/, "");

        setSelectedModule({ ...mod, videoPath: videoPath });
        setContentType("video")
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedModule(null);
        setContentType("")
    };

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

                            <h6 style={{ color: "#28A804" }}>Enrolled</h6>

                        </div>
                    </div>

                    <div className='row text-dark pt-3 ms-3'>
                        <h5 className='mt-2'>Modules</h5>

                        <div className='row mt-3'>
                            {modules.length === 0 ? (
                                <p>No modules found</p>
                            ) : (
                                Array.isArray(modules) && modules.map((mod, index) => (
                                    <div className='col-md-4 mb-4' key={mod._id}>
                                        <div className='card text-dark bg-light'>
                                            <img src="/banner6.jpg" className="card-img-top" alt="module image" style={{ height: '200px', objectFit: 'cover', borderRadius: "15px" }} />
                                            <div className='card-body'>
                                                <h5 className='card-title'>{mod.title}</h5>
                                                <p className='card-text'>{mod.description}</p>
                                                <div className='d-flex'>
                                                    <button className='btn table-button' onClick={() => handleViewPDF(mod)}>Pdf</button>
                                                    <button className='btn table-button' onClick={() => handleViewVideo(mod)}>Video</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {selectedModule && (
                <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedModule.title} - {contentType === "pdf" ? "PDF" : "Video"}</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {contentType === "pdf" ? (
                                    <iframe
                                        src={selectedModule.pdfPath}
                                        title={selectedModule.title}
                                        style={{ width: '100%', height: '500px' }}
                                        frameBorder="0"
                                    ></iframe>
                                ) : (
                                    <video
                                        controls
                                        src={selectedModule.videoPath}
                                        style={{ width: '100%' }}
                                    />
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default StudentViewCourse