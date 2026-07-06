import { useState } from "react";
import { Link } from "react-router";

export default function SearchComponent() {
    const [input, setInput] = useState('')
    const [users, setUsers] = useState([])
    const [msgError, setMsgError] = useState([])
    
    function search(e) {
        setInput(e.target.value)
        fetch(`${import.meta.env.VITE_API_URL}/user?username=${e.target.value}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.errors) {
                setUsers([])
                return setMsgError(res.errors)
            }
            setUsers(res.users)
            setMsgError([])
            console.log('res.users:', res.users)
        })
    }

    function requestFriend(friendId) {
        fetch(`${import.meta.env.VITE_API_URL}/friendship`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({friendId})
        })
        .then(res => res.json())
        .then(res => {
            console.log('res.friendship', res.friendship)
            const friendship = res.friendship
            setUsers(users.map(user => {
                if(user.id === friendship.userIdOne) {
                    user.friendFirst = [friendship]
                } else if (user.id === friendship.userIdTwo) {
                    user.friendSecond = [friendship]
                }
                return user
            }))
        })
        .catch(err => console.error(err))
    }

    function openConversations(participantId) {
        console.log('participantId:', participantId)
        fetch(`${import.meta.env.VITE_API_URL}/conversation`, {
            method: 'POST',
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify({participantsId: [participantId]})
        })
        .then(res => res.json())
        .then(res => {
            console.log('res:', res.conversation)
            setUsers(users.map(user => {
                console.log('user: in conversation', user)
                console.log('res.conversation.participants.find(participant => participant.id == user.id):', res.conversation.participants.find(participant => participant.userId == user.id))
                if(res.conversation.participants.find(participant => participant.userId === user.id)) {
                    user.conversations = res.conversation.participants[0].userId === user.id ? [res.conversation.participants[0]] : [res.conversation.participants[1]]
                    console.log('user.conversations:', user.conversations)
                }
                return user
            }))
        })
    }

    return (
        <>
            {msgError.map((error) => error.msg)}
            <label htmlFor="user">Search your friend: </label>
            <input
                type="search"
                name="user"
                id="user"
                value={input}
                onChange={search}
            />
            <ul>
                {users.map((user) => (
                    <li value={user.username}>
                        <Link to={`/profile/${user.profile.id}`}>
                            {user.username}
                        </Link>{" "}
                        <span>
                            {user.friendFirst.length === 0 &&
                            user.friendSecond.length === 0 ? (
                                <button onClick={() => requestFriend(user.id)}>
                                    req.
                                </button>
                            ) : user.friendFirst.length !== 0 ? (
                                user.friendFirst[0].status
                            ) : (
                                user.friendSecond[0].status
                            )}
                        </span>
                        <span>
                            {
                                user.conversations.length === 0 ? <button onClick={() => openConversations(user.id)}>Open Chat</button> : <Link to={`/conversation/${user.conversations[0].conversationId}`}>chat</Link>
                            }
                        </span>
                    </li>
                ))}
            </ul>
        </>
    );
}