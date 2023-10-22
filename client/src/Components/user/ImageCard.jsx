import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { styled } from 'styled-components';

const Card = styled.div`
    width: 100%;
    height: auto;
    background-color: #ffffff;
    padding-bottom: 1rem;
    border-radius: 10px;
  box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
`;

const CarouselImage = styled.div`
    width: 100%;
    height: 450px;
    /* background-color: #88C4FE; */
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
            {images.length > 0 ?
            images.map((image,i)=>{
                return(
                <CarouselImage key={i}>
                    <Img src={PF + image.filename} alt="" 
                        onError={(e)=> e.target.src = "/images/noPropImg.png"}
                        />
                    
                </CarouselImage>

            )})
        
            : <CarouselImage>
                <Img src={"/images/noPropImg.png"} alt="" />
            
                </CarouselImage>
        }
            
        </Carousel>
    </Card>
        

  )
}

export default Imagecard