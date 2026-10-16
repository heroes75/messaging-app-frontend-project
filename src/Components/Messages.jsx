import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from "react-router";
import styles from '../Styles/Message.module.css'
import { io } from "socket.io-client";
import socket from "../socket";


const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/upload`

export default function Messages() {
    const [message, setMessage] = useState('')
    const [msgError, setMsgError] = useState([])
    const [files, setFiles] = useState()
    const [conversation, setConversation] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [callerId, setCallerId] = useState(null)
    const [isReceivingCall, setIsReceivingCall] = useState(false)
    const [responseOfCall, setResponseOfCall] = useState(false)
    const [receiveCallMessage, setReceiveCallMessage] = useState(null)
    const [isAllowCall, setIsAllowCall] = useState(false)
    const [isCalling, setIsCalling] = useState(false)
    const [hash, setHash] = useState('')
    const inputFiles = useRef()
    const {user} = useOutletContext()
    // console.log('peer in msg:', peer.id)
    // console.log('useOutletContext():', useOutletContext())
    // console.log('user msg:', user)
    // const peer = useOutletContext().peer
    const location = useLocation()
    // console.log('participants: msg', participants)
    // console.log('peer:', peer)
    // console.log('location.state.participants:', location)
    const {conversationId} = useParams()
    const navigate = useNavigate()
    const fileTypes = [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon",
    ];


    useEffect(() => {
        fetch(
            `${import.meta.env.VITE_API_URL}/conversation/${conversationId}`,
            {
                method: "GET",
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        )
            .then((res) => res.json())
            .then((res) => {
                setConversation(res.conversation);
                setIsAllowCall(res.isAllowCall)
                console.log('res.conversation in message:', res.conversation)
                console.log('res.isAllowCall:', res.isAllowCall)
            })
            .catch((err) => {
                console.error(err);
                setIsError(err);
            })
            .finally(() => setIsLoading(false));
    }, [conversationId])

    useEffect(() => {
        socket.connect()
        console.log('socket in msg:', socket)
        // socket.on(`user:${user}`)
    
        
        socket.on(`message`, (message) => {
            console.log('message in msg:', message)
            if(message.conversationId === conversation.id) setConversation({...conversation, messages: conversation.messages.concat(message)})
            
        })
        
        socket.on('calling', (hash, {username, id}) => {
            setIsReceivingCall(true)
            setReceiveCallMessage(`${username} is calling you`)
            setCallerId(id)
            setHash(hash)
        })

        // socket.on("response", (response) => {
        //     setResponseOfCall(response);
        // });
        // console.log('isReceivingCall:', isReceivingCall)
        return () => {
            socket.disconnect()
            socket.off(`message`)
            socket.off(`calling`)
        }
    }, [conversationId, conversation, isReceivingCall])

    // useEffect(() => {
    //     peer.on('call', stream => {
    //         console.log('stream calling work:', stream)
    //     })
    // }, [peer])
     
    function autoSize(e) {
        const el = e.target
        el.style.cssText = 'height:auto; padding: 10px 0 0 0';
        el.style.height = el.scrollHeight + 'px';
    }

    function handleMessage(e) {
        setMessage(e.target.value)
    }
    
    function handleFiles(e) {
        // console.log('e.target.files:', e.target.files[0])
        // console.log('files', files)
        setFiles(e.target.files[0])
    }

    function deleteFile() {
        setFiles(null)
        inputFiles.current.value = ''
    }

    async function sendMessage(e) {
        setIsSending(true)
        const cpMsgError = []
        e.preventDefault()
        let file
        if (files) {
            // console.log("files:", files);
            if(!fileTypes.includes(files.type)) return setMsgError(cpMsgError.concat(['file type isn\'t valid']))
            if(files.size > 50 * 1e6) {
                return setMsgError(cpMsgError.concat(['file size is too high']))
            }
            const formData = new FormData();
            formData.append("file", files);
            formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
            file = await fetch(url, {
                method: "POST",
                body: formData,
            }).then((res) => res.json());
        }
        // console.log('image:', file)
        fetch(`${import.meta.env.VITE_API_URL}/conversation/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({message, file})
        })
        .then(res => res.json())
        .then(res => {
            // console.log('res.message sending:', res.message)
            inputFiles.current.value = '',
            setFiles(null)
            setMessage('')
            // console.log('res.notifications:', res.notifications)
            socket.emit('message', res.message, res.notifications)
            setConversation({...conversation, messages: [...conversation.messages, res.message]})
        })
        .catch(err => console.error(err))
        .finally(() => setIsSending(false))
    }

    const videoCall = () => {
        setIsCalling(true)
        const hash = Math.floor(Math.random() * 1000000000)
        socket.emit(`call`, hash, conversationId, {username: user.username, id: user.id})
        navigate(`/conversation/${conversationId}/video#${hash}`)
        // console.log('`/conversation/${conversationId}/video#${hash}`:', `/conversation/${conversationId}/video#${hash}`)
        // navigator.mediaDevices.getUserMedia({
        //     audio: true,
        //     video: true,
        // }).then(stream => {
        //     setVideoStream(stream)
        //     // peer.on('call', call => {
        //     //     setIsReceiveCall(true)
        //     //     if(isAcceptCall) {
        //     //         call.answer(stream)
        //     //     }
        //     // })
        //     socket.emit('call', )
        //     console.error('location.state.participants:', location.state.participants)
        //     location.state.participants.forEach(participant => {
        //         const call = peer.call(participant.user.id, stream)
        //         call.on('stream', userStream => {
        //             setRemotesVideosStream(userStream)
        //         })
        //     });
        //     // const call = peer.call()
        // })
    }

    function connectToNewUser(usserId, stream) {
        
    }

    function refuseCall() {
        socket.emit('responseCall', false, callerId)
    }

    function acceptCall() {
        socket.emit('responseCall', true, callerId)
        navigate(`/conversation/${conversationId}/video#${hash}`)
        setIsCalling(true)
        // console.log('isCalling:', isCalling)
    }

    if(isLoading) return <h1>Loading Spinner...</h1>
    if(isError) return <h1>{isError.message}</h1>

    return (
        <div className={styles.messageContainer}>
            <div hidden={isCalling}>
                {isAllowCall && <div className="callSection">
                    <div>
                        <button onClick={videoCall}>Video Call</button>
                        <button>Audio Call</button>
                    </div>
                    <div className="first" hidden={!isReceivingCall}>
                        {receiveCallMessage}
                        <button onClick={acceptCall}>Accept</button>
                        <button onClick={refuseCall}>Refuse</button>
                    </div>
                    <div>
                        <p>{responseOfCall ? 'Your call has been accepted' : 'Your call has been refused'}</p>
                    </div>
                </div>}
                <ul className={styles.ul}>
                    {conversation.messages.map((message) => (
                        <li 
                            className={ user.id === message.userId ? styles.right : styles.left}
                            key={message.id}
                        >
                            <h4>{!conversation.isGroup ? '' : message.userId === user.id ? 'You' : message.user.username}</h4>
                            <span>{message.message} </span>
                            <span>
                                {" "}
                                {new Intl.DateTimeFormat(undefined, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }).format(new Date(message.createdAt))}
                            </span>{" "}
                            {message.MessageAttachments.length !== 0 && <div><img style={{width: '300px'}} src={message.MessageAttachments[0].attachmentUrl} alt={message.MessageAttachments[0].attachmentName} /></div>}
                        </li>
                    ))}
                </ul>
                <form>
                    <label htmlFor="file">
                        {msgError.map(msg => msg)}
                        <input
                            onChange={handleFiles}
                            type="file"
                            ref={inputFiles}
                            name="file"
                            id="file"
                        />
                    </label>
                    <label htmlFor="message">
                        {files && <div>
                            <img
                                style={{ width: "100px" }}
                                src={files ? URL.createObjectURL(files) : null}
                                alt=""
                            />
                             <button onClick={deleteFile}>Delete Image</button>
                        </div>}
                        <textarea
                            value={message}
                            onChange={handleMessage}
                            onKeyDown={autoSize}
                            className={styles.textarea}
                            name="message"
                            id="message"
                        ></textarea>
                    </label>
                    <button onClick={sendMessage} disabled={message === "" || isSending}>
                        {isSending ? 'Sending...' : 'Send' }
                    </button>
                </form>
            </div>
            <div hidden={!isCalling}>
                <Outlet context={{id: user.id, username: user.username, socket, conversationId, isCalling, callerId, conversation}}/>
            </div>
        </div>
    );

    
}