import React, { useEffect, useState } from 'react';
import './posts.css';
import { FavoriteBorder, Star, StarBorder } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClippedPara = styled.p`
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-height: 1.5;
`;


const Posts = ({title}) => {
    const navigate = useNavigate()
    const [posts,setPosts] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const user = useSelector((state)=>state.user.user);

    const notify = (msg)=>{
        return toast(msg)
    }
    
    const getPosts = async ()=>{
        try {
            await axiosInstance.get("/getallproperties")
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
        getPosts()
    },[])

    console.log(posts)

    function formatPrice(price) {
        if (typeof price !== 'number' || isNaN(price)) {
          return 'N/A'; 
        }
      
        if (price >= 10000000) {
    
          const formattedPrice = (price / 10000000).toFixed(2);
          return formattedPrice.endsWith('.00') ? formattedPrice.slice(0, -3) + ' Cr' : formattedPrice + ' Cr';
        } 
        else if (price >= 100000) {
          const formattedPrice = (price / 100000).toFixed(2);
          return formattedPrice.endsWith('.00') ? formattedPrice.slice(0, -3) + ' Lac' : formattedPrice + ' Lac';
        } else {
          return price.toLocaleString('en-IN');
        }
      }

     const handleLike = async(propId,i)=>{
        if(user?.role !== 'user'){
            return
        }
        await axiosInstance.put(`/likeprop`,
        {propId,userId:user._id}
        )
        .then((res)=>{
            console.log(res)
            const updProp = res.data.updProp;
            console.log(updProp)
            notify(res.data.msg)
            const updPosts = posts.map((post)=>(
                post._id === propId ? updProp : post
            ))

            setPosts(updPosts)
        })
        .catch((err)=>{
            console.log(err)
        })

     }


    return (
        <div className='posts'>
            <h2>{title}</h2>
            <div className='cards'>

            {posts.length > 0 && posts.map((post,i)=>{
                
                return (
                    <div className="card" key={i}>
                            <div className="picNlike">
                                <div className="pic" onClick={()=>navigate(`/post-detail/${post._id}`)}>
                                    <img src={post?.images[0] ? PF + post.images[0]?.filename : "/images/noPropImg.png"}
                                        alt="" />
                                </div>

                                <div className='heart' onClick={()=>handleLike(post?._id,i)}>
                                    {post?.likedBy.includes(user?._id)
                                    ?  <Star style={{color:"red"}}/>
                                    : <StarBorder/>
                                    }
                                </div>
                            </div>
                            <div className="priceDesc" onClick={()=>navigate(`/post-detail/${post?._id}`)}>
                                {/* <span>{post.title}</span> */}
                                <span className="price">{post.title}</span>
                                <span className="price">₹ {formatPrice(post?.price)}</span>
                                <span>Type: {post?.type}</span>
                                <span>Purpose: {post?.purpose}</span>
                                <ClippedPara>{ post?.description}</ClippedPara>
                            </div>
                            <div className="placeDate" onClick={()=>navigate(`/post-detail/${post?._id}`)}>
                                <span className="place">{post?.area},{post?.location}</span>
                            </div>
                        </div>
            )})}

            </div>

            <ToastContainer/>
        </div>
    )
}

export default Posts