import { useEffect, useRef } from "react";
import styles from '../Styles/Video.module.css'
import ActionButtons from "./ActionButtons/ActionButtons";

export default function Video({videoStream, callStatus, setCallStatus, peerConnection}) {
    const ref = useRef(null)
    useEffect(() => {
        // console.log('videoStream:',videoStream)
        // console.log('videoStream instanceof MediaStream:',videoStream.remoteVideo instanceof MediaStream)
        ref.current.srcObject = videoStream.remoteVideo
        console.log('videoStream in video:', videoStream)
        // ref.current.addEventListener('loadedmetadata', () => {
        //     ref.current.play()
        // })
    }, [videoStream]);
    const disableVideo = () => {
        console.log('ref.current.srcObject before:', ref.current.srcObject)
        ref.current.srcObject = null
        console.log('ref.current.srcObject:', ref.current.srcObject)
    }
    return (
        <div className={styles.videoContainer}>
            <video className={styles.video} width={300} ref={ref} autoPlay></video>
            <p className={styles.username}>{videoStream.username}</p>
            { callStatus && 
            (<div className={styles.buttonContainers}>
                <ActionButtons disableVideo={disableVideo} localVideo={ref} callStatus={callStatus} setCallStatus={setCallStatus} videoStream={videoStream.remoteVideo} peerConnection={peerConnection} />
            </div>)
            }
        </div>
    )
}