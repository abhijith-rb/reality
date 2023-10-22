import React, {  useEffect, useRef } from 'react';
import { createPopper } from '@popperjs/core';
import {Logout, Settings } from '@mui/icons-material';
import styled from "styled-components";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Tooltip = styled.div`
    width: 15vw;
    height: auto;
    gap: 2vh;
    padding-left: 2vw;
    padding-top: 3vh;
    padding-bottom: 3vh;
    position: absolute;
    top: 0;
    right: 5;
    z-index: 99;
    display: flex;
    flex-direction: column;
    color: #6C737E;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    background-color: #ffffff;
    margin-top: 10vh;
    margin-right:10vw;
`;

const UserDetails = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    flex-direction: column;
    /* @media (max-width: 1300px){
    } */
`;

const Img = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
`;


const Popper = ({buttonRef,handleLogout}) => {
    const tooltipRef = useRef(null);
    const user = useSelector((state)=> state.user.user);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
    useEffect(() => {
      const tooltip = tooltipRef.current;
      const button = buttonRef.current;
      let popperInstance = null;
  
      if (button && tooltip) {
        popperInstance = createPopper(button, tooltip, {
          placement: 'bottom',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0,8],
              },
            },
          ],
        });
      }
  
      return () => {
        if (popperInstance) {
          popperInstance.destroy();
        }
      };
    }, []);

    let newName;
    if(user?.username.includes("@")){
        newName = user?.username.split("@")[0]
    }
    else{
        newName = user?.username;
    }

  return (
      
      <Tooltip>
        <UserDetails>
          <Img src={user?.image ?(user.googleUser 
                                ? user.image
                                : PF + user.image ) : '/images/avatar.png'} 
                                alt='img'
                                onError={(e)=>e.target.src="/images/avatar.png"}
                                />
          <h4>{user && newName}</h4>
        </UserDetails>
      
        <hr></hr>
        <Link to="/profile" style={{textDecoration:'none',color:"inherit",fontSize:"20px"}}>Profile</Link>
        {user?.subscribed && <Link to="/userprops" style={{textDecoration:'none',color:"inherit",fontSize:"20px"}}>Dashboard</Link>}
        <Link style={{textDecoration:'none',color:"red"}} onClick={handleLogout}> <Logout/> Logout</Link>
      </Tooltip>


  )
}

export default Popper