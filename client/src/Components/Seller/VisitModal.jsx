import { CancelOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
// import axiosInstance from '../../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Wrapper = styled.div`
    width: 90%;
    min-height: 40vh;
    border-radius: 10px;
    box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
    position: fixed;
    top: 15vh;
    left: 5%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 2vh 5vw;
    z-index: 120;
`;

const WeekDiv = styled.div`
 width: 1400px;
height: auto;
display: flex;
 justify-content: space-around;
 /* border: 2px solid red; */
 padding: 0 2vw;
`;
const DayDiv = styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 2vh;
    align-items: center;
    /* border: 2px solid green; */
    padding: 3vh 2vw;
    @media (max-width:400px){
        width: 95%;
    }
`;

const SlotList = styled.div`
    width: 100%;
    height: auto;
    /* border: 2px solid red; */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vh;
`;

const SlotIntDiv = styled.div`
    width: 100%;
    height: 5vh;
    color: white;
    background-color: #7393A7;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1vw;
    @media (max-width: 1000){
        padding: 0 5vw;
    }

    input{
        cursor: pointer;
    }
`;

const CloseIcon = {
    color: "black",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "15px"
};

const BtnsDiv = styled.div`
 width: 80%;
 display: flex;
 align-items: center;
 justify-content: space-evenly;
 margin-top: 2vh;
`;

const BookedVisit = styled.div`
    /* min-height: 45vh; */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 3vh;
    padding: 5vh 4vw;
`;

const BodyContainer = styled.div`
    width: 89vw;
    height: auto;
    overflow-x: scroll;
    border: 2px solid #B5CFD8;
    &::-webkit-scrollbar{
        width: 0.01em;
    }
    &::-webkit-scrollbar-track{
        background: transparent;
    }
    &::-webkit-scrollbar-thumb{
        background: transparent;
    }
`;

const VisitModal = ({ setVisitOpen, propertyId, sellerId }) => {
    const axiosInstance = useAxiosPrivate()

    const [visit, setVisit] = useState(null)
    const user = useSelector((state) => state.user.user);
    const [selected, setSelected] = useState({
        timeSlot: null,
        day: null,
        date: null
    })
    const notify = (msg) => toast(msg);
    const todayDate = new Date();
    const todayNum = todayDate.getDay();
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const [slots, setSlots] = useState(null)
    const getSlots = async () => {
        await axiosInstance.get(`/get-slots/${sellerId}`)
            .then((res) => {
                setSlots(res.data);
            })
            .catch((err) => {
                console.log(err);
                notify(err.response.data.msg);
            })
    }

    const days = [...week];
    for (let i = 0; i < todayNum + 1; i++) {
        days.push(days.shift());
    }
    console.log(days)

    useEffect(() => {
        getSlots();
    }, []);
    console.log(slots)

    const handleConfirm = async () => {
        if (selected.timeSlot == null) return;

        const obj = {
            sellerId: sellerId,
            visitorId: user?._id,
            propertyId: propertyId,
            day: selected.day,
            date: selected.date,
            timeSlot: selected.timeSlot,
        }

        await axiosInstance.post("/create-visit", obj)
            .then((res) => {
                console.log(res.data)
                setVisit(res.data.visit)
                console.log(res.data.msg)
                notify(res.data.msg);
                setSelected({timeSlot:null,day:null,date:null})
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response?.data.msg)
                notify(err.response?.data.msg)
            })
    }

    const getVisit = async () => {
        await axiosInstance.get(`/get-visit?sid=${sellerId}&vid=${user._id}&pid=${propertyId}`)
            .then((res) => {
                console.log(res.data)
                setVisit(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getVisit();
    }, [])

    const cancelVisit = async () => {
        await axiosInstance.delete(`/cancel-visit?sid=${sellerId}&vid=${user._id}&pid=${propertyId}`)
            .then((res) => {
                console.log(res.data)
                notify("Visit Cancelled")
                setVisit(null)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    console.log(selected)
    return (
        <Wrapper>
            <CancelOutlined onClick={() => setVisitOpen(false)}
                style={CloseIcon} />

            {
                visit ?
                    <BookedVisit>
                        <h2 style={{color:"#12233f"}}>Your visit is scheduled at </h2>
                        <span style={{ fontSize: '24px' }}>Time: {visit?.timeSlot}</span>
                        <span style={{ fontSize: '24px' }}>Day: {visit?.day} </span>
                        <span style={{ fontSize: '24px' }}>Date: {visit?.date?.split("T")[0]}</span>
                        <Button variant='danger' onClick={cancelVisit}>Cancel Visit</Button>
                    </BookedVisit>
                    :
                    <>
                        {slots ?
                            <>
                                <h1 style={{color:"#12233f"}}>Choose a Timeslot</h1>
                                <BodyContainer>
                                    <WeekDiv>
                                        {days && days?.map((d, i) => (
                                            <DayDiv key={i}>
                                                <span>{d}</span>

                                                {slots &&
                                                    (slots[d]?.timeSlots?.length > 0)
                                                    &&
                                                    <SlotList>

                                                        {slots[d]?.timeSlots?.map((timeSlot) => (
                                                            <SlotIntDiv>
                                                                <input type='radio' name='interval'
                                                                    value={timeSlot}
                                                                    onChange={(e) => setSelected((prev) => ({ ...prev, timeSlot: timeSlot, day: d, date: slots[d]?.date }))}
                                                                />
                                                                <span>{timeSlot}</span>
                                                            </SlotIntDiv>
                                                        ))}
                                                    </SlotList>

                                                }
                                            </DayDiv>
                                        ))}

                                    </WeekDiv>

                                </BodyContainer>
                                {selected.timeSlot &&
                                    <p style={{ fontSize: '20px' }}>Selected Slot: {selected?.timeSlot} {selected?.day} {selected?.date?.split('T')[0]}</p>

                                }

                                <BtnsDiv>
                                    <Button variant='secondary' onClick={() => setVisitOpen(false)}>
                                        Cancel </Button>
                                    <Button onClick={handleConfirm}>Confirm</Button>
                                </BtnsDiv>
                            </>
                            : <h1>No Slots Available</h1>
                        }

                        <ToastContainer />

                    </>

            }


        </Wrapper>
    )
}

export default VisitModal