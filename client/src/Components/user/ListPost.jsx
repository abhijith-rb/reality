import { WidthFull } from '@mui/icons-material';
import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components'

const PostWrap = styled.div`
    width: 80vw;
    height: 35vh;
    background-color: #eeebeb;
    padding: 2vh 2vw;
    display: flex;
    border-radius:5px;
`;

const ImgDiv = styled.div`
    width: 25%;
    height: 90%;
    background-color: red;
`;

const DetailsDiv= styled.div`
    width: 50%;
    height: 90%;
    color: #0f518f;
    padding-left: 5vw;
    padding-top: 2vh;
`;

const RightDiv = styled.div`
    width: 25%;
    height: 90%;
    display: flex;
    flex-direction: column;
    gap: 2vh;
    align-items: center;
    padding: 2vh 3vw;
    color: #0f518f;
    background-color: #c2bcbc;
`;

const Img = styled.img`
    width: 100%;
    height: 100%;
`;

const ClippedPara = styled.p`
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-height: 1.5;
    margin-top: 5vh;
`;


const ListPost = ({post}) => {

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

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
      
      <Link to={`/post-detail/${post?._id}`} key={post?._id} style={{textDecoration:'none', color:"#555"}}>
    <PostWrap>
        <ImgDiv>
            <Img src={post?.images[0] ? PF + post?.images[0]?.filename : "/images/noPropImg.png"} alt=''/>
        </ImgDiv>
        <DetailsDiv>
            <h4>{post?.title}</h4>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",width:"20vw",marginTop:"2vh"}}>
            <span>Type: {post?.type}</span>
            <span>Location: {post?.location}</span>
            </div>
            <ClippedPara>{post?.description}</ClippedPara>
        </DetailsDiv>
        <RightDiv>
            <h3>₹{formatPrice(post?.price)}</h3>
            <span>{post?.area}</span>
            <Button>Contact the Owner</Button>
        </RightDiv>

    </PostWrap>
    </Link>
  )
}

export default ListPost