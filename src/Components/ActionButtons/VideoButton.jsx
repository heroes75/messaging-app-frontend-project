const VideoButton = ({videoStream, setCallStatus, callStatus}) => {
    const videoButton = () => {
        const copyCallStatus = {...callStatus}
        if (copyCallStatus.videoEnabled) {
            copyCallStatus.videoEnabled = false
            setCallStatus(copyCallStatus)
            const tracks = videoStream.getVideoTracks()
            tracks.forEach(track => track.enabled = false)
        } else if(copyCallStatus.videoEnabled === false) {
            copyCallStatus.videoEnabled = true
            setCallStatus(copyCallStatus)
            const tracks = videoStream.getVideoTracks()
            tracks.forEach(track => track.enabled = true)
        }
    }
    return (
        <>
            <button onClick={videoButton}>Cut Video</button>
        </>
    )
}

export default VideoButton