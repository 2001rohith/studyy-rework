import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar2 from '../components/Sidebar2';
// import axios from 'axios';
import { useApiClient } from "../../utils/apiClient"
import { useUser } from "../../UserContext"
// import API_URL from '../../axiourl';
// const apiClient = axios.create({
//     baseURL: API_URL,
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     }
// });

function AdminAssignments() {
    const apiClient = useApiClient()
    const navigate = useNavigate();
    const { user, token } = useUser();
    const [assignments, setAssignments] = useState([]);
    const [allAssignments, setAllAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [assignmentsPerPage] = useState(5);
    const [courseName, setCourseName] = useState('');
    const [currentAssignments, setCurrentAssignments] = useState([]);

    const getAssignments = async () => {
        try {
            const response = await apiClient.get('/course/admin-get-assignments');
            const data = response.data;
            if (response.status === 200) {
                setAssignments(data.assignments || []);
                setAllAssignments(data.assignments || []);
                setLoading(false);
            } else {
                setError('No assignments found or failed to fetch!');
                setLoading(false);
            }
        } catch (error) {
            console.log("Error in fetching assignments:", error);
            setError('Server error, please try again later');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !token) {
            navigate('/');
            return;
        }
        getAssignments();
    }, []);

    useEffect(() => {
        const indexOfLastAssignment = currentPage * assignmentsPerPage;
        const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;

        if (courseName === '') {
            setCurrentAssignments(allAssignments?.slice(indexOfFirstAssignment, indexOfLastAssignment) || []);
        } else {
            const filteredAssignments = allAssignments?.filter(assignment =>
                assignment?.course?.toLowerCase().includes(courseName.toLowerCase())
            );
            setCurrentAssignments(filteredAssignments?.slice(indexOfFirstAssignment, indexOfLastAssignment) || []);
        }
    }, [allAssignments, currentPage, courseName, assignmentsPerPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = async (id) => {
        try {
            const response = await apiClient.delete(`/course/admin-delete-assignment/${id}`);
            if (response.status === 200) {
                alert("Assignment deleted successfully");
                const updatedAssignments = assignments.filter(assignment => assignment._id !== id);
                setAssignments(updatedAssignments);
                setAllAssignments(updatedAssignments);

                const indexOfLastAssignment = currentPage * assignmentsPerPage;
                const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
                const updatedCurrentAssignments = updatedAssignments.slice(indexOfFirstAssignment, indexOfLastAssignment);
                setCurrentAssignments(updatedCurrentAssignments);
            } else {
                alert("Failed to delete assignment");
            }
        } catch (error) {
            console.log("Error in deleting assignment:", error);
        }
    };

    if (loading) {
        return (
            <div className="spinner-border text-primary spinner" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }

    if (error) {
        return <p className="ms-2">{error}</p>;
    }

    return (
        <div className='row'>
            <div className='col text-light side-bar'>
                <Sidebar2 />
            </div>
            <div className='col text-light'>
                <div className='row headers'>
                    <h4>Assignments</h4>
                </div>

                <div className='row table-content text-dark'>
                    <div className='search-bar'>
                        <input
                            type="text"
                            placeholder="Search by course name..."
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                        />
                        <button className='btn search-bar-button' onClick={() => setCourseName('')}>Clear</button>
                    </div>
                    {currentAssignments?.length > 0 ? (
                        <table className="table table-default table-hover table-responsive table-striped-columns table-borderless mt-2">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Course</th>
                                    <th>Deadline (Date)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAssignments.map((assignment, index) => (
                                    <tr key={assignment?._id}>
                                        <td>{index + 1}</td>
                                        <td>{assignment?.title}</td>
                                        <td>{assignment?.course}</td>
                                        <td>{new Date(assignment?.deadline).toLocaleDateString()}</td>
                                        <td>
                                            <button className='btn table-button mx-1' onClick={() => handleDelete(assignment._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No assignments found</p>
                    )}
                    {allAssignments?.length > assignmentsPerPage && (
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: Math.ceil(allAssignments.length / assignmentsPerPage) }, (_, i) => (
                                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button onClick={() => paginate(i + 1)} className="page-link">
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminAssignments;