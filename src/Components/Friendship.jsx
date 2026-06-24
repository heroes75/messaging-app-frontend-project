import { useEffect, useState } from "react";

export default function Friendship() {
    const [friends, setFriends] = useState([])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/friendship`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                setFriends(res.friends)
            })
    }, [])

    return (
        <>
            <ul>
                {friends.map(friend => <li key={friend.userIdOne + friend.userIdTwo}><span>{friend.friend[0].username}</span> <span>{friend.status}</span></li>)}
                {/* <li>me <span>FRIEND</span></li> */}
            </ul>
        </>
    )
}