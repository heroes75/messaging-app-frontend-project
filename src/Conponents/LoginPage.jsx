import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"


export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [msgError, setMsgError] = useState([])
    const navigate = useNavigate()
    const [search, setSearch] = useSearchParams(window.location.search)

    function handleSubmit() {
        fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                if(res.msg)  return setMsgError(res.msg)
                localStorage.setItem('token', res.token)
                navigate('/')
            })
    }


    return (
        <>
            {search.get('issignup') === 'true' && <p>Well you're now registered, please connect you</p>}
            <ul>
                {msgError.map(msg => <li key={msg}>{msg}</li>)}
            </ul>
            <label htmlFor="username">Enter your username</label>
            <input required onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Enter your username" type="text" name="username" id="username" />
            <label htmlFor="password">Enter your password</label>
            <input required onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter your password" type="password" name="password" id="password" />
            <button onClick={handleSubmit}>Submit</button>
        </>
    )
}