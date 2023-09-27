import React from 'react';
import { styled } from 'styled-components';

const ContentWrapper = styled.div`
    margin-top: 12vh;
    padding-left: 5vw;
    padding-right: 5vw;
    padding-top: 5vh;
    height: auto;
    min-height: 90vh;
    background-color: #eeebeb;
    @media (max-width:800px){
      margin-top: 10vh;
    }
`;

const Content = ({children}) => {
  return (
    <ContentWrapper>
        {children}
    </ContentWrapper>
  )
}

export default Content