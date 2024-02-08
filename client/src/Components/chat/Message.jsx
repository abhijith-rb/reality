import React, { useState, useEffect } from 'react'
import { styled } from 'styled-components';
// import axiosInstance from '../../axios/axiosInstance';
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

const Message = ({ message, own}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <Wrapper style={{ alignItems: own && "flex-end" }}>
            <Top >
               
                <Text style={{ backgroundColor: own && "rgb(221, 217, 217)", color: own && "black" }}>
                    {message.text}
                </Text>
            </Top>
            <Bottom>{format(message.createdAt)}</Bottom>
        </Wrapper>
    )
}

export default Message