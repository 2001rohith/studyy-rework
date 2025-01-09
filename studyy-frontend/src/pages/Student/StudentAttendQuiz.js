import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext"


function StudentAttendQuiz() {
    const { submitQuiz } = useCourseService()
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const quiz = location.state?.quiz;
  const { user,token } = useUser();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
  }
    if (quiz) {
      setLoading(false);
    }
  }, [quiz,user]);

  if (!quiz) {
    return <div>No quiz data available</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex] || {};

  const handleOptionSelect = (option) => {
    const previousOption = selectedOptions[currentQuestionIndex];
    const isCorrectAnswer = option === currentQuestion.answer;
    const wasPreviouslyCorrect = previousOption === currentQuestion.answer;

    if (previousOption !== option) {
      setSelectedOptions({
        ...selectedOptions,
        [currentQuestionIndex]: option,
      });

      setScore((prevScore) => {
        if (isCorrectAnswer && !wasPreviouslyCorrect) {
          return prevScore + 1;
        } else if (!isCorrectAnswer && wasPreviouslyCorrect) {
          return prevScore - 1;
        }
        return prevScore;
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user || !quiz) {
        console.error("User or quiz not found.");
        return;
    }
    
    try {
        const isSuccess = await submitQuiz(user.id, quiz._id, score);

        if (isSuccess) {
            alert('Quiz submitted successfully!');
            navigate('/student-view-quizzes');
        }
    } catch (error) {
        console.error('Error submitting quiz:', error.message);
        alert(error.message)
    }
}

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className='row'>
      <div className='col text-light side-bar'>
        <StudentSidebar />
      </div>
      <div className='col text-dark'>
        <div className='row headers'>
          <h4>Quizzes</h4>
        </div>
        <div className='row table-content'>
          <div className="question-container">
            <h5>Questions</h5>
            <div className="question-card">
              <div className='question'>
                <h6>{currentQuestion.question} <i className="fa-solid fa-question"></i></h6>
              </div>
              <div className="options">
                {currentQuestion.options?.map((option, index) => (
                  <div
                    key={index}
                    className={`option ${selectedOptions[currentQuestionIndex] === option ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            <div className="navigation-buttons text-center">
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              <button onClick={handleNext} disabled={!quiz?.questions}>
                {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentAttendQuiz;
