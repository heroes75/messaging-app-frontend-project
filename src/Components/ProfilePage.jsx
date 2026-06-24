import { useEffect, useState } from "react";


export default function ProfilePage() {
    const [bio, setBio] = useState('')
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/profile`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.profile) {
                    setBio(res.profile.bio)
                    setFirstName(res.profile.firstname)
                    setLastName(res.profile.lastname)
                }
            })
    })

    return (
        <>
            
        </>
    )
}