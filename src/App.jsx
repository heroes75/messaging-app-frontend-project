import { useEffect, useState } from "react";
import "./App.css";
import socket from "./socket";
import { Link, Outlet, useNavigate } from "react-router";

function App() {
    const [user, setUser] = useState({})
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(null)

    useEffect(() => {
        socket.connect();
        fetch(`${import.meta.env.VITE_API_URL}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                console.log('res.user:', res.user)
                if (!res.user) return navigate("/login");
                console.log('res.user:', res.user)
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
            <nav>
                <ul>
                    <li><Link to={`/conversation`}>Conversations</Link></li>
                    <li><Link to={`/friendship`}>Friends</Link></li>
                    <li><Link to={`/profile/${user.profile.id}`}>Profile</Link></li>
                    <li><Link to={`/notification`}>Notifications</Link></li>
                </ul>
            </nav>
            <div className="details">
                <Outlet/>
            </div>
        </>
    );
}

export default App;
