import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { logout } from '../../redux/userReducer';
import { Button, NavItem, Navbar } from 'react-bootstrap'
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import axiosInstance from '../../axios/axiosInstance';


const HeadContainer = styled.div`
    width: 100%;
    height: 10vh;
    background-color: #637CFE;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    padding-left: 2vw;
    padding-right: 3vw;
    z-index: 99;
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

const AuthDiv = styled.div`
    display: flex;
    width: 24vw;
    align-items: center;
    justify-content: space-evenly;
`;

const Img = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background-color: aliceblue;
`;

const SearchDiv = styled.div`
    flex: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1vw;
`;

const Bar = styled.input`
    width: 40%;
    height: 5vh;
    padding-left: 1rem;
    border: none;
`;


const AdminHeader = ({ setShowSBar }) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch();
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
        <HeadContainer>
            <LogoDiv>
                <MenuIcon onClick={() => setShowSBar(true)} style={{ marginLeft: "1rem", color: "#ffffff", cursor: "pointer" }} />
                <Logo onClick={() => navigate("/")}>
                    Reality
                </Logo>
            </LogoDiv>

           

            <div>

                {user?.role === "admin"
                    ? (<Button variant='danger' onClick={handleLogout}>
                        Logout
                    </Button>)


                    : (<Button onClick={() => navigate('/login')}>
                        Login
                    </Button>)


                }
            </div>

        </HeadContainer>
    )
}

export default AdminHeader