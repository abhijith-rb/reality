import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserLayout from '../../Components/user/UserLayout';
import Imagecard from '../../Components/user/ImageCard';
import DetailsCard from '../../Components/user/DetailsCard';
import axios from 'axios';
import SellerCard from '../../Components/user/SellerCard';
import { styled } from 'styled-components';
// import axiosInstance from '../../axios/axiosInstance';
import { useSelector } from 'react-redux';
import PrimeDeets from '../../Components/user/PrimeDeets';
import Gallery from './Gallery';
import VisitCard from '../../Components/user/VisitCard';
import VisitModal from '../../Components/Seller/VisitModal';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Wrapper = styled.div`
    width: 100%;
    height: auto;
    /* background-color: #eeebeb; */
    position: relative;
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
    flex:7;
    margin-bottom: 3rem;
`;

const SideDiv = styled.div`
    flex:2;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    @media (max-width:970px){
        width: 70vw;
        margin-bottom: 2vh;
    }
`;

const Detail = () => {
    const axiosInstance = useAxiosPrivate()

  const postId = useLocation().pathname.split("/")[2];
  const [post,setPost] = useState({})
  const [date,setDate] = useState("");
  const user = useSelector((state)=>state.user.user);
  const [galOpen,setGalOpen] = useState(false);
  const [visitOpen,setVisitOpen] = useState(false);

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

  const addView = async()=>{
    await axiosInstance.put("/addview",{
        userId : user._id,
        postId: postId
    })
  }

  useEffect(()=>{
    getProperty();
    if(user && user.role === "user"){
        addView()
        .then(()=>{
            console.log("view added")
        })
        .catch((err)=>{
            console.log(err)
        })
    }
  },[postId])

  console.log(date)
  
  return (
    <UserLayout>
        <Wrapper>
            <ContainerDiv>
                <MainDiv>
                    <PrimeDeets post={post} setGalOpen={setGalOpen}/>
                    <DetailsCard post={post}/>
                </MainDiv>
                <SideDiv>
                    {user && (user._id!=post.ownerId) && < SellerCard post={post}/>}
                    {user && (user._id!=post.ownerId) && <VisitCard post={post} setVisitOpen={setVisitOpen}/>}
                </SideDiv>

            </ContainerDiv>
        </Wrapper>

        { visitOpen && <VisitModal sellerId={post.ownerId} propertyId={post._id} setVisitOpen={setVisitOpen}/>}
        {galOpen && <Gallery images={post?.images} setGalOpen={setGalOpen}/>}
    </UserLayout>
  )
}

export default Detail