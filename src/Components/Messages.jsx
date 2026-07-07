import { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import styles from '../Styles/Message.module.css'


const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/upload`

export default function Messages() {
    const [message, setMessage] = useState('')
    const [msgError, setMsgError] = useState([])
    const [files, setFiles] = useState()
    const [conversation, setConversation] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const inputFiles = useRef()
    const user = useOutletContext()
    const {conversationId} = useParams()
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
                console.log('res.conversation:', res.conversation)
            })
            .catch((err) => {
                console.error(err);
                setIsError(err);
            })
            .finally(() => setIsLoading(false));
    }, [conversationId])


    function autoSize(e) {
        const el = e.target
        el.style.cssText = 'height:auto; padding: 10px 0 0 0';
        el.style.height = el.scrollHeight + 'px';
    }

    function handleMessage(e) {
        setMessage(e.target.value)
    }
    
    function handleFiles(e) {
        console.log('e.target.files:', e.target.files[0])
        console.log('files', files)
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
            console.log("files:", files);
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
        console.log('image:', file)
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
            console.log(res.message)
            inputFiles.current.value = '',
            setFiles(null)
            setMessage('')
            setConversation({...conversation, messages: [...conversation.messages, res.message]})
        })
        .catch(err => console.error(err))
        .finally(() => setIsSending(false))
    }


    if(isLoading) return <h1>Loading Spinner...</h1>
    if(isError) return <h1>{isError.message}</h1>

    return (
        <>
            <ul className={styles.ul}>
                {conversation.messages.map((message) => (
                    <li
                        className={
                            user.id === message.userId
                                ? styles.right
                                : styles.left
                        }
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
        </>
    );

    
}