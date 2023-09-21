import { CallEnd, Cancel } from '@mui/icons-material';
import React, {useEffect} from 'react'
import { Button } from 'react-bootstrap';
import styled from 'styled-components';


const Wrapper = styled.div`
    width: 90vw;
    height: 80vh;
    background-color: #88C4FE;
    border: 2px solid red;
    position: absolute;
    z-index: 10;
    display: flex;
    flex-direction: column;
`;

const TopDiv = styled.div`
    width: 100%;
    height: 10%;
    border: 2px solid grey;
`;

const MidDiv = styled.div`
    width: 100%;
    height: 75%;
    border: 2px solid blue;
    display: flex;
    justify-content: space-between;
`;

const BotDiv = styled.div`
    width: 100%;
    height: 15%;
    border: 2px solid green;
`;

const VideoBox = ({setShowVbox,setVideocall,localStream,remoteStream,localVideoRef,remoteVideoRef}) => {
    
    
    useEffect(()=>{
        remoteVideoRef.current.srcObject = remoteStream;
    },[remoteStream])
    
    useEffect(()=>{
        localVideoRef.current.srcObject = localStream;

        return()=>{
            

            if(localStream){
                localStream.getTracks().forEach((track)=> track.stop())
            }

        }

    },[localStream])


    const endCall = ()=>{

        if(localStream){
            localStream.getTracks().forEach((track)=> track.stop())
        }

    }

    const closeVbox = ()=>{
        endCall()
        setShowVbox(false)
        setVideocall(false)
    }


  return (
    <Wrapper>
        <TopDiv>
            <Cancel 
                onClick={closeVbox}
                style={{cursor:'pointer'}}
            />
        </TopDiv>
        <MidDiv>
            <video ref={localVideoRef} autoPlay playsInline muted/>
            <video ref={remoteVideoRef} autoPlay playsInline srcObject={remoteStream}/>

        </MidDiv>
        <BotDiv>
            <Button variant='danger' onClick={endCall}><CallEnd/></Button>
            
        </BotDiv>
    </Wrapper>
  )
}

export default VideoBox