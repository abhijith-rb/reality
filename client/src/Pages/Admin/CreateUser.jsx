import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import AdminHeader from '../../Components/admin/AdminHeader';
import styled from 'styled-components';
import Sidebar from '../../Components/admin/Sidebar';
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


const Create = styled.div`
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

const CreateUser = () => {
  const axiosInstance = useAxiosPrivate()

  const navigate = useNavigate()
  const usernameRef = useRef()
  const emailRef = useRef()
  const phoneRef = useRef()
  const passwordRef = useRef()

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;
    const password = passwordRef.current.value;

    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{3,}$/;
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

    if (!passwordRegex.test(password)) {
      notify(`Password should contain atleast 1 capital letter, 
      1 small letter and 1 digit`)
      return;
    }

    await axiosInstance.post('/admin/adduser', {
      username, email, password, phone
    }).then((response) => {
      console.log(response.data.msg)
      navigate("/admin/usermng");
    }).catch((err) => {
      console.log(err)
      
    })

  }
  return (
    <AdminLayout>
      <MainBox>
          <Create>
            <Title>Add User</Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='username'>
                <Form.Label>Username</Form.Label>
                <Form.Control  type='text' name='username' ref={usernameRef} />
              </Form.Group>
              <Form.Group controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' name='email' ref={emailRef} />
              </Form.Group>
              <Form.Group controlId='phone'>
                <Form.Label>Phone</Form.Label>
                <Form.Control type='text' name='phone' ref={phoneRef} />
              </Form.Group>
              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' name='password' ref={passwordRef} />
              </Form.Group>

              <Btns>
                <Button type='submit'>
                  Create
                </Button>
                <Link to='/admin/usermng' style={{ textDecoration: 'none', color: "white" }}><Button variant='secondary'>Cancel</Button></Link>
              </Btns>
            </Form>
          </Create>
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

export default CreateUser