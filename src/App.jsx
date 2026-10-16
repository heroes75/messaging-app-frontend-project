import { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";
// import socket from "./socket";
import { Link, Outlet, useNavigate } from "react-router";
import SearchComponent from "./Components/SearchComponents";
import { io } from "socket.io-client";
import socket from "./socket";
import ChatIcon from './assets/chat_24dp_0D0D05_FILL0_wght400_GRAD0_opsz24.svg?react'
import NotificationIconActive from './assets/notifications_active_24dp_0D0D05_FILL0_wght400_GRAD0_opsz24.svg?react'
import FriendsIcon from './assets/group_24dp_0D0D05_FILL0_wght400_GRAD0_opsz24.svg?react'
import ProfileIcon from './assets/account_box_24dp_0D0D05_FILL0_wght400_GRAD0_opsz24.svg?react'
import NotificationIcon from './assets/notifications_24dp_0D0D05_FILL0_wght400_GRAD0_opsz24.svg?react'
// import { ReactComponent as  Chat} from './assets/chat_24dp_0D0D05_FILL0_wght400_GRAD0_opsz24.svg'

function App() {
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(null)
    const [isSelected, setIsSelected] = useState(null)
    const [isRceiveNotif, setIsRceiveNotif] = useState(false)
    const [notifications, setNotifications] = useState([])
    const navigate = useNavigate();
    // const notifRef = useRef(null)
    const unreadNotificationLength = user.notifications?.filter(notif => notif.status === 'NOT_READ').length || 0
    const isHaveNotifs = unreadNotificationLength !== 0
    console.log('unreadNotificationLength:', unreadNotificationLength === 0)


    useEffect(() => {
        socket.connect();
        socket.emit('try', 'new')
        let key
        // console.log('socket.connected:', socket.connected)
        const updateUserNotification = (notifications) => {
            console.log('notifications:', notifications)
            // setNotifications(prevNotif => prevNotif.map(notif => ({...notif, isShow: true})))
            setNotifications(prevNotif => {
                return prevNotif.concat({notifications, isShow: true})
            })

            setIsRceiveNotif(true)
            setUser(user => ({...user, notifications: user.notifications.concat(notifications)}))
            key = setTimeout(() => {
                console.log('Twice')
                setNotifications(prevNotif =>  prevNotif.map(notif => {
                    console.log('notif:', notif)
                    console.log('prevNotif.length:', prevNotif.length)
                    if (notif.notifications.id === notifications.id) {
                        // const copyNotif = 
                        return {notifications: notif.notifications, isShow: false}
                    }
                    return notif
                }))
                console.log('Twice 2')
                // setIsRceiveNotif(false)
            }, 1000);
            setTimeout(() => {
                console.log('Twice 3')
                setNotifications(prevNotif =>  prevNotif.map(notif => {
                    console.log('notif: 2', notif)
                    console.log('prevNotif.length: 2', prevNotif.length)
                    if (notif.notifications.id === notifications.id) {
                        // const copyNotif = 
                        return {notifications: notif.notifications, isShow: true}
                    }
                    return notif
                }))
                console.log('Twice 4')
                // setIsRceiveNotif(false)
            }, 5000);
            console.log('key:', key)
        }
        socket.on('notifications', updateUserNotification)
        return () => {
            console.log('key in return:', key)
            clearTimeout(key)
            socket.off('notifications', updateUserNotification)
            socket.disconnect()
        }
    },[])

    useEffect(() => {
        // const socket =  io(import.meta.env.VITE_API_URL, {
        //     autoConnect: false,
        //     extraHeaders: {
        //         authorization: `Bearer ${localStorage.getItem("token")}`
        //     }
        // })
        console.log('user:', user)
        fetch(`${import.meta.env.VITE_API_URL}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => {
                if(res.status === 303) return navigate('/login')
                return res.json()
            })
            .then((res) => {
                console.log('res.user: in App', res.user)
                if (!res.user) return navigate("/login");
                setUser(res.user)
            })
            .catch(error => {
                console.error(error)
                setIsError(error)
            })
            .finally(() => setIsLoading(false))
            
    }, []);

    const select = (name) => {
        setIsSelected(name)
        // if (name === '/notification') {
        //     fetch(`${import.meta.env.VITE_API_URL}/notification`, {
        //         method: 'PUT',
        //         headers: {
        //             authorization: `Bearer ${localStorage.getItem('token')}`
        //         } 
        //     })
        //     .then(res => res.json())
        //     .then(res => {
        //         console.log('res:', res.notifications)
                
        //     })
        // }
    }

    const isStyleApplied = (name) => {
        return { boxShadow: isSelected === name ? 'inset 50px 0 50px -20px #f22248 ' : 'none'}
    }

    if(isLoading) return <h1>Loading Spinner</h1>
    if(isError) return <h1>{isError.message}</h1>

    return (
        <>
            <nav className={styles.nav}>
                <div>
                    {user.username}
                </div>
                <h3>
                    LOGO
                </h3>
                <SearchComponent user={user} />
            </nav>
            <main className={styles.main}>
                {
                    notifications.map(notification => {
                        return (
                            <div className={`${styles.notification} ${notification.isShow ? "" : styles.move}`}>
                                <span>you a new notification</span>
                                <div className={styles.buttonContainer}>
                                    <button>mark like read</button>
                                    <button>See</button>
                                </div>
                            </div>
                        );
                    })
                }
                
                <aside className={styles.aside}>
                    <ul className={styles.ul}>
                        <li onClick={() => select(`/conversation`)} style={isStyleApplied('/conversation')}> <Link to={`/conversation`}> <ChatIcon className={styles.ChatIcon} /><span>Conversations</span></Link></li>
                        <li onClick={() => select(`/friendship`)} style={isStyleApplied('/friendship')}><Link to={`/friendship`}> <FriendsIcon className={styles.FriendsIcon} /><span>Friends</span></Link></li>
                        <li onClick={() => select('/profile')}  style={isStyleApplied('/profile')}><Link to={`/profile/${user.profile.id}`}><ProfileIcon className={styles.ProfileIcon}/><span>Profile</span></Link></li>
                        <li onClick={() => select('/notification')}  style={isStyleApplied('/notification')}><Link to={`/notification`}>{isHaveNotifs ? <NotificationIconActive className={styles.NotificationIcon} /> : <NotificationIcon className={styles.NotificationIcon} />}<span>Notifications</span></Link> {unreadNotificationLength !== 0 && <div className={styles.notificationCounter} ><span>{unreadNotificationLength}</span></div>}</li>
                    </ul>
                </aside>
                <div className="details">
                    <Outlet context={{user, setUser}}/>
                </div>
            </main>
        </>
    );
}

export default App;
