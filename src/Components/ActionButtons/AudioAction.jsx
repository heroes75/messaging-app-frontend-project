const AudioButton = ({callStatus, setCallStatus, videoStream}) => {
    const audioButton = () => {
        const tracks = videoStream.getAudioTracks()
        console.log('tracks before modify:', tracks)
        const copyCallStatus = {...callStatus}
        console.log('copyCallStatus:', copyCallStatus)
        if (callStatus.audioEnabled === false) {
            copyCallStatus.audioEnabled = true
            setCallStatus(copyCallStatus)
            const tracks = videoStream.getAudioTracks()
            tracks.forEach(t =>t.enabled = true);
            console.log('tracks after modify:', tracks)
        } else if (callStatus.audioEnabled === true) {
             copyCallStatus.audioEnabled = false
            setCallStatus(copyCallStatus)
            const tracks = videoStream.getAudioTracks()
            tracks.forEach(t =>t.enabled = false);
            console.log('tracks after modify:', tracks)
        }
    } 
    return (
        <>
            <button onClick={audioButton}>Cut Audio</button>
        </>
    )
}

export default AudioButton