import React, { useState, useEffect } from 'react'
import UserLayout from '../../Components/user/UserLayout'
import { styled } from 'styled-components';
import ListPost from '../../Components/user/ListPost';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';

const Wrapper = styled.div`
    width: 100%;
    display: flex;

`;

const SideDiv = styled.div`
    flex: 2;
    background-color: yellowgreen;
    height: 50vh;
`;

const MainDiv = styled.div`
    /* background-color: aqua; */
    padding-top: 4vh;
    padding-bottom: 4vh;
    flex: 8;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vh;
`;

const Listing = () => {
    const [posts,setPosts] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');
    console.log(query)
    
    const getPosts = async ()=>{
        try {
            await axiosInstance.get(`/search-property?squery=${query}`)
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
    },[query])

    console.log(posts)
  return (
    <UserLayout>
        <Wrapper>
            {/* <SideDiv>

            </SideDiv> */}

            <MainDiv>
                {posts.length>0 ?
                    posts?.map((post)=>(
                        <ListPost post={post}/>
                    ))

                    :<h1>No Matching Search Results</h1>
                }
            </MainDiv>
        </Wrapper>

    </UserLayout>
  )
}

export default Listing