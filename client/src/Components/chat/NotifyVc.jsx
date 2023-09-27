import React from 'react'
import { Call, CallEnd } from '@mui/icons-material';
import { Button } from 'react-bootstrap';
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
    width: 30vw;
    height: 30vh;
    /* border: 2px solid red; */
    position: absolute;
    top: 0;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5vh;
    background-color: #79AC78;
    border-radius: 5px;
    color: #D0E7D2;
`;

const BtnsDiv = styled.div`
    width: 80%;
    display: flex;
    justify-content: space-between;
`;

const NotifyVc = ({callerName,setCallNotice,roomId}) => {
    const navigate = useNavigate()
    const acceptCall = ()=>{
        navigate(`/room/${roomId}`)
    }

    const rejectCall = ()=>{
        setCallNotice(false)
    }
  return (
    <Wrapper>
    <h1>{callerName} calling</h1>
    <BtnsDiv>
        <Button variant='success' onClick={acceptCall}><Call/></Button>
        <Button variant='danger' onClick={rejectCall}><CallEnd/></Button>
    </BtnsDiv>

</Wrapper>
  )
}

export default NotifyVc