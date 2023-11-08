import { Bathroom, Bed, Cake, Construction, Escalator, Image, RoundedCornerOutlined, Sell, Signpost, SquareFoot, SquareOutlined, StairsOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components';

const Card = styled.div`
    width: 100%;
    /* height: auto; */
    min-height: 50vh;
    background-color: #ffffff;
    padding-top: 2vh;
    padding-bottom: 2vh;
    border-radius: 10px;
    box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    align-items: center;

`;

const TopDiv = styled.div`
    width: 100%;
    height: auto;
    /* min-height: 6vh; */
    /* border: 2px solid blue; */
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #666;
    @media (max-width: 800px){
        height: auto;
    }
`;

const PriceDiv = styled.div`
height: fit-content;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    /* border: 2px solid black; */
`;

const DeetsTop = styled.ul`
width: 50%;
height: 9vh;
/* min-height: 6vh; */
display: flex;
flex-direction: column;
    /* border: 2px solid green; */
    @media (max-width: 800px){
        height: 15vh;
    }
`;

const BotDiv = styled.div`
width: 100%;
min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 2px solid red; */
    @media (max-width:800px){
        flex-direction: column;
    }
`;

const PicsDiv = styled.div`
width: 40%;
 height: 95%;
 padding: 2vh 2vw;
   cursor: pointer;
    @media (max-width: 800px){
        width: 95%;
        height: 50%;
    }
`;

const MorePics = styled.div`
    width: 100%;
    height: 6vh;
    position: absolute;
    bottom: 0;
    left: 0;
    color: #ffffff;
    background-color: #222;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DeetsDiv = styled.div`
width: 60%;
min-height: 55vh;

    @media (max-width: 800px){
        width: 95%;
        height: 45vh;
    }
`;

const WrapDeet = styled.div`
    width: 100%;
min-height: 55vh;
display: flex;
flex-direction: column;
justify-content: space-evenly;
    /* border: 2px solid yellow; */
    @media (max-width: 800px){
        width: 100%;
        height: 45vh;
    }
`;

const RowDiv = styled.div`
    width: 100%;
    min-height: 15vh;
    /* border: 2px solid violet; */
    display: flex;
`;

const InfoBlock = styled.div`
    width: 50%;
    height: 100%;
    /* border: 2px solid red; */
    color: #777;
    padding:1vh 0 0 1vw;
    
`;

const ImageDiv = styled.div`
    width: 100%;
    height: 50vh;
    /* border: 2px solid #777; */
    border-radius: 5px;
    position: relative;

`;

const Img = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
`;

const InfoTile = styled.h6`
width: fit-content;
padding: 0 1vw;
border-radius: 5px;
height: fit-content;
    color: white;
    background-color: #222;
    opacity: 0.5;
`;

const Dtb = styled.div`
    display: flex;
    gap: 3px;
    @media (max-width: 800px){
        width: 100%;
        height: 45vh;
        flex-direction: column;
        gap: 0;
    }
`;

const PrimeDeets = ({ post, setGalOpen }) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    console.log(post)
    const [images, setImages] = useState([])
    useEffect(() => {
        if (post && post.images) {
            setImages([...post.images])

        }
    }, [post])

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
    console.log(images)
    return (
        <Card>
            <TopDiv>
                <PriceDiv>
                    <h2>₹ {formatPrice(post?.price)}</h2>
                </PriceDiv>
                <DeetsTop>
                    <h4>{post?.title}</h4>
                    <Dtb>
                        <p>{post?.type == "Plot" ? post?.type : (post?.type + " property")} for {post?.purpose == "Buy" ? "Sale " : "Rent "}</p>
                        <p> in {post?.location}</p>

                    </Dtb>

                </DeetsTop>
            </TopDiv>

            <BotDiv>
                <PicsDiv>
                    <ImageDiv onClick={() => setGalOpen(true)}>
                        {images[0]?.filename ?

                            <Img src={PF + images[0].filename} alt=""
                                onError={(e) => e.target.src = "/images/noPropImg.png"}
                            />
                            :
                            <Img src={"/images/noPropImg.png"} alt="" />

                        }

                        <MorePics>
                            <Image /> Photos(1/{images.length})
                        </MorePics>
                    </ImageDiv>



                </PicsDiv>

                <DeetsDiv>
                    {
                        post?.type == "Residential"
                        &&

                        <WrapDeet>

                            <RowDiv>
                                <InfoBlock>
                                    <InfoTile><SquareFoot /> Area</InfoTile>
                                    {post?.area}
                                </InfoBlock>
                                <InfoBlock>
                                    <InfoTile><Bed /> Configuration</InfoTile>
                                    {post?.bed ? post?.bed + " Bedrooms" : "1 Bedroom"}, {post?.bath ? post?.bath + " Bathrooms" : "1 Bathroom"}
                                </InfoBlock>
                            </RowDiv>
                            <RowDiv>
                                <InfoBlock>
                                    <InfoTile><Sell /> Price</InfoTile>
                                    ₹ {formatPrice(post?.price)}
                                </InfoBlock>
                                <InfoBlock>
                                    <InfoTile><Signpost /> Address</InfoTile>
                                    {post?.location}
                                </InfoBlock>

                            </RowDiv>
                            <RowDiv>
                                <InfoBlock>
                                    <InfoTile><StairsOutlined /> Total Floors </InfoTile>
                                    {post?.tfloors ? post?.tfloors : "Nil"}
                                </InfoBlock>
                                <InfoBlock>
                                    <InfoTile><Cake /> Property Age</InfoTile>
                                    {post?.age ? post?.age + " Year Old" : "Nil"}
                                </InfoBlock>
                            </RowDiv>
                        </WrapDeet>
                    }

                    {
                        post?.type == "Commercial"
                        &&
                        <WrapDeet>

                            <RowDiv>
                                <InfoBlock>
                                    <InfoTile><SquareFoot /> Super Area</InfoTile>
                                    {post?.area}
                                </InfoBlock>
                                <InfoBlock>
                                    <InfoTile><Sell /> Price</InfoTile>
                                    ₹ {formatPrice(post?.price)}
                                </InfoBlock>
                            </RowDiv>
                            <RowDiv>
                                <InfoBlock>

                                    <InfoTile><StairsOutlined /> Floor</InfoTile>
                                    {post?.floor ? post?.floor : "Nil"}
                                </InfoBlock>
                                <InfoBlock>
                                    <InfoTile><Signpost /> Address</InfoTile>
                                    {post?.location}
                                </InfoBlock>

                            </RowDiv>
                            <RowDiv>
                                <InfoBlock>
                                    <InfoTile><Bathroom /> Washroom </InfoTile>
                                    {post?.wash ? post?.wash : "Nil"}
                                </InfoBlock>
                                <InfoBlock>
                                    <InfoTile><Escalator /> Lift</InfoTile>
                                    {post?.lift ? post?.lift : "Nil"}
                                </InfoBlock>
                            </RowDiv>
                        </WrapDeet>

                    }

                    {
                        post?.type == "Plot"
                        &&
                        <WrapDeet>

                            <RowDiv>
                                <InfoBlock>
                                    <InfoTile><SquareFoot /> Area</InfoTile>
                                    {post?.area}
                                </InfoBlock>
                                <InfoBlock>
                                    <InfoTile><Sell /> Price</InfoTile>
                                    ₹ {formatPrice(post?.price)}
                                </InfoBlock>
                            </RowDiv>
                            <RowDiv>
                                <InfoBlock>
                                    <InfoTile><Signpost /> Address</InfoTile>
                                    {post?.location}
                                </InfoBlock>
                                <InfoBlock>
                                    <InfoTile><SquareOutlined /> Boundary wall</InfoTile>
                                    {post?.wall ? "Yes" : "No"}
                                </InfoBlock>


                            </RowDiv>
                            <RowDiv>
                                <InfoBlock>
                                    <InfoTile><Construction /> Any Construction done</InfoTile>
                                    {post?.built ? "Yes" : "No"}
                                </InfoBlock>
                                <InfoBlock>
                                    <InfoTile><RoundedCornerOutlined /> Open Sides</InfoTile>
                                    {post?.opens ? post?.opens : "Nil"}
                                </InfoBlock>
                            </RowDiv>
                        </WrapDeet>

                    }

                </DeetsDiv>

            </BotDiv>
        </Card>
    )
}

export default PrimeDeets