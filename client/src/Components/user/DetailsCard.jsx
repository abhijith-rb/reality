import React from 'react'
import { styled } from 'styled-components'

const Dcard = styled.div`
    margin-top: 1vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
    padding-left: 3vw;
    width: 100%;
    background-color: #ffffff;
    font-family: 'Montserrat', sans-serif;
    font-weight:500;
    border-radius: 5px;
;`



const Ul = styled.ul`
    list-style: none;
    width: 100%;
    height: auto;
    font-size: 16px;

`;

const Li = styled.li`
  width: 100%;
    height: auto;
    display: flex;
    padding-bottom: 28px;
`;

const LabelDiv = styled.div`
      width: 170px;
    height: auto;
    /* line-height: 20px; */
`;


const DetailsCard = ({post}) => {
  console.log(post)

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
  
   


  return (
    <Dcard>
        <h1 style={{marginBottom:'4vh'}}>Property Details</h1>

        <Ul>
          <Li>
              <LabelDiv>Title</LabelDiv>
            <div>
              <span>{post.title}</span>
            </div>
          </Li>
          <Li>
              <LabelDiv>Type</LabelDiv>
            <div>
              <span>{post.type}</span>
            </div>
          </Li>
          <Li>
              <LabelDiv>Price</LabelDiv>
            <div>
              <span>₹ {formatPrice(post.price)}</span>
            </div>
          </Li>
          <Li>
              <LabelDiv>Area</LabelDiv>
            <div>
              <span>{post.area}</span>
            </div>
          </Li>
          <Li>
              <LabelDiv>Location</LabelDiv>
            <div>
              <span>{post.location}</span>
            </div>
          </Li>
        </Ul>


        <hr></hr>
        <h5>Description</h5>
        <p>{post.description}</p>

    </Dcard>
  )
}

export default DetailsCard