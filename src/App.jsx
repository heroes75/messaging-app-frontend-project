import { useEffect, useState } from "react";
import "./App.css";
import socket from "./socket";
import { Link, Outlet, useNavigate } from "react-router";

function App() {
    const [user, setUser] = useState()
    const navigate = useNavigate();

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
                if (!res.user) return navigate("/login");
                setUser(res.user)
            });
    }, []);

    return (
        <>
            <nav>
                <ul>
                    <li><Link to={`/conversation`}>Conversations</Link></li>
                    <li><Link to={`/friendship`}>Friends</Link></li>
                    <li><Link to={`/profile`}>Profile</Link></li>
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
