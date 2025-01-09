import { useState } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherAddQuiz = () => {
    const { createQuiz } = useCourseService()
    const { user, token } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const cId = location.state?.id;
    const [courseId, setCourseId] = useState(cId);
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', ''], answer: '' }]);
    const [message, setMessage] = useState('Fill Fields!');

    const handleQuizTitleChange = (e) => setQuizTitle(e.target.value);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        if (field === 'option1' || field === 'option2') {
            const optionIndex = field === 'option1' ? 0 : 1;
            updatedQuestions[index].options[optionIndex] = value;
        } else {
            updatedQuestions[index][field] = value;
        }
        
        // Check for duplicates when question field is changed
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
                // Clear the duplicate question
                updatedQuestions[index].question = '';
            }
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

        // Check for duplicate questions before submission
        const questionTexts = questions.map(q => q.question.trim().toLowerCase());
        const hasDuplicates = questionTexts.some(
            (question, index) => questionTexts.indexOf(question) !== index
        );

        if (hasDuplicates) {
            toast.error("Please remove duplicate questions before submitting.");
            return;
        }

        // Validate that all questions, options, and answers are filled
        const hasEmptyFields = questions.some(
            q => !q.question.trim() || 
                 !q.options[0].trim() || 
                 !q.options[1].trim() || 
                 !q.answer.trim()
        );

        if (hasEmptyFields) {
            toast.error("Please fill in all questions, options, and answers.");
            return;
        }

        const quizData = { title: trimmedTitle, courseId, questions };

        try {
            const data = await createQuiz(quizData);
            toast.success(data.message);
            setTimeout(() => {
                goback();
            }, 2000);
        } catch (error) {
            console.error("Error creating quiz:", error);
            toast.error(error.message);
        }
    };

    const goback = async () => {
        navigate("/teacher-view-quizzes", { state: { id: courseId } });
    };

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col text-light side-bar">
                    <TeacherSidebar />
                </div>
                <div className="col text-light ms-2">
                    <div className="row mb-4 headers">
                        <h4>Quizzes</h4>
                    </div>

                    <div className="row add-course-forms">
                        <div className="col-md-6 text-dark first-form">
                            <h5 className="mb-5">Create a Quiz</h5>
                            <form onSubmit={handleSubmit}>
                                <input
                                    className="form-control mb-3"
                                    type="text"
                                    placeholder="Quiz Title"
                                    value={quizTitle}
                                    onChange={handleQuizTitleChange}
                                    required
                                />
                                {questions.map((q, index) => (
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
                                ))}

                                <button className="btn table-button" type="submit">
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

export default TeacherAddQuiz;