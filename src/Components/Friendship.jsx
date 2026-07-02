import { useEffect, useState } from "react";

export default function Friendship() {
    const [friendsSecond, setFriendsSecond] = useState([])
    const [friendsFirst, setFriendsFirst] = useState([])
    const friendDemandSecond = friendsSecond.filter(friend => friend.status === 'REQ_UID1')
    const friendDemandFirst = friendsFirst.filter(friend => friend.status === 'REQ_UID2')
    const friendRequestSecond = friendsSecond.filter(friend => friend.status === 'REQ_UID2')
    const friendRequestFirst = friendsFirst.filter(friend => friend.status === 'REQ_UID1')
    const friendshipFirst = friendsFirst.filter(friend => friend.status === 'FRIEND')
    const friendshipSecond = friendsSecond.filter(friend => friend.status === 'FRIEND')


    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/friendship`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                setFriendsSecond(res.friendsSecond)
                setFriendsFirst(res.friendsFirst)
            })
    }, [])

    function handleRequest(friendshipStatus, friendId, isInFirst) {
        console.log('import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL)
        fetch(`${import.meta.env.VITE_API_URL}/friendship/${friendId}`, {
            method: 'PUT',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({friendshipStatus})
        })
        .then(res => res.json())
        .then(res => {
            const friendship = res.friendship
            console.log('res,friendship:', res.friendship)
            console.log('friendship.friendFirst:', friendship.friendFirst)
            // if (friendship.friendFirst) {
                setFriendsFirst(friendsFirst.map(friend => {
                    console.log('friend in first:', friend)
                    console.log('friendship.userIdOne === friend.userIdOne:', friendship.userIdOne === friend.userIdOne)
                    if((friendship.userIdOne === friend.userIdOne)) return friendship
                    return friend
                }))
                // return
            // }
                
            setFriendsSecond(friendsSecond.map(friend => {
                console.log('friend in second:', friend)
                console.log('friendship.userIdTwo === friend.userIdTwo:', friendship.userIdTwo === friend.userIdTwo)
                if((friendship.userIdTwo === friend.userIdTwo)) return friendship
                return friend
            }))
        })
    }

    return (
        <>
            <div>
                <h2>Friends</h2>
                <ul>
                    {friendshipFirst.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friendFirst.username}</span><span>{friend.status}</span></li>)}
                    {friendshipSecond.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friendSecond.username}</span><span>{friend.status}</span></li>)}
                </ul>
            </div>
            <div>
                <h2>Friend demand</h2>
                <ul>
                    {friendDemandFirst.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friendFirst.username}</span><span>{friend.status}</span></li>)}
                    {friendDemandSecond.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friendSecond.username}</span><span>{friend.status}</span></li>)}
                </ul>
            </div>
            <div>
                <h2>Friend Request</h2>
                <ul>
                    {friendRequestFirst.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friendFirst.username}</span><span>{friend.status}</span> <button onClick={() => handleRequest('FRIEND', friend.friendFirst.id)}>Accept</button> <button onClick={() => handleRequest('BLOCKED', friend.friendFirst.id)}>Reject</button></li>)}
                    {friendRequestSecond.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friendSecond.username}</span><span>{friend.status}</span> <button onClick={() => handleRequest('FRIEND', friend.friendSecond.id)}>Accept</button> <button onClick={() => handleRequest('BLOCKED', friend.friendSecond.id)}>Reject</button></li>)}
                </ul>
            </div>
        </>
    )
}