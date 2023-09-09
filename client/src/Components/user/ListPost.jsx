import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components'
import { setCurrentChat } from '../../redux/chatReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';

const PostWrap = styled.div`
    width: 80vw;
    min-height: 35vh;
    background-color: #ffffff;
    padding: 2vh 2vw;
    display: flex;
    border-radius:5px;
    @media (max-width:800px){
      flex-direction: column;
    }
`;

const ImgDiv = styled.div`
    width: 25%;
    height: 90%;
    min-height: 30vh;
    @media (max-width:800px){
      width: 100%;
      height: 25%;
    }
`;

const DetailsDiv= styled.div`
    width: 50%;
    height: 90%;
    color: #0f518f;
    padding-left: 5vw;
    padding-top: 2vh;
    @media (max-width:800px){
      width: 90%;
      height: 50%;
      padding-left: 1vw;
    padding-top: 1vh;
     
    }
`;

const SubDetail = styled.div`
  display:flex;
  flex-direction:column;
  width:80%;
  margin-top:2vh;
 @media (max-width:800px){
  width: 50vw;
 }
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
    @media (max-width:800px){
      width: 100%;
      height: 25%;
      flex-direction: row;
    }
`;

const SubRight = styled.div`

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
    margin-top: 1vh;
`;


const ListPost = ({post}) => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
  const user = useSelector((state)=> state.user.user)
  const ownerId = post.ownerId
  console.log(post)

  const handleChat = async()=>{
    
    await axiosInstance.post(`/chat/conversation/`,{
        senderId:user?._id,
        receiverId:ownerId
    })
    .then((res)=>{
        dispatch(setCurrentChat(res.data))
    })

    navigate("/messenger")
  }

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
            <SubDetail >
            <h5>Type: {post?.type}</h5>
            <h5>Location: {post?.location}</h5>
            </SubDetail>
            <ClippedPara>{post?.description}</ClippedPara>
        </DetailsDiv>
        <RightDiv>
          <SubRight>
            <h3>₹{formatPrice(post?.price)}</h3>
            <span>{post?.area}</span>

          </SubRight>
            <Button onClick={handleChat}>Contact the Owner</Button>
        </RightDiv>

    </PostWrap>
    </Link>
  )
}

export default ListPost