import React from "react"
import { Link, useNavigate } from 'react-router-dom';


const Footer2 = () =>
    <footer className=" font-small blue pt-4 teacher-footer">
        <div className="container-fluid text-center text-md-left">
            <div className="row">
                <div className="col-md-6 mt-md-0 mt-3">
                    <h5 className="text-uppercase">Studyy.com</h5>
                    <p>Here you can learn and grow with our teachers and their courses.</p>
                </div>

                <hr className="clearfix w-100 d-md-none pb-0" />

                <div className="col-md-3 mb-md-0 mb-3">
                    <h5 className="text-uppercase">Links</h5>
                    <div className="list-unstyled">
                        <Link to="/teacher-view-courses" className="sidebar-item">Courses</Link>
                        <Link to="" className="sidebar-item">Users</Link>
                        <Link to="" className="sidebar-item">Users</Link>
                        <Link to="" className="sidebar-item">Users</Link>
                    </div>
                </div>

                <div className="col-md-3 mb-md-0 mb-3">
                    <h5 className="text-uppercase">Links</h5>
                    <div className="list-unstyled">
                        <Link to="" className="sidebar-item">Users</Link>
                        <Link to="" className="sidebar-item">Users</Link>
                        <Link to="" className="sidebar-item">Users</Link>
                        <Link to="" className="sidebar-item">Users</Link>
                    </div>
                </div>
            </div>
        </div>

        <div className="footer-copyright text-center py-3">
            <p> studyy.com</p>
        </div>

    </footer>

export default Footer2