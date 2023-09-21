import React from 'react'
import { Call, CallEnd } from '@mui/icons-material';
import { Button } from 'react-bootstrap';
import styled from 'styled-components'

const Wrapper = styled.div`
    width: 30vw;
    height: 30vh;
    border: 2px solid red;
    position: absolute;
    top: 0;
    right: 0;
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

const CallNotice = ({call,callerName,setShowVbox,setCallNotice,setVideocall,setLocalStream,setRemoteStream}) => {

    const acceptCall = ()=>{
        setCallNotice(false)
        setShowVbox(true)
        navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                        setLocalStream(stream);
                       
                        call.answer(stream)
    
                        call.on('stream', (remoteStream) => {
    
                            setRemoteStream(remoteStream);
                            
                        })

                })
                .catch((error) => {
                    console.error('Error accessing media devices: ', error)
                })
    }

    const rejectCall = ()=>{
        setVideocall(false)
    }


  return (
    <Wrapper>
        <h1>{callerName} calling</h1>
        <BtnsDiv>
            <Button variant='success' onClick={acceptCall}><Call/></Button>
            <Button variant='danger' onClick={rejectCall}><CallEnd/></Button>
        </BtnsDiv>

    </Wrapper>
  )
}

export default CallNotice