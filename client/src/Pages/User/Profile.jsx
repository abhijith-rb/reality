import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/userReducer';
import styled from 'styled-components';
import Header from '../../Components/user/Header';
import UserLayout from '../../Components/user/UserLayout';
import axiosInstance from '../../axios/axiosInstance'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Content = styled.div`
  padding-top: 5vh;
  padding-bottom: 5vh;
  padding-left:5vw;
  padding-right: 5vw;
  /* margin-top: 14vh; */
  display: flex;
  flex-direction:column;
  align-items: center;
  min-height: 55vh;

`;


const ProfileBox = styled.div`
  width: 50vw;
  /* height: 80vh; */
  background-color: #88C4FE;
  padding-bottom: 2vh;
  
`;

const ImgBox = styled.div`
  width: 50vw;
  min-height: 20vh;
  display: flex;
  justify-content: space-between;
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
  gap: 20px;
  flex-direction: column;
`;

const Fieldbox = styled.div`
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FieldInput = styled.input`
  padding: 10px 20px;
  width: 70%;
  border-radius: 5px;
  font-size: 16px;
  border: none;
  outline: none;
`;



const ProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background-color: aliceblue;
`;


const CustomFileInput = styled.input`
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0;
`;

const CustomFileLabel = styled.label`&::after{
  content: "Choose Image";
  display: inline-block;
  background-color: #007bff;
  color: #fff;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;}
`;


const Profile = () => {
  const user = useSelector((state) => state.user.user)
  console.log(user)
  const dispatch = useDispatch()
  const [imgfile, setImgfile] = useState(null)
  const [details, setDetails] = useState({})

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  console.log(PF)

  const handleSubmit = async () => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i;
    if (!allowedExtensions.exec(imgfile.name)) {
      alert('Invalid file format. Only JPG, JPEG, PNG, WEBP, or GIF images are allowed.');
      return;
    }
    const formData = new FormData();
    formData.append('image', imgfile);
    await axiosInstance.post(`/uploadimg/${user?._id}`, formData)
      .then((response) => {
        console.log(response.data);
        dispatch(updateUser(response.data));

      })
      .catch((err) => {
        console.log(err)
        
      })
  }

  console.log(user)
  return (
    <UserLayout>
      <Content>

        <ProfileBox>
          <h2 style={{ textAlign: 'center', color: '#777' }}>Profile</h2>
          <ImgBox>
            <div className="avatar">
              <ProfileImg src={user?.image ? PF + user.image : '/images/avatar.png'} alt="" />
            </div>

            <div className="custom-file">
              <CustomFileInput type="file" name='image' onChange={(e) => setImgfile(e.target.files[0])} className="custom-file-input" id="customFile" />
              <CustomFileLabel className="custom-file-label" htmlFor="customFile" />
            </div>

            <Button onClick={imgfile && handleSubmit}>Upload</Button>
            <div className="details">
            </div>
          </ImgBox>
          <DetailRow>
            <Fieldbox>
              <label>Username</label>
              <FieldInput type="text" className='fieldInput' value={user?.username} readOnly />
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
      </Content>
    </UserLayout>
  )
}

export default Profile