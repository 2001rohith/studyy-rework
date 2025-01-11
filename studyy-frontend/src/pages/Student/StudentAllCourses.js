import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import { useCourseService } from '../../utils/courseService';
import { useUser } from "../../UserContext";
import debounce from 'lodash/debounce';

function StudentAllCourses() {
    const { fetchCourses } = useCourseService()
    const navigate = useNavigate();
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [modulesFilter, setModulesFilter] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const itemsPerPage = 4;

    const debouncedSearch = debounce((searchTerm) => {
        setSearch(searchTerm);
        setCurrentPage(1);
    }, 500);

    useEffect(() => {
        getCourses();
    }, [currentPage, search, modulesFilter])

    const getCourses = async () => {
        try {
            setLoading(true);
            const response = await fetchCourses(user.id, {
                page: currentPage,
                limit: itemsPerPage,
                search: search || '',
                modulesFilter: modulesFilter || '',
            });

            const { courses, totalPages, totalCourses } = response.data;
            setCourses(courses || []);
            setTotalPages(totalPages);
            setTotalCourses(totalCourses);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };


    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const clearSearch = () => {
        setSearch('');
        setCurrentPage(1);
    };

    const handleModulesFilter = (value) => {
        setModulesFilter(value);
        setCurrentPage(1);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="pagination-controls text-center mt-4">
                <button
                    className="btn btn-outline-primary mx-1"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mx-2">Page {currentPage} of {totalPages}</span>
                <button
                    className="btn btn-outline-primary mx-1"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    // if (loading) {
    //   return (
    //     <div className="spinner-border text-primary spinner2" role="status">
    //       <span className="visually-hidden">Loading...</span>
    //     </div>
    //   );
    // }

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
                            defaultValue={search}
                            onChange={handleSearchChange}
                        />
                        <button
                            className="btn search-bar-button"
                            onClick={clearSearch}
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
                                {modulesFilter || "Modules"}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <button className="dropdown-item" onClick={() => handleModulesFilter('')}>
                                        Default
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => handleModulesFilter('Less')}>
                                        1-2
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => handleModulesFilter('Medium')}>
                                        3-4
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => handleModulesFilter('More')}>
                                        4+
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="row mt-3 text-dark">
                        <h5 className="mb-3">Our Courses</h5>
                        <div className="scroll-container">
                            {courses.length === 0 ? (
                                <div className="alert alert-info" role="alert">
                                    No courses match.
                                </div>
                            ) : loading ? (
                                <div className="text-center my-3">
                                    <div className="spinner-border text-primary spinner3" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="row row-cols-1 row-cols-md-2 g-4">
                                    {courses.map((course) => (
                                        <div className="col" key={course._id}>
                                            <div className="card course-card  mb-5">
                                                <img
                                                    src="/course-card1.jpg"
                                                    className="card-img-top"
                                                    alt="Course thumbnail"
                                                    style={{ objectFit: 'cover', borderRadius: '15px' }}
                                                />
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">{course.title}</h5>
                                                    <p className="card-text mb-1">{course.description}</p>
                                                    <div className="text-center mt-auto">
                                                        <button
                                                            className="btn button"
                                                            onClick={() =>
                                                                navigate("/student-check-course", {
                                                                    state: { courseId: course._id },
                                                                })
                                                            }
                                                        >
                                                            More
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>;
                </div>
            </div>
            {renderPagination()}
        </div>
    );
}

export default StudentAllCourses;