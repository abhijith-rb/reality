import React, { useRef } from 'react'
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { logout } from '../../redux/userReducer';
import { useEffect, useState } from 'react'
import { Button, NavItem, Navbar } from 'react-bootstrap';
import { ArrowDropDownCircle,Chat } from '@mui/icons-material';
import Popper from '../Popper';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { setCurrentChat } from '../../redux/chatReducer';
import axiosInstance from '../../axios/axiosInstance';


const TopContainer = styled.div`
    width: 100%;
    height: 10vh;
    background-color: #79AC78;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 3vw;
    padding-right:1vw;
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
  display: none;
  /* align-items: center; */
  @media (max-width: 800px){
    display: flex;
  align-items: center;
  }
`;

const JustLogo = styled.div`
    display: flex;
  align-items: center;
  @media (max-width: 800px){
    display: none;
  }
`;

const TopRight = styled.div`
    flex: 4;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    /* background-color: yellow; */
    @media (max-width: 800px){
    display: none;
  }
`;

const InfoDiv = styled.div`
    display: flex;
    width: 50%;
    align-items: center;
    justify-content: space-evenly;
    cursor: pointer;
`;

const Img = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background-color: aliceblue;
`;

const PostBtn = styled.div`
    width: 12vw;
    height:6vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius:5px;
    background-color: #ffffff;
    cursor: pointer;
    font-size:1em;
`;


const SearchDiv = styled.div`
    flex: 4;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1vw;
    /* background-color: red; */
`;

const Bar = styled.input`
    width: 60%;
    height: 5vh;
    padding-left: 1vw;
    border: none;
    border-radius: 5px;
`;


const Topbar = ({setSidebar}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const buttonRef = useRef(null);
    const [tooltip, setTooltip] = useState(false)
    const [showSide, setShowSide] = useState(false)

    const [inputText, setInputText] = useState("")
    

    const handleSearch = ()=>{
        if(inputText === "") return;
        
        navigate(`/list?q=${inputText}`)
    }

    const handleLogout = async () => {
        await axiosInstance.delete('/auth/logout')
            .then(() => {
                dispatch(logout())
                setTooltip(false)
                dispatch(setCurrentChat(null))
                console.log("logout dispatched")
            })
            .catch((error) => {
                console.log(error)
               
            })
    }


    return (
        <TopContainer>
            <LogoDiv>
                <MenuIcon onClick={() => setSidebar(true)} style={{ marginLeft: "1rem", color: "#ffffff", cursor: "pointer" }} />
                <Logo onClick={() => navigate("/")}>
                    Realify
                </Logo>
            </LogoDiv>

            <JustLogo>
                <Logo onClick={() => navigate("/")}>
                    Realify
                </Logo>
            </JustLogo>

            <SearchDiv>
                <Bar name='searchbarusertop' placeholder='Search...' onChange={(e)=>setInputText(e.target.value)} />

                <Button className='btn btn-sm' variant='warning' onClick={()=>handleSearch()}>
                    <SearchIcon/>
                </Button>

            </SearchDiv>

            <TopRight>
                {user?.role === "user" ?
                    <InfoDiv>
                        <span style={{ color: "#ffffff" }}>Hi, {user?.username}</span>

                        <div ref={buttonRef} onClick={() => { setTooltip(!tooltip) }}>
                            <Img src={user?.image ? PF + user.image : '/images/avatar.png'} alt="" />
                            <ArrowDropDownCircle style={{color:"black"}}/>
                        </div>

                        <Chat onClick={()=> navigate("/messenger")} style={{color:"white"}}/>
                    </InfoDiv>

                    : (<Button variant='warning' onClick={() => navigate('/login')}>
                        Login
                    </Button>)
                }
                {tooltip && <Popper buttonRef={buttonRef} handleLogout={handleLogout} />}

                <PostBtn onClick={() => navigate('/userprops')}>
                    Post Property
                </PostBtn>
            </TopRight>

        </TopContainer>
    )
}

export default Topbar