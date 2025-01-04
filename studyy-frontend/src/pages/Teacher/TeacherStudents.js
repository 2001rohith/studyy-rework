// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import StudentSidebar from '../components/StudentSidebar';

// import axios from 'axios';
// import API_URL from '../../axiourl';

// const apiClient = axios.create({
//     baseURL: API_URL,
//     headers: {
//         'Accept': 'application/json',
//     },
// });

// function StudentAllAssignments() {
//     const navigate = useNavigate();
//     const user = JSON.parse(localStorage.getItem('user'));
//     const [loading, setLoading] = useState(true)
//     const [assignments, setAssignments] = useState([]);
//     const fileInputRefs = useRef({});
//     const [showToast, setShowToast] = useState(false)
//     const [modal, setModal] = useState(false)
//     const [message, setMessage] = useState("")
//     const [assignmentDetails, setAssignmentDetails] = useState({ title: "", description: "", dueDate: "" })

//     useEffect(() => {
//         if (!user) {
//             navigate('/');
//             return;
//         }
//         const getAssignments = async () => {
//             try {
//                 const response = await apiClient.get(`/course/student-get-assignments/${user.id}`, {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 });
//                 const data = response.data;
//                 if (response.status === 200) {
//                     setAssignments(data.assignments);
//                     setLoading(false)
//                     console.log("assignments:", data.assignments);
//                 } else {
//                     console.log("something went wrong:", data.message);
//                 }
//             } catch (error) {
//                 console.log("error in fetching assignments:", error);
//             }
//         };
//         getAssignments();
//     }, []);

//     const handleFileUploadClick = (assignmentId) => {
//         if (fileInputRefs.current[assignmentId]) {
//             fileInputRefs.current[assignmentId].click();
//         }
//     };

//     const handleFileChange = async (e, assignmentId) => {
//         const file = e.target.files[0];
//         if (!file) {
//             alert('No file selected');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('studentId', user.id);

//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('Authentication token is missing');
//             }

//             const response = await apiClient.post(`/course/submit-assignment/${assignmentId}`, formData, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });

//             const data = response.data

//             if (response.status === 200) {
//                 setMessage("Assignment Uploaded")
//                 setShowToast(true)
//                 setAssignments(prevAssignments =>
//                     prevAssignments.map(a =>
//                         a._id === assignmentId
//                             ? {
//                                 ...a,
//                                 submissions: Array.isArray(a.submissions)
//                                     ? [...a.submissions, { student: user.id, filePath: 'path-to-file' }]
//                                     : [{ student: user.id, filePath: 'path-to-file' }],
//                             }
//                             : a
//                     )
//                 );
//             } else {
//                 console.log("Error:", data.message);
//                 setMessage(data.message)
//                 setShowToast(true)
//             }
//         } catch (error) {
//             if (error.response) {
//                 console.error('Server Error:', error.response.data);

//             } else {
//                 console.error('Error submitting assignment:', error.message);

//             }
//         }
//     };

//     const openUploadModal = (assignment) => {
//         setAssignmentDetails(assignment);
//         setModal(true);
//     };

//     const closeUploadModal = () => {
//         setModal(false);
//         setAssignmentDetails({ title: '', description: '' });
//     }

//     if (loading) {
//         return <div className="spinner-border text-primary spinner2" role="status">
//             <span className="visually-hidden">Loading...</span>
//         </div>
//     }
//     return (
//         <>
//             <div className='row'>
//                 <div className='col text-light side-bar'>
//                     <StudentSidebar />
//                 </div>
//                 <div className='col text-dark'>
//                     <div className='row headers'>
//                         <h4>Assignments</h4>
//                     </div>
//                     <div className='row table-content'>
//                         <div className="row mt-3 text-dark">
//                             <h5 className='mb-3 ms-2'>All Assignments</h5>
//                             <div className="scroll-container">
//                                 {assignments.length === 0 ? (
//                                     <p>There is no assignments</p>
//                                 ) : (
//                                     assignments.map((assignment) => (
//                                         <div className="card course-card mx-2" style={{ width: '20rem', height: "30rem" }} key={assignment._id}>
//                                             <img src="/banner9.jpg" className="card-img-top" alt="..." style={{ height: '200px', objectFit: 'cover', borderRadius: "15px" }} />
//                                             <div className="card-body text-center">
//                                                 <h5 className="card-title">{assignment.title}</h5>
//                                                 <h6>{assignment.course}</h6>
//                                                 <small className="card-text">{assignment.description}</small>
//                                             </div>
//                                             <div className='text-center'>
//                                                 {
//                                                     assignment.submissions && Array.isArray(assignment.submissions) &&
//                                                         !assignment.submissions.some(submission => submission.student.toString() === user.id.toString()) ? (
//                                                         <button
//                                                             className="btn button mb-4"
//                                                             style={{ width: "100px" }}
//                                                             onClick={() => openUploadModal(assignment)}
//                                                         >
//                                                             View
//                                                         </button>
//                                                     ) : (
//                                                         <h6 className='mb-5' style={{ color: "#28A804" }}>Submitted!</h6>
//                                                     )
//                                                 }
//                                             </div>
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {modal && (
//                 <div
//                     className="modal show d-block"
//                     tabIndex="-1"
//                     role="dialog"
//                     style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
//                 >
//                     <div className="modal-dialog" role="document">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Upload Assignment</h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={closeUploadModal}
//                                 ></button>
//                             </div>
//                             <div className="modal-body">
//                                 <p><strong>Title:</strong> {assignmentDetails.title}</p>
//                                 <p><strong>Description:</strong> {assignmentDetails.description}</p>
//                                 <div className="form-group">
//                                     <label htmlFor="fileUpload" className="form-label">
//                                         Choose a file to upload
//                                     </label>
//                                     <>
//                                         <button
//                                             className="btn button mb-4"
//                                             style={{ width: "100px" }}
//                                             onClick={() => handleFileUploadClick(assignmentDetails._id)}
//                                         >
//                                             Upload
//                                         </button>
//                                         <input
//                                             type="file"
//                                             accept=".pdf,.mp4"
//                                             style={{ display: "none" }}
//                                             ref={(el) => (fileInputRefs.current[assignmentDetails._id] = el)}
//                                             onChange={(e) => handleFileChange(e, assignmentDetails._id)}
//                                         />
//                                     </>
//                                 </div>
//                             </div>
//                             <div className="modal-footer">
//                                 <button
//                                     type="button"
//                                     className="btn button"
//                                     onClick={closeUploadModal}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn button"
//                                     onClick={() => console.log('Upload functionality here')}
//                                 >
//                                     Upload
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {showToast && (
//                 <div className="toast show position-fixed  bottom-0 end-0 m-3" style={{ borderRadius: "15px", backgroundColor: "#0056b3", color: "white" }}>
//                     <div className="toast-body">
//                         {message}
//                         <button type="button" className="btn-close ms-2 mb-1" onClick={() => setShowToast(false)}></button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// export default StudentAllAssignments;

