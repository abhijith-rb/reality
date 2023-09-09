import React, { useEffect, useState } from 'react';
import UserLayout from '../../Components/user/UserLayout';
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

const Favorites = () => {
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
        <div className='posts'>
            <h2>Favorite Properties</h2>
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
                                    {post?.likedBy.includes(user._id)
                                    ?  <Star style={{color:"red"}}/>
                                    : <StarBorder/>
                                    }
                                </div>
                            </div>
                            <div className="priceDesc" onClick={()=>navigate(`/post-detail/${post?._id}`)}>
                                <span>{post.title}</span>
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

            {posts.length === 0 && 
            <h1 style={{color:"#777"}}>
                You haven't liked any properties yet</h1>}

            </div>

            <ToastContainer/>
            
        </div>
    </UserLayout>
  )
}

export default Favorites