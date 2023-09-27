import React, {useState } from 'react'
import {useSelector } from 'react-redux';
import styled from 'styled-components';
import UserLayout from '../../Components/user/UserLayout';
import ProfileInfo from '../../Components/user/ProfileInfo';
import EditProfile from '../../Components/user/EditProfile';
import ChangePwd from '../../Components/user/ChangePwd';


const Content = styled.div`
 width: 70vw;
  padding-bottom: 5vh;
  margin-left: 10vw;
  display: flex;
  min-height: 55vh;
  /* border: 2px solid red; */
  font-family: 'Montserrat', sans-serif;
  font-weight:500;
  @media (max-width:930px){
    flex-direction: column;
  }
`;

const Mainbox = styled.div`
  /* border: 2px solid yellow; */
`;

const Sidebox = styled.div`
  flex: 4;
  height: 25vh;
  background-color: #79AC78;
  display: flex;
  align-items: center;
`;

const UlSide = styled.ul`
  list-style: none;
  color: #ffffff;
  font-size: 18px;
  padding-top: 1vh;
  
`;

const LiSide = styled.li`
  margin-bottom: 1rem;
  cursor: pointer;
`;


const Profile = () => {
  const user = useSelector((state) => state.user.user)
  console.log(user)
  const [page,setPage] = useState('info')
 
  return (
    <UserLayout>
      <Content>

        <Sidebox>
          <UlSide>
            <LiSide onClick={()=>setPage('info')}>Profile </LiSide>
            <LiSide onClick={()=>setPage('edit')}>Edit Profile</LiSide>
            <LiSide onClick={()=>setPage('pwd')}>Change Password</LiSide>
          </UlSide>

        </Sidebox>

      <Mainbox>
        {page === 'info' && <ProfileInfo user={user}/>}
        {page === 'edit' && <EditProfile user={user}/>}
        {page === 'pwd' && <ChangePwd user={user} setPage={setPage}/>}

      </Mainbox>
      </Content>
    </UserLayout>
  )
}

export default Profile