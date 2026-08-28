import { useEffect, useRef } from "react";

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
    return <video width={300} ref={ref} autoPlay></video>
}