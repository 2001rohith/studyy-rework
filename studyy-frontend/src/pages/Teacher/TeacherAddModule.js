import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TeacherSidebar from '../components/TeacherSidebar';
import { useApiClient } from "../../utils/apiClient";
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext";
import { Upload } from 'lucide-react';

function TeacherAddModule() {
    const apiClient = useApiClient()
    const location = useLocation();
    const navigate = useNavigate();
    const courseId = location.state?.courseId;
    const { user, token } = useUser();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [moduleVideoFile, setModuleVideoFile] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
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
            setModuleVideoFile(file);
            setFileNames(prev => ({ ...prev, video: file.name }));
        }
        setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pdfFile || !moduleVideoFile) {
            setMessage("Please select both PDF and video files");
            setShowToast(true);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('courseId', courseId);
        formData.append('pdf', pdfFile);
        formData.append("video", moduleVideoFile);

        try {
            setLoading(true);
            const response = await apiClient.post(`/course/teacher-add-module`, formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(prev => ({
                        pdf: percentCompleted,
                        video: percentCompleted
                    }));
                }
            });

            const data = response.data;
            if (response.status === 200) {
                setMessage(data.message);
                setShowToast(true);
                setTimeout(() => {
                    navigate(`/teacher-view-course`, { state: { id: courseId } });
                }, 2000);
            } else {
                setMessage(data.message || "Failed to add module");
                setShowToast(true);
            }
        } catch (error) {
            console.log("Error uploading module", error);
            setMessage("Error uploading files. Please try again.");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

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
                    <div className='row content'>
                        <div className='other-forms'>
                            <h5 className='mb-5'>Add Module</h5>
                            <form onSubmit={handleSubmit}>
                                <label>Title:</label>
                                <input
                                    className='form-control mb-3'
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                <label>Description:</label>
                                <textarea 
                                    className='form-control mb-3'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                                
                                {/* PDF Upload Section */}
                                <div className="mb-3">
                                    <label>Upload PDF:</label>
                                    <div className="position-relative">
                                        <input
                                            className='form-control'
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => handleFileChange(e, 'pdf')}
                                            required
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
                                            required
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
                                    className='btn btn-secondary' 
                                    type="submit" 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Upload className="inline-block mr-2" size={16} />
                                            Uploading...
                                        </>
                                    ) : 'Add Module'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            {showToast && (
                <div 
                    className="toast show position-fixed bottom-0 end-0 m-3" 
                    style={{ borderRadius: "15px", backgroundColor: "#0056b3", color: "white" }}
                >
                    <div className="toast-body">
                        {message}
                        <button 
                            type="button" 
                            className="btn-close ms-2 mb-1" 
                            onClick={() => setShowToast(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default TeacherAddModule;