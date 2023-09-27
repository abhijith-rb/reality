import React, { useEffect, useRef, useState } from 'react'
import UserLayout from '../../Components/user/UserLayout'
import { styled } from 'styled-components';
import { io } from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux';
import Conversation from '../../Components/chat/Conversation';
import Message from '../../Components/chat/Message';
import { setCurrentChat } from '../../redux/chatReducer';
import { Cancel, VideoCall } from '@mui/icons-material';
import axiosInstance from '../../axios/axiosInstance';
import {v4} from 'uuid'
import NotifyVc from '../../Components/chat/NotifyVc';
import { useNavigate } from 'react-router-dom';



const Wrapper = styled.div`
    /* height: calc(100vh - 70px); */
    height: fit-content;
    display: flex;
`;

const ChatMenu = styled.div`
    /* flex: 2; */
    width: 20vw;
    @media (max-width: 800px){
        flex:3;
    }
`;

const ChatBox = styled.div`
    /* flex: 4; */
    width: 50vw;
    display: flex;
    justify-content: center;
    @media (max-width: 800px){
        flex:7;
    }
`;

const ChatBoxWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 10px;
    height: 100%;
    width: 100%;
    /* background-color: red; */
`;

const ChatBoxTopWrap = styled.div`
    position: relative;
    height: 60vh;
    width: 100%;
    
`;

const ChatBoxTop = styled.div`
    height: 50vh;
    margin-top: 10vh;
    overflow-y: scroll;
    border: 3px solid #79AC78;
    background-color:#ffffff;
    padding: 0 1vw;
`;

const ChatInfo = styled.div`
    width: 100%;
    height: 10vh;
    background-color: #79AC78;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
    padding:0 3vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const InfoLeft = styled.div`
    
`;

const InfoRight = styled.div`
    width:15vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ChatBoxBottom = styled.div`
    margin-top: 5px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;


const FixedTextareaContainer = styled.div`
  width: 80%; 
  max-width: 500px; 
  height: auto; 
  border: 3px solid #ccc; 
  padding: 10px; 
  display: flex;
  flex-direction: column; 
  background-color: #ffffff;

  @media (min-width: 768px) {
    max-width: 800px; 
  }
`;
const FixedTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
`;

const ChatSubmitButton = styled.button`
    width: 70px;
    height: 40px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: teal;
    color: white;
`;


const ChatMenuWrapper = styled.div`
    padding: 10px;
    height: 100%;
`;

const NoConversationText = styled.span`
    position: absolute;
    top: 10%;
    font-size: 50px;
    color: gray;
    cursor: default;
    
`;

const Img = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
`;

const OpenDiv = styled.div`
    position: relative;
    height: 60vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    @media (max-width:800px){
        display: none;
    }
`;

const Messenger = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const dispatch = useDispatch();
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const user = useSelector((state) => state.user.user)
    const socket = useRef();
    const scrollRef = useRef();
    const currentChat = useSelector((state) => state.chat.current)
    console.log("firstCurrentChat", currentChat)
    const [roomId,setRoomId] = useState()
    const navigate = useNavigate()

    const [callerName, setCallerName] = useState("An User")
    const [callnotice,setCallnotice] = useState(false)

    const msgRef = useRef();

    const [recInfo, setRecinfo] = useState(null)

    const peer = useRef();

    const receiverId = currentChat?.members?.find((member) => member !== user._id)
    console.log("receiverId", receiverId)

    const getUser = async () => {
        try {
            await axiosInstance.get(`/find-user/${receiverId}`)
                .then((res) => {
                    setRecinfo(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            console.log(error)
        }
    }


    //To receive messages

    useEffect(() => {
        console.log("useeffect 2 called")

        

        socket.current = io("ws://localhost:8800")
        socket.current.on("getMessage", (data) => {
            console.log(data.text)
            console.log(data)
            console.log("getMsgg listend")
            const arrmsg = {
                senderId: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            }
            console.log("arrmsg", arrmsg)
            setArrivalMessage(arrmsg)

        })

        socket.current.on('notifyCall', ({callerName,roomId}) => {
            console.log(`video call from ${callerName} notified`)
            setCallerName(callerName)
            setRoomId(roomId)
            setCallnotice(true)
            
        })

        return () => {
            socket.current.disconnect()
        }

    }, [])

    console.log("arrivalMessage", arrivalMessage)


    useEffect(() => {
        console.log("arrival useeffect called")
        console.log(arrivalMessage)
        console.log("2ndcurrentChat", currentChat)
        console.log(arrivalMessage?.senderId)
        const isSenderActive = currentChat?.members.includes(arrivalMessage?.senderId)
        console.log(isSenderActive)
        {
            arrivalMessage
                &&
                isSenderActive
                && setMessages((prev) => [...prev, arrivalMessage])
        }

        getConversations();

    }, [arrivalMessage, currentChat])



    //To add the current user to the list of active users and retrieve the list of active users

    useEffect(() => {
        console.log("useeffect 3 called")

        socket.current.emit("addUser", user._id)

        console.log("Add user emitted")

        socket.current.on("getUsers", (users) => {
            //Modify it => Current user should only see certain active users not all
            // setOnlineUsers(users)
            console.log("onlineUsers", users)
        })

        getConversations()
    }, [user])

    const getConversations = async () => {
        console.log("getConversations Called")
        await axiosInstance.get(`/chat/conversation/${user._id}`)
            .then((res) => {
                // console.log(res.data)
                setConversations(res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
            })
            .catch((err) => {
                console.log(err)
            })
    }


    const getMessages = async () => {
        await axiosInstance.get(`/chat/message/${currentChat?._id}`)
            .then((res) => {
                // console.log(res.data)
                setMessages(res.data);
            })
            .catch((err) => {
                console.log((err))
            })
    }

    useEffect(() => {
        console.log("useeffect 1 called")
        getUser();
        getMessages();
    }, [currentChat])


    useEffect(() => {
        console.log("useeffect 5 called")
        getConversations()
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newMessage = msgRef.current.value;

        if (newMessage === "") return;

        const recId = currentChat?.members.find((member) => member !== user._id)
        // console.log(recId)

        const message = {
            conversationId: currentChat._id,
            senderId: user._id,
            receiverId: recId,
            text: newMessage,
        }


        //Sending message to Socket server
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId: recId,
            text: newMessage
        })

        try {
            await axiosInstance.post("/chat/message", message)
                .then((res) => {
                    setMessages([...messages, res.data])
                    msgRef.current.value = "";
                })
        } catch (err) {
            console.log(err)
        }

    }


    const handleVC = () => {
        const roomId = v4()
        console.log(roomId)
        setRoomId(roomId)
        navigate(`/room/${roomId}`)
        socket.current.emit('room-id', {
            receiverId,
            username:user.username,
            roomId
        })
    }

    console.log(peer)

    return (
        <UserLayout>
            <Wrapper>
                <ChatMenu>
                    <ChatMenuWrapper>
                        {conversations.map((c, i) => (
                            <div onClick={() => dispatch(setCurrentChat(c))}>
                                <Conversation key={i} conversation={c}
                                    currentUser={user} />
                            </div>
                        ))}

                    </ChatMenuWrapper>
                </ChatMenu>
                <ChatBox>
                    <ChatBoxWrapper>
                        {
                            currentChat
                                ?
                                (<>
                                    <ChatBoxTopWrap>
                                        <ChatInfo>
                                            <InfoLeft>
                                                <Img src={recInfo?.image ? PF + recInfo.image : "/images/avatar.png"} alt="" />
                                                <span>{recInfo?.username}</span>
                                            </InfoLeft>
                                            <InfoRight>
                                                <VideoCall
                                                    onClick={handleVC}
                                                    style={{ color: 'white', fontSize: "40px", cursor: 'pointer' }} />
                                                <Cancel
                                                    onClick={() => dispatch(setCurrentChat(null))}
                                                    style={{ color: "white", cursor: "pointer" }}
                                                />
                                            </InfoRight>

                                        </ChatInfo>
                                        <ChatBoxTop>
                                            {messages.map((m) => (
                                                <div ref={scrollRef}>
                                                    <Message key={m._id} message={m}
                                                        own={m.senderId === user._id} receiverId={receiverId} />
                                                </div>
                                            ))

                                            }


                                        </ChatBoxTop>

                                    </ChatBoxTopWrap>
                                    <ChatBoxBottom>


                                        <FixedTextareaContainer>
                                            <FixedTextarea
                                                rows="4"
                                                cols="50"
                                                placeholder='write something'
                                                ref={msgRef}
                                            />
                                        </FixedTextareaContainer>
                                        <ChatSubmitButton onClick={handleSubmit}>
                                            Send
                                        </ChatSubmitButton>
                                    </ChatBoxBottom>
                                </>)

                                : (<OpenDiv>
                                    <NoConversationText>Open a conversation to start a chat.</NoConversationText>
                                </OpenDiv>
                                )
                        }


                {callnotice && <NotifyVc callerName={callerName} setCallNotice={setCallnotice} roomId={roomId}/>}
                    </ChatBoxWrapper>
                </ChatBox>
                
            </Wrapper>

        </UserLayout>
    )
}

export default Messenger