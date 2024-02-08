import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
// import axiosInstance from '../../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropCard from './PropCard';
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


const Posts = ({ title, type }) => {
    const axiosInstance = useAxiosPrivate()

    const [posts, setPosts] = useState([]);
    const user = useSelector((state) => state.user.user);

    const notify = (msg) => {
        return toast(msg)
    }

    const handleLike = async (propId, i) => {
        if (user?.role !== 'user') {
            return
        }
        await axiosInstance.put(`/likeprop`,
            { propId, userId: user._id }
        )
            .then((res) => {
                console.log(res)
                const updProp = res.data.updProp;
                console.log(updProp)
                notify(res.data.msg)
                const updPosts = posts.map((post) => (
                    post._id === propId ? updProp : post
                ))

                setPosts(updPosts)
            })
            .catch((err) => {
                console.log(err)
            })

    }

    const getPosts = async () => {
        try {
            await axiosInstance.get("/getallproperties")
                .then((response) => {
                    handleTypes(response.data)
                })
                .catch((err) => {
                    console.log(err)
                })

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPosts()
    }, [])

    const handleTypes = (qposts)=>{
        if(type == "latest"){
            qposts.reverse()
        }
        else if(type=="mostViewed"){
            qposts.sort((a,b)=> b.views.length - a.views.length);
            qposts = qposts.slice(0,4);
        }
        setPosts(qposts)
    }

    console.log(posts)

    return (
        <>
            {
                posts.length > 0 &&
                    <PostsDiv>
                        <PostsHead>{title}</PostsHead>

                        <Cards>
                            {posts.map((post, i) => {

                                return (
                                    <PropCard post={post} handleLike={handleLike} i={i} key={post._id} />
                                )
                            }
                            )}
                        </Cards>
                        <ToastContainer />
                    </PostsDiv>
            }

        </>
    )
}

export default Posts