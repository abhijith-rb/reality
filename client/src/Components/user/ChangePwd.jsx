import React, {useRef } from 'react'
import styled from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProfileBox = styled.div`
  flex: 6;
  width: 50vw;
  background-color: #B5CFD8;
  padding-bottom: 2vh;
  padding-top: 2vh;
  @media (max-width:930px){
    width:100%
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
  border: none;
  outline: none;
  @media (max-width:800px){
    width:95%;
  }
`;

const ChangePwd = ({user,setPage}) => {
  const notify = (msg)=> toast(msg)

  const oldRef = useRef()
  const newRef = useRef()
  const reRef = useRef()

  const handleSubmit = async () => {
    const oldPwd = oldRef.current.value;
    const newPwd = newRef.current.value;
    const rePwd = reRef.current.value;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{3,}$/;


    if(oldPwd === '' || newPwd === '' || rePwd === ''){
      notify(`All the fields are required`)
      return;
    }

    if(!passwordRegex.test(oldPwd)){
      notify(`Password should have 1 small letter
             , 1 capital letter and 1 number`)
      return;
    }

    if(!passwordRegex.test(newPwd)){
      notify(`Password should have 1 small letter
             , 1 capital letter and 1 number`)
      return;
    }
    
    if(!passwordRegex.test(rePwd)){
      notify(`Password should have 1 small letter
             , 1 capital letter and 1 number`)
      return;
    }

    if(newPwd !== rePwd){
      notify(`Passwords doesn't match`)
      return
    }

    const updateObj = {oldPassword:oldPwd,newPassword:newPwd}
    
    await axiosInstance.put(`/changepwd/${user._id}`,updateObj)
      .then(async (res) => {
        console.log(res.data)
         notify(res.data.msg);
        setPage('info')
      })
      .catch((err) => {
        console.log(err)
        notify(err.response.data.msg)
      })
  }

  console.log(user)
  return (
    <ProfileBox>
      <h2 style={{ textAlign: 'center', color: '#ffffff' }}> Change Password </h2>
     
      <DetailRow>
        <Fieldbox>
          <label>Old Password</label>
          <FieldInput type="password" ref={oldRef} />
        </Fieldbox>

        <Fieldbox>
          <label>New Password</label>
          <FieldInput type="password" ref={newRef} />
        </Fieldbox>
        <Fieldbox>
          <label>Confirm Password</label>
          <FieldInput type="password" ref={reRef} />
        </Fieldbox>

        <Button onClick={handleSubmit}>Update</Button>
      </DetailRow>
    <ToastContainer/>
    </ProfileBox>
  )
}

export default ChangePwd
