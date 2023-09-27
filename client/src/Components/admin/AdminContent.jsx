import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

const ContentWrapper = styled.div`
    margin-top: 10vh;
    padding-left: 2vw;
    padding-right: 5vw;
    padding-top: 5vh;
    min-height: 90vh;
    background-color: #F1F0E8;
    display: flex;

`;

const SideDiv = styled.div`
  flex:2;
  height: 80vh;
  /* border: 2px solid grey; */
  @media (max-width:800px){
    display: none;
  }
`;

const SideBar = styled.div`
  width: 85%;
  height: 55vh;
  background-color: #96B6C5;
  border: 2px solid #ADC4CE;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Ul = styled.ul`
  list-style: none;
  color: #ffffff;
  font-size: 25px;
  margin-top:5vh;
  font-style:bold;
  padding-left: 1rem;
  padding-right:1rem;
`;

const Li = styled.li`
  cursor: pointer;
  margin-bottom:3vh;
`;

const MainDiv = styled.div`
  flex: 8;
  @media (max-width:800px){
    width: 100%;
  }
`;

const AdminContent = ({ children }) => {
  const navigate = useNavigate();

  return (
    <ContentWrapper>
      <SideDiv>
        <SideBar>
          <Ul>
            <Li onClick={() => navigate("/admin/dashboard")}>Dashboard</Li>
            <Li onClick={() => navigate("/admin/usermng")}>Users</Li>
            <Li onClick={() => navigate("/admin/propmng")}>Properties</Li>
            <Li onClick={() => navigate("/admin/bannermng")}>Banners</Li>
            <Li onClick={() => navigate("/admin/blogmng")}>Blogs</Li>

          </Ul>
        </SideBar>
      </SideDiv>
      <MainDiv>
        {children}
      </MainDiv>
    </ContentWrapper>
  )
}

export default AdminContent