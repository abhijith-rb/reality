import React, { useEffect, useState } from 'react'
import BlogPost from '../../Components/blog/BlogPost'
import { styled } from 'styled-components';
import UserLayout from '../../Components/user/UserLayout';
import axiosInstance from '../../axios/axiosInstance';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
    height: fit-content;
    display: flex;
    flex-wrap: wrap;
    /* margin-bottom: 5vh; */
    align-items: center; 
    justify-content:center;
    padding-bottom:5vh;
    /* border: 2px solid red; */
`;

const TopDiv = styled.div`
    width:100%;
    height: 10vh;
    /* border: 2px solid blue; */
    display: flex;
    align-items: center;
`;

const Blogs = () => {
    const [blogs,setBlogs] = useState([])
    const user = useSelector((state)=> state.user.user);
    const navigate = useNavigate();
    const getAllBlogs = async()=>{
        await axiosInstance.get("/blog")
        .then((res)=>{
            setBlogs(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        getAllBlogs();
    },[])

    console.log(blogs)
  return (
    <UserLayout>
        {user?.subscribed &&
            <TopDiv>
                <Button onClick={()=> navigate('/write')}>Write a blog</Button>
            </TopDiv>
        }
        <Wrapper>
            {
                blogs.reverse().map((b,i)=>(
                    <BlogPost post={b} key={i}/>
                ))
            } 

        </Wrapper>
    </UserLayout>
  )
}

export default Blogs