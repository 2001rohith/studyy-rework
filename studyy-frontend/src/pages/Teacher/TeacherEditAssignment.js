import { useState, useEffect } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext"



const TeacherEditAssignment = () => {
    const { updateAssignment } = useCourseService()
    const { user,token } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const assignment = location.state?.assignment || {};
    const courseId = location.state?.courseId;

    const [title, setTitle] = useState(assignment.title || '');
    const [description, setDescription] = useState(assignment.description || '');
    const [dueDate, setDueDate] = useState(assignment.dueDate || '');
    console.log("due date:",dueDate)
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!courseId || !assignment) {
            navigate('/teacher-view-assignments', { replace: true });
        }
    }, [courseId, assignment, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
    
        if (!trimmedTitle) {
            setMessage("Enter a valid title");
            return;
        }
    
        if (!trimmedDescription) {
            setMessage("Enter a valid description");
            return;
        }
    
        const assignmentData = { 
            title: trimmedTitle, 
            description: trimmedDescription, 
            dueDate 
        };
    
        try {
            const data = await updateAssignment(assignment._id, assignmentData);
    
            setMessage(data.message);
    
            if (data.message) {
                navigate("/teacher-view-assignments", { state: { id: courseId } });
            }
        } catch (error) {
            console.error("Error updating assignment:", error);
            setMessage(error.message);
        }
    };
    
    const formatDate = (date) => {
        return date.split("T")[0]
    };

    return (
        <>
            <div className='row'>
                <div className='col text-light side-bar'>
                    <TeacherSidebar />
                </div>
                <div className='col text-light '>
                    <div className='row headers'>
                        <h4>Edit Assignment</h4>
                    </div>
                    <div className='row content forms'>
                        <div className='other-forms'>
                            <h5 className='mb-5'>Edit Assignment</h5>
                            {message && <p>{message}</p>}
                            <form onSubmit={handleSubmit}>
                                <small>Title:</small>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                <small>Deadline:</small>
                                <input
                                    className='form-control'
                                    type="date"
                                    value={formatDate(dueDate)}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    
                                />
                                <small>Description:</small>
                                <textarea
                                    className='form-control'
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                                <button className='btn btn-secondary button mb-3 mt-3' type="submit">
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherEditAssignment;
