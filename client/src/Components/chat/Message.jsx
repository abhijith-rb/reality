import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios'
import { styled } from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';
import { format } from 'timeago.js'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
`;
const Top = styled.div`
    display: flex;
`;
const Img = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
    border: 2px solid grey;
`;
const Text = styled.div`
    padding: 10px;
    border-radius: 20px;
    background-color:#1877f2;
    color: white;
    max-width: 300px;
`;
const Bottom = styled.div`
    font-size: 12px;
    margin-top: 10px;
`;

const Message = ({ message, own, receiverId }) => {
    const user = useSelector((state) => state.user.user)
    const [receiver, setReceiver] = useState(null);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const currentChat = useSelector((state) => state.chat.current)

    useEffect(() => {
        const getReceiver = async () => {
            try {
                await axiosInstance.get(`/find-user/${receiverId}`)
                    .then((res => {
                        setReceiver(res.data)
                    }))
            } catch (error) {
                console.log(error)
            }
        }

        getReceiver();
    }, [receiverId])

    // console.log(receiver)

    return (
        <Wrapper style={{ alignItems: own && "flex-end" }}>
            <Top >
                <Img
                    style={{ display: own && "none" }}
                    src={receiver?.image ?
                        (receiver.googleUser
                            ? receiver.image
                            : PF + receiver.image)
                        : '/images/avatar.png'} alt=""
                    onError={(e) => e.target.src = "/images/avatar.png"}
                />
                <Text style={{ backgroundColor: own && "rgb(221, 217, 217)", color: own && "black" }}>
                    {message.text}
                </Text>
            </Top>
            <Bottom>{format(message.createdAt)}</Bottom>
        </Wrapper>
    )
}

export default Message