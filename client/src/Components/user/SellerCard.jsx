import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components'
import { setCurrentChat } from '../../redux/chatReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';


const Sellercardx= styled.div`
    width: 100%;
    height: 25vh;
    padding-top: 1vh;
    background-color: #88C4FE;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    font-family: 'Montserrat', sans-serif;

`;

const Sellerdeets = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Sellerline1 = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-left: 1rem;
`;

const Img = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
`;

const LongBtn = styled.button`
    width: 60%;
    height: 5vh;
    font-weight: bold;
    margin-top: 1rem;
    color: #1876D0;
    background-color: white;
    border:2px solid #1876D0;
    border-radius: 5px;
`;

const Title = styled.h3`
    color: #ffffff;
`

const OwnerName = styled.span`
    color: #043d72;
    font-size: 18px;
`;

const SellerCard = ({post}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [owner,setOwner] = useState(null)
    const ownerId = post.ownerId
    const user = useSelector((state)=> state.user.user)

    useEffect(()=>{
        const getOwner = async()=>{
            await axiosInstance.get(`/find-user/${ownerId}`)
            .then((res)=>{
                console.log(res.data)
                setOwner(res.data)
            })
            .catch((err)=>{
                console.log(err)
            })
        }

        getOwner()
    },[post])

    console.log(owner)

    const handleChat = async()=>{
    
        await axiosInstance.post(`/chat/conversation/`,{
            senderId:user?._id,
            receiverId:ownerId
        })
        .then((res)=>{
            dispatch(setCurrentChat(res.data))
        })

        navigate("/messenger")
    }

  return (
    <Sellercardx>
        <Title>Contact Owner</Title>
        <Sellerdeets>
            <Sellerline1>
            <Img src={owner?.image ? PF + owner.image : '/images/avatar.png'} alt="" />
            
            <OwnerName>{owner?.username}</OwnerName>

            </Sellerline1>
        </Sellerdeets>
        <LongBtn onClick={handleChat}>Chat with Owner</LongBtn>
    </Sellercardx>
  )
}

export default SellerCard