import { io } from "socket.io-client";
console.log(`Bearer ${localStorage.getItem('token')}`)

const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: false,
    extraHeaders: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
})


export default socket