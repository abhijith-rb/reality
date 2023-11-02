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
    /* color: #3a3d43; */
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
        align-items: center;
        gap: 3vw;
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
    padding: 0;
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
                    <li><i class="fa-brands fa-facebook fa-xl" style={{color: "#2e4876"}} href="https://www.facebook.com" ></i></li>
                    <li><i class="fa-brands fa-youtube fa-xl" style={{color: "#cd1818"}} href="https://www.youtube.com"></i></li>
                    <li><i class="fa-brands fa-square-instagram fa-xl" style={{color: "#ae1e33"}} href="https://www.instagram.com"></i></li>
                </Ul>
            </Rightlg>
        </FootLg>

        <FootSm>
            <Copyright>All trademarks, logos and names are properties of their respective owners. 
                All Rights Reserved. © Copyright 2023 Realify Real-estate Services Limited.</Copyright>
        </FootSm>

    </FootContainer>
  )
}

export default Footer