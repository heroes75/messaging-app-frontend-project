import { useEffect, useRef } from "react";
import styles from '../Styles/Video.module.css'

export default function Video({videoStream}) {
    const ref = useRef(null)
    useEffect(() => {
        // console.log('videoStream:',videoStream)
        // console.log('videoStream instanceof MediaStream:',videoStream.remoteVideo instanceof MediaStream)
        ref.current.srcObject = videoStream.remoteVideo
        console.log('videoStream.remoteVideo:', videoStream.remoteVideo)
        // ref.current.addEventListener('loadedmetadata', () => {
        //     ref.current.play()
        // })
    }, [videoStream]);
    return (
        <div className={styles.videoContainer}>
            <video className={styles.video} width={300} ref={ref} autoPlay></video>
            <p className={styles.username}>{videoStream.id}</p>
            <div className={styles.buttonContainers}>
                <button>HangUp</button>
                <button>Cut Audio</button>
                <button>Cut Video</button>
            </div>
        </div>
    )
}