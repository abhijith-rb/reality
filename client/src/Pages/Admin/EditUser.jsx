import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from '../../Components/admin/AdminLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
// import axiosInstance from '../../axios/axiosInstance';

const MainBox = styled.div`
  width: 100%;
  margin-top: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const Edit = styled.div`
  min-width: 40vw;
  width: fit-content;
  padding:2vh 3vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #ADC4CE;
  border-radius: 5px;
  background-color: #96B6C5;
`;

const Title = styled.h1`
  text-align: center;
  color:#36454F;

`;

const Btns = styled.div`
  margin-top: 3vh;
  display: flex;
  justify-content: space-between;
`;

const EditUser = () => {
  const axiosInstance = useAxiosPrivate()

  const navigate = useNavigate()
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [phone,setPhone] = useState("")
  const path = useLocation();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log(path)
  const userId = path.pathname.split("/")[3];
  console.log(userId)

  const notify = (msg) => toast.warn(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  const getUser = async()=>{
    await axiosInstance.get(`/admin/getuser/${userId}`)
    .then((response)=>{
      const fetchedUser = response.data;
      console.log(fetchedUser)
      setUsername(fetchedUser.username)
      setEmail(fetchedUser.email)
      setPhone(fetchedUser.phone)
    })
    .catch((err)=>{
      console.log(err)
     
    })
  }

  useEffect(()=>{
    console.log("useEffect called")
    getUser();
  },[userId])


  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!usernameRegex.test(username)) {
      notify(`Username should be atleast
      3 characters long`)
      return;
    }

    if (!emailRegex.test(email)) {
      notify(`Invalid Email Format`)
      return;
    }

    if (!phoneRegex.test(phone)) {
      notify(`Phone number should be of 10 digits`)
      return;
    }

    console.log(username, email, phone)
    await axiosInstance.post(`/admin/updateuser/${userId}`,{username, email, phone})
    .then((response)=>{
      console.log(response.data.msg)
      navigate("/admin/usermng")
    })
    .catch((err)=>{
      console.log(err)
     
    })

  }
  console.log(email)

  return (
    <AdminLayout>
    <MainBox>
     
    <Edit>
      <Title>Edit User</Title>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='username'>
          <Form.Label>Username</Form.Label>
          <Form.Control value={username} type='text' name='username' onChange={(e)=>setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} type='email' name='email' onChange={(e)=>{setEmail(e.target.value)}} />
        </Form.Group>
        <Form.Group controlId='phone'>
          <Form.Label>Phone</Form.Label>
          <Form.Control value={phone} type='text' name='phone' onChange={(e)=>{setPhone(e.target.value)}} />
        </Form.Group>

        <Btns>

        <Button type='submit'>
          Update
        </Button>
      <Link to='/admin/usermng' style={{textDecoration:'none',color:"white"}}><Button variant='secondary'>Cancel</Button></Link>
        </Btns>

      </Form>
    </Edit>

    </MainBox>

    <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

    </AdminLayout>
  )
}

export default EditUser