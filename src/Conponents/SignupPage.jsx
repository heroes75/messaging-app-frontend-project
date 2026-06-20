import { useState } from "react"
import styles from "../Styles/SignupPage.module.css"

function SignupPage() {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const isUsernameAlphaNumeric = /\w+/g.test(username)
    const isUsernameOverflowThree = username.length >=3
    const isPasswordContainsOneLowerCase = /[a-z]+/g.test(password)
    const isPasswordContainsOneUpperCase = /[A-Z]+/g.test(password)
    const isPasswordContainsOneNumber = /\d+/g.test(password)
    const isPasswordContainsOneAlphanumericCharacter = /\W+/g.test(password)
    const isPasswordOverflowHeight = password.length >= 8
    const isConfirmPasswordIsEqualToPassword = password === confirmPassword
    const msgError = [
        {status: isUsernameAlphaNumeric, msg:'Your username must be alphanumeric',},
        {status: isUsernameOverflowThree ,msg:'Your username must overflow 3 characters'},
        {status: isPasswordOverflowHeight ,msg: 'Your password must overflow 8 characters'},
        {status: isPasswordContainsOneNumber ,msg: 'your password must contains at least one number'},
        {status: isPasswordContainsOneUpperCase, msg: 'your password must contains at least one Upper-case'},
        {status: isPasswordContainsOneLowerCase,msg: 'your password must contains at least one Lower-case'},
        {status: isPasswordContainsOneAlphanumericCharacter, msg: 'your password must contains at least one non-alphanumeric character'},
        {status: isConfirmPasswordIsEqualToPassword, msg: 'Your confirm Password must be equal to your password'},
    ]


    function handleUsername(e) {
        console.log('msgError:', msgError)
        console.log('isUsernameAlphaNumeric:', isUsernameAlphaNumeric)
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
        console.log('e.target.checkValidity():', e.target.checkValidity())
    }

    return (
        <>
            <main>

                <form>
                    <ul>
                        {msgError.map(error => error.status || <li style={{color: 'red'}}>{error.msg}</li>)}
                    </ul>
                    <div className={styles.inputContainer}>
                        <label htmlFor="username">Enter your username</label>
                        <input onChange={handleUsername} value={username} minLength={3} pattern="\w+" type="text" name="username" id="username" placeholder="Enter your username" />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="password">Enter your password</label>
                        <input onChange={handlePassword} value={password} minLength={8} pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).+" type="text" name="password" id="password" placeholder="Enter your password" required />
                    </div>
                    <div className="inputContainer">
                        <label htmlFor="confirmPassword">Confirm your password</label>
                        <input onChange={handleConfirmPassword} value={confirmPassword} minLength={8} type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm your password" />
                    </div>
                    <button onClick={handleSubmit}>Submit</button>
                </form>
            </main>
        </>
    )
}

export default SignupPage