import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../Components/admin/AdminLayout';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axiosInstance from '../../axios/axiosInstance';

const MainBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;


const Title = styled.h1`
  text-align: center;
  /* background-color: red; */
`;

const Btns = styled.div`
  display: flex;
  justify-content: space-around;
`;

const TopDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TableResponsive = styled.div`
  overflow: auto;
  margin-top: 3vh;
  max-width: 90vw;
  max-height: 60vh;
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

const Usermng = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const searchRef = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const getUsers = async () => {
    await axiosInstance.get('/admin/getallusers')
      .then((response) => {
        console.log(response.data);
        setUsers(response.data)
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  useEffect(() => {
    getUsers();
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault();
    const squery = searchRef.current.value;
    console.log(squery)
    if (squery) {
      await axiosInstance.get(`/admin/search?squery=${squery}`)
        .then((response) => {
          setUsers(response.data)
        })
        .catch((err) => {
          console.log(err)
         
        })
    }
  }

  const handleReset = () => {
    getUsers();
    searchRef.current.value = "";
  }

  const notify = (msg)=> toast(msg)

  const unblockUser = async(userId)=>{
    await axiosInstance.put(`/admin/unblockuser/${userId}`)
    .then((response)=>{
      const updatedUser = response.data.updatedUser
      console.log(updatedUser)

      const updtdUsers = users.map((user)=>(
        user._id === userId ? updatedUser : user
      ))
      setUsers(updtdUsers)
      
      notify(response.data.msg)
    })
    .catch((err)=>{
      console.log(err)
      notify(err.response.data.msg)
      
    })
  }

  const blockUser = async(userId)=>{
    await axiosInstance.put(`/admin/blockuser/${userId}`)
    .then((response)=>{
      const updatedUser = response.data.updatedUser
      console.log(updatedUser)

      const updtdUsers = users.map((user)=>(
        user._id === userId ? updatedUser : user
      ))
      setUsers(updtdUsers)

      notify(response.data.msg)
     
    })
    .catch((err)=>{
      console.log(err)
      notify(err.response.data.msg)
      
    })
  }

  return (
    <AdminLayout>

    <MainBox>

      <Title >User Management</Title>

      <TopDiv>
        <div>
        <Button onClick={ ()=>navigate('/admin/createuser')}>Create</Button>

        </div>

        <div>

        <Form onSubmit={handleSearch} className='searchForm' style={{width:"100%",display:"flex",alignItems:"center"}}>
          <Form.Group controlId="formBasicInput"  >
            <Form.Control type="text" name='search' ref={searchRef} placeholder="Search here..." />
          </Form.Group>
            <Button type='submit' variant='secondary'><SearchIcon/></Button>
            <Button onClick={handleReset} variant='warning'><RestartAltIcon/></Button>
        </Form>
        </div>

      </TopDiv>
      {
        users?.length > 0 ?
        (<TableResponsive className="table-responsive" >
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th style={{textAlign:"center"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                (users.map((user) => {
                  return (<tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td >
                      <Btns>

                      <Button variant='warning' onClick={() => navigate(`/admin/edituser/${user._id}`)}>Edit</Button>
                      {
                        user.isBlocked 
                        ? <Button variant='success' onClick={()=>unblockUser(user._id)}>Unblock</Button>
                        : <Button variant='danger' onClick={()=>blockUser(user._id)}>Block</Button>
                      }
                      
                      </Btns>
                    </td>
                  </tr>)
                }))
              }
            </tbody>
          </table>
        </TableResponsive>)

        : (<h2 style={{ textAlign: 'center', color: "#777" }}>No Matching Search Results</h2>)

      }

    <ToastContainer/>

    </MainBox>
    
    </AdminLayout>

  )
}

export default Usermng