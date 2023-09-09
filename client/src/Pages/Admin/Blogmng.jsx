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
import {format} from 'date-fns'

const MainBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

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

const Blogmng = () => {

    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const searchRef = useRef();
    const [blogId, setBlogId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    console.log(blogs)

    const showDeleteModal = (blogid, title) => {
        setBlogId(blogid);
        setDeleteMessage(`Are you sure you want to delete ${title}?`)
        setDisplayConfirmationModal(true)
    }
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false)
        setBlogId(null)
    }


    const submitDelete = () => {
        handleDelete();
        hideConfirmationModal();

    }

    const notify = (msg) => toast(msg);

    const handleDelete = async () => {
        try {
            if (blogId) {
                await axiosInstance.delete(`/blog/${blogId}`)
                    .then((response) => {
                        const updtdblogs = blogs.filter((blog) => (
                            blog._id !== blogId
                        ))
                        setBlogs(updtdblogs)
                        setBlogId(null)
                        console.log("blog deleted successfully");
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

    const getblogs = async () => {
        await axiosInstance.get('/blog')
            .then((response) => {
                console.log(response.data);
                setBlogs(response.data)
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    useEffect(() => {
        getblogs();
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault();
        const squery = searchRef.current.value;
        console.log(squery)
        if (squery) {
            await axiosInstance.get(`/blog?squery=${squery}`)
                .then((response) => {
                    setBlogs(response.data)
                })
                .catch((err) => {
                    console.log(err)
                    
                })
        }
    }

    const handleReset = () => {
        getblogs();
        searchRef.current.value = "";
    }

    

  return (
    <AdminLayout>

            <MainBox>
                <Title>Blog Management</Title>

                <TopDiv>
                    <div>
                        <Button onClick={() => navigate('/admin/createblog')}>Create</Button>

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
                    blogs?.length > 0 ?
                    <TableResponsive className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Posted Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (blogs.map((blog) => {
                                        return (
                                        <tr key={blog._id} style={{cursor:'pointer'}} onClick={()=>navigate(`/admin/blog/${blog._id}`)}>
                                            <td>{blog.title}</td>
                                            <td>{blog.username}</td>
                                            <td> {format(new Date(blog.createdAt), 'dd/MM/yyyy')}</td>
                              
                                        </tr>
                                        )
                                    }))



                                }

                            </tbody>
                        </table>
                    </TableResponsive>

                    : <h2 style={{ textAlign: 'center', color: "#777" }}>No Search Results</h2>

                }

                <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} message={deleteMessage} />
                <ToastContainer />
            </MainBox>

        </AdminLayout>
  )
}

export default Blogmng