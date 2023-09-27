import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form} from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/userReducer';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../axios/axiosInstance';
import UserLayout from '../../Components/user/UserLayout';


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
    background-color: #B0D9B1;
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

    await axiosInstance.post('/auth/login', {
      username, password
    }).then((response) => {
      const userInfo = response.data;
      console.log(userInfo)
      dispatch(loginSuccess(userInfo))

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