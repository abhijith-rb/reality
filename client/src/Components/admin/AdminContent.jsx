import React from 'react';
import { styled } from 'styled-components';

const ContentWrapper = styled.div`
    margin-top: 10vh;
    padding-left: 5vw;
    padding-right: 5vw;
    padding-top: 5vh;
    min-height: 90vh;
    /* background-color: blue; */
`;

const AdminContent = ({children}) => {
  return (
    <ContentWrapper>
        {children}
    </ContentWrapper>
  )
}

export default AdminContent