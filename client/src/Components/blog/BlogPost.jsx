import React from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components';

const Wrapper = styled.div`
    width: 25vw;
    padding: 0 1vw;
    height: auto;
    margin: 0px 30px 10px 10px;
    border-radius: 5px;
    box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
    font-family: 'Montserrat', sans-serif;
    font-weight:500;
    cursor: pointer;
    @media (max-width: 1000px){
        width: 90vw;
    }
`;

const PostImg = styled.img`
    width: 100%;
    height: 50vh;
    object-fit: contain;
    border-radius: 7px;
`;
const PostInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const PostTag = styled.div`
    width: 80%;
    font-size: 16px;
    color: 053B50;
    line-height: 20px;
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
`;
const PostTitle = styled.span`
    font-size: 24px;
    font-weight: 700;
    margin-top: 15px;
    cursor: pointer;

`;
const PostDate = styled.span`
    font-size: 16px;
    margin-top: 1px;
    color: 053B50;
`;
const PostDesc = styled.p`
    font-size: 16px;
    margin-top: 2vh;
    color: #053B50;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1 ;
    -webkit-box-orient: vertical;
`;

const BlogPost = ({post}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const navigate = useNavigate();

  return (
    <Wrapper onClick={()=> navigate(`/blog/${post?._id}`)}>
       {/* <Link to = {`/blog/${post?._id}`} style={{textDecoration:'none'}}> */}

        <PostImg
            src={post?.image ? PF + post.image : "/images/noPropImg.png"}
            alt="No Image" />
        
        <PostInfo>

           <PostTitle>{post?.title}</PostTitle>

            <PostTag>
             {post.tags.map((t,i)=> (
                <span className="postTag" key={i}>{t}</span>  
                
             ))}
            
            </PostTag>
            
            <PostDate>{new Date(post.createdAt).toDateString()}</PostDate>

            <PostDesc>
            {post.description}
            </PostDesc>
        </PostInfo>

        {/* </Link> */}
    </Wrapper>
  )
}

export default BlogPost