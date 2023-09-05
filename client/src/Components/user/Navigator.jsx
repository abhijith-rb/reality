import React from 'react';
import styled from 'styled-components';

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
  return (
    <NavContainer>
        <Ul>
          <Li>Buy</Li>
          <Li>Rent</Li>
          <Li>Sell</Li>
          <Li>Plots</Li>
          {/* <Li>Commercial</Li> */}
          <Li>Project</Li>
        </Ul>

    </NavContainer>
  )
}

export default Navigator