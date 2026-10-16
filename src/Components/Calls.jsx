import Peer from "peerjs"
import { useEffect, useMemo, useState } from "react"
import { useRef } from "react"
import { useNavigate, useOutletContext } from "react-router"
import Video from "./Video"
import createPeer from "../peerjsUtils/createPeer"
import FallbackVideo from "./FallbackVideo"

export default function Call() {
    const localVideo = useRef()
    const [remotesVideos, setRemotesVideos] = useState([])
    const [streamState, setStreamState] = useState(null)
    const {id, socket, conversationId, isCalling, callerId, conversation, username} = useOutletContext()
    const [othersParticipantsVideos, setOthersParticipantsVideos] = useState(conversation.participants.filter(participant => participant.userId !== id).map(participant => ({remoteVideo: null, id: participant.userId, username: participant.user.username})))
    // console.log('id:', id)
    // console.log('conversationId:', conversationId)
    // const peer = useMemo(() =>
            //     new Peer(id, {
            //     port: 3001,
            //     path: "/peerjs",
            //     secure: false,
            //     host: "localhost",
            // }),
    //     [id],
    // );
    const [peer, setPeer] = useState()
    const [peers, setPeers] = useState({})
    const [callStatus, setCallStatus] = useState({
        haveMedia: true,
        videoEnabled: null,
        audioEnabled: true,
    })
    // console.log('peers:', peers)
    const peerRef = useRef(null)
    const navigate = useNavigate()

    // console.log('PeerRef out:', peerRef.current?.id)
    // console.log('typeOf RemotesVideos out:', typeof remotesVideos)



    useEffect(() => {
        const listenResponse = (response, callerId) => {
            console.log('(response, callerId):', (response, callerId))
        }
        socket.on('response', listenResponse)
        
        return () => {
            socket.off(listenResponse)
        }
    }, [])
    
    
    useEffect(() => {
        if(!isCalling) {
            navigate(window.location.pathname.replace(/\/video.*/, ""))
            return
        }
        // console.log('peer-id first useEffect:', peer.id)
        // const peer2 = peer
        // console.log("window.URLPattern:", window.location.pathname.replace(/\/video.*/, ""));
        console.log("PeerRef in first useEffevt:", peerRef.current?.id)

        const constraints = {
            audio: true,
            video: true,
        };
        // function addVideoStream(video, stream) {
        //     video.srcObject = stream;
        //     video.addEventListener("loadedmetadata", () => {
        //         video.play();
        //     });
        // }

        let peerInstance = null;
        let localStream = null;

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                localStream = stream;
                console.log("stream first mediadevices:", stream);
                setStreamState(stream);

                if (peerRef.current) peerRef.current.destroy();
                const peer = new Peer(id, {
                    host: "localhost",
                    path: "/peerjs",
                    port: 3001,
                    secure: false,
                });
                peerInstance = peer;
                peerRef.current = peer;
                const copyCallStatus = {...callStatus}
                copyCallStatus.haveMedia = true;
                copyCallStatus.audioEnabled = true
                copyCallStatus.videoEnabled = true
                setCallStatus(copyCallStatus)

                // setStreamState(stream);
                //  if (!peer) {
                // const peer = createPeer(id, setPeer)
                // console.log('peer after cresate peer:', peer)

                // addVideoStream(localVideo.current, stream);
                // console.log("peer-id before call:", peer.id);
                // console.log("peer.id === peer2.id", peer.id);
                peer.on("call", (call) => {
                    console.log("call in STREAM:", call);
                    call.answer(stream);
                    call.on("stream", (userStream) => {
                        setRemotesVideos((prevRemotesVideos) => {
                            // console.log("remotesVideos after call.answer:", [
                            //     ...prevRemotesVideos,
                            //     { remoteVideo: userStream, id: call.peer },
                            // ]);
                            const filtered = prevRemotesVideos.filter(
                                (video) => video.id !== call.peer,
                            );
                            return [
                                ...filtered,
                                { remoteVideo: userStream, id: call.peer },
                            ];
                        });
                        // const copyOfParticipantsVideos = [othersParticipantsVideos]
                        setOthersParticipantsVideos(othersParticipantsVideos.map(participant => {
                            if(participant.id === call.peer) participant.remoteVideo = userStream
                            return participant
                        }))
                    });
                });
                peer.on("open", (peerId) => {
                    console.log(
                        "Peer successfully connected to server with ID:",
                        peerId,
                    );
                    if (callerId !== id && callerId !== null) {
                        console.log(
                            "callerId !== id && callerId !== nul:",
                            callerId !== id && callerId !== null,
                        );
                        socket.emit("video-connected", conversationId, id);
                    }
                });
                setPeer(peer)
                peer.on("error", (err) => {
                    console.error(
                        "PeerJS Global Error:",
                        err.type,
                        err.message,
                    );
                });

                const videoDisconnected = (userId) => {
                    setRemotesVideos((prev) =>
                        prev.filter((video) => video.id !== userId),
                    );
                };

                const videoConnected = (userId) => {
                    console.log(
                        "peerRef in connectToNewUser videoConnected:",
                        peerRef.current.id,
                    );
                    console.log(
                        '"video-connected", (userId):',
                        "video-connected",
                        userId,
                    );
                    // console.log('streamState:', streamState)
                    // connectToNewUser(userId, streamState, peerRef.current);
                    console.log(
                        "peer.current in videoConnected:",
                        peer.current,
                    );
                    console.log("!peer.current:", !peer.current);
                    console.log("!localStream:", !localStream);
                    console.log(
                        "peerRef.current.destroyed:",
                        peerRef.current.destroyed,
                    );
                    if (
                        !peerRef.current ||
                        !localStream ||
                        peerRef.current.destroyed
                    )
                        return;
                    const call = peerRef.current.call(userId, localStream);
                    console.log("call:", call);
                    call.on("stream", (userStream) => {
                        setRemotesVideos((prev) => {
                            const filtered = prev.filter(
                                (video) => video.id !== userId,
                            );
                            return [
                                ...filtered,
                                { remoteVideo: userStream, id: userId },
                            ];
                        });
                        setOthersParticipantsVideos(othersParticipantsVideos.map(participant => {
                            if(participant.id === userId) {
                                participant.remoteVideo = userStream
                            }
                            return participant
                        }))
                    });
                };

                socket.on("video-connected", videoConnected);
                socket.on("video-disconnected", videoDisconnected);
            })
            .catch((error) => console.error(error));

        return () => {
            console.log("peer in demount:", peer);
            console.log(
                "Démontage du composant : Nettoyage des sockets et du Peer",
            );
            socket.off("video-connected");
            socket.emit("video-disconnected", conversationId, id);
            setRemotesVideos([]);
            if (peerInstance) {
                peerInstance.disconnect();
                peerInstance.destroy();
                peerInstance.current = null;
            }

            peerRef.current = null;
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [callerId, conversationId, id]);

    // if (!isCalling) {
    //     navigate(window.location.pathname.replace(/\/video.*/, ""));
    //     return;
    // }

    return (
        <>
            {/* <div className="videoContainer">
                <video style={{width: 300}} ref={localVideo}></video>
            </div> */}
            {/* <div className="videoContainer"> */}
            {streamState && (
                <Video
                    key={streamState.id}
                    videoStream={{ remoteVideo: streamState, id, username }}
                    callStatus={callStatus}
                    setCallStatus={setCallStatus}
                    peerConnection={peer}
                />
            )}
            {/* </div> */}
            {/* <div className="remotesVideosBox">
                {remotesVideos.map((remoteVideo) => {
                    console.log(" typeof remoteVideo:", remoteVideo);
                    // console.log('videoStream instanceof MediaStream:',remoteVideo instanceof MediaStream)
                    return (
                        <Video key={remoteVideo.id} videoStream={remoteVideo}/>
                    );
                })}
            </div> */}
            <div className="remotesVideosBox">
                {othersParticipantsVideos.map((participant) => {
                    console.log(" typeof remoteVideo:", participant);
                    // console.log('videoStream instanceof MediaStream:',remoteVideo instanceof MediaStream)
                    console.log('participant.remoteVideo?.active === true:', participant.remoteVideo?.active === true)
                    return participant.remoteVideo?.active === true ? (
                        <Video key={participant.id} videoStream={participant}/>
                    ) : (<FallbackVideo username={participant.username}/>)
                })}
            </div>
        </>
    );
}