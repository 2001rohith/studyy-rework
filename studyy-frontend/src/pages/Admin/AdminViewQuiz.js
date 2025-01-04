import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar2 from '../components/Sidebar2';
import { useUser } from "../../UserContext"

function AdminViewQuiz() {
    const navigate = useNavigate()
    const location = useLocation();
    const quiz = location.state?.quiz;
    const { user, token } = useUser();
    console.log("quiz from admin view quiz:", quiz)

    useEffect(() => {
        if (!user || !token) {
            navigate('/');
            return;
        }
    }, [])

    if (!quiz) {
        return <div>Quiz not found.</div>;
    }

    return (
        <>
            <div className='row'>
                <div className='col text-light side-bar'>
                    <Sidebar2 />
                </div>
                <div className='col text-light content'>
                    <div className='row headers ms-2'>
                        <h4>Quizzes</h4>
                    </div>
                    <div className='row admin-banner ms-2'>
                        <h2>{quiz.title}</h2>
                        <p>Course: {quiz.course}</p>
                        <p>Submissions: {quiz.submissions}</p>
                    </div>

                    <div className='row text-dark pt-3 ms-3'>
                        <h4 className='mt-2'>Questions:</h4>
                        {quiz.questions && quiz.questions.length > 0 ? (
                            <div className="row mt-3">
                                {quiz.questions.map((question, index) => (
                                    <div className="col-md-6 col-lg-4 mb-4" key={index}>
                                        <div className="card h-100">
                                            <img src="/banner5.jpg" className="card-img-top" alt="module image" style={{ height: '150px', objectFit: 'cover', borderRadius: "20px" }} />
                                            <div className="card-body">
                                                <h5 className="card-title">Question {index + 1}</h5>
                                                <p className="card-text"><strong>{question.question}</strong></p>
                                                <p>Option A: {question.options[0]}</p>
                                                <p>Option B: {question.options[1]}</p>
                                                <p><strong>Answer:</strong> {question.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No questions available for this quiz.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminViewQuiz;
