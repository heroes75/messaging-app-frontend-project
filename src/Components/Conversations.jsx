import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useOutletContext } from "react-router";

const token = `Bearer ${localStorage.getItem('token')}`;


export default function Conversations() {
    const user = useOutletContext()
    const [conversations, setConversation] = useState([]) 
    const [selectedConversation, setSelectedConversation] = useState({}) 
    const [participantsId, setParticipantsId] = useState([])
    const [name, setName] = useState('')
    const [isOpenToUpdate, setIsOpenToUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const dialog = useRef()
    const dialogDeleteGroup = useRef()
    const [friends, setFriends] = useState(user.friendFirst.concat(user.friendSecond))
    const [msgError, setMsgError] = useState([])
    const isInsufficientParticipant = participantsId.length < 2
    const isnameEmpty = name === ""

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/conversation`, {
            method: 'GET',
            headers: {
                authorization: token
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log('res.conversations:', res.conversations)
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
        setFriends(user.friendFirst.concat(user.friendSecond));
        setParticipantsId([]);
        setName("");
        setMsgError([])
        dialog.current.close();
    }

    function openDialog(conversation) {
        const participants = conversation.participants.filter(participant => participant.userId !== user.id).map(participant => participant.user)
        setParticipantsId(participants)
        setName(conversation.name)
        console.log('{id: conversation.id, name: conversation.name}:', {id: conversation.id, name: conversation.name})
        setSelectedConversation({id: conversation.id, name: conversation.name})
        setIsOpenToUpdate(true)
        setFriends(friends.filter(friend => !participants.some(participant => participant.id === friend.id )))
        dialog.current.show()
    }

    function createGroup() {
        if(validateGroupe()) return
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

    function updateGroup(conversationId) {
        if(validateGroupe()) return
        fetch(`${import.meta.env.VITE_API_URL}/conversation/${conversationId}`, {
            method: 'PUT',
            headers: {
                authorization: token,
                'content-type': 'application/json'
            },
            body: JSON.stringify({participantsId: participantsId.map(participant => participant.id), name})
        })
        .then(res => res.json())
        .then(res => {
            const conversationUpdated = res.conversation
            console.log('conversationUpdated:', conversationUpdated)
            setConversation(conversations.map(conversation => {
                if(conversation.id === conversationUpdated.id) return conversationUpdated
                return conversation
            }))
            cancel()
        })
        .catch(err => console.error(err))
    }

    function openDialogDelete(conversation) {
        setSelectedConversation(conversation)
        dialogDeleteGroup.current.show()
    }

    function cancelDelete() {
        dialogDeleteGroup.current.close()
    }

    function deleteGroup(conversationId) {
        console.log('deletedConversation:', conversationId)
        setConversation(conversations.filter(conversation => conversation.id !== conversationId))
        fetch(`${import.meta.env.VITE_API_URL}/conversation/${conversationId}`, {
            method: 'DELETE',
            headers: {
                authorization: token
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log('res.conversation:', res.conversation)
            dialogDeleteGroup.current.close()
        })
        .catch(err => console.error(err))
    }

    function validateGroupe() {
        const newMsgError = []
        if(isInsufficientParticipant) {
            newMsgError.push('you need of two friend to create a group')
            setMsgError(newMsgError)
        }
        if(isnameEmpty) {
            newMsgError.push('Your group need a name')
            setMsgError(newMsgError)
        }
        if (newMsgError.length === 0) {
            return false
        } else {
            return true
        }
    }

    if(isLoading) return <h1>Loading spinner</h1>

    return (
        <>
            <dialog ref={dialogDeleteGroup}>
                are you sure you want delete this group "{selectedConversation.name}"
                <button onClick={() => deleteGroup(selectedConversation.id)}>Ok</button>
                <button onClick={cancelDelete}>Cancel</button>
            </dialog>
            <dialog ref={dialog}>
                <ul>
                    {
                        msgError.map(msg => <li>{msg}</li>)
                    }
                </ul>
                <label htmlFor="name">Group Name:</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    id="name"
                />
                <ul>
                    <li>Added Friend</li>
                    {participantsId.map((participantId) => (
                        <li>
                            {participantId.username}{" "}
                            <button onClick={() => removeFriend(participantId)}>
                                remove
                            </button>
                        </li>
                    ))}
                </ul>
                <ul>
                    <li>friends</li>
                    {friends.map((friend) => (
                        <li key={friend.userId}>
                            {friend.username}{" "}
                            <button onClick={() => addFriend(friend)}>
                                add
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={cancel}>cancel</button>
                {
                    isOpenToUpdate ? <button onClick={() => updateGroup(selectedConversation.id)}>Save</button> : <button onClick={createGroup}>Create Group</button>
                }
                
            </dialog>
            <button onClick={() => {dialog.current.show(); setIsOpenToUpdate(false)}}>Add Group</button>
            <ul>
                {conversations.map((conversation) => (
                    <li key={conversation.id}>
                        <Link to={`/conversation/${conversation.id}`}>
                            {conversation.isGroup
                                ? conversation.name
                                : conversation.participants.filter(
                                      (participant) =>
                                          participant.userId !== user.id,
                                  )[0].user.username}
                        </Link>{" "}
                        {conversation.participants.find(
                            (participant) =>
                                participant.userId === user.id &&
                                participant.role === "ADMIN",
                        ) && (
                            <span>
                                <button onClick={() => openDialog(conversation)}>Edit</button> <button onClick={() => openDialogDelete(conversation)}>Delete</button>
                            </span>
                        )}{" "}
                    </li>
                ))}
            </ul>
            <div>
                <Outlet context={user} />
            </div>
        </>
    );
}