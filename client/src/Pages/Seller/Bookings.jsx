import React, { useEffect, useState } from 'react';
import UserLayout from '../../Components/user/UserLayout';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import SlotModal from '../../Components/Seller/SlotModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axiosInstance from '../../axios/axiosInstance';
import { useSelector } from 'react-redux';
import VisitorsModal from '../../Components/Seller/VisitorsModal';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Wrapper = styled.div`
    position: relative;
`;

const Header = styled.div`
  display  :flex ;
  align-items: center;
  justify-content: space-around;
  /* border: 2px solid green; */
`;

const BodyContainer = styled.div`
    width: 89vw;
    height: auto;
    overflow-x: scroll;
    border-radius: 10px;
    border: 2px solid #7393A7;
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

const WeekDiv = styled.div`
    width: 1400px;
    height: auto;
    display: flex;
    justify-content: space-around;
    /* border: 2px solid red; */

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
    justify-content:center;
    padding: 0 1vw;
    font-size: 1rem;
    @media (max-width: 1000){
        padding: 0 5vw;
    }
`;

const Bookings = ()=>{
    const axiosInstance = useAxiosPrivate()

    const user = useSelector((state)=>state.user.user)
    const notify = (msg)=> toast(msg);
    const todayDate = new Date();
    const todayNum = todayDate.getDay();
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [day,setDay] = useState(week[todayNum])
    const [box,setBox] = useState(false)
    const [idx,setIdx] = useState(-1)

    const [slots,setSlots] = useState({
        Sunday:{date:null,timeSlots:[]},
        Monday:{date:null,timeSlots:[]}, 
        Tuesday:{date:null,timeSlots:[]}, 
        Wednesday:{date:null,timeSlots:[]}, 
        Thursday:{date:null,timeSlots:[]}, 
        Friday:{date:null,timeSlots:[]}, 
        Saturday:{date:null,timeSlots:[]}
    })

    const [visitors,setVisitors] = useState([])
    const [vmodal,setVmodal] = useState(false)

    const getSlots= async()=>{
        try{
            await axiosInstance.get(`/get-slots/${user._id}`)
            .then((res)=>{
                console.log("res.data",res.data)
                setSlots(res.data)
            })
            .catch((err)=>{
                console.log(err)
                notify(err.response.data.msg)
            })
        }catch(err){
            console.log(err)
        }
    }

    const getVisitors= async()=>{
        await axiosInstance.get(`/get-visitors/${user._id}`)
        .then((res)=>{
            console.log(res.data)
            setVisitors(res.data)
        })
        .catch((err)=>{
            console.log(err.response.data.msg)
            notify(err.response.data.msg)
        })
        
    }

    useEffect(()=>{
        getSlots()
    },[])
    
    useEffect(()=>{
        getVisitors()

    },[vmodal])

    const days =[...week];
    for(let i=0; i<todayNum+1;i++){
        days.push(days.shift());
    }
    console.log(days)

    const handleSet = (d,i)=>{
        // console.log(slots[d])
        
        setDay(d)
        setIdx(i)
        setBox(true)
    }

    console.log(slots)
    // console.log(slots["Sunday"])
    console.log(days)
    return (
        <UserLayout>
            <Wrapper>
                <Header>
                    <h1 style={{color:"#12233f"}}>My Time-Slots</h1>
                    <Button variant='info' onClick={()=>setVmodal(true)}>
                        Visitors
                    </Button>
                </Header>
                <BodyContainer>
                    <WeekDiv>
                        {days && days?.map((d,i)=>(
                            <DayDiv key={i}>
                                <span>{d}</span>
                                
                                <Button onClick={()=>handleSet(d,i)}>
                                    Set Slot</Button>

                                    {slots &&
                                        (slots[d]?.timeSlots?.length > 0)
                                    &&
                                    <SlotList>
                                        
                                            {slots[d]?.timeSlots?.map((timeSlot)=>(
                                                <SlotIntDiv>{timeSlot}</SlotIntDiv>
                                            ))}
                                    </SlotList>
                                        
                                    }
                            </DayDiv>
                        ))}

                    </WeekDiv>

                </BodyContainer>

            {vmodal && <VisitorsModal setVmodal={setVmodal} visitors={visitors}/>}

            {box && <SlotModal setBox={setBox} slots={slots} 
                    setSlots={setSlots} day={day} idx={idx}/>}
            </Wrapper>
            <ToastContainer/>
        </UserLayout>
    )
}

export default Bookings;