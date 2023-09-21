import { Call, CallEnd } from '@mui/icons-material';
import React from 'react'
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 30vw;
    height: 30vh;
    border: 2px solid green;
    position: absolute;
    top: 3;
    left: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5vh;
`;

const BtnsDiv = styled.div`
    width: 80%;
    display: flex;
    justify-content: space-between;
`;

const StartVC = ({ setCallStarter, setShowVbox, setVideocall, socket, peer,
    receiverId, setLocalStream, setRemoteStream}) => {
    const user = useSelector((state) => state.user.user)

    const callUser = (receiverId) => {
        socket.current.emit('init-call', { receiverId, username: user?.username })

        if (!peer) {
            console.error('Peer is not properly initialized.');
            return;
        }
    
        if (!peer.open) {
            console.error('Peer is not connected to the signaling server.');
            return;
        }

        navigator.mediaDevices
        .getUserMedia({video:true,audio:true})
        .then((stream)=>{
            setLocalStream(stream);

            console.log(peer)
            if (peer) {
                console.log(receiverId)

                const call = peer.call(receiverId, stream);
                
                console.log(call)
                console.log("peer call started")
                call?.on('stream', (remoteStream) => {
                    console.log(remoteStream)
                    setRemoteStream(remoteStream);
                   
                })
    
            }
            else{
                console.error("Peer not initialized properly")
            }
        })

    }

    const startCalling = () => {
        setCallStarter(false)
        setShowVbox(true)
        callUser(receiverId)
    }

    const stopCall = () => {
        setVideocall(false)
    }

    return (
        <Wrapper>
            <h1>Start the call?</h1>
            <BtnsDiv>
                <Button onClick={startCalling}><Call /></Button>
                <Button variant='danger' onClick={stopCall}><CallEnd /></Button>
            </BtnsDiv>
        </Wrapper>
    )
}

export default StartVC