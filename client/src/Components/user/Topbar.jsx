import React, { useEffect, useRef } from 'react'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/userReducer';
import { useState } from 'react'
import { Button } from 'react-bootstrap';
import { ArrowDropDownCircle, Chat, Close } from '@mui/icons-material';
import Popper from '../Popper';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { setCurrentChat } from '../../redux/chatReducer';
// import axiosInstance from '../../axios/axiosInstance';
import axios from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { setCurrentToken } from '../../redux/accessTokenReducer';


const TopContainer = styled.div`
    width: 100%;
    height: 10vh;
    background-color: #7393A7;
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
    /* font-family: 'Times New Roman', Times, serif; */
    font-style: italic;
    flex: 2;
    margin-left: 1vw;
`;

const LogoDiv = styled.div`
  display: none;
  @media (max-width: 890px){
    display: flex;
  align-items: center;
  }
`;

const JustLogo = styled.div`
    display: flex;
  align-items: center;
  @media (max-width: 890px){
    display: none;
  }
`;

const TopRight = styled.div`
    flex: 4;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    @media (max-width: 890px){
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


const SearchDiv = styled.div`
    flex: 4;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1vw;
`;

const SearchCombo = styled.div`
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 1vw;
    background-color  :white ;
    border-radius: 5px;
    position: relative;

    @media (max-width:500px){
        width: 95%;
    }
`;

const Bar = styled.input`
    width: 92%;
    height: 5vh;
    padding-left: 1vw;
    border-radius: 5px;
    border: none;
    &:focus{
        outline: none;
    }
`;

const SgBoxDiv = styled.div`
width: 100%;
background-color: #ffffff;
border-radius: 10px;
box-shadow: 
    12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
    display: flex;
    z-index: 7;
  position: absolute;
  top: 40px;
  left: 0;
  padding: 1vh 1vw;
  @media (max-width:800px){
    flex-direction: column;
  }
`;

const Ul = styled.ul`
width: 100%;
height: auto;
max-height: 60vh;
/* border: 2px solid grey; */
background-color: #ffffff;
list-style: none;
margin: 0;
padding-left: 5px;
border-radius: 10px;

`;

const Li = styled.li`
  cursor:pointer;
  color: #444;
  &:hover{
    color: #7393A7;
  }
`;


const Topbar = ({ setSidebar }) => {
    const axiosInstance = useAxiosPrivate()

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const buttonRef = useRef(null);
    const [tooltip, setTooltip] = useState(false)
    const [inputText, setInputText] = useState("")
    const [query, setQuery] = useState("");
    const [box, setBox] = useState(false);
    const [suggestions, setSuggestions] = useState([])

    let newName;
    if (user?.username.includes("@")) {
        newName = user?.username.split("@")[0]
    }
    else {
        newName = user?.username;
    }

    const handleQuery = (e) => {
        setBox(true);
        setQuery(e.target.value)
    }

    const suggest = async () => {
        await axios.get(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}
        &session_token=${123}&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
            .then((res) => {
                console.log(res)
                console.log(res.data)
                setSuggestions(res.data.suggestions)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        console.log(query)
        suggest();
    }, [query])

    const handleSelect = (sgn) => {
        setBox(false)
        setQuery(sgn.name);
    }

    const handleSearch = () => {
        setBox(false);
        if (query === "") return;

        navigate(`/list?q=${query}`)
    }

    const handleLogout = async () => {
        await axiosInstance.delete('/auth/logout')
            .then(() => {
                dispatch(logout())
                dispatch(setCurrentToken(null))
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
                <SearchCombo>
                    <Bar name='searchbarusertop' placeholder='Search...' value={query} onChange={handleQuery} />
                    <SearchIcon style={{ cursor: "pointer" }} onClick={() => handleSearch()} />
                    {box &&
                        suggestions?.length > 0 &&
                        <SgBoxDiv>
                            <Ul>
                                {
                                    suggestions?.map((sgn) => (
                                        <Li onClick={() => handleSelect(sgn)}>{sgn.name}</Li>
                                    ))
                                }
                            </Ul>

                            <Close onClick={() => setBox(false)} style={{ cursor: "pointer", color: "#444" }} />
                        </SgBoxDiv>
                    }
                </SearchCombo>

            </SearchDiv>

            <TopRight>
                {user?.role === "user" ?
                    <InfoDiv>
                        <span style={{ color: "#ffffff" }}>Hi, {user && newName}</span>

                        <div ref={buttonRef} onClick={() => { setTooltip(!tooltip) }}>
                            <Img src={user?.image ?
                                (user.googleUser
                                    ? user.image
                                    : PF + user.image)
                                : '/images/avatar.png'} alt=""
                                onError={(e) => e.target.src = "/images/avatar.png"}
                            />
                            <ArrowDropDownCircle style={{ color: "white" }} />
                        </div>

                        <Chat onClick={() => navigate("/messenger")} style={{ color: "white" }} />
                    </InfoDiv>

                    : (<Button variant='info' onClick={() => navigate('/login')}>
                        Login
                    </Button>)
                }
                {tooltip && <Popper buttonRef={buttonRef} handleLogout={handleLogout} />}

                <Button size='lg' variant='outline-light' onClick={() => navigate('/userprops')}>
                    Post Property
                </Button >
            </TopRight>

        </TopContainer>
    )
}

export default Topbar