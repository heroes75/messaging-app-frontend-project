import { useEffect, useState } from "react";
import socket from "../socket";

export default function Friendship() {
    const [friendsSecond, setFriendsSecond] = useState([])
    const [friendsFirst, setFriendsFirst] = useState([])
    console.log('friendsFirst:', friendsFirst)
    const friendDemandSecond = friendsSecond.filter(friend => friend.status === 'REQ_UID1')
    const friendDemandFirst = friendsFirst.filter(friend => friend.status === 'REQ_UID2')
    const friendRequestSecond = friendsSecond.filter(friend => friend.status === 'REQ_UID2')
    const friendRequestFirst = friendsFirst.filter(friend => friend.status === 'REQ_UID1')
    const friendshipFirst = friendsFirst.filter(friend => friend.status === 'FRIEND')
    const friendshipSecond = friendsSecond.filter(friend => friend.status === 'FRIEND')
    const friendshipRejectFirst = friendsFirst.filter(friend => friend.status === 'BLOCKED')
    const friendshipRejectSecond = friendsSecond.filter(friend => friend.status === 'BLOCKED')

    console.log('friendshipRejectFirst:', friendshipRejectFirst)
    useEffect(() => {
        socket.connect()
        const updateFriendFirst = (friendStatus) => {
            console.log('friendStatus: in friend first', friendStatus)
            setFriendsFirst(friendsFirst => friendsFirst.map(friendFirst => {
                console.log('friendsFirst:', friendFirst)
                console.log('friendFirst.userIdOne === friendStatus.userIdOne:', friendFirst.userIdOne === friendStatus.userIdOne)
                if(friendFirst.userIdOne === friendStatus.userIdOne) return friendStatus;
                return friendFirst;
            }))
        }
        const updateFriendSecond = (friendStatus) => {
            console.log('friendStatus: in friend second', friendStatus)
            setFriendsSecond(friendsSecond => friendsSecond.map(friendSecond => {
                console.log('friendSecond:', friendSecond)
                console.log('friendSecond.userIdTwo === friendStatus.userIdTwo:', friendSecond.userIdTwo === friendStatus.userIdTwo)
                if(friendSecond.userIdTwo === friendStatus.userIdTwo) return friendStatus;
                return friendSecond;
            }))
        }

        socket.on('friendFirst', updateFriendFirst)
        socket.on('friendSecond', updateFriendSecond)

        return () => {
            socket.disconnect()
            socket.off('friendFirst', updateFriendFirst)
            socket.off('friendSecond', updateFriendSecond)
        }
    }, [])

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

    function handleRequest(friendshipStatus, friendId) {
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
            const notification = res.notification
            console.log('res,friendship:', res.friendship)
            console.log("friendship.friendFirst:", friendship.friendFirst);
            setFriendsFirst(
                friendsFirst.map((friend) => {
                    if (friendship.userIdOne === friend.userIdOne){
                        console.log('friendship.userIdOne === friend.userIdOne: in hnadle Request', friendship.userIdOne === friend.userIdOne)
                        socket.emit('friendFirst', friendship, notification)
                        return friendship;
                    }
                    return friend;
                }),
            );

            setFriendsSecond(
                friendsSecond.map((friend) => {
                    if (friendship.userIdTwo === friend.userIdTwo){
                        console.log('friendship.userIdTwo === friend.userIdTwo: in handle request', friendship.userIdTwo === friend.userIdTwo)
                        socket.emit('friendSecond', friendship, notification)
                        return friendship;
                    }
                    return friend;
                }),
            );
        })
    }

    return (
        <>
            <div>
                <h2>Friends</h2>
                <ul>
                    {friendshipFirst.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friendFirst.username}</span><span>{friend.status}</span> <button onClick={() => handleRequest('BLOCKED', friend.friendFirst.id)}>BLOCK</button></li>)}
                    {friendshipSecond.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friendSecond.username}</span><span>{friend.status}</span> <button onClick={() => handleRequest('BLOCKED', friend.friendSecond.id)}>BLOCK</button></li>)}
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
            <div>
                <h2>Friendship Rejected</h2>
                <ul>
                    {friendshipRejectFirst.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friendFirst.username}</span><span>{friend.status}</span> <button onClick={() => handleRequest('REQ_UID2', friend.friendFirst.id)}>Re-Demand</button></li>)}
                    {friendshipRejectSecond.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friendSecond.username}</span><span>{friend.status}</span> <button onClick={() => handleRequest('REQ_UID1', friend.friendSecond.id)}>Re-Demand</button></li>)}
                </ul>
            </div>
        </>
    )
}