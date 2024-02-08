import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
// import axiosInstance from '../../axios/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'react-bootstrap';
import { updateUser } from '../../redux/userReducer';
import ConfirmModal from '../../utils/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const SubedDiv = styled.div`
    width: 40vw;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3vh;
    background-color: #B5CFD8;
    padding: 3vh 3vw;
    margin-bottom:3vh;
    border-radius: 5px;
    @media (max-width:900px){
        width: 90vw;
    }
`;

const DeetsDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-size: 24px;
`;

const BtnsDiv = styled.div`
    width: 80%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    @media (max-width: 800px){
        flex-direction: column;
        gap: 5vh;
    }
`;

const SubscribedApp = () => {
    const axiosInstance = useAxiosPrivate()

    const user = useSelector((state)=>state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data,setData] = useState();
    const notify = (msg)=> toast(msg);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const unique = {
        title:"Unsubscribe App",
        confirmBtn: "Unsubscribe"
    }

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

    const triggerUnSub = () => {
        setModalMessage(`Are you sure you want to Unsubscribe?`)
        setShowModal(true)
    }
    const hideModal = () => {
        setShowModal(false)
    }

    const confirmModal = ()=>{
        UnsubApp();
        hideModal();
    }

  return (
    <SubedDiv>
        <h2 style={{color:"#04364A"}}>You are subscribed to this App</h2>
        <DeetsDiv>
            <span>Plan : {data?.plan.toUpperCase()}</span>
            <span>Price : ₹{data?.price}</span>
            <span>Expires on : {data?.endDate.split('T')[0]}</span>

        </DeetsDiv>

        <BtnsDiv>
            <Button onClick={()=>navigate('/userprops')}>Dashboard</Button>
            <Button variant='danger' onClick={triggerUnSub}>Unsubscribe</Button>

        </BtnsDiv>

        <ConfirmModal  showModal={showModal} confirmModal={confirmModal} hideModal={hideModal} message={modalMessage} unique={unique}/>
        <ToastContainer/>
    </SubedDiv>
  )
}

export default SubscribedApp