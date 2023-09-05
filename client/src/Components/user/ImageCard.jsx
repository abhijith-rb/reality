import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { styled } from 'styled-components';

const Card = styled.div`
    width: 100%;
    height: auto;
    background-color: #ffffff;
    padding-bottom: 1rem;
`;

const CarouselImage = styled.div`
    width: 100%;
    height: 450px;
    background-color: black;
`;

const Img = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const Imagecard = ({post}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    console.log(post)
    const [images,setImages] = useState([])
    useEffect(()=>{
        if(post && post.images){
            setImages([...post.images])

        }
    },[post])
    console.log(images)
  return (
    <Card>
        <Carousel >
            {images.map((image,i)=>{
                return(
                <CarouselImage key={i}>
                    <Img src={PF + image.filename} alt="" />
                    
                </CarouselImage>

            )})}
            
        </Carousel>
    </Card>
        

  )
}

export default Imagecard