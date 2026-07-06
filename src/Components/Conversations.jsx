import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useOutletContext } from "react-router";

const token = `Bearer ${localStorage.getItem('token')}`;


export default function Conversations() {
    const user = useOutletContext()
    const [conversations, setConversation] = useState([]) 
    const [participantsId, setParticipantsId] = useState([])
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const dialog = useRef()
    const [friends, setFriends] = useState(user.friendFirst.concat(user.friendSecond))
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/conversation`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log('res.conversations:', res.conversations)
                console.log('user', user)
                setConversation(res.conversations)
            })
            .finally(() => setIsLoading(false))
    }, [])

    function addFriend(obj) {
        setParticipantsId(participantsId.concat(obj))
        setFriends(friends.filter(friend => friend.id !== obj.id))
    }

    function removeFriend(obj) {
        setParticipantsId(participantsId.filter(participantId => participantId.id !== obj.id))
        setFriends(friends.concat(obj))
    }

    function cancel() {
            setFriends(user.friendFirst.concat(user.friendSecond))
            setParticipantsId([])
            dialog.current.close()
            setName('')
    }

    function createGroup() {
        fetch(`${import.meta.env.VITE_API_URL}/conversation`, {
            method: 'POST',
            headers: {
                authorization: token,
                'content-type': 'application/json'
            },
            body: JSON.stringify({participantsId: participantsId.map(participant => participant.id), name})
        })
        .then(res => res.json())
        .then(res => {
            console.log('res.conversation:', res.conversation)
            setConversation(conversations.concat(res.conversation))
            cancel()
        })
    }

    if(isLoading) return <h1>Loading spinner</h1>

    return (
        <>  
            <dialog ref={dialog}>
                <label htmlFor="name">Group Name:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" />
                <ul>
                    <li>Added Friend</li>
                    {
                        participantsId.map(participantId => <li>{participantId.username} <button onClick={() => removeFriend(participantId)}>remove</button></li>)
                    }
                </ul>
                <ul>
                    <li>friends</li>
                    {
                        friends.map(friend => <li>{friend.username} <button onClick={() => addFriend(friend)}>add</button></li>)
                    }
                </ul>
                <button onClick={cancel}>cancel</button>
                <button onClick={createGroup}>Create Group</button>
            </dialog>
            <button onClick={() => dialog.current.show()}>Add Group</button>
            <ul>{conversations.map(conversation => <li key={conversation.id}><Link to={`/conversation/${conversation.id}`}>{conversation.isGroup ? conversation.name : conversation.participants[0].user.username}</Link></li>)}</ul>
            <div>
                <Outlet context={user}/>
            </div>
        </>
    )
}