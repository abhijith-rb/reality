import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '../../redux/userReducer';
import { setCurrentChat } from '../../redux/chatReducer';
// import axiosInstance from '../../axios/axiosInstance';
import { Close } from '@mui/icons-material';
import { Button } from 'react-bootstrap';
import {googleLogout} from '@react-oauth/google'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const SideContainer = styled.div`
  min-width: 17vw;
  height: 100vh;
  background-color: #B5CFD8;
  position: fixed;
  padding-top: 2vh;
  z-index  : 99;
  @media (min-width:890px){
    display: none;
  }
`;

const Ul = styled.ul`
  list-style: none;
  color: #6C737E;
  font-size: 25px;
  margin-top:5vh;
  font-style:bold;
  padding-left: 1rem;
  padding-right:1rem;
`;

const Li = styled.li`
  cursor: pointer;
  margin-bottom:3vh;
  padding: 0 20px;
  border: 2px solid transparent;
  &:hover{
    border: 2px solid #434549;
    border-radius: 10px;
  }
`;

const Logo = styled.span`
    color: #6C737E;
    font-size: 2rem;
    cursor: pointer;
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
  const axiosInstance = useAxiosPrivate()

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
            googleLogout(()=>{
              console.log("the google logout is successfull")
            })
        })
        .catch((error) => {
            console.log(error)
           
        })
}

  return (
    <SideContainer>
      <LogoDiv>
        <Logo onClick={() => navigate("/")}>
                Realify
        </Logo>
        <Close onClick={()=> setSidebar(false)} style={{marginRight:"1rem",color:"#6C737E",cursor:"pointer"}}/>
      </LogoDiv>
        <Ul>
          <Li onClick={()=>navigate("/profile")}>My Profile</Li>
          <Li onClick={()=>goToList("Buy")}>Buy</Li>
          <Li onClick={()=>goToList("Rent")}>Rent</Li>
          <Li onClick={()=>navigate("/messenger")}>Chats</Li>
          <Li onClick={()=>navigate("/favorites")}>Favorites</Li>
          {user?.subscribed && <Li onClick={()=>navigate("/userprops")}>My Properties</Li>}
          <Li onClick={()=>navigate("/blogs")}>Blogs</Li>
          {user?.role === "user"
            ?
              <Button variant='outline-danger' onClick={handleLogout}>Logout</Button> 
              
            :
              <Button variant='outline-primary' onClick={()=>navigate("/login")}> Login</Button>
              
        }
        </Ul>

    </SideContainer>
  )
}

export default UserSidebar