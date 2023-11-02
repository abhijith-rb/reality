import React from 'react'
import Topbar from './Topbar'
import Navigator from './Navigator';
import styled from 'styled-components';

const HeadContainer = styled.div`
    width: 100%;
    background-color: yellow;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
   
`;

const Header = ({setSidebar}) => {
  return (
    <HeadContainer>
        <Topbar setSidebar={setSidebar}/>
        <Navigator/>
    </HeadContainer>
  )
}

export default Header