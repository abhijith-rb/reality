import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserLayout from '../../Components/user/UserLayout';
import Imagecard from '../../Components/user/ImageCard';
import DetailsCard from '../../Components/user/DetailsCard';
import axios from 'axios';
import SellerCard from '../../Components/user/SellerCard';
import { styled } from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';

const Wrapper = styled.div`
    width: 100%;
    height: auto;
    /* background-color: #eeebeb; */
`;

const ContainerDiv = styled.div`
    display: flex;
    gap: 2vw;
    @media (max-width:970px){
        flex-direction: column;
        align-items: center;
    }
`;

const MainDiv = styled.div`
    flex:6;
    margin-bottom: 3rem;
`;

const SideDiv = styled.div`
    flex:3;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    @media (max-width:970px){
        width: 70vw;
        margin-bottom: 2vh;
    }
`;

const Detail = () => {
  const postId = useLocation().pathname.split("/")[2];
  const [post,setPost] = useState({})
  const [date,setDate] = useState("")

  const getProperty = async() => {
    await axiosInstance.get(`/getproperty/${postId}`)
    .then((response)=>{
        console.log(response.data)
        setPost(response.data)
    })
    .catch((err)=>{
        console.log(err)
       
    })
    
  }
  useEffect(()=>{
    getProperty()
  },[postId])

  console.log(date)

  return (
    <UserLayout>
        <Wrapper>
            <ContainerDiv>
                <MainDiv>
                    <Imagecard post={post}/>
                    <DetailsCard post={post}/>
                </MainDiv>
                <SideDiv>
                    <SellerCard post={post}/>
                </SideDiv>

            </ContainerDiv>
        </Wrapper>
    </UserLayout>
  )
}

export default Detail