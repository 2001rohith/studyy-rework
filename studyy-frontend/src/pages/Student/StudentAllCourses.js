import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext";

function StudentAllCourses() {
    const { fetchCourses } = useCourseService();
    const navigate = useNavigate();
    const { user, token } = useUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [modulesFilter, setModulesFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 4;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedSearch = useCallback(
        debounce((searchTerm) => {
            setCurrentPage(1);
            setSearch(searchTerm);
        }, 5000),
        []
    )

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.trim();
        setSearch(e.target.value)

        if (searchTerm !== '') {
            debouncedSearch(searchTerm);
        } else {
            setSearch('');
            setCurrentPage(1);
        }
    };

    useEffect(() => {
        const getCourses = async () => {
            try {
                if (!user || !user.id) {
                    setError('User information not found');
                    navigate("/", { replace: true });
                    return;
                }
                setLoading(true);
                const response = await fetchCourses(user.id, {
                    page: currentPage,
                    limit: itemsPerPage,
                    search: search || '',
                    modulesFilter: modulesFilter || '',
                });
                console.log("response:", response)

                setCourses(response.courses);
                setTotalPages(Math.max(response.totalPages || 1, 1));
            } catch (error) {
                console.error("Error in fetching courses:", error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        getCourses();
    }, [user, navigate, currentPage, search, modulesFilter]);

    const viewCourse = (id) => {
        navigate("/student-check-course", { state: { courseId: id } });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleClearSearch = () => {
        setSearch('');
        setCurrentPage(1);
    };

    const handleModuleFilter = (filter) => {
        setModulesFilter(filter);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="spinner-border text-primary spinner2" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col text-light side-bar">
                <StudentSidebar />
            </div>
            <div className="col text-dark">
                <div className="row headers">
                    <h4>Courses</h4>
                </div>
                <div className="row table-content">
                    <div className="search-bar ms-1 border-bottom pb-3">
                        <input
                            type="text"
                            placeholder="Search course..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <button
                            className="btn search-bar-button"
                            onClick={handleClearSearch}
                            disabled={!search}
                        >
                            Clear
                        </button>
                        <div className="dropdown ms-2">
                            <button
                                className="btn filter-button dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {modulesFilter ? modulesFilter : "Modules"}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => handleModuleFilter('')}
                                    >
                                        Default
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => handleModuleFilter('Less')}
                                    >
                                        1-2
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => handleModuleFilter('Medium')}
                                    >
                                        3-4
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => handleModuleFilter('More')}
                                    >
                                        4+
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row mt-3 text-dark">
                        <h5 className="mb-3">Our courses!</h5>
                        <div className="scroll-container">
                            {courses.length === 0 ? (
                                <div className="alert alert-info" role="alert">
                                    No courses match your search criteria.
                                </div>
                            ) : (
                                courses.map((course) => (
                                    <div
                                        className="card course-card mx-2"
                                        style={{ width: '20rem', height: "25rem" }}
                                        key={course._id}
                                    >
                                        <img
                                            src="/course-card1.jpg"
                                            className="card-img-top"
                                            alt="Course thumbnail"
                                            style={{ height: '200px', objectFit: 'cover', borderRadius: "15px" }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{course.title}</h5>
                                            <small className="card-text mb-1">{course.description}</small>
                                            <div className="text-center">
                                                <button
                                                    className="btn button mt-5"
                                                    onClick={() => viewCourse(course._id)}
                                                >
                                                    More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="pagination-controls text-center mt-4 mb-4">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                </div>
            </div>
        </div>
    );
}

export default StudentAllCourses;
