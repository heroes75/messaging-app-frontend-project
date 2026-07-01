import { useEffect, useState } from "react";
import { Link, Outlet, useOutletContext } from "react-router";

export default function Conversations() {
    const [conversations, setConversation] = useState([]) 
    const user = useOutletContext()
    useEffect(() => {
        console.log('user conv', user)
        fetch(`${import.meta.env.VITE_API_URL}/conversation`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log('res.conversations:', res.conversations)
                setConversation(res.conversations)
            })
    }, [])

    return (
        <>
            <ul>{conversations.map(conversation => <li key={conversation.id}><Link to={`/conversation/${conversation.id}`}>{conversation.participants[0].user.username}</Link></li>)}</ul>
            <div>
                <Outlet context={user}/>
            </div>
        </>
    )
}