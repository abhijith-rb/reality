import React from 'react';
import styled from 'styled-components';
import axiosInstance from "../../axios/axiosInstance"
import { useNavigate } from 'react-router-dom';

const NavContainer = styled.div`
    width: 100%;
    height: 5vh;
    background-color: #88C4FE;
    @media (max-width:800px){
      display:none;
    }
`;

const Ul = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-around;
`;

const Li = styled.li`
  cursor: pointer;
`;



const Navigator = () => {
  const navigate = useNavigate()

  const goToList = (query)=>{
    navigate(`/list?nav=${query}`)
  }
  return (
    <NavContainer>
        <Ul>
          <Li onClick={()=>goToList("Buy")}>Buy</Li>
          <Li onClick={()=>goToList("Rent")}>Rent</Li>
          <Li>Plots</Li>
          <Li>Commercial</Li>
          <Li>Project</Li>
        </Ul>

    </NavContainer>
  )
}

export default Navigator