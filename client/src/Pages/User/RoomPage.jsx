import React, { useEffect, useState } from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt"
import { useSelector } from 'react-redux'
import UserLayout from '../../Components/user/UserLayout';


const RoomPage = () => {
  const navigate = useNavigate()
  const clientUrl = process.env.REACT_APP_CLIENT;
  const { roomId } = useParams()
  const user = useSelector((state) => state.user.user)

  // const [videoStream, setVideoStream] = useState(null);

  // const getVideoStream = async()=>{
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     video:true, audio:true
  //   })

  //   setVideoStream(stream)
  // }
  
  // useEffect(()=>{
  //   getVideoStream()
  //   return ()=>{
  //     videoStream?.getTracks().forEach((track)=> track.stop())
  //   }
  // },[])

  const myMeeting = async (element) => {
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
      container: element,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `${clientUrl}room/${roomId}`
        }
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall
      },
      showScreenSharingButton: false,
      onLeaveRoom : ()=>{
          navigate("/messenger")
      }
    })

  }

  return (
    <UserLayout>
      <div ref={myMeeting} />
    </UserLayout>
  )
}

export default RoomPage