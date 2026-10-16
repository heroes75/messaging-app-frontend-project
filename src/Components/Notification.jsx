import {useState, useEffect} from "react";
import socket from "../socket";
import { useOutletContext } from "react-router";

export default function Notifications() {
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const {user, setUser} = useOutletContext()

    useEffect(() => {
        socket.connect()
        const updateNotification = notification => {
            console.log('notification:', notification)
            setNotifications(notifications => [notification].concat(notifications))
        }
        socket.on('notifications', updateNotification)

        return () => {
            socket.disconnect()
            socket.off('notifications', updateNotification)
        }
    }, [])
    useEffect(() => {
        const bearer = `Bearer ${localStorage.getItem('token')}`
        fetch(`${import.meta.env.VITE_API_URL}/notification`, {
            method: 'PUT',
            headers: {
                authorization: bearer,
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log('res.notifications:', res.notifications)
            setNotifications(res.notifications)
            setUser(user => ({...user, notifications}))
        })
        .catch(err => {
            console.error(err)
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
                    notifications.map(notification => <li key={notification.id}><span>{notification.notification}</span> <span>{notification.createdAt}</span></li>)
                }
            </ul>
        </>
    )
}