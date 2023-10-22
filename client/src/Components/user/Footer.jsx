import React from 'react';
import styled from 'styled-components';
import {Facebook, Instagram, YouTube} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

const FootContainer = styled.div`
    width: 100%;
    height: fit-content;
    background-color: bisque;
`;

const FootLg = styled.div`
    width:100% ;
    height: fit-content;
    min-height: 22vh;
    background-color: #98b1c6;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1vh 2vw 0 2vw;
    color: #3a3d43;
    @media (max-width: 800px){
        flex-direction: column;
        padding: 0 2px;
        height: fit-content;
    }
`;

const Leftlg = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media (max-width: 800px){
        width: 95%;
    }
`;

const Rightlg = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media (max-width: 800px){
        width: 95%;
        flex-direction: row;
    }
`;

const FootSm = styled.div`
    width:100% ;
    min-height: 5vh;
    background-color: #393c42;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 5px;
`;

const Copyright = styled.p`
    color: #ffffff;
`;

const Ul = styled.ul`
    list-style:none;
    display: flex;
    justify-content: space-between;
    gap: 2vw;
`;

const Footer = () => {
    const navigate = useNavigate();

  return (
    <FootContainer>

        <FootLg>
            <Leftlg>
                <h4>About Realify</h4>
                <p>Realify is a full stack service provider for all real estate needs. As the largest platform 
                    for buyers and sellers of property to connect in a transparent manner, Realify has an active 
                    base of a large number of property listings. </p>

            </Leftlg>

            <Rightlg>
                <h4>Connect with us</h4>
                <Ul>
                    <li ><a href="https://www.facebook.com" ><Facebook/></a></li>
                    <li><a href="https://www.youtube.com"><YouTube style={{color:"red"}}/></a></li>
                    <li><a href="https://www.instagram.com"><Instagram style={{color:"magenta"}}/></a></li>
                </Ul>
            </Rightlg>
        </FootLg>

        <FootSm>
            <Copyright>All trademarks, logos and names are properties of their respective owners. 
                All Rights Reserved. © Copyright 2023 Realify Realty Services Limited.</Copyright>
        </FootSm>

    </FootContainer>
  )
}

export default Footer