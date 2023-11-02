import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const NavContainer = styled.div`
    width: 100%;
    height: 5vh;
    background-color: #B5CFD8;
    display: flex;
    justify-content: space-between;
    @media (max-width:800px){
      display:none;
    }
`;

const WrapDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;


const Span = styled.span`
   color: #434549;
   cursor: pointer;
   padding: 0px 20px;
   border: 2px solid transparent;
   &:hover{
    border: 2px solid #434549;
    border-radius: 5px;
   }
`;


const Navigator = () => {
  const navigate = useNavigate()

  const goToList = (query)=>{
    navigate(`/list?nav=${query}`)
  }
  return (
    <NavContainer>

        <WrapDiv>
          <Span onClick={()=>goToList("Buy")}>Buy</Span>
          <Span onClick={()=>goToList("Rent")}>Rent</Span>
          <Span onClick={()=>navigate("/blogs")}>Blogs</Span>
          <Span onClick={()=>navigate("/favorites")}>Favorites</Span>

        </WrapDiv>
    </NavContainer>
  )
}

export default Navigator