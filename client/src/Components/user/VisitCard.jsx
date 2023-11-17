import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    height: 25vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background-color: #B5CFD8;
    color: #ffffff;
    border-radius: 10px;
    box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
    font-family: 'Montserrat', sans-serif;
`;

const LongBtn = styled.button`
    width: 75%;
    min-height: 5vh;
    font-weight: bold;
    margin-top: 1rem;
    color: #1876D0;
    background-color: white;
    border:2px solid #1876D0;
    border-radius: 5px;
`;

const VisitCard = ({post,setVisitOpen}) => {
  return (
    <Wrapper>
        <h2>Book a Visit</h2>
        <LongBtn onClick={()=>setVisitOpen(true)}>Book</LongBtn>
    </Wrapper>
  )
}

export default VisitCard