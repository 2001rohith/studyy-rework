import { useEffect, useState } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import { useApiClient } from "../../utils/apiClient"
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io(`${API_URL}`);

const TeacherEditQuiz = () => {
    const apiClient = useApiClient()

    const location = useLocation();
    const navigate = useNavigate();
    const { user, token } = useUser();
    const [teacherId, setTeacherId] = useState(user.id)
    const quizId = location.state?.quiz._id;
    const courseId = location.state?.courseId;
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', ''], answer: '' }]);
    const [message, setMessage] = useState('Loading quiz details...');
    const [showToast, setShowToast] = useState(false)
    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {

                const response = await apiClient.get(`/course/get-quiz/${quizId}`);

                const data = response.data;
                if (response.status === 200) {
                    setQuizTitle(data.quiz.title);
                    console.log("quiz title:", quizTitle)
                    setQuestions(data.quiz.questions);
                    setMessage('Edit the quiz details');
                } else {
                    setMessage('Failed to load quiz details');
                }
            } catch (error) {
                console.error('Error fetching quiz details:', error);
                setMessage('Error loading quiz details');
            }
        };

        if (quizId) {
            fetchQuizDetails();
        }
    }, [quizId]);

    const handleQuizTitleChange = (e) => setQuizTitle(e.target.value);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];

        if (field === 'option1' || field === 'option2') {
            const optionIndex = field === 'option1' ? 0 : 1;
            const currentOptions = updatedQuestions[index].options;
            const otherOptionIndex = optionIndex === 0 ? 1 : 0;

            // Check for duplicate options within the same question
            if (
                value.trim().toLowerCase() === currentOptions[otherOptionIndex].trim().toLowerCase() &&
                value.trim() !== ''
            ) {
                toast.error("Options for a question cannot be the same!", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }

            updatedQuestions[index].options[optionIndex] = value;
        } else {
            // Check for duplicate questions
            if (field === 'question' && value.trim() !== '') {
                const isDuplicate = questions.some(
                    (q, i) => i !== index && q.question.trim().toLowerCase() === value.trim().toLowerCase()
                );

                if (isDuplicate) {
                    toast.error(`Question "${value}" already exists!`, {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }

            updatedQuestions[index][field] = value;
        }

        setQuestions(updatedQuestions);
    };



    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', ''], answer: '' }]);
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedTitle = quizTitle.trim();
        if (!trimmedTitle) {
            toast.error("Please provide a valid quiz title.");
            return;
        }

        // Check for duplicate questions
        const questionTexts = questions.map(q => q.question.trim().toLowerCase());
        const hasDuplicateQuestions = questionTexts.some(
            (question, index) => questionTexts.indexOf(question) !== index
        );

        if (hasDuplicateQuestions) {
            toast.error("Please remove duplicate questions before submitting.");
            return;
        }

        // Check for duplicate options
        const hasDuplicateOptions = questions.some(q => {
            const [option1, option2] = q.options.map(opt => opt.trim().toLowerCase());
            return option1 === option2 && option1 !== '';
        });

        if (hasDuplicateOptions) {
            toast.error("Please ensure no options are the same within a question.");
            return;
        }

        const quizData = { title: trimmedTitle, questions, courseId, teacherId };

        try {
            const response = await apiClient.put(`/course/teacher-edit-quiz/${quizId}`, quizData);
            const data = response.data;

            if (response.status === 200) {
                toast.success("Quiz updated successfully!");
                setTimeout(() => {
                    navigate("/teacher-view-quizzes", { state: { id: courseId }, replace: true });
                }, 1000);
                socket.emit('notificationAdded', {
                    courseId: courseId,
                    teacherId: user.id,
                });
            } else {
                toast.error(data.message || "Error occurred while updating the quiz.");
            }
        } catch (error) {
            console.error('Error updating quiz:', error);
            toast.error("Server error. Please try again.");
        }
    };


    // const goback = async () => {
    //     navigate("/teacher-view-quizzes", { state: { id: courseId } });
    // };

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col text-light side-bar">
                    <TeacherSidebar />
                </div>
                <div className="col text-light ms-2">
                    <div className="row mb-4 headers">
                        <h4>Edit Quiz</h4>
                    </div>

                    <div className="row add-course-forms table-content">
                        <div className="col-md-6 text-dark first-form">
                            <h5 className="mb-5">Edit Quiz</h5>
                            <form onSubmit={handleSubmit}>
                                {message}
                                <label>Title:</label>
                                <input
                                    className="form-control mb-3"
                                    type="text"
                                    placeholder="Quiz Title"
                                    value={quizTitle}
                                    onChange={handleQuizTitleChange}
                                    required
                                />
                                {questions.length === 0 ? (
                                    <p>No questions available</p>
                                ) : (
                                    questions.map((q, index) => (
                                        <div key={index} className="question-section mb-4">
                                            <h6>Question {index + 1}</h6>
                                            <input
                                                className="form-control mb-2"
                                                type="text"
                                                placeholder="Question"
                                                value={q.question}
                                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                                required
                                            />
                                            <label>Options:</label>
                                            <input
                                                className="form-control mb-2"
                                                type="text"
                                                placeholder="Option 1"
                                                value={q.options[0]}
                                                onChange={(e) => handleQuestionChange(index, 'option1', e.target.value)}
                                                required
                                            />
                                            <input
                                                className="form-control mb-2"
                                                type="text"
                                                placeholder="Option 2"
                                                value={q.options[1]}
                                                onChange={(e) => handleQuestionChange(index, 'option2', e.target.value)}
                                                required
                                            />
                                            <label>Answer:</label>
                                            <input
                                                className="form-control mb-2"
                                                type="text"
                                                placeholder="Answer"
                                                value={q.answer}
                                                onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                                                required
                                            />
                                            <button type="button" className="btn table-button mt-2" onClick={() => handleRemoveQuestion(index)}>
                                                Remove
                                            </button>
                                            <button type="button" className="btn table-button mt-2 ms-2" onClick={handleAddQuestion}>
                                                Add
                                            </button>
                                        </div>
                                    ))
                                )}

                                <button className="btn table-button" type="submit">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                {showToast && (
                    <div className="toast show position-fixed  bottom-0 end-0 m-3" style={{ borderRadius: "15px", backgroundColor: "#0056b3", color: "white" }}>
                        <div className="toast-body">
                            {message}
                            <button type="button" className="btn-close ms-2 mb-1" onClick={() => setShowToast(false)}></button>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
};

export default TeacherEditQuiz;
