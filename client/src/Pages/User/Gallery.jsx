import { CancelOutlined, Close } from "@mui/icons-material";
import React from "react";
import styled from "styled-components";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    background-color: black;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding:2vh 2vw  2vw;
   
`;

const CarouselDiv = styled.div`
    width: 80%;
    height: 95vh;
    /* border: 2px solid red; */
    @media (max-width:700px){
        width: 100%;
        height: 60vh;
    }
`;

const CarouselImageDiv = styled.div`
    width: 100%;
    height: 80vh;
    /* border: 2px solid green; */
    display: flex;
    align-items: center;
    @media (max-width:700px){
        width: 100%;
        height: 40vh;
    }
`;

const ImgStyle = {
    objectFit: "cover"
}


const CloseIcon = {
    color:"white",
    cursor:"pointer",
    position:"absolute",
    top:"5px",
    right:"10px"
}

const Gallery = ({setGalOpen,images})=>{
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <Wrapper>
            <CancelOutlined onClick={()=>setGalOpen(false)} style={CloseIcon}/>
            <CarouselDiv>
                <Carousel>
                    {
                        images.length >0 ?
                        images.map((image,i)=>(
                        <CarouselImageDiv key={i}>
                            <img src={PF + image.filename} alt="" 
                            onError={(e)=> e.target.src = "/images/noPropImg.png"}
                            style={ImgStyle}
                            />
                        </CarouselImageDiv>   
                        ))

                        :<h1>No Image Available</h1>
                    }

                </Carousel>
            </CarouselDiv>
        </Wrapper>
    )
}

export default Gallery;