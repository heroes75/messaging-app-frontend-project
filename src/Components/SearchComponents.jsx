import { useState } from "react";
import { Link } from "react-router";

export default function SearchComponent() {
    const [input, setInput] = useState('')
    const [users, setUsers] = useState([])
    const [msgError, setMsgError] = useState([])
    
    function search(e) {
        setInput(e.target.value)
        console.log('e.target.value:', e.target.value)
        console.log('`${import.meta.env.VITE_API_URL}/user?username=${e.target.value}:', `${import.meta.env.VITE_API_URL}/user?username=${e.target.value}`)
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

    return (
        <>  
            {msgError.map(error => error.msg)}
            <label htmlFor="user">Search your friend: </label>
            <input type="search" name="user" id="user" value={input} onChange={search} />
            <ul >
                {users.map(user => <li value={user.username}><Link to={`/profile/${user.profile.id}`}>{user.username}</Link></li>)}
            </ul>
        </>
    )
}