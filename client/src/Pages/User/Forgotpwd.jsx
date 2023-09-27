import React, { useRef } from 'react'
import UserLayout from '../../Components/user/UserLayout'
import { styled } from 'styled-components';
import { Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';

const Wrapper = styled.div`
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10vh;
`;

const FormWrap = styled.div`
    width: 40vw;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 3vh;
    align-items: center;
    background-color: #B0D9B1;
    padding: 3vh 3vw;
    border-radius: 5px;
    margin-bottom: 4vh;
    box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);

    @media (max-width:900px){
      width: 70vw;
      padding: 2vh 0;
    }
`;

const RowClass = styled.div`
    display: flex;
    /* width: 100%; */
    align-items: last baseline;
    /* justify-content: center; */
    gap: 2vw;
    margin-bottom: 2vh;
    @media (max-width:900px){
      flex-direction: column;
      gap: 1vh;
    }
`;

const Forgotpwd = () => {
    const otpRef = useRef()
    const emailRef = useRef()
    const navigate = useNavigate()

    const notify = (msg) => toast(msg);

    const handleSend = async (e) => {
        e.preventDefault()
        const email = emailRef.current.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            notify(`Invalid Email format`)
            return;
        }
        await axiosInstance.post("/auth/genotp",{email:email})
        .then((res)=>{
            notify("Otp Send Successfully")
        })
        .catch((err)=>{
            console.log(err)
            notify(err.response.data.msg)
        })
    }

    const handleVerify = async (e) => {
        e.preventDefault()
        const email = emailRef.current.value;
        const otp = otpRef.current.value;
        await axiosInstance.post("/auth/verifyotp",{otp:otp,email:email})
        .then((res)=>{
            const userId = res.data.userId;
            navigate(`/changepwd?q=${userId}`)
        })
        .catch((err)=>{
            notify(err.response.data.msg)
        })
    }
    return (
        <UserLayout>
            <Wrapper>
                <FormWrap>
                    <h1>Forgot password ?</h1>
                <Form onSubmit={handleSend}>
                    <RowClass>
                        <Form.Group controlId='email'>
                            <Form.Label >Enter email</Form.Label>
                            <Form.Control type='email' name='email' 
                            ref={emailRef} />
                        </Form.Group>

                        <Button type='submit' variant='primary'>
                            Send Otp
                        </Button>

                    </RowClass>
                </Form>

                <Form onSubmit={handleVerify}>
                    <RowClass>
                        <Form.Group controlId='otp'>
                            <Form.Label >Enter Otp</Form.Label>
                            <Form.Control type='otp' name='otp' 
                            ref={otpRef} />
                        </Form.Group>

                        <Button type='submit' variant='primary'>
                            Verify
                        </Button>

                    </RowClass>
                </Form>

            <Link to='/login'>Login</Link>

                </FormWrap>
            </Wrapper>

            <ToastContainer/>
        </UserLayout>
    )
}

export default Forgotpwd