import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar'
import '../css/TeacherLiveClass.css';
import io from 'socket.io-client';
import API_URL from '../../axiourl';
import { useUser } from "../../UserContext"


const socket = io(`${API_URL}`);

function StudentLiveClass() {
    const { user,token } = useUser();
    const [peerId, setPeerId] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    const peerInstance = useRef(null);
    const [stream, setStream] = useState(null);
    // const [socket, setSocket] = useState(null);
    // const [peerConnection, setPeerConnection] = useState(null);
    // const [hasTeacherStream, setHasTeacherStream] = useState(false)
    const [hasJoined, setHasJoined] = useState(true)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showModal, setShowModal] = useState(false)
    const [hasUnread, setHasUnread] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const classId = location.state?.classId;
    const courseId = location.state?.classId;
    const classTitle = location.state?.title;
    const userName = user.name

    const classPeerId = location.state?.peerId
    console.log("class peerid:", classPeerId)
    const [remotePeerIdValue, setRemotePeerIdValue] = useState("");

    useEffect(() => {
        socket.emit('join-class', classId);

        socket.on('receive-message', (messageData) => {
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setHasUnread(true)
            console.log("has unread:", hasJoined)
        });

        socket.on('teacher-ended-class', (classId) => {
            handleEndClass()
            console.log("class ended")
        });

        return () => {
            socket.off('receive-message');
        };
    }, [classId]);

    const sendMessage = () => {
        if (newMessage.trim() === '') return;

        socket.emit('send-message', { classId, userName, message: newMessage });
        // setMessages((prevMessages) => [...prevMessages, { userName, message: newMessage }]);
        setNewMessage('');
    };

    const joinClass = () => {
        setRemotePeerIdValue(classPeerId);
        call(remotePeerIdValue)
            .then(() => {
                setHasJoined(false);
            })
            .catch((err) => {
                console.error("Error joining the class:", err);
                setHasJoined(false);
            });
    };


    const startSelfVideo = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            currentUserVideoRef.current.srcObject = mediaStream;

            await new Promise((resolve, reject) => {
                const videoElement = currentUserVideoRef.current;

                const onLoadedMetadata = () => {
                    videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
                    resolve();
                };

                videoElement.addEventListener('loadedmetadata', onLoadedMetadata);

                setTimeout(() => reject('Video metadata loading timed out'), 5000);
            });

            try {
                await currentUserVideoRef.current.play();
            } catch (err) {
                console.error('Error playing video:', err);
            }

            setStream(mediaStream);
            return mediaStream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    useEffect(() => {
        const peer = new Peer();

        peer.on('open', (id) => {
            setPeerId(id);
            console.log("student peerid:", id)

        });

        peer.on('call', (call) => {
            startSelfVideo().then((mediaStream) => {
                call.answer(mediaStream);
                call.on('stream', (remoteStream) => {
                    remoteVideoRef.current.srcObject = remoteStream;

                    const videoElement = remoteVideoRef.current;

                    videoElement.onloadedmetadata = () => {
                        try {
                            videoElement.play().catch((err) => {
                                console.error("Error trying to play remote video: ", err);
                            });
                        } catch (err) {
                            console.error("Error playing video: ", err);
                        }
                    };
                });
            });
        });

        peerInstance.current = peer;

        startSelfVideo();

        // return () => {
        //     socket.emit('student-disconnected', peerId); // Emit to server that the student disconnected
        // };

    }, []);

    const call = (remotePeerId) => {
        return new Promise((resolve, reject) => {
            startSelfVideo()
                .then((mediaStream) => {
                    const callInstance = peerInstance.current.call(remotePeerId, mediaStream);

                    callInstance.on('stream', (remoteStream) => {
                        const videoElement = remoteVideoRef.current;

                        if (videoElement) {
                            videoElement.srcObject = remoteStream;

                            videoElement.onloadedmetadata = () => {
                                try {
                                    videoElement.play().catch((err) => {
                                        console.error("Error trying to play remote video: ", err);
                                    });
                                    resolve();
                                } catch (err) {
                                    console.error("Error playing video: ", err);
                                    reject(err);
                                }
                            };
                        } else {
                            reject(new Error("Remote video element not found."));
                        }
                    });

                    callInstance.on('error', (error) => {
                        console.error("Error during call:", error);
                        reject(error);
                    });
                })
                .catch((err) => {
                    console.error("Error starting self video: ", err);
                    reject(err);
                });
        });
    };




    const handleEndClass = async () => {
        try {
            // 1. Notify teacher through socket
            socket.emit('student-disconnected', { 
                peerId,
                classId, // Make sure classId is available in scope
                studentId: user.id // Assuming you have user context
            });
    
            // 2. Clean up media streams
            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop();
                    console.log(`Track stopped: ${track.kind}`);
                });
                setStream(null);
            }
    
            // 3. Clean up peer connections
            if (peerInstance.current) {
                // Close all media calls
                if (peerInstance.current.connections) {
                    Object.keys(peerInstance.current.connections).forEach((peerId) => {
                        const connections = peerInstance.current.connections[peerId];
                        connections.forEach((conn) => {
                            // Check if it's a MediaConnection (call)
                            if (conn.peerConnection) {
                                conn.peerConnection.close();
                            }
                            conn.close();
                            console.log(`Closed connection to peer: ${peerId}`);
                        });
                    });
                }
    
                // Destroy the peer instance completely
                peerInstance.current.destroy();
                peerInstance.current = null;
            }
    
            // 4. Clean up video elements
            if (currentUserVideoRef.current) {
                const stream = currentUserVideoRef.current.srcObject;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                currentUserVideoRef.current.srcObject = null;
            }
    
            if (remoteVideoRef.current) {
                const stream = remoteVideoRef.current.srcObject;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                remoteVideoRef.current.srcObject = null;
            }
    
            // 5. Leave the socket room
            socket.emit('leave-class', classId);
    
            // 6. Navigate away
            navigate("/student-view-classes", { replace: true });
    
        } catch (error) {
            console.error("Error during class cleanup:", error);
            // Still try to navigate away even if there's an error
            navigate("/student-view-classes", { replace: true });
        }
    };

    const toggleMute = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];

            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsCameraOff(!isCameraOff);
        }
    };

    const toggleMessage = () => {
        setHasUnread(false)
        setShowModal(!showModal)
    };

    return (
        <div className="live-class-page">
            <StudentSidebar />
            <div className="live-class-content">
                <header className="live-class-header">
                    {!hasJoined ? (
                        <>
                            <h3 >{classTitle}</h3>
                        </>
                    ) : (
                        <>
                            <h4>Live Class</h4>
                            <button className="btn table-button " onClick={() => joinClass()}>Join</button>
                        </>
                    )}

                </header>

                <div className="video-section row pt-4">

                    <div className="col teacher-video-section">
                        <small>Teacher</small>
                        <video ref={remoteVideoRef} className="teacher-video" />
                    </div>

                    <div className='col student-self-video-section'>
                        <small>You</small>

                        <video ref={currentUserVideoRef} className="student-self-video me-2" />
                    </div>
                </div>

                <div className="controls-bar">
                    <button onClick={handleEndClass} className="control-btn end-call">
                        <i className="fa-solid fa-phone"></i>
                    </button>
                    <button onClick={toggleCamera} className="control-btn">
                        <i className={`fa-solid ${isCameraOff ? 'fa-video-slash' : 'fa-video'}`}></i>
                    </button>
                    <button onClick={toggleMute} className="control-btn">
                        <i className={`fa-solid ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                    </button>
                    <button onClick={toggleMessage} className="control-btn">
                        <i class="fa-solid fa-comment"></i>
                        {hasUnread && <p className="class-red-dot"></p>}
                    </button>
                    {/* <div>
                    <a href="#!" onClick={toggleMessage} className="sidebar-item">
                    <i class="fa-solid fa-comment"></i>
                        {hasUnread && <span className="class-red-dot"></span>}
                    </a>
                    </div> */}
                </div>

                {showModal && (
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Class Chat</h5>
                                    <button type="button" className="btn-close" onClick={toggleMessage}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="chat-container">
                                        <div className="chat-box">
                                            {messages.map((msg, index) => (
                                                <div
                                                    key={index}
                                                    className="border-bottom py-2"
                                                >
                                                    <strong>{msg.userName}: </strong>
                                                    {msg.message}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <div className="chat-input w-100 d-flex">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="form-control"
                                        />
                                        <button onClick={sendMessage} className="btn live-chat-button table-button ms-2">
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentLiveClass;
