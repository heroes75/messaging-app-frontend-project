import {useState, useEffect} from "react";

export default function Notifications() {
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    useEffect(() => {
        const bearer = `Bearer ${localStorage.getItem('token')}`
        fetch(`${import.meta.env.VITE_API_URL}/notification`, {
            method: 'GET',
            headers: {
                authorization: bearer,
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log('res.notifications:', res.notifications)
            setNotifications(res.notifications)
        })
        .catch(err => {
            console.error('err:', err)
            setIsError(err)
        })
        .finally(() => setIsLoading(false))
    }, [])

    if(isLoading) return <h1>Loading spinner...</h1>
    if(isError) return <h1>{isError.message}</h1>

    return (
        <>
            <ul>
                {
                    notifications.map(notification => <li><span>{notification.notification}</span><span>{notification.createdAt}</span></li>)
                }
            </ul>
        </>
    )
}