import { useEffect, useRef } from "react";

export default function Video({videoStream}) {
    const ref = useRef()
    useEffect(() => {
        console.log('videoStream:',videoStream)
        console.log('videoStream instanceof MediaStream:',videoStream instanceof MediaStream)
        ref.current.srcObject = videoStream
        ref.current.addEventListener('loadedmetadata', () => {
            ref.current.play()
        })
    }, [videoStream]);
    return <video ref={ref}></video>
}