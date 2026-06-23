import { useEffect, useState } from "react";
import "./App.css";
import socket from "./socket";
import { useNavigate } from "react-router";

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
                
            </nav>
            <h1>Our First Test</h1>;
        </>
    );
}

export default App;
