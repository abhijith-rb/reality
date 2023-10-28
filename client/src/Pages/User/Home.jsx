import React, { useEffect, useState } from 'react'
import Posts from '../../Components/posts/Posts';
import UserLayout from '../../Components/user/UserLayout';
import styled from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';
import Loader from '../../utils/Loader';

const Banner = styled.div`
  position: relative;
  margin-bottom: 4vh;
`;

const Img = styled.img`
  width: 100%;
  height: 45vh;
  object-fit: cover;
  border-radius: 5px;
`;

const Title = styled.h1`
  color:white;
  position: absolute;
  top: 25%;
  left: 20%;
  font-family: 'Montserrat', sans-serif;
  font-weight: bolder;
  filter: drop-shadow(0.35rem 0.35rem 0.4rem rgba(0, 0, 0, 0.5));
`;

const Description = styled.h5`
  color:white;
  position: absolute;
  top: 60%;
  left: 20%;
`

const Home = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [banner,setBanner] = useState({})
  const getBanner = async()=>{
    await axiosInstance.get("/getbanner")
    .then((res)=>{
      console.log(res)
        setBanner(res.data)
    })
  }

  useEffect(()=>{
      getBanner()
  },[])

  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
    },[1500])
  },[])

  return (
    <UserLayout>
      {
        loading ?
        <Loader/>
        :
        <>
            <Banner>
              <Title>{banner?.title}</Title>
            
              <Img src={banner ? PF + banner?.image : "/images/noBanner.jpg"} alt=''
                          onError={(e)=> e.target.src = "/images/noBanner.jpg"}
                          />
            </Banner>
          <Posts title="Latest Properties"/>
        </>
      }
    </UserLayout>

  )
}

export default Home