import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MenuIcon from '@mui/icons-material/Menu';
import { Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
// import axiosInstance from '../../axios/axiosInstance';
import { logout } from '../../redux/userReducer';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const SideContainer = styled.div`
  min-width: 17vw;
  height: 100vh;
  position: fixed;
  background-color: #96B6C5;
  padding-top: 2vh;
  z-index  : 99;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  padding: 0 20px;
  border: 2px solid transparent;
  &:hover{
    border: 2px solid #434549;
    border-radius: 10px;
  }
`;

const Logo = styled.span`
    color: #ffffff;
    font-size: 2rem;
    cursor: pointer;
    font-style: italic;
    flex: 2;
    /* margin-left: 1vw; */
`;

const LogoDiv = styled.div`
  width: 100%;
  padding: 0 1vw 0 2vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
`;

const Sidebar = ({ setShowSBar }) => {
  const axiosInstance = useAxiosPrivate()

  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const handleLogout = async () => {
    await axiosInstance.delete('/auth/logout')
      .then(() => {
        dispatch(logout())
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
          Realify
        </Logo>
        <Close onClick={() => setShowSBar(false)} style={{ marginRight: "1rem", color: "#ffffff", cursor: "pointer" }} />
      </LogoDiv>
      <Ul>
        <Li onClick={() => navigate("/admin/dashboard")}>Dashboard</Li>
        <Li onClick={() => navigate("/admin/usermng")}>Users</Li>
        <Li onClick={() => navigate("/admin/propmng")}>Properties</Li>
        <Li onClick={() => navigate("/admin/bannermng")}>Banners</Li>
        <Li onClick={() => navigate("/admin/blogmng")}>Blogs</Li>

        {/* <Li>
          {user?.role === "admin"
            ? (<Button variant='danger' onClick={handleLogout}>
              Logout
            </Button>)

            : (<Button onClick={() => navigate('/login')}>
              Login
            </Button>)
          }
        </Li> */}

      </Ul>

    </SideContainer>
  )
}

export default Sidebar