import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components';
// import axiosInstance from '../../axios/axiosInstance';
import { useSelector } from 'react-redux';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Wrapper = styled.div`
    width: 100%;
    height: 10vh;
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    margin-top: 20px;
    background-color: #B5CFD8;
    border-radius: 5px;
    @media (max-width: 800px){
        flex-direction: column;
        height: auto;
    }
`;

const ImgDiv = styled.div`
    flex: 3;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Img = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
`;

const RightDiv = styled.div`
flex: 7;
    display: flex;
    flex-direction: column;
  overflow: hidden;

`;
const ConversationName = styled.span`
    font-weight: bold;
`;

const LastMsg = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  width: 100%;
  display: inline-block;
  color: #333;
    @media (max-width:800px){
        display: none;
    }
`;

const Conversation = ({ conversation, currentUser}) => {
    const axiosInstance = useAxiosPrivate()

    const [user2, setUser2] = useState(null);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const user2Id = conversation.members.find((m) => m !== currentUser._id);
    const currentChat = useSelector((state) => state.chat.current)

    const getUser = async () => {
        try {
            await axiosInstance.get(`/find-user/${user2Id}`)
                .then((res) => {
                    setUser2(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser();
    }, [currentUser, conversation])

    console.log(user2)
    return (
        <Wrapper>
            <ImgDiv>
                <Img src={user2?.image ?
                    (user2.googleUser
                        ? user2.image
                        : PF + user2.image)
                    : '/images/avatar.png'} alt=""
                    onError={(e) => e.target.src = "/images/avatar.png"}
                />
            </ImgDiv>
            <RightDiv>
                <ConversationName >{user2?.username}</ConversationName>
                <LastMsg>
                    {conversation.lastMessage}
                </LastMsg>
            </RightDiv>
        </Wrapper>
    )
}

export default Conversation