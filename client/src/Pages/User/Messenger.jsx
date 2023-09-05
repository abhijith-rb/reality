import React, { useEffect, useRef, useState } from 'react'
import UserLayout from '../../Components/user/UserLayout'
import { styled } from 'styled-components';
import { io } from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux';
import Conversation from '../../Components/chat/Conversation';
import Message from '../../Components/chat/Message';
import axios from 'axios';
import { setCurrentChat } from '../../redux/chatReducer';
import { Cancel, Close } from '@mui/icons-material';
import axiosInstance from '../../axios/axiosInstance';

const Wrapper = styled.div`
    /* height: calc(100vh - 70px); */
    height: 70vh;
    display: flex;
`;

const ChatMenu = styled.div`
    flex: 2;
`;

const ChatBox = styled.div`
    flex: 7;
    display: flex;
    justify-content: center;
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
    padding-right: 10px;
    border: 3px solid #88C4FE;
`;

const ChatInfo = styled.div`
    width: 100%;
    height: 10vh;
    background-color: #88C4FE;
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


const ChatMenuInput = styled.input`
    width: 90%;
    padding: 1vh 1vw;
    border: none;
    border-bottom: 1px solid gray;
`;

const NoConversationText = styled.span`
    position: absolute;
    top: 10%;
    font-size: 50px;
    color: gray;
    cursor: default;
    
`;

const Img=styled.img`
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
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const user = useSelector((state) => state.user.user)
    const socket = useRef();
    const scrollRef = useRef();
    const currentChat = useSelector((state) => state.chat.current)
    console.log(currentChat)
    console.log(conversations)

    const[recInfo,setRecinfo] = useState(null)

    const receiverId = currentChat?.members.find((member) => member !== user._id)
    console.log(receiverId)

    useEffect(()=>{
        const getUser=async()=>{
            try {
                await axiosInstance.get(`/find-user/${receiverId}`)
                .then((res)=>{
                    setRecinfo(res.data)
                })
                .catch((err)=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }

        getUser();
    },[currentChat])

    //To receive messages
    
    useEffect(() => {
        socket.current = io("ws://localhost:8900")
        try {
            socket.current.on("getMessage", (data) => {
                console.log(data.text)
                console.log("getMsgg listend")
                const arrmsg = {
                    senderId: data.senderId,
                    text: data.text,
                    createdAt: Date.now(),
                }
                console.log(arrmsg)
                setArrivalMessage(arrmsg)
                getConversations();
            })

        } catch (error) {
            console.log("something went wrong")
            console.log(error)
        }
    }, [])

    console.log(arrivalMessage)


    useEffect(() => {
        // console.log("arrival useeffect called")
        arrivalMessage &&
            (currentChat?.members.includes(arrivalMessage?.senderId)
                && setMessages((prev) => [...prev, arrivalMessage])
            )

        // arrivalMessage && sortConvs(arrivalMessage.senderId)
    }, [arrivalMessage, currentChat])

    //To add the current user to the list of active users and retrieve the list of active users
    useEffect(() => {
        socket.current.emit("addUser", user._id)
        console.log("Add user emitted")
        socket.current.on("getUsers", (users) => {
            //Modify it => Current user should only see certain active users not all
            // setOnlineUsers(users)
            console.log(users)
        })
    }, [user])

    const getConversations = async () => {
        await axiosInstance.get(`/chat/conversation/${user._id}`)
            .then((res) => {
                console.log(res.data)
                setConversations(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    useEffect(() => {

        getConversations()
    }, [user._id])

    useEffect(() => {
        const getMessages = async () => {
            await axiosInstance.get(`/chat/message/${currentChat?._id}`)
                .then((res) => {
                    console.log(res.data)
                    setMessages(res.data);
                })
                .catch((err) => {
                    console.log((err))
                })
        }

        getMessages();
    }, [currentChat])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(newMessage === "") return;

        const message = {
            conversationId: currentChat._id,
            senderId: user._id,
            receiverId: receiverId,
            text: newMessage,
        }

        console.log(receiverId)

        //Sending message to Socket server
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage
        })

        try {
            await axiosInstance.post("/chat/message", message)
                .then((res) => {
                    setMessages([...messages, res.data])
                    setNewMessage("")
                })
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <UserLayout>
            <Wrapper>
                <ChatMenu>
                    <ChatMenuWrapper>
                        {/* <ChatMenuInput placeholder='Search here' /> */}
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
                                            <Img src={recInfo?.image ? PF+ recInfo.image : "/images/avatar.png"} alt="" />
                                            <span>{recInfo?.username}</span>
                                        </InfoLeft>
                                        <InfoRight>
                                            <Cancel 
                                            onClick={()=>dispatch(setCurrentChat(null))}
                                            style={{color:"white",cursor:"pointer"}}
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
                                                onChange={(e)=> setNewMessage(e.target.value)}
                                                value={newMessage}
                                            />
                                        </FixedTextareaContainer>
                                        <ChatSubmitButton onClick={handleSubmit}>
                                            Send
                                        </ChatSubmitButton>
                                    </ChatBoxBottom>
                                </>)

                                : ( <OpenDiv>
                                        <NoConversationText>Open a conversation to start a chat.</NoConversationText>
                                    </OpenDiv>
                                )
                        }
                    </ChatBoxWrapper>
                </ChatBox>
                

            </Wrapper>

        </UserLayout>
    )
}

export default Messenger