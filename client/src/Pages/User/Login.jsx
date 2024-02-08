import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form} from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/userReducer';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axiosInstance from '../../axios/axiosInstance';
import UserLayout from '../../Components/user/UserLayout';
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import axios from '../../api/axios';
import { setCurrentToken } from '../../redux/accessTokenReducer';

const Content = styled.div`
  height: 75vh;
  padding-top: 2vh;
  padding-bottom: 2vh;
  padding-left:5vw;
  padding-right: 5vw;

`;

const LoginContainer = styled.div`
  width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

`


const LoginBox = styled.div`
    width: 50%;
    height: 100%;
    padding: 2vh 2vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3vh;
    border-radius: 5px;
    background-color: #B5CFD8;
    margin-bottom: 2vh;
    box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);

    @media (max-width:800px){
      width: 90%;
    }
`;

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const usernameRef = useRef();
  const passwordRef = useRef();

  const notify = (msg) => toast(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart())
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{3,}$/;

    if (!usernameRegex.test(username)) {
      notify('Invalid Credentials')
      return;
    }

    if (!passwordRegex.test(password)) {
      notify('Invalid Credentials')
      return;
    }

    await axios.post('/auth/login', {
      username, password
    }).then((response) => {
      console.log("reponsed login", response)
      const userInfo = response?.data?.userInfo;
      console.log(userInfo)
      dispatch(loginSuccess(userInfo))
      dispatch(setCurrentToken(response?.data?.accessToken))

      if (userInfo.role === "user") {
        navigate("/")
      }
      else if (userInfo.role === "admin") {
        navigate("/admin/dashboard")
      }
    }).catch((error) => {
      dispatch(loginFailure())
      notify(error.response.data.msg)
    });
  }

  const onSuccess = async(credentialResponse)=>{
    console.log("Google login success")
    console.log(credentialResponse)
    const decoded = jwt_decode(credentialResponse.credential)
    console.log(decoded)

    const userInfo = {
      username : decoded.given_name,
      email: decoded.email,
      image: decoded.picture
    }

    dispatch(loginStart())

    await axios.post("/auth/google-auth", userInfo)
    .then((res)=>{
      const userInfo = res.data;
      dispatch(loginSuccess(userInfo))
      if (userInfo.role === "user") {
        navigate("/")
      }
      else if (userInfo.role === "admin") {
        navigate("/admin/dashboard")
      }
    })
    .catch((err)=>{
      dispatch(loginFailure())
      notify(err.response.data.msg)
    })
  }

  const onError = ()=>{
    notify("Error logging in with Google Account")
  }

  return (

    <UserLayout>
      <Content>
          <LoginContainer>
          <LoginBox>
            <h1>Login</h1>
            <Form onSubmit={handleLogin} style={{ height: "50%", display: "flex", flexDirection: "column", justifyContent: "space-between" }} >
              <Form.Group controlId="username">
                <Form.Label >Username</Form.Label>
                <Form.Control type='text' name='username' ref={usernameRef} />
              </Form.Group>

              <Form.Group controlId='password'>
                <Form.Label >Password</Form.Label>
                <Form.Control type='password' name='password' ref={passwordRef} />
              </Form.Group>

              <Button type='submit' variant='primary'>
                Login
              </Button>
              <Link to='/forgotpwd' style={{textAlign:"center"}}>Forgot Password</Link>
           
            </Form>

            {/* <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}> */}
              <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              cookiePolicy={'single_host_origin'}
              />
            {/* </GoogleOAuthProvider> */}

            <Link to='/register'>Register</Link>
          </LoginBox>

          


          </LoginContainer>


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

export default Login