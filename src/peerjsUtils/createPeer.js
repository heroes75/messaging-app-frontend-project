import Peer from "peerjs";

export default function createPeer(id, setPeer) {
    const peer =  new Peer(id, {
        host: 'localhost',
        path: '/peerjs',
        port: 3001,
        secure: false,
    })

    peer.on('open', id => {
        console.log('id:', id)

    })

    // peer.on('call', call => {
    //     console.log('call', call)
    //     setAvailableCalls([call])
    // })
    console.log('peer increate peer:', peer)
    setPeer(peer)
    return peer
}