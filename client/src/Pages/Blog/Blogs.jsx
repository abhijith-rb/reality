import React, { useEffect, useState } from 'react'
import BlogPost from '../../Components/blog/BlogPost'
import { styled } from 'styled-components';
import UserLayout from '../../Components/user/UserLayout';
// import axiosInstance from '../../axios/axiosInstance';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Wrapper = styled.div`
    height: fit-content;
    display: flex;
    /* flex-wrap: wrap; */
    align-items: center; 
    justify-content:center;
    padding-bottom:2vh;
    @media (max-width: 1000px){
        flex-direction: column;
    }
`;

const TopDiv = styled.div`
    width:90%;
    height: 10vh;
    /* border: 2px solid blue; */
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const Card = styled.div`
    width: 70%;
    height: auto;
    background-color: #ffffff;
    padding-top: 2vh;
    /* padding-bottom: 2vh; */
    border-radius: 10px;
    box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
    /* display: flex;
    align-items: center;
    justify-content: center; */
    /* border:2px solid red; */
    @media (max-width:800px){
        width: 95%;
    }
`;

const CarouselDiv = styled.div`
    width: 100%;
    height: fit-content;
    /* border: 2px solid green; */
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: center;
`;

const Img = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const Blogs = () => {
    const axiosInstance = useAxiosPrivate()

    const [blogs, setBlogs] = useState([])
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const getAllBlogs = async () => {
        await axiosInstance.get("/blog")
            .then((res) => {
                setBlogs(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllBlogs();
    }, [])

    console.log(blogs)
    return (
        <UserLayout>
            {user?.subscribed &&
                <TopDiv>
                    <Button variant='outline-primary' onClick={() => navigate('/write')}>Write a blog</Button>
                </TopDiv>
            }
            <Wrapper>
                {/* {blogs.length >0 ?
                blogs.reverse().map((b,i)=>(
                    <BlogPost post={b} key={i}/>
                ))
                : <h2 style={{color:"#777"}}>No Blogs</h2>
            }  */}

                <Card>
                    <Carousel >
                        {blogs.length > 0 ?
                            blogs.reverse().map((blog, i) => {
                                return (
                                    <CarouselDiv >
                                        <BlogPost post={blog} key={i} />
                                    </CarouselDiv>
                                )
                            })

                            :

                            <h2 style={{ color: "#777" }}>No Blogs</h2>


                        }
                    </Carousel>
                </Card>
            </Wrapper>
        </UserLayout>
    )
}

export default Blogs