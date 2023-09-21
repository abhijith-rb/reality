import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import VideoBox from './VideoBox';
import { useSelector } from 'react-redux';
import StartVC from './StartVC';
import CallNotice from './CallNotice';

const Wrapper = styled.div`
    width: 90vw;
    height: 80vh;
    border:2px solid grey;
    position: absolute;
    z-index: 10;
    display: flex;
    flex-direction: column;
`;

const Videocall = ({receiverId,socket,setVideocall,callerName,
    vcMode,peer,localStream,setLocalStream,remoteStream,setRemoteStream,
    localVideoRef,remoteVideoRef,showVbox, setShowVbox, call}) => {

    const [callStarter,setCallStarter] = useState(true)
    const [callNotice, setCallNotice] = useState(true)
    

  return (
    <Wrapper>
        {vcMode === "caller" && callStarter && <StartVC setShowVbox={setShowVbox} socket={socket} setCallStarter={setCallStarter} setVideocall={setVideocall} peer={peer} receiverId={receiverId} setLocalStream={setLocalStream} setRemoteStream={setRemoteStream}/>}
        
        {vcMode === "receiver" && callNotice && <CallNotice call={call} callerName={callerName} setShowVbox={setShowVbox} setCallNotice={setCallNotice} setVideocall={setVideocall} setLocalStream={setLocalStream} setRemoteStream={setRemoteStream} />}
        
        {showVbox && <VideoBox setShowVbox={setShowVbox} setVideocall={setVideocall} localStream={localStream} remoteStream={remoteStream} localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef} />}
    </Wrapper>
  )
}

export default Videocall