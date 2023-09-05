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
            <p>{post.price}</p>
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