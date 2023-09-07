import React, { useEffect, useState } from 'react';
import './posts.css';
import { FavoriteBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { styled } from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';

const ClippedPara = styled.p`
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-height: 1.5;
`;


const Posts = ({title}) => {
    const [posts,setPosts] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    
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

    return (
        <div className='posts'>
            <h2>{title}</h2>
            <div className='cards'>

            {posts.map((post)=>{
                
                return (
                    <Link to={`/post-detail/${post._id}`} key={post._id} style={{textDecoration:'none', color:'white'}}>
                        <div className="card" key={post._id}>
                            <div className="picNlike">
                                <div className="pic">
                                    <img src={post?.images[0] ? PF + post.images[0]?.filename : "/images/noPropImg.png"}
                                        alt="" />
                                </div>
                                <div className='heart'>
                                    <FavoriteBorder/>
                                </div>
                            </div>
                            <div className="priceDesc">
                                <span className="price">₹ {formatPrice(post.price)}</span>
                                <ClippedPara>{ post.description}</ClippedPara>
                            </div>
                            <div className="placeDate">
                                <span className="place">{post.area},{post.location}</span>
                            </div>
                        </div>
                    </Link>    
            )})}

            </div>

            
        </div>
    )
}

export default Posts