import React from 'react'
import { styled } from 'styled-components'

const Dcard = styled.div`
    margin-top: 1vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
    width: 100%;
    padding-left: 1vw;
    background-color: #ffffff;
;`

const DBlock = styled.div`
    display: flex;
    gap: 8vw;
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
        <h3>Details</h3>
        <DBlock>
            <p>Title</p>
            <p>{post.title}</p>
        </DBlock>
        <DBlock>
            <p>Type</p>
            <p>{post.type}</p>
        </DBlock>
        <DBlock>
            <p>Price</p>
            <p>{formatPrice(post.price)}</p>
        </DBlock>
        <DBlock>
            <p>Area</p>
            <p>{post.area}</p>
        </DBlock>
        <DBlock>
            <p>Location</p>
            <p>{post.location}</p>
        </DBlock>
        <hr></hr>
        <h5>Description</h5>
        <p>{post.description}</p>

    </Dcard>
  )
}

export default DetailsCard