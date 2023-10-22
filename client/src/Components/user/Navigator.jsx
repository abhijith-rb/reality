import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const NavContainer = styled.div`
    width: 100%;
    height: 5vh;
    /* background-color: #B0D9B1; */
    background-color: #B5CFD8;
    display: flex;
    justify-content: space-between;
    @media (max-width:800px){
      display:none;
    }
`;

const Ul = styled.ul`
width: 100%;
  list-style: none;
  display: flex;
  justify-content: space-around;
/* border: 2px solid red; */

`;

const Li = styled.li`
  color: #434549;
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
          <Li onClick={()=>navigate("/blogs")}>Blogs</Li>
          <Li onClick={()=>navigate("/favorites")}>Favorites</Li>
        </Ul>

    </NavContainer>
  )
}

export default Navigator