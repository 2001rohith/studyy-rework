import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useUserService } from '../../utils/userService'
import { useUser } from "../../UserContext"

function AdminHome() {
    const { adminFetchUsers, adminDeleteUser, adminBloackUser } = useUserService()
    const navigate = useNavigate()
    const { user, token } = useUser();
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchEmail, setSearchEmail] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedRole, setSelectedRole] = useState("")
    const [usersPerPage] = useState(6)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isBlocking, setIsBlocking] = useState(false);

    useEffect(() => {
        if (!user || !token) {
            navigate('/');
            return;
        }
        const getUsers = async () => {
            try {
                const data = await adminFetchUsers()
                setUsers(data)
                setFilteredUsers(data)
            } catch (error) {
                console.log("error in fetching users from admin", error)
            }
        }
        getUsers()
    }, [])

    useEffect(() => {
        if (searchEmail === '') {
            setFilteredUsers(users)
        } else {
            const results = users.filter(user =>
                user.email.toLowerCase().includes(searchEmail.toLowerCase())
            );
            setFilteredUsers(results);
        }
    }, [searchEmail, users]);

    useEffect(() => {
        let results
        if (selectedRole === '') {
            setFilteredUsers(users)
        } else if (selectedRole === "teacher") {
            results = users.filter(user =>
                user.role.toLowerCase().includes(selectedRole.toLowerCase())
            );
            setFilteredUsers(results);
        } else {
            results = users.filter(user =>
                user.role.toLowerCase().includes(selectedRole.toLowerCase())
            )
            setFilteredUsers(results);

        }
    }, [selectedRole, users]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDelete = async () => {
        try {
            await adminDeleteUser(selectedUser._id)
            setToastMessage("User deleted successfully");
            setShowToast(true);
            setUsers(users.filter(user => user._id !== selectedUser._id));
            setShowDeleteModal(false);
        } catch (error) {
            console.log("error in fetching users from admin", error)
        }
    }

    const handleBlock = async () => {
        try {
            const data = await adminBloackUser(selectedUser._id)
            setToastMessage(data.message)
            setShowToast(true);
            const updatedUsers = users.map(user =>
                user._id === selectedUser._id ? { ...user, isBlocked: !user.isBlocked } : user
            );
            setUsers(updatedUsers);
            setShowBlockModal(false);
        } catch (error) {
            console.error("Error during blocking/unblocking:", error);
        }
    };

    return (
        <>
            <div className='row'>
                <div className='col text-light side-bar'>
                    <Sidebar />
                </div>
                <div className='col text-light'>
                    <div className='row headers'>
                        <h4>Users</h4>
                    </div>
                    <div className='row content text-dark'>

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
                                    {selectedRole ? selectedRole : "Select Role"}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={() => setSelectedRole('')}
                                        >
                                            All Users
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={() => setSelectedRole('teacher')}
                                        >
                                            Teachers
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={() => setSelectedRole('student')}
                                        >
                                            Students
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {filteredUsers.length === 0 ? (
                            <div className="text-center">
                                <p>No users found.</p>
                            </div>
                        ) : (
                            <table className="table table-borderless table-default table-hover table-striped-columns">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Blocked</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user, index) => (
                                        <tr key={user._id}>
                                            <td>{indexOfFirstUser + index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>{user.isBlocked ? "Yes" : "No"}</td>
                                            <td>
                                                <button
                                                    className="btn table-button mx-1"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedUser(user);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    className="btn table-button mx-1"
                                                    onClick={() => {
                                                        setShowBlockModal(true);
                                                        setSelectedUser(user);
                                                        setIsBlocking(user.isBlocked);
                                                    }}
                                                >
                                                    {user.isBlocked ? "Unblock" : "Block"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {showDeleteModal && (
                            <div className="modal show d-block" tabIndex="-1">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Confirm Delete</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            <p>Are you sure you want to delete this user?</p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showBlockModal && (
                            <div className="modal show d-block" tabIndex="-1">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Confirm {isBlocking ? 'Unblock' : 'Block'}</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowBlockModal(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            <p>Are you sure you want to {isBlocking ? 'unblock' : 'block'} this user?</p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowBlockModal(false)}>Cancel</button>
                                            <button type="button" className="btn btn-warning" onClick={handleBlock}>
                                                {isBlocking ? 'Unblock' : 'Block'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showToast && (
                            <div className="toast show position-fixed bottom-0 end-0 m-3">
                                <div className="toast-body">
                                    {toastMessage}
                                    <button type="button" className="btn-close ms-2 mb-1" onClick={() => setShowToast(false)}></button>
                                </div>
                            </div>
                        )}
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
                                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <a onClick={() => paginate(i + 1)} className="page-link">
                                            {i + 1}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminHome