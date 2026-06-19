function SignupPage() {
    return (
        <>
            <main>
                <div className="inputContainer">
                    <label htmlFor="username">Enter your username</label>
                    <input type="text" name="username" id="username" placeholder="Enter your username" />
                </div>
                <div className="inputContainer">
                    <label htmlFor="password">Enter your password</label>
                    <input type="text" name="password" id="password" placeholder="Enter your password" />
                </div>
                <div className="inputContainer">
                    <label htmlFor="confirmPassword">Confirm your password</label>
                    <input type="text" name="confirmPassword" id="confirmPassword" placeholder="Confirm your password" />
                </div>
                <button>Submit</button>
            </main>
        </>
    )
}

export default SignupPage