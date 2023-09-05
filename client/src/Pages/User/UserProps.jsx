import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap'
import DeleteConfirmation from '../../utils/DeleteConfirmation'
import axios from 'axios';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../Components/user/Header';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import UserLayout from '../../Components/user/UserLayout';
import axiosInstance from '../../axios/axiosInstance';

const MainBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left:5vw;
  padding-right:5vw;
`;

const ContentBox = styled.div`
  flex: 8;
  
`;

const Title = styled.h1`
  text-align: center;
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

const UserProps = () => {
    const user = useSelector((state)=> state.user.user)
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const searchRef = useRef();
    const [propId, setPropId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);

    const showDeleteModal = (propid, title) => {
        setPropId(propid);
        setDeleteMessage(`Are you sure you want to delete ${title}?`)
        setDisplayConfirmationModal(true)
    }
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false)
        setPropId(null)
    }


    const submitDelete = () => {
        handleDelete();
        hideConfirmationModal();

    }

    const notify = (msg)=> toast(msg);

    const handleDelete = async () => {
        try {
            if (propId) {
                await axiosInstance.get(`/deleteproperty/${propId}`)
                    .then((response) => {
                        const updtdProps = properties.filter((prop)=>(
                            prop._id !== propId 
                        ))
                        setProperties(updtdProps)    
                        setPropId(null)
                        console.log("property deleted successfully");
                        notify(response.data.msg)
                    })
                    .catch((err) => {
                        console.log(err)
                        
                    })
            }
        } catch (error) {
            console.log(error)
        }

    }

    const getuserproperties = async() => {
        await axiosInstance.get(`/getuserprops/${user._id}`)
            .then((response) => {
                console.log(response.data);
                setProperties(response.data)
            })
            .catch((err)=>{
                console.log(err)
                
            })
    }

    useEffect(() => {
        getuserproperties();
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault();
        const squery = searchRef.current.value;
        console.log(squery)
        if (squery) {
            // await axiosInstance.get(`/search-property?squery=${squery}`)
        await axiosInstance.get(`/getuserprops/${user._id}?squery=${squery}`)
                .then((response) => {
                    setProperties(response.data)
                })
                .catch((err) => {
                    console.log(err)
                    
                })
        }
    }

    const handleReset = () => {
        getuserproperties();
        searchRef.current.value = "";
    }
    return (
        <UserLayout>

            <MainBox>

                    <Title>My Properties</Title>

                    <TopDiv>
                    <div>
                        <Button onClick={() => navigate('/postproperty')}>Create</Button>

                    </div>

                    <div>

                        <Form onSubmit={handleSearch} className='searchForm' style={{ width: "100%", display: "flex", alignItems: "center"}}>
                            <Form.Group controlId="formBasicInput"  >
                                <Form.Control type="text" name='search' ref={searchRef} placeholder="Search here..." />
                            </Form.Group>
                            <Button type='submit' variant='secondary'><SearchIcon /></Button>
                            <Button onClick={handleReset} variant='warning'><RestartAltIcon /></Button>
                        </Form>
                    </div>

                    </TopDiv>

                    {properties &&
                        properties.length > 0 ?
                        (<TableResponsive className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Location</th>
                                        <th>Price</th>
                                        <th style={{textAlign:"center"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (properties.map((property) => {
                                            return (<tr key={property._id}>
                                                <td>{property.title}</td>
                                                <td>{property.location}</td>
                                                <td>₹ {property.price}</td>
                                                <td >
                                                    <Btns>

                                                    <Button variant='warning' onClick={() => navigate(`/updateproperty/${property._id}`)}>Edit</Button>
                                                    <Button variant='danger' onClick={() => showDeleteModal(property._id, property.title)}>Delete</Button>
                                                    </Btns>
                                                </td>
                                            </tr>)
                                        }))



                                    }

                                </tbody>
                            </table>
                        </TableResponsive>)

                        : (<h2 style={{ textAlign: 'center', color: "white" }}>No Search Results</h2>)

                    }

                    <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} message={deleteMessage} />
                <ToastContainer/>
            </MainBox>

        </UserLayout>

    )
}

export default UserProps