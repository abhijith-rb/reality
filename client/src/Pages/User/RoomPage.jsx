import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from 'react-redux';
import styled from 'styled-components';

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

  useEffect(()=>{
    const appID = Number(process.env.REACT_APP_ZEGO_APP_ID);
    const serverSecret = process.env.REACT_APP_ZEGO_SERVER_SECRET;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      user._id,
      user.username
    )

    const zc = ZegoUIKitPrebuilt.create(kitToken)

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
        zc.destroy();
        navigate("/messenger")

      }
    })

    return()=>{
      zc.destroy();
    }
  },[])

  return (
      <Wrapper ref={videoContainerRef} />
  )
}

export default RoomPage