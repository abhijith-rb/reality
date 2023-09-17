import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';
import { updateUser } from '../../redux/userReducer';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileBox = styled.div`
  flex: 6;
  width: 50vw;
  background-color: #88C4FE;
  padding-bottom: 2vh;
  padding-top: 2vh;
  @media (max-width:930px){
    width:100%
  }
`;

const ImgBox = styled.div`
  width: 100%;
  min-height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20%;
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


const CustomFileInput = styled.input`
  cursor: pointer;
  position: relative;
  width: 20%;
  height: 40%;
  z-index: 2;
  opacity: 0;
`;

const CustomFileLabel = styled.label`&::after{
  content: "Browse Image";
  display: inline-block;
  background-color: #007bff;
  color: #fff;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;}
`;

const EditProfile = ({ user }) => {
  const dispatch = useDispatch()
  const notify = (msg)=> toast(msg)

  const [imgfile, setImgfile] = useState(null)

  const nameRef = useRef()
  const emailRef = useRef()
  const phoneRef = useRef()

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  console.log(PF)

  const getUser = async () => {
    nameRef.current.value = user.username
    emailRef.current.value = user.email
    phoneRef.current.value = user.phone
  }


  useEffect(() => {
    getUser()
  }, [])

  const handleSubmit = async () => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i;
    if (imgfile && !allowedExtensions.exec(imgfile.name)) {
      notify('Invalid file format. Only JPG, JPEG, PNG, WEBP, or GIF images are allowed.');
      return;
    }
    const formData = new FormData();
    if (imgfile) {
      formData.append('image', imgfile);
    }
    formData.append('username', nameRef.current.value);
    formData.append('email', emailRef.current.value);
    formData.append('phone', phoneRef.current.value);

    await axiosInstance.put(`/editprofile/${user._id}`, formData)
      .then((res) => {
        console.log(res.data)
        dispatch(updateUser(res.data.userInfo))
        notify(res.data.msg)
      })
      .catch((err) => {
        notify(err.response.data.msg)
      })
  }

  console.log(user)
  return (
    <ProfileBox>
      <h2 style={{ textAlign: 'center', color: '#ffffff' }}> Edit Profile </h2>
      <ImgBox>
        <div className="avatar">
          <ProfileImg src={user?.image ? PF + user.image : '/images/avatar.png'} alt="" />
        </div>

        <div className="custom-file">
          <CustomFileInput type="file" name='image' onChange={(e) => setImgfile(e.target.files[0])} className="custom-file-input" id="customFile" />
          <CustomFileLabel className="custom-file-label" htmlFor="customFile" />
        </div>


      </ImgBox>
      <DetailRow>
        <Fieldbox>
          <label>Username</label>
          <FieldInput type="text" className='fieldInput' ref={nameRef} />
        </Fieldbox>

        <Fieldbox>
          <label>Email</label>
          <FieldInput type="text" className='fieldInput' ref={emailRef} />
        </Fieldbox>
        <Fieldbox>
          <label>Phone</label>
          <FieldInput type="text" className='fieldInput' ref={phoneRef} />
        </Fieldbox>

        <Button onClick={handleSubmit}>Update</Button>
      </DetailRow>
    <ToastContainer/>
    </ProfileBox>
  )
}

export default EditProfile