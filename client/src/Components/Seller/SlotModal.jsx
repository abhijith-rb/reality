import React, { useEffect, useState } from 'react';
import { CancelOutlined} from '@mui/icons-material';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
// import axiosInstance from '../../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Wrapper = styled.div`
    width: 50vw;
    min-height: 50vh;
    border-radius: 10px;
    box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
    position: fixed;
    top: 20vh;
    left: 25%;
    background-color: #ffffff;
    @media (max-width: 800px){
      width: 90%;
    left: 5%;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 3vh 0;
`;

const TitleDiv = styled.div`
  display: flex;
  align-items: baseline;
  gap:4vw;
`;

const SlotsWrap = styled.div`
  width: 95%;
  min-height: 25vh;
  display: flex;
  align-items: center;
  gap:3vw;
  flex-wrap: wrap;
  /* border: 2px solid yellow; */
  padding: 2vh 0 2vh 5vw;
  @media (max-width:500px){
    padding: 2vh 0 2vh 4vw;
  }
`;

const SlotCard = styled.div`
  min-width: 15vw;
  height: 5vh;
  /* border: 2px solid grey; */
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2vw;
  color: white;
  background-color: #7393A7;
  @media (max-width:700px){
    min-width: 30vw;
  }
  @media (max-width:500px){
    min-width: 36vw;
  }

  input{
    cursor: pointer;
  }
`;

const BtnsDiv = styled.div`
 width: 80%;
 display: flex;
 align-items: center;
 justify-content: space-evenly;
 /* border: 2px solid black; */
 margin-top: 2vh;
`;

const CloseIcon = {
    color:"black",
    cursor:"pointer",
    position:"absolute",
    top:"10px",
    right:"15px"
}

const SlotModal = ({setBox,slots,setSlots,day,idx}) => {
  const axiosInstance = useAxiosPrivate()

  const notify = (msg)=> toast(msg);
   const user = useSelector((state)=>state.user.user)
    const currDate = new Date();
    const thenDate = new Date(currDate.setDate(currDate.getDate()+idx+1));
    const dmy = `${thenDate.getDate()}-${thenDate.getMonth()+1}-${thenDate.getFullYear()}`
    console.log(dmy);

    const [selected,setSelected] = useState(slots ? slots[day]?.timeSlots : []);
    
    useEffect(()=>{
      setSelected(slots ? slots[day].timeSlots : [])
    },[day])
    const slotTimes = ["9am-10am","10am-11am","11am-12pm","12pm-1pm",
    "2pm-3pm","3pm-4pm","4pm-5pm","5pm-6pm"];
   

    const handleCheck = (e,time)=>{
      console.log("check fn",time,e.target.checked)
      const isChecked = e.target.checked;
      const withinLimit = selected.length < 4;

      if(isChecked && !withinLimit){
        notify("Maximum limit is 4 ")
        return
      }

      if(isChecked){
        setSelected((prev)=>(prev?.length>0 ? [...prev,time] : [time]))
      }else{
        const j = selected.indexOf(time);
        const temp = [...selected]
        temp.splice(j,1);
        setSelected([...temp])
      }
    }
    
    const handleApply= async()=>{
      const obj = {
        sellerId:user._id,
        day:day,
        date:thenDate,
        timeSlots:selected
      }
      await axiosInstance.post("/put-slots",obj)
      .then((res)=>{
        console.log(res.data);
        setSlots((prev)=>({...prev,[day]:{...day,timeSlots:[...selected]}}))
        setBox(false)
        notify(res.data.msg)
      })
      .catch((err)=>{
        if(err.response?.data){
          notify(err.response.data.msg)
        }else{
          notify("Network error")
        }

      })
    }

  return (
    <Wrapper>
        <CancelOutlined onClick={()=>setBox(false)} style={CloseIcon}/>
        <TitleDiv>
          <h1>{day}</h1>
          <span>{dmy}</span>
        </TitleDiv>
        <h4>Select atmost 4 slots</h4>
        <SlotsWrap>
          {
            slotTimes.map((t,i)=>(
              <SlotCard key={i}>
                <span style={{fontSize:'20px'}}>{t}</span>
                <input type='checkbox' checked={selected?.includes(t)}
                 onChange={(e)=>handleCheck(e,t)}/>
              </SlotCard>
            ))
          }
        </SlotsWrap>
        <BtnsDiv>
          <Button variant='secondary' onClick={()=>setBox(false)}>
            Cancel</Button>
          <Button onClick={handleApply}>Apply</Button>
        </BtnsDiv>

        <ToastContainer/>
    </Wrapper>
  )
}

export default SlotModal;