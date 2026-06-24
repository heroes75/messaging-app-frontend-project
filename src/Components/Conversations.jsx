import { useEffect, useState } from "react";

export default function Conversations() {
    const [conversations, setConversation] = useState([]) 
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/conversation`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                setConversation(res.conversations)
            })
    })

    return (
        <>
            <ul>{conversations.map(conversation => <li key={conversation.id}>{conversation.participants[0].user.username}</li>)}</ul>
        </>
    )
}