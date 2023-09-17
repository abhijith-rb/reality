import React, { useRef } from 'react'
import UserLayout from '../../Components/user/UserLayout'
import { styled } from 'styled-components';
import { Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';

const Wrapper = styled.div`
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const FormWrap = styled.div`
    width: 40vw;
    height: 40vh;
    display: flex;
    flex-direction: column;
    gap: 3vh;
    align-items: center;
    background-color: #88C4FE;
    padding: 3vh 3vw;
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
                <Form onSubmit={handleSend}>
                    <Form.Group controlId='email'>
                        <Form.Label >Enter email</Form.Label>
                        <Form.Control type='email' name='email' 
                        ref={emailRef} style={{width:"20vw"}}/>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Send Otp
                    </Button>
                </Form>

                <Form onSubmit={handleVerify}>

                    <Form.Group controlId='otp'>
                        <Form.Label >Enter Otp</Form.Label>
                        <Form.Control type='otp' name='otp' 
                        ref={otpRef} style={{width:"20vw"}}/>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Verify Otp
                    </Button>
                </Form>
                </FormWrap>
            </Wrapper>

            <ToastContainer/>
        </UserLayout>
    )
}

export default Forgotpwd