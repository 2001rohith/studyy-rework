import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import Footer from "../components/Footer"
import { useApiClient } from "../../utils/apiClient"

import { useUser } from "../../UserContext"




function StudentHome() {
  const apiClient = useApiClient()

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  // const [user, setUser] = useState(null);
  const { user,token,logout } = useUser();
  console.log("user from context:",user)

  useEffect(() => {
    
    if (!user|| !token) {
      navigate('/');
      return;
    }

    try {
      // const parsedUser = JSON.parse(userDetails);
      // console.log("user from student home:",parsedUser)
      // setUser(parsedUser);
      fetchCourses(user.id, token);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/');
    }
  }, [navigate]);

  const fetchCourses = async (userId, token) => {
    try {
      const response = await apiClient.get(`/course/home-get-courses/${userId}`);
      const data = response.data
      console.log("response on fetching course for student home:",data)
      if (response.status === 200) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized access
        logout()
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const viewCourse = (id) => {
    navigate("/student-check-course", { state: { courseId: id } });
  };

  const ViewCourses = () => {
    navigate("/student-view-courses");
  };

  // Show loading state while checking authentication and fetching data
  if (loading) {
    return (
      <div className="spinner-border text-primary spinner2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  // Only render the main content if we have a user
  if (!user) {
    return null; // This shouldn't actually render because we redirect in useEffect
  }

  return (
    <>
      <div className='row'>
        <div className='col text-light side-bar'>
          <StudentSidebar />
        </div>
        <div className='col text-dark'>
          <div className='row headers'>
            <h4>Home</h4>
          </div>
          <div className='row table-content'>
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src="/banner(3).jpg" className="d-block w-100 carousel-image" alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                    <button className='btn button cbutton' onClick={ViewCourses}>Get Started!</button>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="/banner(4).jpg" className="d-block w-100 carousel-image" alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                    <button className='btn button cbutton' onClick={ViewCourses}>Get Started!</button>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="/banner(5).jpg" className="d-block w-100 carousel-image" alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                    <button className='btn button cbutton' onClick={ViewCourses}>Get Started!</button>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <div className="row mt-3 text-dark">
              <h5 className='mb-3'>Latest Courses!</h5>
              <div className="scroll-container">
                {!courses ? (
                  <p>No course found</p>
                ) : (
                  courses.map((course) => (
                    <div className="card course-card mx-2" style={{ width: '18rem' }} key={course._id}>
                      <img src="/course-card1.jpg" className="card-img-top" alt="..." style={{ height: '250px', objectFit: 'cover', borderRadius: "15px" }} />
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <small className="card-text mb-1">{course.description}</small>
                        <button className="btn button btn mt-5 ms-2" onClick={() => viewCourse(course._id)}>More</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default StudentHome;