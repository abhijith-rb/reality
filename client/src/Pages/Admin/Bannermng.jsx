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
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
// import axiosInstance from '../../axios/axiosInstance';

const MainBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

`;


const Title = styled.h1`
  text-align: center;
  /* color: #96B6C5; */
  color: #36454F;

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

const Img = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 5px;
    object-fit: cover;
`;

const Bannermng = () => {
    const axiosInstance = useAxiosPrivate();
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const searchRef = useRef();
    const [bannerId, setbannerId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    console.log(banners)

    const showDeleteModal = (bannerid, title) => {
        setbannerId(bannerid);
        setDeleteMessage(`Are you sure you want to delete ${title}?`)
        setDisplayConfirmationModal(true)
    }
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false)
        setbannerId(null)
    }


    const submitDelete = () => {
        handleDelete();
        hideConfirmationModal();

    }

    const notify = (msg) => toast(msg);

    const handleDelete = async () => {
        try {
            if (bannerId) {
                await axiosInstance.delete(`/admin/deletebanner/${bannerId}`)
                    .then((response) => {
                        const updtdbanners = banners.filter((banner) => (
                            banner._id !== bannerId
                        ))
                        setBanners(updtdbanners)
                        setbannerId(null)
                        console.log("banner deleted successfully");
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

    const getbanners = async () => {
        await axiosInstance.get('/admin/getallbanners')
            .then((response) => {
                console.log(response.data);
                setBanners(response.data)
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    useEffect(() => {
        getbanners();
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault();
        const squery = searchRef.current.value;
        console.log(squery)
        if (squery) {
            await axiosInstance.get(`/admin/search-banner?squery=${squery}`)
                .then((response) => {
                    setBanners(response.data)
                })
                .catch((err) => {
                    console.log(err)
                    
                })
        }
    }

    const handleReset = () => {
        getbanners();
        searchRef.current.value = "";
    }


    return (
        <AdminLayout>

            <MainBox>
                <Title>Banner Management</Title>

                <TopDiv>
                    <div>
                        <Button onClick={() => navigate('/admin/createbanner')}>Create</Button>

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
                    banners?.length > 0 ?
                    (<TableResponsive className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Image</th>
                                    <th>Description</th>
                                    <th style={{ textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (banners.map((banner) => {
                                        return (<tr key={banner._id}>
                                            <td>{banner.title}</td>
                                            <td><Img src={PF + banner.image}  alt=''/></td>
                                            <td>{banner.description}</td>
                                            <td >
                                                <Btns>

                                                    <Button variant='warning' onClick={() => navigate(`/admin/editbanner/${banner._id}`)}>Edit</Button>
                                                    <Button variant='danger' onClick={() => showDeleteModal(banner._id, banner.title)}>Delete</Button>
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

export default Bannermng