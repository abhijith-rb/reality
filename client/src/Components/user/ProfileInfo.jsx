import React from 'react'
import styled from 'styled-components';


const ProfileBox = styled.div`
  flex: 6;
  width: 50vw;
  background-color: #B0D9B1;
  padding-bottom: 2vh;
  padding-top: 2vh;
  @media (max-width:930px){
    width:100%
  }
`;

const ImgBox = styled.div`
  width: 50vw;
  min-height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 30px;
  @media (max-width:800px){
    flex-direction: column;
  }
`;

const DetailRow = styled.div`
  width: 100%;
  min-height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-direction: column;
`;

const Fieldbox = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width:800px){
    width:100%;
    padding-left: 1vw;
  }
`;

const FieldInput = styled.input`
  padding: 10px 20px;
  width: 80%;
  border-radius: 5px;
  font-size: 16px;
  border: none;
  outline: none;
  @media (max-width:800px){
    width:95%;
  }
`;



const ProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background-color: aliceblue;
`;




const ProfileInfo = ({user}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

 
  return (
    <ProfileBox>
          <h2 style={{ textAlign: 'center', color: '#ffffff' }}>Profile </h2>
          <ImgBox>
            <div className="avatar">
              <ProfileImg src={user?.image ? PF + user.image : '/images/avatar.png'} alt="" />
            </div>
            
          </ImgBox>
          <DetailRow>
            <Fieldbox>
              <label>Username</label>
              <FieldInput type="text" className='fieldInput' value={user?.username} readOnly />
            </Fieldbox>
            <Fieldbox>
              <label>Role</label>
              <FieldInput type="text" className='fieldInput' value={user?.subscribed ? 'Owner' : 'User'} readOnly />
            </Fieldbox>
            <Fieldbox>
              <label>Email</label>
              <FieldInput type="text" className='fieldInput' value={user?.email} readOnly />
            </Fieldbox>
            <Fieldbox>
              <label>Phone</label>
              <FieldInput type="text" className='fieldInput' value={user?.phone} readOnly />
            </Fieldbox>
          </DetailRow>

        </ProfileBox>
  )
}

export default ProfileInfo