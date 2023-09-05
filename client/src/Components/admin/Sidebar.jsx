import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MenuIcon from '@mui/icons-material/Menu';

const SideContainer = styled.div`
  min-width: 17vw;
  height: 100vh;
  background-color: #637CFE;
  position: fixed;
  padding-top: 2vh;
  z-index  : 99;
`;

const Ul = styled.ul`
  list-style: none;
  color: #ffffff;
  font-size: 25px;
  margin-top:5vh;
  font-style:bold;
  padding-left: 1rem;
  padding-right:1rem;
`;

const Li = styled.li`
  cursor: pointer;
  margin-bottom:3vh;
`;

const Logo = styled.span`
    color: #ffffff;
    font-size: 2rem;
    cursor: pointer;
    font-family: 'Times New Roman', Times, serif;
    font-style: italic;
    flex: 2;
    margin-left: 1vw;
`;

const LogoDiv = styled.div`
  display: flex;
  align-items: center;
`;

const Sidebar = ({setShowSBar}) => {
  const navigate = useNavigate();

  return (
    <SideContainer>
      <LogoDiv>
        <MenuIcon onClick={()=> setShowSBar(false)} style={{marginLeft:"1rem",color:"#ffffff",cursor:"pointer"}}/>
        <Logo onClick={() => navigate("/")}>
                Reality
        </Logo>
      </LogoDiv>
        <Ul>
          <Li onClick={()=>navigate("/admin/dashboard")}>Dashboard</Li>
          <Li onClick={()=>navigate("/admin/usermng")}>Users</Li>
          <Li onClick={()=>navigate("/admin/propmng")}>Properties</Li>
          <Li onClick={()=>navigate("/admin/catmng")}>Categories</Li>
          <Li onClick={()=>navigate("")}>Banners</Li>
        </Ul>

    </SideContainer>
  )
}

export default Sidebar