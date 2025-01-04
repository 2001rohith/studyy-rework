import { useState } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApiClient } from "../../utils/apiClient"
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext"



const TeacherAddLiveClass = () => {
    const apiClient = useApiClient()
    const navigate = useNavigate();
    const location = useLocation();
    const courseId = location.state?.id;
    const { user,token } = useUser();
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    // const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);  // State to control modal visibility

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            
            const response = await apiClient.post(`/course/add-class`, {
                courseId,
                title,
                date,
                time,
                duration,
                teacherId: user.id,
            });

            const data = response.data;
            if (response.status === 200) {
                setMessage(data.message);
                setShowModal(true);  
            } else {
                setMessage(data.message);
                setError('Failed to add the class');
            }
        } catch (err) {
            setError('Server error, please try again later');
        } finally {
            setLoading(false);
        }
    };

    const goback = () => {
        navigate('/teacher-view-classes', { state: { id: courseId } });
    };

    return (
        <>
            <div className="row">
                <div className="col text-light side-bar">
                    <TeacherSidebar />
                </div>
                <div className="col text-light ms-2">
                    <div className="row mb-4 headers">
                        <h4>Live classes</h4>
                    </div>

                    <div className="row add-course-forms">
                        <div className="col-md-6 text-dark first-form">
                            <h5 className="mb-5">Create a class</h5>

                            {showModal && (
                                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Alert!</h5>
                                            </div>
                                            <div className="modal-body">
                                                {message}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" onClick={goback} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div>
                                    <input
                                        className="form-control mb-3"
                                        type="text"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                    <small className="form-check-label ms-2">Date:</small>
                                    <input
                                        className="form-control mb-3"
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                    <small className="form-check-label ms-2">Time:</small>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        required
                                    />
                                    <small className="form-check-label ms-2">Duration (minutes):</small>
                                    <input
                                        type="number"
                                        placeholder="Duration in minutes"
                                        className="form-control"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        required
                                    />
                                    {/* <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={isLive}
                                        onChange={(e) => setIsLive(e.target.checked)}
                                    />
                                    <small className="form-check-label ms-2">Start live</small> */}
                                </div>
                                <button className="btn btn-secondary mt-3" type="submit">
                                    {loading ? 'Adding...' : 'Add'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherAddLiveClass;
