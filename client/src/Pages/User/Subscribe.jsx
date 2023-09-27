import React, { useState } from 'react'
import UserLayout from '../../Components/user/UserLayout'
import { styled } from 'styled-components';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import useRazorpay from 'react-razorpay'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../redux/userReducer';
import axiosInstance from '../../axios/axiosInstance';

const Wrapper = styled.div`
    /* min-height: 120vh; */
    display: flex;
    /* align-items: center; */
    justify-content: center;
    /* background-color: yellow; */
`;

const FormWrap = styled.div`
    width: 80vw;
    /* min-height: 80vh; */
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3vh;
    background-color: #B0D9B1;
    padding: 3vh 3vw;
    margin-bottom:3vh;
`;

const SubBox = styled.div`
    width:100%;
    height: auto;
    /* border: 2px solid grey; */
    display: flex;
    justify-content: space-around;
    align-items: center;
    @media (max-width:500px){
        flex-direction: column;
        gap: 2vh;
    }
`;

const MonthBox = styled.div`
    min-width:20vw;
    /* max-width:40vw; */
    height: 30vh;
    padding: 2vh 2vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background-color: teal;
    border-radius: 5px;
    @media (max-width:500px){
        width: 90%;
    }
`;

const YearBox = styled.div`
    min-width:20vw;
    /* max-width:40vw; */
    height: 30vh;
    padding: 2vh 2vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background-color: teal;
    border-radius: 5px;
    @media (max-width:500px){
        width: 90%;
    }
`;

const Subscribe = () => {
    const user = useSelector((state) => state.user.user)
    const [Razorpay] = useRazorpay();
    const navigate = useNavigate()
    const notify = (msg) => toast(msg);
    const [isSub,setIsSub] = useState(false)
    const dispatch = useDispatch()

    console.log(user)

    const razorPayment = (order) => {
        console.log(order)
        const options = {
            key: "rzp_test_6JFoZx1fYTkS3n",
            amount: order.amount, 
            currency: 'INR',
            name: 'Reality',
            description: 'Payment for Order',
            image: '/path/to/your/logo.png', 
            order_id: order.id, 
            handler: function (response) {
                verifyPayment(response, order,user._id)
                console.log(response);
            },
            prefill: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                contact: '1234567890',
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#3399cc"
            }
        }
        const rzp = new Razorpay(options);
        rzp.open();
    }

    const verifyPayment =async(payment,order,userId)=>{
        await axiosInstance.post("/verifypayment",{payment,order,userId})
        .then((res)=>{
            notify(res.data.msg)
            console.log(res.data.user)
            dispatch(updateUser(res.data.user))
        })
        .catch((err)=>{
            console.log(err)
            notify(err.response.data.msg)
            
        })
    }


    const handleSub = async (plan) => {
        console.log("handlesub called")
        await axiosInstance.post(`/subscribe/${user._id}/to/?plan=${plan}`)
            .then((res) => {
                console.log(res.data)
                razorPayment(res.data)
            })
            .catch((err)=>{
                console.log(err)
               
            })

    }

    return (
        <UserLayout>
            <Wrapper>
                <FormWrap>
                    <h2>Subscribe to the App</h2>
                    <h5>Terms & Conditions</h5>
                    <p>By subscribing to Realify, you agree to comply with these Terms 
                        and Conditions. You are responsible for maintaining the confidentiality
                         of your account information and using the app solely for lawful 
                         purposes. Subscription fees, if applicable, are non-refundable. We 
                         reserve the right to terminate your subscription for any violation of
                          these terms. The app's use is also subject to our Privacy Policy. 
                          All intellectual property rights to Realify belong to Realify Company
                          , and you may not reproduce or modify any part of it without our written 
                          consent. We provide Realify "as is" and disclaim any warranties. Realify
                           will not be liable for any damages resulting from app use. These terms 
                           are governed by India's laws, and we may update them periodically, with 
                           the latest version available on the Realify app. For questions, contact us at realify@gmail.com.</p>
                    
                    {user?.subscribed
                        ? <h2 style={{color:"green"}}>Congrats!!! You are subscribed to this App.</h2>

                        :
                        <SubBox>
                            <MonthBox>
                                <h3>₹500/month</h3>
                                <h4>Monthly</h4>
                                <h4>Subscription</h4>
                                <Button variant='danger' onClick={()=>handleSub("monthly")}>Select</Button>
                            </MonthBox>
                            <YearBox>
                                <h3>₹6000/year</h3>
                                <h4>Yearly</h4>
                                <h4>Subscription</h4>
                                <Button variant='danger' onClick={()=>handleSub("yearly")}>Select</Button>
                            </YearBox>
                        </SubBox>
                    }
                </FormWrap>
            </Wrapper>
            <ToastContainer/>
        </UserLayout>
    )
}

export default Subscribe