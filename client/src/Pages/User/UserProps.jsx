import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap'
import DeleteConfirmation from '../../utils/DeleteConfirmation'
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import UserLayout from '../../Components/user/UserLayout';
import axiosInstance from '../../axios/axiosInstance';
import { Apartment, Business, CardMembership, CurrencyRupee, Preview } from '@mui/icons-material';


const MainBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left:5vw;
  padding-right:5vw;

`;

const OrderCardBlue = styled.div`
  color: #fff;
  background: linear-gradient(45deg,#4099ff,#73b4ff);
  border-radius: 5px;
  -webkit-box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  border: none;
  margin-bottom: 30px;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  height: 24vh;
`;
const OrderCardYellow = styled.div`
  color: #fff;
  background: linear-gradient(45deg,#FFB64D,#ffcb80);
  border-radius: 5px;
  -webkit-box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  border: none;
  margin-bottom: 30px;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  height: 24vh;

`;
const OrderCardPink = styled.div`
  color: #fff;
  background: linear-gradient(45deg,#FF5370,#ff869a);
  border-radius: 5px;
  -webkit-box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  border: none;
  margin-bottom: 30px;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  height: 24vh;

`;

const CardBlock = styled.div`
  padding: 25px;
`;

const Head2 = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  text-align: center;
  color:#36454F;
  margin-bottom: 3vh;
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
  margin-bottom: 3vh;
  max-width: 90vw;
  max-height: 60vh;
  border-radius: 10px;
  box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
  background-color: #ffffff;

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
    const [cardDeets, setCardDeets] = useState({})
    const user = useSelector((state) => state.user.user)
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

    const notify = (msg) => toast(msg);

    const getCardDeets = async()=>{
        
        await axiosInstance.get(`/ownerdashboard/${user._id}`)
        .then((res)=>{
          console.log(res.data)
          setCardDeets(res.data)
        })
    
      }

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

                    })
            }
        } catch (error) {
            console.log(error)
        }

    }

    const getuserproperties = async () => {
        await axiosInstance.get(`/getuserprops/${user._id}`)
            .then((response) => {
                console.log(response.data);
                setProperties(response.data)
            })
            .catch((err) => {
                console.log(err)

            })
    }

    useEffect(() => {
        getCardDeets();
        getuserproperties();
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault();
        const squery = searchRef.current.value;
        console.log(squery)
        if (squery) {
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
        <UserLayout>

            <MainBox>

                <Title>Owner Dashboard</Title>
                <div className="row">

                    <div className="col-md-4 col-xl-4">
                        <OrderCardBlue>
                            <CardBlock>
                                <h3 className="m-b-20">Property Views</h3>
                                <Head2 ><Preview style={{ fontSize: '35px' }} /><span>{cardDeets?.views}</span></Head2>
                                {/* <p className="m-b-0">Completed Orders<Fright className="f-right">351</Fright></p> */}
                            </CardBlock>
                        </OrderCardBlue>
                    </div>

                    <div className="col-md-4 col-xl-4">
                        <OrderCardYellow>
                            <CardBlock>
                                <h3 className="m-b-20">My Listings</h3>
                                <Head2><Business style={{ fontSize: '35px' }} /><span>{cardDeets?.ownerProps}</span></Head2>
                                {/* <p className="m-b-0">Completed Orders<Fright className="f-right">351</Fright></p> */}
                            </CardBlock>
                        </OrderCardYellow>
                    </div>

                    <div className="col-md-4 col-xl-4">
                        <OrderCardPink onClick={()=>navigate("/subscribe")}>
                            <CardBlock>
                                <h3 className="m-b-20">Subscription</h3>
                                <Head2><CardMembership style={{ fontSize: '35px' }} /><span>{cardDeets?.subDoc?.plan.toUpperCase()}</span></Head2>
                                <p style={{marginTop:"4vh"}} className="m-b-0">Valid upto: {cardDeets?.subDoc?.endDate.split('T')[0]}</p>
                            </CardBlock>
                        </OrderCardPink>
                    </div>

                  
                </div>

                <h2>Listed Properties</h2>

                <TopDiv>
                    <div>
                        <Button onClick={() => navigate('/postproperty')}>Create</Button>

                    </div>

                    <div>

                        <Form onSubmit={handleSearch} className='searchForm' style={{ width: "100%", display: "flex", alignItems: "center" }}>
                            <Form.Group controlId="formBasicInput"  >
                                <Form.Control type="text" name='search' ref={searchRef} placeholder="Search here..." />
                            </Form.Group>
                            <Button type='submit' variant='outline-secondary'><SearchIcon /></Button>
                            <Button onClick={handleReset} variant='outline-warning'><RestartAltIcon /></Button>
                        </Form>
                    </div>

                </TopDiv>

                {properties &&
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
                                        return (<tr key={property._id} onClick={()=>navigate(`/post-detail/${property._id}`)} 
                                        style={{cursor:"pointer"}}>
                                            <td>{property.title}</td>
                                            <td>{property.location}</td>
                                            <td>₹ {formatPrice(property.price)}</td>
                                            <td >
                                                <Btns>

                                                    <Button variant='warning' onClick={(e) =>{e.stopPropagation(); navigate(`/updateproperty/${property._id}`)}}>Edit</Button>
                                                    <Button variant='danger' onClick={(e) =>{e.stopPropagation(); showDeleteModal(property._id, property.title)}}>Delete</Button>
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

        </UserLayout>

    )
}

export default UserProps