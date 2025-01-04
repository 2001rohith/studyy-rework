import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherSidebar from '../components/TeacherSidebar'
import Footer2 from '../components/Footer2'
import { useUser } from "../../UserContext"

function TeacherHome() {
  const navigate = useNavigate()
  // const location = useLocation()
  const { user,token } = useUser();
  console.log("teacher peerid:", user)

  useEffect(() => {
    if (!user|| !token) {
      navigate('/');
      return;
    }
  },[])
  return (
    <>
      <div className='row'>
        <div className='col text-light side-bar'>
          <TeacherSidebar />
        </div>
        <div className='col text-light'>
          <div className='row headers'>
            <h4>Home</h4>
          </div>
          <div className='row table-content'>
            <div id="carouselExampleControls" className="teacher-carousel carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src="/banner(3).jpg" className="d-block w-100 carousel-image" alt="..."/>
                  <div className="carousel-caption d-none d-md-block">
                    <button className='btn btn-primary cbutton'>Get Started!</button>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="/banner(1).jpg" className="d-block w-100 carousel-image" alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                    <button className='btn btn-primary cbutton'>Get Started!</button>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="/banner(2).jpg" className="d-block w-100 carousel-image" alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                    <button className='btn btn-primary cbutton'>Get Started!</button>
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
          </div>

        </div>
        <div className='row mt-5'>
        <Footer2/>
        </div>
      </div>
    </>
  )
}

export default TeacherHome
