import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';

const Wrapper=styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    margin-top: 20px;
    background-color: #88C4FE;
`;


const Img=styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
`;
const ConversationName=styled.span`
    font-weight: 500;
`;

const Conversation = ({conversation,currentUser}) => {
    const [user2,setUser2] = useState(null);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const user2Id = conversation.members.find((m)=> m!== currentUser._id)

    useEffect(()=>{
        const getUser=async()=>{
            try {
                await axiosInstance.get(`/find-user/${user2Id}`)
                .then((res)=>{
                    setUser2(res.data)
                })
                .catch((err)=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }

        getUser();
    },[currentUser,conversation])
  return (
    <Wrapper>
      <Img src={user2?.image ? PF+ user2.image : "/images/avatar.png"} alt="" />
      <ConversationName >{user2?.username}</ConversationName>
    </Wrapper>
  )
}

export default Conversation