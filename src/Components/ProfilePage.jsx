import { useEffect, useRef, useState } from "react";


export default function ProfilePage() {
    const [bio, setBio] = useState('')
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [bioInput, setBioInput] = useState(bio)
    const [lastNameInput, setLastNameInput] = useState(firstName)
    const [firstNameInput, setFirstNameInput] = useState(lastName)
    const [isYourProfile, setIsYourProfile] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [statusUpdate , setStatusUpdate] = useState(false)
    const dialog = useRef()

    useEffect(() => {
        console.log(window.location.href)
        fetch(`${import.meta.env.VITE_API_URL}${window.location.pathname}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.profile) {
                    setBio(res.profile.bio)
                    setBioInput(res.profile.bio)
                    setFirstName(res.profile.firstName)
                    setFirstNameInput(res.profile.firstName)
                    setLastName(res.profile.lastName)
                    setLastNameInput(res.profile.lastName)
                    setIsYourProfile(res.isYourProfile)
                }
            })
            .catch(error => {
                console.error(error)
                setIsError(true)
            })
            .finally(() => setIsLoading(false))
    },[])

    function ShowDialog() {
        dialog.current.show()
    }

    function closeDialog() {
        dialog.current.close()
    }

    function handleEdit() {
        setBio(bioInput)
        setFirstName(firstNameInput)
        setLastName(lastNameInput)
        fetch(`${import.meta.env.VITE_API_URL}${window.location.pathname}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({firstName: firstNameInput, lastName: lastNameInput, bio: bioInput})
        })
            .then(res => res.json())
            .then(res => {
                if(res.profile) return setStatusUpdate(true)
            })
            .catch(error => {
                console.error(error)
                setStatusUpdate(false)
            })
        closeDialog()
    }

    if(isLoading) return <h1>Loading spinner</h1>
    if(isError) return <h1>Unexpected error</h1>

    return (
        <>
            <dialog aria-label="dialog" ref={dialog}>
                <label htmlFor="firstName">First Name:</label>
                <input placeholder="first name" value={firstNameInput} onChange={(e) => setFirstNameInput(e.target.value)} type="text" name="firstName" id="firstName"  />
                <label htmlFor="firstName">Last Name:</label>
                <input value={lastNameInput} onChange={(e) => setLastNameInput(e.target.value)} type="text" name="lastName" id="lastName"  />
                <label htmlFor="firstName">Bio:</label>
                <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value)} type="text" name="bio" id="bio"></textarea>
                <button onClick={closeDialog}>Cancel</button>
                <button onClick={handleEdit}>Submit</button>
            </dialog>
            <div style={{display: statusUpdate ? 'block' : 'none'}}>{statusUpdate? 'Your profile is updated' : 'Your profile is not updated'}</div>
            <div className="firstNameContainer"><span>First Name: </span><span data-testid='firstName' className="firstName"><span>{firstName}</span></span></div>
            <div className="lastNameContainer"><span>Last Name: </span><span data-testid='lastName' className="lastName">{lastName}</span></div>
            <div className="bioContainer"><span>Bio: </span><span data-testid='bio' className="bio">{bio}</span></div>
            {isYourProfile && <button onClick={ShowDialog}>Edit</button>}
        </>
    )
}