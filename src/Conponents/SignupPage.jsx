import { useRef, useState } from "react"
import styles from "../Styles/SignupPage.module.css"
import { useNavigate } from "react-router"

function SignupPage() {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [backendMsgError, setBackendMsgError] = useState([])
    const form = useRef(null)
    const navigate = useNavigate()
    const isUsernameAlphaNumeric = /\w+/g.test(username)
    const isUsernameOverflowThree = username.length >=3
    const isPasswordContainsOneLowerCase = /[a-z]+/g.test(password)
    const isPasswordContainsOneUpperCase = /[A-Z]+/g.test(password)
    const isPasswordContainsOneNumber = /\d+/g.test(password)
    const isPasswordContainsOneAlphanumericCharacter = /\W+/g.test(password)
    const isPasswordOverflowHeight = password.length >= 8
    const isConfirmPasswordIsEqualToPassword = password === confirmPassword
    const msgError = [
        {status: isUsernameAlphaNumeric, msg:'Your username must be an alphanumeric',},
        {status: isUsernameOverflowThree ,msg:'Your username must overflow 3 characters'},
        {status: isPasswordOverflowHeight ,msg: 'Your password must overflow 8 characters'},
        {status: isPasswordContainsOneNumber ,msg: 'Your password must contains at least one number'},
        {status: isPasswordContainsOneUpperCase, msg: 'Your password must contains at least one Upper-case'},
        {status: isPasswordContainsOneLowerCase,msg: 'Your password must contains at least one Lower-case'},
        {status: isPasswordContainsOneAlphanumericCharacter, msg: 'Your password must contains at least one non-alphanumeric character'},
        {status: isConfirmPasswordIsEqualToPassword, msg: 'Your confirm Password must be equal to your password'},
    ]


    function handleUsername(e) {
        setUsername(e.target.value)
    }

    function handlePassword(e) {
        setPassword(e.target.value)
    }

    function handleConfirmPassword(e) {
        setConfirmPassword(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        if(!form.current.checkValidity() || !isConfirmPasswordIsEqualToPassword) return
        fetch(import.meta.env.VITE_API_URL + '/signup', {
            method: 'POST',
            body: JSON.stringify({username, password, confirmPassword}),
            headers: {
                'Content-Type': 'application/json',
            }
        }).
            then(res => res.json()).
            then(res => {
                if(res.msg) return setBackendMsgError(res.msg)
                navigate('/login')
            })
    }

    return (
        <>
            <main>

                <form ref={form}>
                    <ul>
                        {msgError.map(error => error.status || <li key={error.msg} style={{color: 'red'}}>{error.msg}</li>)}
                        {backendMsgError.map(msg => <li>{msg}</li>)}
                    </ul>
                    <div className={styles.inputContainer}>
                        <label htmlFor="username">Enter your username</label>
                        <input onChange={handleUsername} value={username} minLength={3} pattern="\w+" type="text" name="username" id="username" placeholder="Enter your username" />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="password">Enter your password</label>
                        <input onChange={handlePassword} value={password} minLength={8} pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).+" type="password" name="password" id="password" placeholder="Enter your password" required />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="confirmPassword">Confirm your password</label>
                        <input onChange={handleConfirmPassword} value={confirmPassword} minLength={8} type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm your password" required />
                    </div>
                    <button type="submit" onClick={handleSubmit}>Submit</button>
                </form>
            </main>
        </>
    )
}

export default SignupPage