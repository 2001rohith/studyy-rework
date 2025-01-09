import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar2 from '../components/Sidebar2';
import { useUserService } from '../../utils/userService'
import { useUser } from "../../UserContext"
import API_URL from '../../axiourl';


function AdminTeachers() {
    const { adminFetchTeachers, adminVerifyTeacher } = useUserService()
    const navigate = useNavigate();
    const { user, token } = useUser();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setConfirmationModal] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        if (!user || !token) {
            navigate('/');
            return;
        }
        const getTeachers = async () => {
            try {
                const data = await adminFetchTeachers()
                setUsers(data);
                setFilteredUsers(data);
                setLoading(false);
            } catch (error) {
                console.log("Error in fetching teachers:", error);
                setLoading(false);
            }
        };
        getTeachers();
    }, []);

    const handleViewPDF = (user) => {
        const backendOrigin = `${API_URL}`;
        const formattedPath = `${backendOrigin}/${user.teacherCertificatePath.replace(/\\/g, '/')}`;
        console.log(formattedPath)
        setSelectedUser({ ...user, teacherCertificatePath: formattedPath });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    useEffect(() => {
        if (searchEmail === '') {
            setFilteredUsers(users);
        } else {
            const results = users.filter(user =>
                user.email.toLowerCase().includes(searchEmail.toLowerCase())
            );
            setFilteredUsers(results);
        }
    }, [searchEmail, users]);

    useEffect(() => {
        let results;
        if (filter === "Unverified") {
            results = users.filter(user => !user.isTeacherVerified);
        } else {
            results = users;
        }
        setFilteredUsers(results);
    }, [filter, users]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleVerification = async (userId) => {
        try {
            await adminVerifyTeacher(userId)
            navigate(0);
        } catch (error) {
            console.error("Error during verification/unverification:", error);
        }
    };

    const showVerificationModal = (user) => {
        setConfirmationModal(true);
        setSelectedUser(user);
        setIsVerified(user.isTeacherVerified);
    };

    const closeConfirmationModal = () => {
        setConfirmationModal(false);
        setSelectedUser(null);
    };

    return (
        <div className='row'>
            <div className='col text-light side-bar'>
                <Sidebar2 />
            </div>
            <div className='col text-light'>
                <div className='row headers'>
                    <h4>Teachers</h4>
                </div>
                <div className='row content'>
                    <div className='search-bar'>
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                        <button className='btn search-bar-button' onClick={() => setSearchEmail('')}>Clear</button>
                        <div className="dropdown ms-2">
                            <button
                                className="btn filter-button dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {filter || "All Teachers"}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <button className="dropdown-item" onClick={() => setFilter("")}>All Teachers</button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => setFilter("Unverified")}>Unverified</button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {loading ? (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : currentUsers.length === 0 ? (
                        <p>No teachers available to display.</p>
                    ) : (
                        <table className="table table-borderless table-default table-hover table-striped-columns">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Verified</th>
                                    <th>Certificate</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1 + (currentPage - 1) * usersPerPage}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.isTeacherVerified ? "Yes" : "No"}</td>
                                        <td>
                                            <button className='btn table-button mx-1' onClick={() => handleViewPDF(user)}>View</button>
                                        </td>
                                        <td>
                                            <button
                                                className='btn table-button mx-1'
                                                onClick={() => showVerificationModal(user)}
                                            >
                                                {user.isTeacherVerified ? "Unverify" : "Verify"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
                                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button onClick={() => paginate(i + 1)} className="page-link">
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {showModal && (
                    <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Teacher Certificate</h5>
                                    <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    {selectedUser && (
                                        <iframe
                                            src={selectedUser.teacherCertificatePath}
                                            title="Certificate PDF"
                                            width="100%"
                                            height="500px"
                                        ></iframe>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showConfirmationModal && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm {isVerified ? 'Unverify' : 'Verify'}</h5>
                                    <button type="button" className="btn-close" onClick={closeConfirmationModal}></button>
                                </div>
                                <div className="modal-body text-dark">
                                    <p>Are you sure you want to {isVerified ? 'unverify' : 'verify'} this teacher?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeConfirmationModal}>Cancel</button>
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={() => handleVerification(selectedUser._id)}
                                    >
                                        {isVerified ? 'Unverify' : 'Verify'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminTeachers;
