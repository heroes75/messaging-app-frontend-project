import AudioButton from "./AudioAction"
import HangupButton from "./HangupButton"
import VideoButton from "./VideoButton"

const ActionButtons = ({callStatus, setCallStatus, videoStream, peerConnection, localVideo, disableVideo}) => {
    return (
        <>
            <AudioButton callStatus={callStatus} setCallStatus={setCallStatus} videoStream={videoStream}/>
            <VideoButton callStatus={callStatus} setCallStatus={setCallStatus} videoStream={videoStream}/>
            <HangupButton disableVideo={disableVideo} localVideo={localVideo} callStatus={callStatus} setCallStatus={setCallStatus} videoStream={videoStream} peerConnection={peerConnection}/>
        </>
    )
}

export default ActionButtons