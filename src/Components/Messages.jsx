import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import styles from '../Styles/Message.module.css'


const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/upload`

export default function Messages() {
    const [message, setMessage] = useState('')
    const [files, setFiles] = useState()
    const [conversation, setConversation] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const user = useOutletContext()
    const {conversationId} = useParams()


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

    async function sendMessage() {
        let file
        if (files) {
            console.log("files:", files);
            const formData = new FormData();
            formData.append("file", files);
            formData.append("upload_preset", "messaging_app");
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
            setMessage('')
            setConversation({...conversation, messages: [...conversation.messages, res.message]})
        })
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
                    >
                        <span>{message.message} </span>
                        <span>
                            {" "}
                            {new Intl.DateTimeFormat(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                            }).format(new Date(message.createdAt))}
                        </span>{" "}
                        {message.MessageAttachments.length !== 0 && <img style={{width: '300px'}} src={message.MessageAttachments[0].attachmentUrl} alt={message.MessageAttachments[0].attachmentName} />}
                    </li>
                ))}
            </ul>
            <label htmlFor="file">
                <input
                    onChange={handleFiles}
                    type="file"
                    name="file"
                    id="file"
                />
            </label>
            <label htmlFor="message">
                <img
                    style={{ width: "100px" }}
                    src={files ? URL.createObjectURL(files) : null}
                    alt=""
                />
                <textarea
                    value={message}
                    onChange={handleMessage}
                    onKeyDown={autoSize}
                    className={styles.textarea}
                    name="message"
                    id="message"
                ></textarea>
            </label>
            <button onClick={sendMessage} disabled={message === ""}>
                send
            </button>
        </>
    );

    
}