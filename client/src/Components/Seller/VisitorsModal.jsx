import React, { useEffect, useState } from 'react';
import { CancelOutlined} from '@mui/icons-material';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import axiosInstance from '../../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = styled.div`
    width: 50vw;
    min-height: 50vh;
    /* border: 2px solid blue; */
    position: fixed;
    top: 20vh;
    left: 25%;
    border-radius: 10px;
    box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
    background-color: #ffffff;
    @media (max-width: 800px){
      width: 90%;
    left: 5%;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 5vh;
    padding: 3vh 1vw;
`;

const TableResponsive = styled.div`
  overflow: auto;
  margin-top: 3vh;
  min-width: 93%;
  max-width: 95%;
  max-height: 60vh;
  /* border: 2px solid red; */
  &::-webkit-scrollbar {
    width: 0.01em;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
`;

const CloseIcon = {
    color:"black",
    cursor:"pointer",
    position:"absolute",
    top:"10px",
    right:"15px"
}

const VisitorsModal = ({setVmodal,visitors}) => {
  return (
    <Wrapper>
        <CancelOutlined onClick={()=>setVmodal(false)} style={CloseIcon}/>
        <h1 style={{color:"#12233f"}}>Visitors</h1>
        {
            visitors?.length >0
            ?
            (<TableResponsive className='table-responsive'>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Property</th>
                            <th>Time</th>
                            <th>Day</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitors?.map((visitor)=>(
                            <tr>
                                <td>{visitor?.visitorName[0]}</td>
                                <td>{visitor?.propertyTitle[0]}</td>
                                <td>{visitor?.timeSlot}</td>
                                <td>{visitor?.day}</td>
                                <td>{visitor?.date.split('T')[0]}</td>
                            </tr>
                        ))

                        }
                    </tbody>
                </table>

            </TableResponsive>

            )
            : (<h2 style={{ textAlign: 'center', color: "#777" }}>No Visitors</h2>)

        }

    </Wrapper>
  )
}

export default VisitorsModal