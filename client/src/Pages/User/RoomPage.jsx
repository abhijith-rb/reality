import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import ErrorBoundary from '../../utils/ErrorBoundary';
// import {ErrorBoundary} from 'react-error-boundary'

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoomPage = () => {
  const navigate = useNavigate();
  const clientUrl = process.env.REACT_APP_CLIENT;
  const { roomId } = useParams();
  const user = useSelector((state) => state.user.user);
  const videoContainerRef = useRef();

  const mainFn = ()=>{
    try {
      const appID = Number(process.env.REACT_APP_ZEGO_APP_ID);
      const serverSecret = process.env.REACT_APP_ZEGO_SERVER_SECRET;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        user._id,
        user.username
      )

      console.log("kitToken",kitToken)
  
      const zc = ZegoUIKitPrebuilt.create(kitToken)
      console.log("zc consoled",zc)
      console.log("zc consoled hasJoinedRoom",zc.hasJoinedRoom)
  
      zc.joinRoom({
        container: videoContainerRef.current,
        sharedLinks: [
          {
            name: "Copy Link",
            url: `${clientUrl}room/${roomId}`
          }
        ],
        maxUsers:2,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall
        },
        showScreenSharingButton: false,
        showPreJoinView: false,

        onLeaveRoom : ()=>{
          if(zc){
            zc.destroy();
          }
        }
      })
      

  
      return()=>{
        if(zc){
          zc.destroy();
        }
        navigate("/messenger")
      }
      
    } catch (error) {
      console.log(error)
      
    }
  }

  useEffect(()=>{
    mainFn()
  
  },[])

  return (
      <Wrapper >
        {
          videoContainerRef.current 
          ?
          <div  ref={videoContainerRef} />
          :<p>Sorry</p>
        }
      </Wrapper>

  )
}

export default RoomPage