import { useNavigate } from "react-router"

const HangupButton = ({videoStream, callStatus, setCallStatus, peerConnection, localVideo, disableVideo}) => {
    const navigate = useNavigate()
    const hangup = () => {
        console.log('peerConnection:', peerConnection)
        const copyLocalVideo = localVideo
        if (peerConnection) {
            console.log('peerConnection before:', peerConnection)
            const copyCallStatus = {...callStatus}
            copyCallStatus.current = 'complete'
            setCallStatus(copyCallStatus)
            peerConnection.disconnect()
            peerConnection.destroy()
            console.log('peerConnection after:', peerConnection)
            const tracks = videoStream.getTracks()
            tracks.forEach(track => track.stop());
            disableVideo()
            navigate('/')
            // peerConnection = null
            // copyLocalVideo.current.srcObject = null
        }
    }

    if(callStatus.current === 'complete') {
        return <h1>Everything done</h1>
    }
    return (
        <>
            <button onClick={hangup}>Hangup</button>
        </>
    )
}

export default HangupButton