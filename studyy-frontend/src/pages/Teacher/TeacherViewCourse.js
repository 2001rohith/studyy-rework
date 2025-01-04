import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TeacherSidebar from '../components/TeacherSidebar'
import { useApiClient } from "../../utils/apiClient"
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext"



function TeacherViewCourse() {
    const apiClient = useApiClient()

    const navigate = useNavigate()
    const location = useLocation()
    const courseId = location.state?.id
    const { user,token } = useUser();
    const [course, setCourse] = useState()
    const [loading, setLoading] = useState(true)
    const [modules, setModules] = useState()
    const [selectedModule, setSelectedModule] = useState(null)
    const [moduleId, setModuleId] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [contentType, setContentType] = useState("")
    const [deleteModal, setDeleteModal] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [message, setMessage] = useState('');

   

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        const getCourse = async () => {
            console.log("course id again", courseId)

            try {

                const response = await apiClient.get(`/course/get-course/${courseId}`);

                const data = response.data;
                console.log("data from teacher home", data)
                setCourse(data.course)
                setModules(data.modules || [])
                setLoading(false)
            } catch (error) {
                console.log("error in fetching course", error)
                setLoading(false)
            }
        }
        getCourse()
    }, [])

    const addModule = () => {
        navigate("/teacher-add-module", { state: { courseId } });
    }

    const deleteModule = async (id) => {
        // if (!window.confirm('Are you sure you want to delete this module?')) return;
        try {
            
            const response = await apiClient.delete(`/course/teacher-delete-module/${moduleId}`);

            const data = response.data;
            if (response.status === 200) {
                setModules(modules.filter(mod => mod._id !== moduleId))
                setDeleteModal(!deleteModal)
                setModuleId("")
                setMessage(data.message)
                setShowToast(!showToast)
                setTimeout(() => {
                    setMessage("")
                    setShowToast(false)
                }, 5000);
            } else {
                alert("Failed to delete module");
            }
        } catch (error) {
            console.log("Error in deleting module", error)
        }
    }

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

    const confirmDelete = (id) => {
        setDeleteModal(!deleteModal)
        setModuleId(id)
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
                    <TeacherSidebar />
                </div>
                <div className='col text-light content'>
                    <div className='row headers ms-2'>
                        <h4>View Course</h4>
                    </div>
                    <div className='row banner ms-1'>
                        {course ? (
                            <>
                                <h2>{course.title}</h2>
                                <p>{course.description}</p>
                            </>
                        ) : (
                            <p>No course found</p>
                        )}
                    </div>

                    <div className='row text-dark pt-3 ms-3'>
                        <h5>Modules</h5>
                        <button
                            className='btn mt-3 regular-button mx-3 mb-3'
                            onClick={addModule}
                        >
                            Add
                        </button>

                        <div className='row '>
                            {modules.length === 0 ? (
                                <p>No modules available</p>
                            ) : (
                                Array.isArray(modules) && modules.map((mod, index) => (
                                    <div className='col-md-4 mb-4' key={mod._id}>
                                        <div className='card text-dark bg-light'>
                                            <img src="/banner6.jpg" className="card-img-top" alt="module image" style={{ height: '200px', objectFit: 'cover', borderRadius: "20px" }} />
                                            <div className='card-body'>
                                                <h5 className='card-title'>{mod.title}</h5>
                                                <p className='card-text'>{mod.description}</p>
                                                <div className='d-flex '>
                                                    <button
                                                        className='btn table-button'
                                                        onClick={() => handleViewPDF(mod)}
                                                    >
                                                        View Pdf
                                                    </button>
                                                    {mod.videoPath && (
                                                        <button
                                                            className="btn table-button"
                                                            onClick={() => handleViewVideo(mod)}
                                                        >
                                                            View Video
                                                        </button>
                                                    )}
                                                    <button
                                                        className='btn table-button'
                                                        onClick={() => confirmDelete(mod._id)}
                                                    >
                                                        Delete
                                                    </button>
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
            {deleteModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this module?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDeleteModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={deleteModule}>Delete</button>
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

export default TeacherViewCourse