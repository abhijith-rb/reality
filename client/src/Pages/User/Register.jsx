import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../Components/user/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../axios/axiosInstance';
import UserLayout from '../../Components/user/UserLayout';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Content = styled.div`
  height: 85vh;
  padding-top: 2vh;
  padding-bottom: 2vh;
  padding-left:5vw;
  padding-right: 5vw;
  /* margin-top: 14vh; */
`;

const RegContainer = styled.div`
  width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: blue;
`;

const AppInfo = styled.div`
    width: 45%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5vh;
    color: white;
    background-color: #1876D0;

`;

const RegisterBox = styled.div`
    width: 55%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3vh;
    background-color: #88C4FE;

`;

const RowClass = styled.div`
    display: flex;
    align-items: center;
    gap: 2vw;
`;

const SubmitBtn = styled.button`
    width: 100%;
    margin-top: 2vh;
`;


const Register = () => {
  const usernameRef = useRef()
  const emailRef = useRef()
  const phoneRef = useRef()
  const passwordRef = useRef()
  const confirmPwdRef = useRef();

  const navigate = useNavigate();

  const notify = (msg) => toast.error(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;
    const password = passwordRef.current.value;
    const confirmPwd = confirmPwdRef.current.value;

    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!usernameRegex.test(username)) {
      notify(`Username should have atleast 3 characters`)
      return;
    }

    if (!emailRegex.test(email)) {
      notify(`Invalid Email format`)
      return;
    }

    if (!phoneRegex.test(phone)) {
      notify(`Phone number should be 10 digits`)
      return;
    }

    if (!passwordRegex.test(password)) {
      notify(`Password should have 1 small letter
             , 1 capital letter and 1 number`)
      return;
    }

    if (password !== confirmPwd) {
      notify(`Passwords doesn't match`)
      return;
    }

    await axiosInstance.post('/auth/register', {
      username, email, password, phone
    })
      .then((response) => {
        navigate('/login')
      })
      .catch((err) => {
        console.log(err)
        notify(err.response.data.msg)
      })

  }
  return (
    <UserLayout>
      <Content>
        <RegContainer>
          <AppInfo>
            <h1>Reality</h1>
            <h4>Create your account to unlock these benefits</h4>
            <ul>
              <li>Get market information, reports and price trends.</li>
              <li>Access millions of advertiser details in one click.</li>
            </ul>

          </AppInfo>
          <RegisterBox>
            <h1>Register</h1>
            <Form onSubmit={handleRegister}>
              <RowClass>
                <Form.Group controlId='username'>
                  <Form.Label>Username</Form.Label>
                  <Form.Control type='text' name='username' ref={usernameRef} />
                </Form.Group>
                <Form.Group controlId='email'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type='email' name='email' ref={emailRef} />
                </Form.Group>

              </RowClass>

              <RowClass>

                <Form.Group controlId='phone'>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type='text' name='phone' ref={phoneRef} />
                </Form.Group>
                <Form.Group controlId='password'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type='password' name='password' ref={passwordRef} />
                </Form.Group>
              </RowClass>

              <RowClass>
                <Form.Group controlId='confirmpwd'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type='password' name='confirmpwd' ref={confirmPwdRef} />
                </Form.Group>

              </RowClass>

              <Button type='submit' className='submitBtn'>
                Register
              </Button>
            </Form>
            <Link to='/login'>Login</Link>
          </RegisterBox>

        </RegContainer>

      </Content>
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
    </UserLayout>
  )
}

export default Register;