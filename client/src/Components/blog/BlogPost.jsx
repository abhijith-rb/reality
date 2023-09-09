import React from 'react'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components';

const Wrapper = styled.div`
    /* width: 385px; */
    width: 40vw;
    height: 60vh;
    margin: 0px 10px 10px 10px;
    /* border: 2px solid grey; */
`;


const PostImg = styled.img`
    width: 100%;
    height: 60%;
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
    font-family: 'Varela', sans-serif;
    font-size: 16px;
    color: 053B50;
    line-height: 20px;
    margin-top: 10px;
    /* margin-right: 15px; */
    display: flex;
    justify-content: space-around;
    /* border: 2px solid blue; */
`;
const PostTitle = styled.span`
    font-family: 'Josefin Sans', sans-serif;
    font-size: 24px;
    font-weight: 700;
    margin-top: 15px;
    cursor: pointer;

`;
const PostDate = styled.span`
    font-family: 'Varela', sans-serif;
    font-size: 16px;
    margin-top: 1px;
    color: 053B50;
`;
const PostDesc = styled.p`
    font-family: 'Varela', sans-serif;
    font-size: 16px;
    margin-top: 15px;
    color: 053B50;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3 ;
    -webkit-box-orient: vertical;
`;

const BlogPost = ({post}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Wrapper>
       <Link to = {`/blog/${post?._id}`} style={{textDecoration:'none'}}>

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

        </Link>
    </Wrapper>
  )
}

export default BlogPost