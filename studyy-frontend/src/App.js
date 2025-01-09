import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import SignUp from "./pages/Auth/SignUp"
import Login from './pages/Auth/Login';
import Otp from './pages/Auth/Otp';
import SelectRole from './pages/Auth/SelectRole';
import TeacherHome from './pages/Teacher/TeacherHome';
import StudentHome from './pages/Student/StudentHome';
import AdminHome from './pages/Admin/AdminHome';
import AdminEditUser from './pages/Admin/AdminEditUser';
import AdminTeachers from './pages/Admin/AdminTeachers';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import TeacherAddCourse from './pages/Teacher/TeacherAddCourse';
import TeacherViewCourse from './pages/Teacher/TeacherViewCourse';
import TeacherEditCourse from './pages/Teacher/TeacherEditCourse';
import TeacherCourses from './pages/Teacher/TeacherCourses';
import TeacherAddModule from './pages/Teacher/TeacherAddModule';
import TeacherEditModule from './pages/Teacher/TeacherEditModule';
import TeacherAddModuleForEdit from './pages/Teacher/TeacherAddModuleForEdit';
import StudentAllCourses from './pages/Student/StudentAllCourses';
import AdminCourses from './pages/Admin/AdminCourses';
import AdminViewCourse from './pages/Admin/AdminViewCourse';
import TeacherAssignmentsCourses from './pages/Teacher/TeacherAssignmentCourse';
import TeacherAssignments from './pages/Teacher/TeacherAssignments';
import TeacherAddAssignment from './pages/Teacher/TeacherAddAssignment';
import TeacherEditAssignment from './pages/Teacher/TeacherEditAssignment';
import TeacherQuizCourses from './pages/Teacher/TeacherQuizCourse';
import TeacherQuizzes from './pages/Teacher/TeacherQuizzes';
import TeacherAddQuiz from './pages/Teacher/TeacherAddQuiz';
import TeacherEditQuiz from './pages/Teacher/TeacherEditQuiz';
import TeacherProfile from './pages/Teacher/TeacherProfile';
import AdminQuizzes from './pages/Admin/AdminQuizzes';
import AdminViewQuiz from './pages/Admin/AdminViewQuiz';
import AdminAssignments from './pages/Admin/AdminAssignments';
import StudentCheckCourse from './pages/Student/StudentCheckCourse';
import StudentAllAssignments from './pages/Student/StudentAllAssignments';
import StudentAllQuizzes from './pages/Student/StudentAllQuizzes';
import StudentEnrolledCourses from './pages/Student/StudentEnrolledCourses';
import StudentViewCourse from './pages/Student/StudentViewCourse';
import StudentProfile from './pages/Student/StudentProfile';
import StudentAttendQuiz from './pages/Student/StudentAttendQuiz';
import TeacherLiveClass from './pages/Teacher/TeacherLiveClass';
import TeacherLiveClassesCourses from './pages/Teacher/TeacherLiveClassesCourse';
import TeacherLiveClasses from './pages/Teacher/TeacherLiveClasses';
import TeacherAddLiveClass from './pages/Teacher/TeacherAddLiveClass';
import StudentClasses from './pages/Student/StudentClasses';
import StudentLiveClass from './pages/Student/StudentLiveClass';
import TeacherEditClass from './pages/Teacher/TeacherEditClass';


function App() {
  return (
    <UserProvider>
      <>
        <Router>
          <Routes>
            <Route path='/Signup' element={
              <>
                <SignUp />
              </>
            } />
            <Route path='/' element={
              <Login />
            } />
            <Route path='/otp' element={
              <Otp />
            } />
            <Route path='/select-role' element={
              <>
                <SelectRole />
              </>
            } />
            <Route path='/admin-home' element={
              <>
                <AdminHome />
              </>
            } />
            <Route path='/admin-edit-user' element={
              <>
                <AdminEditUser />
              </>
            } />
            <Route path='/admin-teachers' element={
              <>
                <AdminTeachers />
              </>
            } />
            <Route path='/admin-courses' element={
              <>
                <AdminCourses />
              </>
            } />
            <Route path='/admin-assignments' element={
              <>
                <AdminAssignments />
              </>
            } />
            <Route path='/admin-quizzes' element={
              <>
                <AdminQuizzes />
              </>
            } />
            <Route path='/admin-view-course' element={
              <>
                <AdminViewCourse />
              </>
            } />
            <Route path='/admin-view-quiz' element={
              <>
                <AdminViewQuiz />
              </>
            } />
            <Route path='/teacher-home' element={
              <>
                <TeacherHome />
              </>
            } />
            <Route path='/teacher-view-assignment-courses' element={
              <>
                <TeacherAssignmentsCourses />
              </>
            } />
            <Route path='/teacher-view-assignments' element={
              <>
                <TeacherAssignments />
              </>
            } />
            <Route path='/teacher-add-assignment' element={
              <>
                <TeacherAddAssignment />
              </>
            } />
            <Route path='/teacher-edit-assignment' element={
              <>
                <TeacherEditAssignment />
              </>
            } />
            <Route path='/teacher-view-quiz-courses' element={
              <>
                <TeacherQuizCourses />
              </>
            } />
            <Route path='/teacher-view-quizzes' element={
              <>
                <TeacherQuizzes />
              </>
            } />
            <Route path='/teacher-add-quiz' element={
              <>
                <TeacherAddQuiz />
              </>
            } />
            <Route path='/teacher-edit-quiz' element={
              <>
                <TeacherEditQuiz />
              </>
            } />
            <Route path='/teacher-view-profile' element={
              <>
                <TeacherProfile />
              </>
            } />
            <Route path='/forgot-password' element={
              <>
                <ForgotPassword />
              </>
            } />
            <Route path='/reset-password/:token' element={
              <>
                <ResetPassword />
              </>
            } />
            <Route path='/teacher-view-courses' element={
              <>
                <TeacherCourses />
              </>
            } />
            <Route path='/teacher-add-course' element={
              <>
                <TeacherAddCourse />
              </>
            } />
            <Route path='/teacher-view-course' element={
              <>
                <TeacherViewCourse />
              </>
            } />
            <Route path='/teacher-edit-course' element={
              <>
                <TeacherEditCourse />
              </>
            } />
            <Route path='/teacher-add-module' element={
              <>
                <TeacherAddModule />
              </>
            } />
            <Route path='/teacher-edit-course-add-module' element={
              <>
                <TeacherAddModuleForEdit />
              </>
            } />
            <Route path='/teacher-edit-module' element={
              <>
                <TeacherEditModule />
              </>
            } />
            <Route path='/teacher-view-class-course' element={
              <>
                <TeacherLiveClassesCourses />
              </>
            } />
            <Route path='/teacher-view-classes' element={
              <>
                <TeacherLiveClasses />
              </>
            } />
            <Route path='/add-live-class' element={
              <>
                <TeacherAddLiveClass />
              </>
            } />
            <Route path='/teacher-live-class' element={
              <>
                <TeacherLiveClass />
              </>
            } />
            <Route path='/edit-class' element={
              <>
                <TeacherEditClass />
              </>
            } />
            <Route path='/student-home' element={
              <>
                <StudentHome />
              </>
            } />
            <Route path='/student-view-courses' element={
              <>
                <StudentAllCourses />
              </>
            } />
            <Route path='/student-check-course' element={
              <>
                <StudentCheckCourse />
              </>
            } />
            <Route path='/student-enrolled-courses' element={
              <>
                <StudentEnrolledCourses />
              </>
            } />
            <Route path='/student-view-course' element={
              <>
                <StudentViewCourse />
              </>
            } />
            <Route path='/student-view-assignments' element={
              <>
                <StudentAllAssignments />
              </>
            } />
            <Route path='/student-view-classes' element={
              <>
                <StudentClasses />
              </>
            } />
            <Route path='/student-view-quizzes' element={
              <>
                <StudentAllQuizzes />
              </>
            } />
            <Route path='/attend-quiz' element={
              <>
                <StudentAttendQuiz />
              </>
            } />
            <Route path='/student-view-profile' element={
              <>
                <StudentProfile />
              </>
            } />
            <Route path='/join-class' element={
              <>
                <StudentLiveClass />
              </>
            } />
          </Routes>
        </Router>
      </>
    </UserProvider>
  );
}

export default App;
