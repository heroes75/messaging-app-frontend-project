import { Fragment, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext, useParams, Link } from "react-router";
import styles from '../Styles/Message.module.css'
import { io } from "socket.io-client";
import socket from "../socket";
import VideoCallIcon from '../assets/videoCallIcon.svg?react'
import VideoCallIcon2 from '../assets/videoCallIcon2.svg?react'
import ArrowBackIcon from '../assets/arrowBackIcon.svg?react'
import AttachFileIcon from '../assets/attach_file.svg?react'
import SendMessageIcon from '../assets/sendMessageIcon.svg?react'
import { differenceInCalendarDays, format, formatDistance } from "date-fns";


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
    const {user, setClickedConversation, setIsMessageOpen, isScreenInferior1000px} = useOutletContext()
    // const peer = useOutletContext().peer
    const location = useLocation()
    const {conversationId} = useParams()
    // const {conversationInfo} = location.state
    // console.log('location:', location.state)
    const navigate = useNavigate()
    // console.log('conversation.isGroup:', conversation.isGroup)
    // console.log('conversation.isGroup !== undefined:', conversation.isGroup !== undefined)
    const conversationInfo = conversation.isGroup === undefined ? "" : conversation.isGroup ? {name: conversation.name} : conversation.participants.filter(participant => participant.userId !== user.id)[0]
    // console.log('conversation.isGroup:', conversation.isGroup)
    // console.log('conversationInfo:', conversationInfo)
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
                // console.log('res.conversation in message:', res.conversation)
                // console.log('res.isAllowCall:', res.isAllowCall)
            })
            .catch((err) => {
                console.error(err);
                setIsError(err);
            })
            .finally(() => setIsLoading(false));
        // return () => {
        //     setIsMessageOpen(false)
        // }
    }, [conversationId])

    useEffect(() => {
        socket.connect()
        // console.log('socket in msg:', socket)
        // socket.on(`user:${user}`)
    
        
        socket.on(`message`, (message) => {
            // console.log('message in msg:', message)
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

    useEffect(() => {
        console.log('setIsMessageOpen(true):', true)
        setIsMessageOpen(true)
        return () => {
            setIsMessageOpen(false)
            console.log('setIsMessageOpen(false):', false)
        }   
    }, [])
     
    function autoSize(e) {
        const el = e.target
        el.style.cssText = 'height: 50px; padding: 10px 0 10px 0';
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
            <div className={styles.subMessageContainer} hidden={isCalling}>
                <div className={styles.messageHead}>
                    <div className={styles.messageInfo}>
                        {
                            isScreenInferior1000px && 
                        <Link className={styles.backLink} to="/conversation">
                            <ArrowBackIcon />
                        </Link>
                        }
                        {
                            conversation.isGroup ?
                            (<h3 className={styles.participantName}>{conversation.name}</h3>) :
                            (<><img className={styles.participantImg} src={conversationInfo.user.profile.imageUrl} alt="img of other participant" /> 
                            <div className={styles.participantName}>
                                <div className={styles.participantUsername}>
                                    <h4>{conversationInfo.user.username}</h4>
                                </div>
                                <div className={styles.realName}>
                                    <span>{conversationInfo.user.profile.firstName}</span>
                                    <span>{conversationInfo.user.profile.lastName}</span>
                                </div>
                            </div></>)
                        }
                    </div>
                    {isAllowCall && 
                    <div className={styles.callSection}>
                        <div>
                            <button className={styles.videoCallButton} onClick={videoCall}>
                                <VideoCallIcon2 style={{width: '45px'}} className={styles.videoCallIcon} />
                            </button>
                        </div>
                        <div className="first" hidden={!isReceivingCall}>
                            {receiveCallMessage}
                            <button onClick={acceptCall}>Accept</button>
                            <button onClick={refuseCall}>Refuse</button>
                        </div>
                        {/* <div>
                            <p>{responseOfCall ? 'Your call has been accepted' : 'Your call has been refused'}</p>
                        </div> */}
                    </div>}
                </div>
                <div className={styles.messageBody}>
                    <ul className={styles.messagesList}>
                        {conversation.messages.map((message, i) => (
                            <Fragment key={message.id}>
                                {i === 0 ? 
                                <li className={styles.center}>
                                    <p>{new Date(message.createdAt).toDateString()}</p>
                                </li> 
                                : differenceInCalendarDays(message.createdAt, conversation.messages[i-1].createdAt) >= 1 ? 
                                <li className={styles.center}>
                                    <p>{format(message.createdAt, 'PPPP')}</p>
                                </li> 
                                : ''}
                                <li
                                    className={`${styles.message} ${user.id === message.userId ? styles.right : styles.left}`}
                                >
                                    <h4>{!conversation.isGroup ? '' : message.userId === user.id ? 'You' : message.user.username}</h4>
                                    <p>{message.message} </p>
                                    {message.MessageAttachments.length !== 0 && <><img className={styles.img} src={message.MessageAttachments[0].attachmentUrl} alt={message.MessageAttachments[0].attachmentName} /></>}
                                    <div>
                                        {" "}
                                        {new Intl.DateTimeFormat(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }).format(new Date(message.createdAt))}
                                    </div>{" "}
                                </li>
                            </Fragment>
                        ))}
                    </ul>
                    <form  className={styles.form}>
                        <div className={styles.inputsContainer}>
                            <label className={styles.labelInputFile} htmlFor="file">
                                <AttachFileIcon className={styles.attachFileIcon}/>
                                {msgError.map(msg => msg)}
                                <input
                                    onChange={handleFiles}
                                    type="file"
                                    ref={inputFiles}
                                    name="file"
                                    id="file"
                                    className={styles.inputHidden}
                                />
                            </label>
                            <label className={styles.labelMessage} htmlFor="message">
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
                                    placeholder='Enter your message...'
                                ></textarea>
                            </label>
                            <button className={styles.sendMessageButton} onClick={sendMessage} disabled={message === "" || isSending}>
                                <SendMessageIcon style={{fill: (message === "" || isSending) ? "gray" : '#f22248'}} />
                                {/* {isSending ? 'Sending...' : 'Send' } */}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div hidden={!isCalling}>
                <Outlet context={{id: user.id, username: user.username, socket, conversationId, isCalling, callerId, conversation}}/>
            </div>
        </div>
    );

    
}