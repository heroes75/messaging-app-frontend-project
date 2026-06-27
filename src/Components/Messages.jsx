import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import styles from '../Styles/Message.module.css'

export default function Messages() {
    const [message, setMessage] = useState('')
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

    function sendMessage() {
        fetch(`${import.meta.env.VITE_API_URL}/conversation/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({message})
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
                {
                    conversation.messages.map(message => <li className={user.id === message.userId ? styles.right : styles.left} ><span>{message.message} </span><span> {new Intl.DateTimeFormat(undefined, {hour: '2-digit', minute: '2-digit'}).format(new Date(message.createdAt))}</span></li>)
                }
            </ul>
            <label htmlFor="message">
                <textarea value={message} onChange={handleMessage} onKeyDown={autoSize} className={styles.textarea} name="message" id="message" ></textarea>
            </label>
            <button onClick={sendMessage} disabled={message === ''}>send</button>
        </>
    )

    
}