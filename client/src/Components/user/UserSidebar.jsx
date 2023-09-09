import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '../../redux/userReducer';
import { setCurrentChat } from '../../redux/chatReducer';
import axiosInstance from '../../axios/axiosInstance';
import { Close } from '@mui/icons-material';

const SideContainer = styled.div`
  min-width: 17vw;
  height: 100vh;
  background-color: #1876D0;
  position: fixed;
  padding-top: 2vh;
  z-index  : 99;
  @media (min-width:800px){
    display: none;
  }
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
  margin-left: 1vw;
`;

const UserSidebar = ({setSidebar}) => {
  const navigate = useNavigate();
  const user = useSelector((state)=> state.user.user)
  const dispatch = useDispatch();

  const goToList = (query)=>{
    navigate(`/list?nav=${query}`)
  }
  
  const handleLogout = async () => {
    await axiosInstance.delete('/auth/logout')
        .then(() => {
            dispatch(logout())
            dispatch(setCurrentChat(null))
            console.log("logout dispatched")
        })
        .catch((error) => {
            console.log(error)
           
        })
}

  return (
    <SideContainer>
      <LogoDiv>
        <Logo onClick={() => navigate("/")}>
                Reality
        </Logo>
        <Close onClick={()=> setSidebar(false)} style={{marginRight:"1rem",color:"#ffffff",cursor:"pointer"}}/>
      </LogoDiv>
        <Ul>
          <Li onClick={()=>navigate("/profile")}>My Profile</Li>
          <Li onClick={()=>navigate("/userprops")}>My Properties</Li>
          <Li onClick={()=>navigate("/blogs")}>Blogs</Li>
          <Li onClick={()=>navigate("/messenger")}>Chats</Li>
          <Li onClick={()=>navigate("/favorites")}>Favorites</Li>
          <Li onClick={()=>goToList("Buy")}>Buy</Li>
          <Li onClick={()=>goToList("Rent")}>Rent</Li>
          {user?.role === "user"
            ?<Li onClick={handleLogout}>Logout</Li>
            :<Li onClick={()=>navigate("/login")}>Login</Li>
        }
        </Ul>

    </SideContainer>
  )
}

export default UserSidebar