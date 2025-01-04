// import { useState } from 'react';
// import TeacherSidebar2 from '../components/TeacherSidebar2';
// import { useLocation,useNavigate } from 'react-router-dom';

// const TeacherAddQuiz = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const cId = location.state?.courseId;
//     const [courseId, setCourseId] = useState(cId);
//     const [quizTitle, setQuizTitle] = useState('');
//     const [questions, setQuestions] = useState([{ question: '', option1: '', option2: '', answer: '' }]);
//     const [message, setMessage] = useState('Fill Fields!');

//     const handleQuizTitleChange = (e) => setQuizTitle(e.target.value);

//     const handleQuestionChange = (index, field, value) => {
//         const updatedQuestions = [...questions];
//         updatedQuestions[index][field] = value;
//         setQuestions(updatedQuestions);
//     };

//     const handleAddQuestion = () => {
//         setQuestions([...questions, { question: '', option1: '', option2: '', answer: '' }]);
//     };
  
//     const handleRemoveQuestion = (index) => {
//         const updatedQuestions = questions.filter((_, i) => i !== index);
//         setQuestions(updatedQuestions);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         const trimmedTitle = quizTitle.trim();
//         if (!trimmedTitle) {
//             setMessage("Please provide a valid quiz title.");
//             return;
//         }

//         const quizData = { title: trimmedTitle, courseId, questions };

//         try {
//             const response = await fetch("http://localhost:8000/course/add-quiz", {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify(quizData)
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 setMessage(data.message);
//             } else {
//                 setMessage(data.message || "Error occurred while creating the quiz.");
//             }
//         } catch (error) {
//             console.error('Error creating quiz:', error);
//             setMessage("Server error. Please try again.");
//         }
//     };

//     const goback = async () => {
//         navigate("/teacher-view-quizzes", { state: { id: courseId } });
//     };

    
    


//     return (
//         <>
//             <div className="row">
//                 <div className="col-md-3 text-light side-bar">
//                     <TeacherSidebar2 />
//                 </div>
//                 <div className="col text-light ms-2">
//                     <div className="row mb-4 headers">
//                         <h4>Quizzes</h4>
//                     </div>

//                     <div className="row add-course-forms">
//                         <div className="col-md-6 text-dark first-form">
//                             <h5 className="mb-5">Create a Assignment</h5>
//                             {message && <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                                 <div class="modal-dialog">
//                                     <div class="modal-content">
//                                         <div class="modal-header">
//                                             <h5 class="modal-title" id="exampleModalLabel">Alert!</h5>
//                                             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                                         </div>
//                                         <div class="modal-body">
//                                             {message}
//                                         </div>
//                                         <div class="modal-footer">
//                                             <button type="button" onClick={goback} class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>}
//                             <form onSubmit={handleSubmit}>
//                                 <input
//                                     className="form-control mb-3"
//                                     type="text"
//                                     placeholder="Quiz Title"
//                                     value={quizTitle}
//                                     onChange={handleQuizTitleChange}
//                                     required
//                                 />
//                                 {questions.map((q, index) => (
//                                     <div key={index} className="question-section mb-4">
//                                         <h6>Question {index + 1}</h6>
//                                         <input
//                                             className="form-control mb-2"
//                                             type="text"
//                                             placeholder="Question"
//                                             value={q.question}
//                                             onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
//                                             required
//                                         />
//                                         <input
//                                             className="form-control mb-2"
//                                             type="text"
//                                             placeholder="Option 1"
//                                             value={q.option1}
//                                             onChange={(e) => handleQuestionChange(index, 'option1', e.target.value)}
//                                             required
//                                         />
//                                         <input
//                                             className="form-control mb-2"
//                                             type="text"
//                                             placeholder="Option 2"
//                                             value={q.option2}
//                                             onChange={(e) => handleQuestionChange(index, 'option2', e.target.value)}
//                                             required
//                                         />
//                                         <input
//                                             className="form-control mb-2"
//                                             type="text"
//                                             placeholder="Answer"
//                                             value={q.answer}
//                                             onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
//                                             required
//                                         />
//                                         <button type="button" className="btn btn-danger" onClick={() => handleRemoveQuestion(index)}>
//                                             Remove Question
//                                         </button>
//                                     </div>
//                                 ))}
//                                 <button type="button" className="btn btn-primary" onClick={handleAddQuestion}>
//                                     Add Another Question
//                                 </button>
//                                 <button className="btn btn-secondary mt-3" type="submit" data-bs-toggle="modal" data-bs-target="#exampleModal">
//                                     Create Quiz
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default TeacherAddQuiz;
