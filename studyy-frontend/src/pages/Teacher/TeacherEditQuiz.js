import { useEffect, useState } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import { useCourseService } from '../../utils/courseService';
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext"

const socket = io(`${API_URL}`);

const TeacherEditQuiz = () => {
    const { getQuizDetails } = useCourseService()
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
                const quizData = await getQuizDetails(quizId);
                setQuizTitle(quizData.title);
                console.log("Quiz title:", quizData.title);
                setQuestions(quizData.questions);
                setMessage("Edit the quiz details");
            } catch (error) {
                console.error("Error fetching quiz details:", error);
                setMessage(error.message);
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
            updatedQuestions[index].options[optionIndex] = value;
        } else {
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
            setMessage("Please provide a valid quiz title.");
            return;
        }

        const quizData = {
            title: trimmedTitle,
            questions,
            courseId,
            teacherId,
        };

        try {
            const data = await updateQuiz(quizId, quizData);
            setMessage("Quiz updated successfully!");
            setShowToast(true);
            setTimeout(() => {
                navigate("/teacher-view-quizzes", { state: { id: courseId }, replace: true });
            }, 1000);

            socket.emit("notificationAdded", {
                courseId: courseId,
                teacherId: user.id,
            });
        } catch (error) {
            console.error("Error updating quiz:", error);
            setMessage(error.message);
        }
    };

    return (
        <>
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
