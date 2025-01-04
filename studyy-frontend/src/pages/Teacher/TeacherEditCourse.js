import { useState, useEffect } from 'react';
import TeacherSidebar from '../components/TeacherSidebar'
import { useLocation, useNavigate } from 'react-router-dom';
import { useApiClient } from "../../utils/apiClient"
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext"




const TeacherEditCourse = () => {
    const apiClient = useApiClient()

    const { user,token } = useUser();
    const navigate = useNavigate()
    const location = useLocation()
    const course = location.state?.course
    const courseId = location.state?.course.id
    const [title, setTitle] = useState(course.title);
    const [description, setDescription] = useState(course.description);
    const [modules, setModules] = useState([])
    const [moduleId, setModuleId] = useState("")
    const [showToast, setShowToast] = useState(false)
    const [message, setMessage] = useState('');
    const [deleteModal, setDeleteModal] = useState(false)

    useEffect(() => {
        const getModule = async () => {
            console.log("course id again", courseId)
            try {

                const response = await apiClient.get(`/course/get-course/${courseId}`);

                const data = response.data;
                console.log("data from teacher home", data)
                setModules(data.modules || [])
                console.log("modules extracted:", modules)
            } catch (error) {
                console.log("error in fetching course", error)
            }
        }
        getModule()
    }, [courseId])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        if (!trimmedTitle) {
            setMessage("Enter title")
            return
        }

        if (!trimmedDescription) {
            setMessage("Enter a proper description")
            return
        }
        try {

            const response = await apiClient.put(`/course/teacher-edit-course/${courseId}`, { title: trimmedTitle, description: trimmedDescription });

            const data = response.data;
            setMessage(data.message);
            console.log(data.message)
            if (response.status === 200) {
                setShowToast(!showToast)
                setTimeout(() => {
                    navigate("/teacher-view-courses")
                }, 2000);
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const addModule = () => {
        navigate("/teacher-edit-course-add-module", { state: { courseId, course } });
    }

    const handleEdit = (mod) => {
        navigate("/teacher-edit-module", { state: { module: mod, course: course } })
    }

    const confirmDelete = (id) => {
        setDeleteModal(!deleteModal)
        setModuleId(id)
    }

    const handleDelete = async () => {
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


    return (
        <>
            <div className='row'>
                <div className='col text-light side-bar'>
                    <TeacherSidebar />
                </div>
                <div className='col text-light '>
                    <div className='row headers'>
                        <h4>Courses</h4>
                    </div>
                    <div className='row table-content forms'>
                        <div className='other-forms'>
                            <h5 className='mb-5'>Edit course</h5>
                            {message && <p>{message}</p>}
                            <form onSubmit={handleSubmit}>
                                <small >Title:</small>
                                <input className='form-control' type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                <small >Description:</small>
                                <textarea className='form-control' placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                <button className='btn btn-secondary button mb-3 mt-3' type="submit">Save</button>
                            </form>

                        </div>

                        <div className='row text-dark pt-3 ms-3'>
                            <h5>Modules</h5>
                            <button
                                className='btn-sm btn-secondary mt-4 regular-button button mx-2 mb-3'
                                onClick={addModule}
                            >
                                Add
                            </button>

                            <div className='row'>
                                {
                                    modules.length === 0 ? (
                                        <p>No modules available</p>
                                    ) : (
                                        Array.isArray(modules) && modules.map((mod, index) => (
                                            <div className='col-md-4 mb-4' key={mod._id}>
                                                <div className='card text-dark bg-light'>
                                                    <img src="/banner6.jpg" className="card-img-top" alt="..." style={{ height: '200px', objectFit: 'cover', borderRadius: "20px" }} />

                                                    <div className='card-body'>
                                                        <h5 className='card-title'>{mod.title}</h5>
                                                        <p className='card-text'>{mod.description}</p>
                                                        <div className='d-flex'>
                                                            <button
                                                                className='btn me-2 table-button'
                                                                onClick={() => handleEdit(mod)}
                                                            >
                                                                Edit
                                                            </button>
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
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
    );
};

export default TeacherEditCourse;

