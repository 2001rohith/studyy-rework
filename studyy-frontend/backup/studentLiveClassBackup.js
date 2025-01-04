import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import { io } from 'socket.io-client';
import '../TeacherLiveClass.css';

function StudentLiveClass() {
    const location = useLocation();
    const navigate = useNavigate();
    const { classId, courseId } = location.state;
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const videoRef = useRef(null);
    const chatRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const playButtonRef = useRef(null);

    useEffect(() => {
        console.log("Class ID used:", classId);

        const newSocket = io("http://localhost:8000");
        setSocket(newSocket);

        newSocket.emit('join-class', { classId, role: 'Student' });

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerConnectionRef.current = pc;

        pc.oniceconnectionstatechange = () => {
            console.log(`ICE Connection State: ${pc.iceConnectionState}`);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("New ICE Candidate:", event.candidate);
            } else {
                console.log("All ICE candidates sent");
            }
        };

        pc.onicegatheringstatechange = () => {
            console.log(`ICE Gathering State: ${pc.iceGatheringState}`);
        };

        pc.ontrack = (event) => {
            console.log("Student received track:", event.streams[0]);
            event.streams[0].getTracks().forEach((track) => {
                console.log(`Track kind: ${track.kind}, enabled: ${track.enabled}, muted: ${track.muted}, ID: ${track.id}`);
                if (track.kind === 'video') {
                    console.log("Video track found:", track);
                }
            });

            if (!videoRef.current.srcObject) {
                console.log("Setting stream to video element");
                videoRef.current.srcObject = event.streams[0];

                window.videoElement = videoRef.current; 

                videoRef.current.muted = false; 

                console.log("Attempting to start video playback");

                console.log("Video element state before playback:", {
                    srcObject: videoRef.current.srcObject,
                    muted: videoRef.current.muted,
                    readyState: videoRef.current.readyState,
                });

                const videoTracks = videoRef.current.srcObject.getVideoTracks();
                const audioTracks = videoRef.current.srcObject.getAudioTracks();
                console.log("Video Tracks:", videoTracks);
                console.log("Audio Tracks:", audioTracks);

                videoTracks.forEach((track) => {
                    track.enabled = true;
                    track.onunmute = () => {
                        console.log("Video track unmuted:", track);
                    };
                });

                audioTracks.forEach((track) => {
                    track.enabled = true;
                    track.onunmute = () => {
                        console.log("Audio track unmuted:", track);
                    };
                });

                videoRef.current.play().then(() => {
                    console.log("Video playback started.");

                    console.log("Video element state after playback starts:", {
                        srcObject: videoRef.current.srcObject,
                        muted: videoRef.current.muted,
                        readyState: videoRef.current.readyState,
                    });

                    if (playButtonRef.current) {
                        console.log("Button made hidden");
                        playButtonRef.current.style.display = "none";
                    }
                }).catch((error) => {
                    console.error("Error starting video playback:", error);
                    if (playButtonRef.current) {
                        playButtonRef.current.style.display = "block";
                    }
                });
            } else {
                console.log("Duplicate stream, skipping...");
            }
        };

        newSocket.on("teacher-offer", async ({ offer }) => {
            console.log("Student received offer:", offer);

            if (!peerConnectionRef.current) {
                console.error("PeerConnection is null or not initialized");
                return;
            }

            try {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnectionRef.current.createAnswer();
                console.log("Student created answer:", answer);
                await peerConnectionRef.current.setLocalDescription(answer);
                newSocket.emit("student-answer", { classId, answer });
            } catch (error) {
                console.error("Error handling teacher offer:", error);
            }
        });

        newSocket.on("teacher-ice-candidate", async ({ candidate }) => {
            console.log("Student received ICE candidate:", candidate);

            if (peerConnectionRef.current && candidate) {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error("Error adding ICE candidate:", error);
                }
            } else {
                console.error("PeerConnection is null or candidate is invalid");
            }
        });

        newSocket.on("receive-message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        newSocket.on("class-ended", () => {
            alert("The class has ended.");
            navigate(`/student-view-classes`, { state: { id: courseId }, replace: true });
        });

        return () => {
            console.log("Cleaning up...");

            if (peerConnectionRef.current) {
                peerConnectionRef.current.ontrack = null;
                peerConnectionRef.current.onicecandidate = null;
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }

            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }

            if (socket) {
                socket.disconnect();
            }
        };
    }, [classId, courseId, navigate]);

    useEffect(() => {
        const handlePlay = () => {
            console.log("Play button clicked");
            if (videoRef.current) {
                console.log("Attempting to start playback from play button click");
                videoRef.current.play().then(() => {
                    console.log("Video playback started.");
                    if (playButtonRef.current) {
                        playButtonRef.current.style.display = "none";
                    }
                }).catch((error) => {
                    console.error("Error starting video playback:", error);
                });
            }
        };

        if (playButtonRef.current) {
            console.log("Adding event listener to play button");
            playButtonRef.current.addEventListener("click", handlePlay);
        }

        return () => {
            if (playButtonRef.current) {
                console.log("Removing event listener from play button");
                playButtonRef.current.removeEventListener("click", handlePlay);
            }
        };
    }, []);

    const handleSendMessage = () => {
        if (messageInput.trim() && socket) {
            const message = { sender: "Student", text: messageInput };
            socket.emit("send-message", { classId, message });
            setMessages((prevMessages) => [...prevMessages, message]);
            setMessageInput("");
        }
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;

        }
    }, [messages]);

    return (
        <div className="live-class-page">
            <StudentSidebar />
            <div className="live-class-content">
                <header className="live-class-header">
                    <h4>Live Class</h4>
                    <h2>Live - Physics</h2>
                </header>

                <div className="video-section">
                    <video ref={videoRef} autoPlay playsInline  className="student-video" style={{ width: '100%', height: '100%' }}></video>
                    <button className='play-button' ref={playButtonRef}>Play Video</button>
                </div>

                <div className="chat-section">
                    <div className="chat-box" ref={chatRef}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.sender === "Teacher" ? "teacher-message" : "student-message"}`}
                            >
                                <strong>{msg.sender}:</strong> {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentLiveClass;
