import { useState,useEffect } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext"



const TeacherAddAssignment = () => {
    const { createAssignment } = useCourseService()
    const location = useLocation();
    const navigate = useNavigate()
    const { user,token } = useUser();
    const cId = location.state?.courseId;
    const [courseId, setCourseId] = useState(cId)
    console.log("course id from add assignmrnt", courseId)

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState("")
    const [deadlineDate, setDeadlineDate] = useState('');
    const [message, setMessage] = useState('Fill Fields!');

    useEffect(() => {
        if (!user|| !token) {
          navigate('/');
          return;
        }
      },[])

      const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
    
        if (!trimmedTitle) {
            setMessage("Please provide valid details.");
            return;
        }
    
        const assignmentData = {
            title: trimmedTitle,
            description,
            dueDate: deadlineDate,
            courseId,
        };
    
        try {
            const data = await createAssignment(assignmentData);
            setMessage(data.message);
        } catch (error) {
            console.error('Error creating assignment:', error);
            setMessage(error.message || "Error occurred while creating the assignment.");
        }
    };    

    const goback = async () => {
        navigate("/teacher-view-assignments", { state: { id: courseId } })

    }


    return (
        <>
            <div className="row">
                <div className="col text-light side-bar">
                    <TeacherSidebar />
                </div>
                <div className="col text-light ms-2">
                    <div className="row mb-4 headers">
                        <h4>Assignments</h4>
                    </div>

                    <div className="row add-course-forms">
                        <div className="col-md-6 text-dark first-form">
                            <h5 className="mb-5">Create a Assignment</h5>
                            {message && <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Alert!</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            {message}
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" onClick={goback} class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            <form onSubmit={handleSubmit}>
                            <label>Title:</label>
                                <input
                                    className="form-control mb-3"
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                <label>Description:</label>
                                <textarea className='form-control'
                                    value={description}
                                    placeholder="Description"
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                                <label>Date:</label>
                                <input
                                    className="form-control mb-3"
                                    type="date"
                                    placeholder="Date"
                                    value={deadlineDate}
                                    onChange={(e) => setDeadlineDate(e.target.value)}
                                    required
                                />

                                <button className="btn btn-secondary" type="submit" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Create
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherAddAssignment;
