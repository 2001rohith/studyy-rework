import { useState, useEffect } from 'react';
import TeacherSidebar from '../components/TeacherSidebar'
import { useLocation, useNavigate } from 'react-router-dom';
import { useApiClient } from "../../utils/apiClient"
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext"
import { Upload } from 'lucide-react';



const TeacherEditModule = () => {
    const apiClient = useApiClient()

    const { user, token } = useUser();
    const navigate = useNavigate()
    const location = useLocation()
    const mod = location.state?.module
    const course = location.state?.course
    const [moduleId, setModuleId] = useState(location.state?.module._id)
    // const moduleId = location.state?.module._id
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [pdfFile, setPdfFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null)
    const [modulee, setModule] = useState()
    const [showModal, setShowModal] = useState(false)
    const [contentType, setContentType] = useState("")
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [uploadProgress, setUploadProgress] = useState({
        pdf: 0,
        video: 0
    });
    const [fileNames, setFileNames] = useState({
        pdf: '',
        video: ''
    });

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === 'pdf') {
            setPdfFile(file);
            setFileNames(prev => ({ ...prev, pdf: file.name }));
        } else {
            setVideoFile(file);
            setFileNames(prev => ({ ...prev, video: file.name }));
        }
        setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    }

    useEffect(() => {
        const getModule = async () => {
            try {
                const response = await apiClient.get(`/course/get-module-data/${moduleId}`)
                const data = response.data
                console.log("data:", data)
                if (response.status === 200) {
                    console.log("module data:", data.module)
                    setModule(data.module)
                    setTitle(data.module.title)
                    setDescription(data.module.description)

                }
            } catch (error) {
                console.log("Error fetching module:", error);
            }
        }
        getModule()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (pdfFile) formData.append('pdf', pdfFile);
        if (videoFile) formData.append("video", videoFile);

        try {
            setLoading(true);
            const response = await apiClient.put(
                `/course/teacher-edit-module/${moduleId}`, 
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => ({
                            pdf: pdfFile ? percentCompleted : 0,
                            video: videoFile ? percentCompleted : 0
                        }));
                    }
                }
            );

            const data = response.data;
            if (response.status === 200) {
                setMessage("Module updated successfully");
                setShowToast(true);
                setTimeout(() => {
                    navigate("/teacher-edit-course", { state: { course } });
                }, 2000);
            } else {
                setMessage(data.message || "Failed to update module");
                setShowToast(true);
            }
        } catch (error) {
            console.log("Error uploading module", error);
            setMessage("Error updating module. Please try again.");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPDF = () => {
        if (!modulee) return
        const backendOrigin = `${API_URL}`;
        const formattedPath = `${backendOrigin}/${modulee.pdfPath.replace(/\\/g, '/')}`.replace(/^\/+/, "");
        setContentType("pdf")
        setShowModal(true);
    };
    const handleViewVideo = () => {
        if (!modulee) return
        const backendOrigin = `${API_URL}`;
        const videoPath = `${backendOrigin}/${modulee.videoPath.replace(/\\/g, '/')}`.replace(/^\/+/, "");
        setContentType("video")
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setContentType("")
    };

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
                    <div className='row content forms'>
                        <div className='other-forms'>
                            <h5 className='mb-5'>Edit Module</h5>
                            <form onSubmit={handleSubmit}>
                                <label>Title:</label>
                                <input 
                                    className='form-control' 
                                    type="text" 
                                    placeholder="Title" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                    disabled={loading}
                                />
                                <label>Description:</label>
                                <textarea 
                                    className='form-control' 
                                    placeholder="Description" 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    required 
                                    disabled={loading}
                                />
                                <button 
                                    type="button"
                                    className='btn table-button me-2' 
                                    onClick={handleViewPDF}
                                    disabled={loading}
                                >
                                    Pdf
                                </button>
                                <button 
                                    type="button"
                                    className='btn table-button' 
                                    onClick={handleViewVideo}
                                    disabled={loading}
                                >
                                    Video
                                </button>
                                
                                {/* PDF Upload Section */}
                                <div className="mb-3 mt-2">
                                    <label>Upload PDF:</label>
                                    <div className="position-relative">
                                        <input
                                            className='form-control'
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => handleFileChange(e, 'pdf')}
                                            disabled={loading}
                                        />
                                        {loading && fileNames.pdf && (
                                            <div className="progress mt-2">
                                                <div 
                                                    className="progress-bar progress-bar-striped progress-bar-animated" 
                                                    role="progressbar" 
                                                    style={{ width: `${uploadProgress.pdf}%` }}
                                                    aria-valuenow={uploadProgress.pdf} 
                                                    aria-valuemin="0" 
                                                    aria-valuemax="100"
                                                >
                                                    {uploadProgress.pdf}%
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Video Upload Section */}
                                <div className="mb-3">
                                    <label>Upload Video:</label>
                                    <div className="position-relative">
                                        <input
                                            className="form-control"
                                            type="file"
                                            accept="video/mp4"
                                            onChange={(e) => handleFileChange(e, 'video')}
                                            disabled={loading}
                                        />
                                        {loading && fileNames.video && (
                                            <div className="progress mt-2">
                                                <div 
                                                    className="progress-bar progress-bar-striped progress-bar-animated" 
                                                    role="progressbar" 
                                                    style={{ width: `${uploadProgress.video}%` }}
                                                    aria-valuenow={uploadProgress.video} 
                                                    aria-valuemin="0" 
                                                    aria-valuemax="100"
                                                >
                                                    {uploadProgress.video}%
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    className='btn btn-secondary button mb-3' 
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Upload className="inline-block mr-2" size={16} />
                                            Updating...
                                        </>
                                    ) : 'Save'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {modulee && showModal && (
                <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {contentType === "pdf" ? (
                                    <iframe
                                        src={`${API_URL}/${modulee.pdfPath.replace(/\\/g, '/')}`.replace(/^\/+/, "")} title={modulee.title}
                                        style={{ width: '100%', height: '500px' }}
                                        frameBorder="0"
                                    ></iframe>
                                ) : (
                                    <video
                                        controls
                                        src={`${API_URL}/${modulee.videoPath.replace(/\\/g, '/')}`.replace(/^\/+/, "")}
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
    );
};

export default TeacherEditModule;

