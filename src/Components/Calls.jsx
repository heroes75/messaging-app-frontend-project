import Peer from "peerjs"
import { useEffect, useMemo, useState } from "react"
import { useRef } from "react"
import { useNavigate, useOutletContext } from "react-router"
import Video from "./Video"

export default function Call() {
    const localVideo = useRef()
    const [remotesVideos, setRemotesVideos] = useState([])
    const [streamState, setStreamState] = useState(null)
    const {id, socket, conversationId, isCalling} = useOutletContext()
    console.log('id:', id)
    console.log('conversationId:', conversationId)
    const peer = useMemo(() => new Peer(id, {
                    port: 3001,
                    path: "/peerjs",
                    secure: false,
                    host: "localhost",
                }), [id])
    const navigate = useNavigate()

    console.log('RemotesVideos out:', remotesVideos)
    console.log('typeOf RemotesVideos out:', typeof remotesVideos)


    
    
    useEffect(() => {
        // console.log('peer-id first useEffect:', peer.id)
        // const peer2 = peer
        console.log(
            "window.URLPattern:",
            window.location.pathname.replace(/\/video.*/, ""),
        );

        socket.emit("video-connected", conversationId, id);
        const constraints = {
            audio: false,
            video: { width: 720, height: 720 },
        };
        function addVideoStream(video, stream) {
            video.srcObject = stream;
            video.addEventListener("loadedmetadata", () => {
                video.play();
            });
        }
        
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                function connectToNewUser(userId, stream, peer) {
                    console.log("peer-id in connectToNewUser:", peer.id);
                    const call = peer.call(userId, stream);
                    console.log("call on connected user:", call);
                    call.on("stream", (userStream) => {
                        console.log("userStream in STREAM:", userStream);
                        setRemotesVideos((prevRemotesVideos) => {
                            console.log("remotesVideos in connectToNewUser stream:",remotesVideos);
                            return [...prevRemotesVideos,userStream];
                        });
                    });
                }
                // setStreamState(stream);
                // const peer = new Peer(id, {
                //     port: 3001,
                //     path: "/peerjs",
                //     secure: false,
                //     host: "localhost",
                // });
                // setPeer(peer);
                // console.log('constraints:', constraints)
                addVideoStream(localVideo.current, stream);
                console.log("peer-id before call:", peer.id);
                console.log("peer.id === peer2.id", peer.id);
                peer.on("call", (call) => {
                    console.log("userStream in STREAM:", call);
                    call.answer(stream);
                    call.on("stream", (userStream) => {
                         setRemotesVideos((prevRemotesVideos) => {
                            // console.log("remotesVideos in connectToNewUser stream:",remotesVideos);
                            return [...prevRemotesVideos,userStream];
                        });
                    });
                    console.log('typeof remotesVideos:',typeof remotesVideos)
                    // setRemotesVideos((remotesVideos) =>
                    //     remotesVideos.push(stream),
                    // );
                    console.log(
                        "remotesVideos in navigator call:",
                        remotesVideos,
                    );
                });
                
                socket.on("video-connected", (userId) => {
                    console.log("userId:", userId);
                    connectToNewUser(userId, stream, peer);
                });
            })
            .catch((error) => console.error(error));
        // return () => {
        //     peer.disconnect()
        //     socket.off('video-connected')
        // }
    }, []);

    // useEffect(() => {
       
        
    //     // socket.on("video-connected", (userId) => {
    //     //             console.log("userId:", userId);
    //     //             connectToNewUser(userId, streamState, peer);
    //     //         });
        
    // }, [id, conversationId, peer, socket, streamState])


        if(!isCalling) {
            navigate(window.location.pathname.replace(/\/video.*/, ''))
            return
        }
    

    return (
        <>
            <video style={{width: 300}} ref={localVideo}></video>
            <div className="remotesVideosBox">
                {
                    remotesVideos.map(remoteVideo => {
                        console.log(' typeof remoteVideo:', typeof remoteVideo)
                        console.log('videoStream instanceof MediaStream:',remoteVideo instanceof MediaStream)
                        return <Video  key={remoteVideo.id} videoStream={remoteVideo} />
                    })
                }
            </div>
        </>
    )
}