import Peer from "peerjs"
import { useEffect, useMemo, useState } from "react"
import { useRef } from "react"
import { useNavigate, useOutletContext } from "react-router"
import Video from "./Video"
import createPeer from "../peerjsUtils/createPeer"

export default function Call() {
    const localVideo = useRef()
    const [remotesVideos, setRemotesVideos] = useState([])
    const [streamState, setStreamState] = useState(null)
    const {id, socket, conversationId, isCalling, callerId} = useOutletContext()
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
    // console.log('peers:', peers)
    const peerRef = useRef(null)
    const navigate = useNavigate()

    // console.log('PeerRef out:', peerRef.current?.id)
    // console.log('typeOf RemotesVideos out:', typeof remotesVideos)


    
    
    useEffect(() => {
        // console.log('peer-id first useEffect:', peer.id)
        // const peer2 = peer
        // console.log("window.URLPattern:", window.location.pathname.replace(/\/video.*/, ""));
        console.log('PeerRef in first useEffevt:', peerRef.current?.id)

        

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

        let peerInstance = null
        let localStream = null
        
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
                            const filtered = prevRemotesVideos.filter(video => video.id !== call.peer);
                            return [
                                ...filtered,
                                { remoteVideo: userStream, id: call.peer },
                            ];
                        });
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
                peer.on("error", (err) => {
                    console.error(
                        "PeerJS Global Error:",
                        err.type,
                        err.message,
                    );
                });

                const videoDisconnected = (userId) => {
                    setRemotesVideos((prev) => prev.filter((video) => video.id !== userId));
                }

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
                            const filtered = prev.filter(video => video.id !== userId);
                            return [...filtered,{ remoteVideo: userStream, id: userId }]
                        });
                    });
                };

                socket.on("video-connected", videoConnected);
                socket.on("video-disconnected", videoDisconnected);
            })
            .catch((error) => console.error(error));
            
        return () => {

            console.log('peer in demount:', peer)
            console.log('Démontage du composant : Nettoyage des sockets et du Peer');
                socket.off("video-connected");
                socket.emit('video-disconnected', conversationId, id)
                setRemotesVideos([])
                if (peerInstance) {
                    peerInstance.disconnect()
                    peerInstance.destroy()
                    peerInstance.current = null;
                }
                
                peerRef.current = null
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                }
        }
    }, [callerId, conversationId, id]);

    // useEffect(() => {
    //     if (!streamState || !peerRef.current) return;
    //     console.log('PeerRef in second useEffevt:', peerRef.current?.id)
    //     console.log('callerId !== id && callerId !== null:', callerId !== id && callerId !== null)
    //     // if (callerId !== id && callerId !== null) {
    //     //     // console.log('is emitting !!!!!!!:', callerId !== id)
    //     //     socket.emit("video-connected", conversationId, id);
    //     // }
    //     function connectToNewUser(userId, stream, peer) {
    //         console.log('stream:', stream)
    //         console.log('userId in debut od connectToNewUser:', userId)
    //         console.log('peer in debut od connectToNewUser:', peer.id)
    //         // peer.id = id
    //         console.log('!peer:', !peer)
    //         console.log('peer.disconnected:', peer.disconnected)
    //         if (!peer || peer.disconnected) {
    //             console.warn("Cannot call: Peer is disconnected from server.");
    //             return;
    //         }
    //                 console.log('id in open:', id)
    //                 const call = peer.call(userId, stream);
    //                 console.log("call on connected user:", call);
    //                 if (!call) {
    //                     console.error('peer undefined')

    //                     return
    //                 }
    //                 console.log('call created:', call)
    //                 call.on("stream", (userStream) => {
    //                 setRemotesVideos((prevRemotesVideos) => {
    //                     console.log("remotesVideos after peer-call:", [
    //                         ...prevRemotesVideos,
    //                         { remoteVideo: userStream, id: userId },
    //                     ]);
    //                     return [
    //                         ...prevRemotesVideos,
    //                         { remoteVideo: userStream, id: userId },
    //                     ];
    //                 });
    //                 })
    //             }
    //     const videoConnected = (userId) => {
    //         console.log("peerRef in connectToNewUser videoConnected:", peerRef.current.id);
    //         console.log(
    //             '"video-connected", (userId):',
    //             "video-connected",
    //             userId,
    //         );
    //         // console.log('streamState:', streamState)
    //         // connectToNewUser(userId, streamState, peerRef.current);
    //         if(!peer.current || !localSteam || peerRef.current.destroyed) return
    //         const call = peerRef.current.call(userId)
    //         call.on('stream', userStream => {
    //             setRemotesVideos((prev) => [
    //                 ...prev,
    //                 { remoteVideo: userStream, id: userId },
    //             ]);
    //         })
    //     }

    //     socket.on("video-connected", videoConnected);
    //     return () => {
    //         // socket.emit("video-disconnected", conversationId, id)
    //         if(socket) {
    //             socket.off("video-connected", videoConnected);
    //             socket.close()
    //             socket.disconnect()
    //         }
            
    //     };
    // }, [streamState]);


        if(!isCalling) {
            navigate(window.location.pathname.replace(/\/video.*/, ''))
            return
        }
    

    return (
        <>
            {/* <div className="videoContainer">
                <video style={{width: 300}} ref={localVideo}></video>
            </div> */}
            <div className="videoContainer">
                {streamState && <Video key={streamState.id} videoStream={{remoteVideo: streamState, id}}/>}
            </div>
            <div className="remotesVideosBox">
                {
                    remotesVideos.map(remoteVideo => {
                        console.log(' typeof remoteVideo:', remoteVideo)
                        // console.log('videoStream instanceof MediaStream:',remoteVideo instanceof MediaStream)
                        return <Video  key={remoteVideo.id} videoStream={remoteVideo} />
                    })
                }
            </div>
        </>
    )
}