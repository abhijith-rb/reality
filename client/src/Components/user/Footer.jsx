import React from 'react';
import styled from 'styled-components';

const FootContainer = styled.div`
    width: 100%;
    height: 35vh;
    background-color: bisque;
`;

const FootLg = styled.div`
    width:100% ;
    height: 22vh;
    background-color: #D9D9D9;
`;

const FootMd = styled.div`
    width:100% ;
    height: 8vh;
    background-color: #C3C1C1;
`;

const FootSm = styled.div`
    width:100% ;
    height: 5vh;
    background-color: #000000;
`;

const Footer = () => {
  return (
    <FootContainer>

        <FootLg>

        </FootLg>

        <FootMd>

        </FootMd>

        <FootSm>

        </FootSm>

    </FootContainer>
  )
}

export default Footer