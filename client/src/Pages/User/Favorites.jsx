import React, { useEffect, useState } from 'react';
import UserLayout from '../../Components/user/UserLayout';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
// import axiosInstance from '../../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropCard from '../../Components/posts/PropCard';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const PostsDiv = styled.div`
    height: auto;
    display: flex;
    flex-direction: column;
    padding-bottom: 5vh;
    /* padding-left: 2vw; */
    font-weight:500;
`;

const PostsHead = styled.h2`
    font-weight: 400;
    color: #12233f;
`;

const Cards = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    gap: 4vw;
    padding-left: 2vw;
    
    &::-webkit-scrollbar {
        width: 0.01em;
      }
    
      &::-webkit-scrollbar-track {
        background: transparent;
      }
    
      &::-webkit-scrollbar-thumb {
        background: transparent;
      }

      @media (max-width:1000px){
        justify-content: center;
        padding-left: 0;
      }
`;

const Favorites = () => {
    const axiosInstance = useAxiosPrivate()

    const navigate = useNavigate()
    const [posts,setPosts] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const user = useSelector((state)=>state.user.user);

    const notify = (msg)=>{
        return toast(msg)
    }
    
    const getFavs = async ()=>{
        try {
            await axiosInstance.get(`/getfavs/${user._id}`)
            .then((response)=>{
                setPosts(response.data)
            })
            .catch((err)=>{
               
            })

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getFavs()
    },[])

    console.log(posts)


     const handleLike = async(propId,i)=>{
        await axiosInstance.put(`/likeprop`,
        {propId,userId:user._id}
        )
        .then((res)=>{
            console.log(res)
            const updProp = res.data.updProp;
            console.log(updProp)

            const updPosts = posts.filter((post)=>(
                post._id !== propId 
            ))

            setPosts(updPosts)

            notify(res.data.msg)
        })
        .catch((err)=>{
            console.log(err)
        })

     }
  return (
    <UserLayout>
        <PostsDiv>
            <PostsHead>Favorite Properties</PostsHead>
            <Cards>

            {posts.length > 0 && posts.map((post,i)=>{
                
                return (
                    <PropCard post={post} handleLike={handleLike} i={i}/>

            )})}

            {posts.length === 0 && 
            <h1 style={{color:"#777"}}>
                You haven't liked any properties yet</h1>}

            </Cards>

            <ToastContainer/>
            
        </PostsDiv>
    </UserLayout>
  )
}

export default Favorites