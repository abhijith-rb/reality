import React, { useRef } from 'react'
import UserLayout from '../../Components/user/UserLayout'
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "../../api/axios"
import { styled } from 'styled-components';



const Wrapper = styled.div`
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: yellow; */
`;

const FormWrap = styled.div`
    width: 40vw;
    height: 40vh;
    display: flex;
    flex-direction: column;
    gap: 3vh;
    align-items: center;
    background-color: #B5CFD8;
    padding: 3vh 3vw;
`;

const ChangePwd = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('q');
    const passwordRef = useRef()
    const repasswordRef = useRef()
    const navigate = useNavigate()
    console.log(userId)

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

    const handleChange = async (e) => {
        e.preventDefault();
        const password = passwordRef.current.value;
        const repassword = repasswordRef.current.value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,20}$/

        if (!passwordRegex.test(password)) {
            notify('Enter valid Password')
            return;
        }

        if (password !== repassword) {
            notify("Passwords doesn't match")
            return;
        }
        await axios.post(`/auth/updatepwd/${userId}`, { password: password })
            .then((res) => {
                navigate("/login")
            })
            .catch((err)=>{
                notify(err.response.data.msg)
            })
    }
    return (
        <UserLayout>
            <Wrapper>
                <FormWrap>
                    <Form onSubmit={handleChange}>
                        <Form.Group controlId='password'>
                            <Form.Label >Enter Password</Form.Label>
                            <Form.Control type='password' name='password' ref={passwordRef} />
                        </Form.Group>
                        <Form.Group controlId='repassword'>
                            <Form.Label >Confirm Password</Form.Label>
                            <Form.Control type='password' name='repassword' ref={repasswordRef} />
                        </Form.Group>

                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                    </Form>
                </FormWrap>
            </Wrapper>
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

export default ChangePwd