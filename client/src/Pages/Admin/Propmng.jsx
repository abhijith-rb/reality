import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap'
import DeleteConfirmation from '../../utils/DeleteConfirmation'
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
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
  color: #96B6C5;

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

const Propmng = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const searchRef = useRef();
    const [propId, setPropId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    console.log(properties)

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

    const notify = (msg) => toast(msg);

    const handleDelete = async () => {
        try {
            if (propId) {
                await axiosInstance.get(`/deleteproperty/${propId}`)
                    .then((response) => {
                        const updtdProps = properties.filter((prop) => (
                            prop._id !== propId
                        ))
                        setProperties(updtdProps)
                        setPropId(null)
                        console.log("property deleted successfully");
                        notify(response.data.msg)
                    })
                    .catch((err) => {
                        console.log(err)
                        notify(err.response.data.msg)
                       
                    })
            }
        } catch (error) {
            console.log(error)
        }

    }

    const getproperties = async () => {
        await axiosInstance.get('/getallproperties')
            .then((response) => {
                console.log(response.data);
                setProperties(response.data)
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    useEffect(() => {
        getproperties();
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault();
        const squery = searchRef.current.value;
        console.log(squery)
        if (squery) {
            await axiosInstance.get(`/search-property?squery=${squery}`)
                .then((response) => {
                    setProperties(response.data)
                })
                .catch((err) => {
                    console.log(err)
                    
                })
        }
    }

    const handleReset = () => {
        getproperties();
        searchRef.current.value = "";
    }

    function formatPrice(price) {
        if (typeof price !== 'number' || isNaN(price)) {
          return 'N/A'; 
        }
      
        if (price >= 10000000) {
    
          const formattedPrice = (price / 10000000).toFixed(2);
          return formattedPrice.endsWith('.00') ? formattedPrice.slice(0, -3) + ' Cr' : formattedPrice + ' Cr';
        } 
        else if (price >= 100000) {
          const formattedPrice = (price / 100000).toFixed(2);
          return formattedPrice.endsWith('.00') ? formattedPrice.slice(0, -3) + ' Lac' : formattedPrice + ' Lac';
        } else {
          return price.toLocaleString('en-IN');
        }
      }

    return (
        <AdminLayout>

            <MainBox>
                <Title>Property Management</Title>

                <TopDiv>
                    <div>
                        <Button onClick={() => navigate('/admin/createproperty')}>Create</Button>

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
                
                {
                    properties?.length > 0 ?
                    (<TableResponsive className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Location</th>
                                    <th>Price</th>
                                    <th style={{ textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (properties.map((property) => {
                                        return (<tr key={property._id}>
                                            <td>{property.title}</td>
                                            <td>{property.location}</td>
                                            <td>₹ {formatPrice(property.price)}</td>
                                            <td >
                                                <Btns>

                                                    <Button variant='warning' onClick={() => navigate(`/admin/editproperty/${property._id}`)}>Edit</Button>
                                                    <Button variant='danger' onClick={() => showDeleteModal(property._id, property.title)}>Delete</Button>
                                                </Btns>
                                            </td>
                                        </tr>)
                                    }))



                                }

                            </tbody>
                        </table>
                    </TableResponsive>)

                    : (<h2 style={{ textAlign: 'center', color: "#777" }}>No Search Results</h2>)

                }

                <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} message={deleteMessage} />
                <ToastContainer />
            </MainBox>

        </AdminLayout>

    )
}

export default Propmng