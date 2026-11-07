// import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useOutletContext } from "react-router";
// import createPeer from "../peerjsUtils/createPeer";
import styles from '../Styles/Conversations.module.css';
import GroupAdd from '../assets/group_add.svg?react'
import ManageGroup from '../assets/manage_accounts.svg?react'
import DeleteGroup from '../assets/group_remove_24dp_0D0D05_FILL0_wght400_GRAD0_opsz24.svg?react'

const token = `Bearer ${localStorage.getItem('token')}`;


export default function Conversations() {
    const {user} = useOutletContext()
    const [conversations, setConversation] = useState([]) 
    const [selectedConversation, setSelectedConversation] = useState({}) 
    const [isMessageOpen, setIsMessageOpen] = useState(false) 
    const [clickedConversation, setClickedConversation] = useState({}) 
    const [participantsId, setParticipantsId] = useState([])
    const [name, setName] = useState('')
    const [isOpenToUpdate, setIsOpenToUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [friends, setFriends] = useState(user.friendFirst.concat(user.friendSecond))
    const [msgError, setMsgError] = useState([])
    // const [peer, setPeer] = useState(new Peer(user.id , {
    //     host: 'localhost',
    //     path: '/peerjs',
    //     port: 3001,
    //     secure: false,
    // }))
    const [isOpenGroupOption, setIsOpenGroupOption] = useState(false)
    const [isScreenInferior1000px, setIsScreenInferior1000px] = useState(window.matchMedia('(max-width: 850px)'));
    console.log('window.matchMedia(max-width: 850px).matches:', window.matchMedia('(max-width: 850px)').matches)
    const testUrl = window.location.href.replace(/http.*\/conversation/, '') !== ''
    console.log('testUrl:', testUrl)
    const [isHideConversationList, setIsHideConversationList] = useState(isScreenInferior1000px.matches && testUrl) 
    console.log('isScreenInferior1000px.matches && isMessageOpen:', isScreenInferior1000px.matches && isMessageOpen)
    console.log('isHideConversationList:', isHideConversationList)
    const dialog = useRef(null)
    const dialogDeleteGroup = useRef(null)
    const isInsufficientParticipant = participantsId.length < 2
    const isNameEmpty = name === "";

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
                setClickedConversation({})
                setConversation(res.conversations)
            })
            .finally(() => setIsLoading(false))
        return () => {
            setClickedConversation({})
        }
    }, [])

    useEffect(() => {
        const checkWidth = (e) => {
            setIsHideConversationList(e.matches && testUrl)
            setIsScreenInferior1000px(e.matches)
            console.log('testUrl in checkWidth:', testUrl)
            console.log('e.matches:', e.matches)
        }
        isScreenInferior1000px.addEventListener('change',checkWidth)

        return () => {
            isScreenInferior1000px.removeEventListener('change', checkWidth)
        }
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
        setIsOpenGroupOption(false)
        console.log('isOpenGroupOption:', isOpenGroupOption)
        setFriends(user.friendFirst.concat(user.friendSecond));
        setParticipantsId([]);
        setName("");
        setMsgError([])
        dialog.current.close();
    }

    function openDialog(conversation) {
        const participants = conversation.participants.filter(participant => participant.userId !== user.id).map(participant => participant.user)
        setParticipantsId(participants)
        console.log('participants:', participants)
        setName(conversation.name)
        // console.log('{id: conversation.id, name: conversation.name}:', {id: conversation.id, name: conversation.name})
        setSelectedConversation({id: conversation.id, name: conversation.name})
        setIsOpenToUpdate(true)
        setFriends(friends.filter(friend => !participants.some(participant => participant.id === friend.id )))
        dialog.current.showModal()
        setIsOpenGroupOption(true)
        console.log('isOpenGroupOption: in open', isOpenGroupOption)
    }

    function openDialogToCreateGroup() {
        setIsOpenGroupOption(true)
        console.log('isOpenGroupOption: in open', isOpenGroupOption)
        dialog.current.showModal();
        setIsOpenToUpdate(false);
    }

    function createGroup() {
        if(validateGroupe()) return
        fetch(`${import.meta.env.VITE_API_URL}/conversation`, {
            method: 'POST',
            headers: {
                authorization: token,
                'content-type': 'application/json',
            },
            body: JSON.stringify({participantsId: participantsId.map(participant => participant.id), name}),
        })
        .then(res => res.json())
        .then(res => {
            if(res.errors) return setMsgError(res.errors.map(error => error.msg))
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
            if(res.errors) return setMsgError(res.errors.map(error => error.msg))
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
        dialogDeleteGroup.current.showModal()
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
        if(isNameEmpty) {
            newMsgError.push('Your group need a name')
            setMsgError(newMsgError)
        }
        if (newMsgError.length === 0) {
            return false
        } else {
            return true
        }
    }

    function displayClickedConversation(conversation) {
        setClickedConversation(conversation)
        // setIsHideConversationList(isScreenInferior1000px && true)
        // console.log('(window.location.href + conversation.id).replace(/http.*/conversation/, ):', (window.location.href).replace(/http.*\/conversation/, ''))
        // setTestUrl((window.location.href + '/' + conversation.id).replace(/http.*\/conversation/, '') !== '')
    }

    // const videoCall = () => {
    //     navigator.mediaDevices.getUserMedia({
    //         audio: true,
    //         video: true
    //     }).then(stream => {
    //         setLocalStream(stream);
    //         peer.call()
    //     })
    // }

    if(isLoading) return <h1>Loading spinner</h1>

    return (
        <div className={styles.conversationsContainer}>
            <dialog ref={dialogDeleteGroup} className={styles.dialogueDeleteGroup}>
                <p className={styles.paragraphDeleteGroup}>
                    are you sure you want delete this group
                    "{selectedConversation.name}":
                </p>
                <div className={styles.deleteGroupButtonContainer}>
                    <button className={styles.cancelDelete} onClick={cancelDelete}>Cancel</button>
                    <button className={styles.validDelete} onClick={() => deleteGroup(selectedConversation.id)}>
                        Ok
                    </button>
                </div>
            </dialog>
            <dialog ref={dialog} id="createGroupId" className={`${styles.dialogCreateGroup} ${isOpenGroupOption ? styles.displayDialog : ''}`}>
                <h3 className={styles.createGroupTitle}>{!isOpenToUpdate ? 'Create New Group:': 'Update Group:'}</h3>
                <ul className={styles.createGroupErrors}>
                    {msgError.map((msg) => (
                        <li>{msg}</li>
                    ))}
                </ul>
                <div className={styles.inputCreateGroupContainer}>
                    <label htmlFor="name">Group Name:</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        name="name"
                        id="name"
                    />
                </div>
                <ul className={styles.friendList}>
                    <li className={styles.friendTitle}><h3>Added Friend</h3></li>
                    {participantsId.map((participantId) => (
                        <li className={styles.friend} key={participantId.id}>
                            {participantId.username}{" "}
                            <button className={styles.removeInFriendButton} onClick={() => removeFriend(participantId)}>
                                <DeleteGroup className={styles.removeFriend}/>
                            </button>
                        </li>
                    ))}
                </ul>
                <ul className={styles.friendList}>
                    <li className={styles.friendTitle}><h3>friends</h3></li>
                    {friends.map((friend) => (
                        <li className={styles.friend} key={friend.id}>
                            {friend.username}{" "}
                            <button className={styles.addFriendToGroupButton} onClick={() => addFriend(friend)}>
                                <GroupAdd className={styles.addFriendIcon}/>
                            </button>
                        </li>
                    ))}
                </ul>
                <div className={styles.createGroupButtonContainer}>
                    <button command='createGroupId' commandfor='close' className={`${styles.cancelButton}`} onClick={cancel}>cancel</button>
                    {isOpenToUpdate ? (
                        <button
                            onClick={() => updateGroup(selectedConversation.id)}
                            className={styles.validGroupButton}
                        >
                            Save
                        </button>
                    ) : (
                        <button className={styles.validGroupButton} onClick={createGroup}>Create Group</button>
                    )}
                </div>
            </dialog>
            <div className={styles.conversationsList} style={{display: (isMessageOpen && isScreenInferior1000px) ? 'none' : 'block'}} qwerty={isHideConversationList.toString()}>
                <div className={styles.conversationsHead}>
                    <span className={styles.span}>Conversations</span>
                    <button
                        className={styles.button}
                        onClick={openDialogToCreateGroup}
                    >
                        <GroupAdd className={styles.groupIcon} />
                    </button>
                </div>
                <ul className={styles.conversations} >
                    {conversations.map((conversation) => {
                        // console.log('conversation:', conversation)
                        const participants = conversation.participants.filter(
                            (participant) => participant.user.id !== user.id,
                        );
                        return (
                            <li className={styles.li} key={conversation.id}>
                                <Link
                                    to={`/conversation/${conversation.id}`}
                                    state={{ participants: participants }}
                                    className={styles.link}
                                    onClick={() => displayClickedConversation(conversation)}
                                >
                                    
                                    {conversation.isGroup
                                        ? conversation.name
                                        : (<> <img className={styles.img} src={participants[0].user.profile.imageUrl} alt="photo profile of user" /> {participants[0].user.username}</>)}
                                </Link>{" "}
                                {conversation.participants.find(
                                    (participant) =>
                                        participant.userId === user.id &&
                                        participant.role === "ADMIN",
                                ) && (
                                    <span>
                                        <div className={styles.buttonContainer}>
                                            <button
                                                onClick={() =>
                                                    openDialog(conversation)
                                                }
                                                className={styles.buttonManageGroup}
                                            >
                                                <ManageGroup className={styles.manageGroup} />
                                            </button>{" "}
                                            <button
                                                onClick={() =>
                                                    openDialogDelete(conversation)
                                                }
                                                className={styles.deleteButton}
                                            >
                                                <DeleteGroup className={styles.deleteGroup}/>
                                            </button>
                                        </div>
                                    </span>
                                )}{" "}
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className={styles.MessagesContainer}>
                <Outlet context={{ user, setClickedConversation, setIsMessageOpen }} />
            </div>
        </div>
    );
}