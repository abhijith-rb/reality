import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';
import { Star, StarBorder } from '@mui/icons-material';


const Card = styled.div`
    width: 18vw;
    height: 55vh;
    border-radius: 4px;
    padding-left: 5px;
    display: flex;
    flex-direction: column;   
    padding-right: 5px;
    cursor: pointer;
    box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
    background-color: #ffffff;
    @media (max-width:800px) {
        width: 36vw;
        height: 55vh;
    }

    @media (max-width:500px) {
        width: 85vw;
        height: 55vh;
    }
`;

const PicNLike = styled.div`
    width: 100%;
    height: 25vh;
    display: flex;
    justify-content: space-between;
    margin-top: 0.5em;
    margin-bottom: 1vh;
    position: relative;
    /* border: 2px solid red; */
`;

const Pic = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-right:0 ;
    border-radius: 5px;
    /* border: 2px solid blue; */

`;

const Img = styled.img`
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 5px;
`;

const StarLike = styled.div`
    position: absolute;
    right: 8px;
    top: 10px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: aliceblue;
`;

const PriceDesc = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 1vw;
`;

const Price = styled.span`
    font-size: 20px;
    font-weight:700;
    color: #4f5867;
    /* color: #0f518f; */
`;

const PlaceDate = styled.div`
    color: #777;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    text-transform: uppercase;
    align-items: center;
    margin-bottom: 1rem;
    padding-left: 1vw;
`;

const ClippedPara = styled.p`
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-height: 1.5;
`;


const PropCard = ({post,handleLike,i}) => {
    const navigate = useNavigate()
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const user = useSelector((state)=>state.user.user);

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

    const handleView = async(post)=>{
        if(user && user.role === "user"){
            await axiosInstance.put("/addview",{
                userId : user._id,
                postId: post._id
            })
        }
        
        navigate(`/post-detail/${post._id}`)
    }


    return (
        <Card key={i}>
            <PicNLike>
                <Pic onClick={() => handleView(post)}>
                    <Img src={post?.images[0] ? (PF + post.images[0]?.filename) : "/images/noPropImg.png"}
                        alt="" 
                        onError={(e)=> e.target.src = "/images/noPropImg.png"}
                        />
                </Pic>

                <StarLike onClick={() => handleLike(post?._id, i)}>
                    {post?.likedBy.includes(user?._id)
                        ? <Star style={{ color: "red" }} />
                        : <StarBorder />
                    }
                </StarLike>
            </PicNLike>
            <PriceDesc onClick={() => handleView(post)}>
                <Price>{post.title}</Price>
                <Price>₹ {formatPrice(post?.price)}</Price>
                <span>Type: {post?.type}</span>
                <span>Purpose: {post?.purpose}</span>
                <ClippedPara>{post?.description ? post?.description : ""}</ClippedPara>
            </PriceDesc>
            <PlaceDate onClick={() => handleView(post)}>
                <span className="place">{post?.area},{post?.location}</span>
            </PlaceDate>
        </Card>
    )
}

export default PropCard