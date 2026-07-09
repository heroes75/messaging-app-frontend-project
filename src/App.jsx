import { useEffect, useState } from "react";
import "./App.css";
// import socket from "./socket";
import { Link, Outlet, useNavigate } from "react-router";
import SearchComponent from "./Components/SearchComponents";
import { io } from "socket.io-client";
import socket from "./socket";

function App() {
    const [user, setUser] = useState({})
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(null)

    useEffect(() => {
        // const socket =  io(import.meta.env.VITE_API_URL, {
        //     autoConnect: false,
        //     extraHeaders: {
        //         authorization: `Bearer ${localStorage.getItem("token")}`
        //     }
        // })
        socket.connect();
        socket.emit('try', 'new')
        console.log('socket.connected:', socket.connected)
        console.log('socket:', socket)
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
                if (!res.user) return navigate("/login");
                setUser(res.user)
            })
            .catch(error => {
                console.error(error)
                setIsError(error)
            })
            .finally(() => setIsLoading(false))
            
    }, []);

    if(isLoading) return <h1>Loading Spinner</h1>
    if(isError) return <h1>{isError.message}</h1>

    return (
        <>
            <SearchComponent user={user} />
            <nav>
                <ul>
                    <li><Link to={`/conversation`}>Conversations</Link></li>
                    <li><Link to={`/friendship`}>Friends</Link></li>
                    <li><Link to={`/profile/${user.profile.id}`}>Profile</Link></li>
                    <li><Link to={`/notification`}>Notifications</Link></li>
                </ul>
            </nav>
            <div className="details">
                <Outlet context={user}/>
            </div>
        </>
    );
}

export default App;
