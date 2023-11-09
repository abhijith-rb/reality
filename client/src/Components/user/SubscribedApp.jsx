import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'react-bootstrap';
import { updateUser } from '../../redux/userReducer';

const SubedDiv = styled.div`
    width: 80vw;
    min-height: 30vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3vh;
    background-color: #B5CFD8;
    padding: 3vh 3vw;
    margin-bottom:3vh;
`;

const SubscribedApp = () => {
    const user = useSelector((state)=>state.user.user);
    const dispatch = useDispatch();
    const [data,setData] = useState();
    const notify = (msg)=> toast(msg);
    const getData = async()=>{
        await axiosInstance.get(`/get-subscription-data/${user._id}`)
        .then((res)=>{
            setData(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        getData()
    },[])

    const UnsubApp = async()=>{
        await axiosInstance.put(`/unsubscribe/${user._id}`)
        .then((res)=>{
            notify(res.data.msg)
            dispatch(updateUser(res.data.user));
        })
        .catch((err)=>{
            console.log(err);
            notify(err.response.data.msg)
        })
    }

    console.log(data)
  return (
    <SubedDiv>
        <h2 style={{color:"green"}}>You are subscribed to this App.</h2>
        <Button variant='danger' onClick={UnsubApp}>Unsubscribe</Button>
        <ToastContainer/>
    </SubedDiv>
  )
}

export default SubscribedApp