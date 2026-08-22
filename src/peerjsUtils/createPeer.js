import Peer from "peerjs";

export default function createPeer(id, setPeer, setAvailableCalls) {
    const peer =  new Peer(id, {
        host: 'localhost',
        path: '/',
        port: 3001,
        secure: false,
    })

    peer.on('call', call => {
        console.log('call', call)
        setAvailableCalls([call])
    })
    console.log('peer:', peer)
    setPeer(peer)
}