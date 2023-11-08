import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from '../../Components/admin/AdminLayout';
import axiosInstance from '../../axios/axiosInstance';
import axios from 'axios';
import { Close } from '@mui/icons-material';

const MainBox = styled.div`
  width: 100%;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4vh;
`;


const Title = styled.h1`
  text-align: center;
  color:#36454F;

`;

const Edit = styled.div`
  width: fit-content;
  padding:2vh 3vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #ADC4CE;
  border-radius: 5px;
  background-color: #96B6C5;
`;

const ImageBox = styled.div`
    /* width: 50%; */
    height:40vh;
`;

const Btns = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 5vh;
`;

const CarouselDiv = styled.div`
    width: 100%;
    max-height: 40vh;
    background-color: black;
`;

const Img = styled.img`
  height: 40vh;
`;

const Ul = styled.ul`
width: 100%;
height: auto;
max-height: 60vh;
background-color: #ffffff;
color: #777;
list-style: none;
margin: 0;
padding-left: 5px;
border-radius: 10px;
`;

const Li = styled.li`
  cursor:pointer;
  &:hover{
    color: #7393A7;
  }
`;

const LocDiv = styled.div`
  position: relative;
`;

const CheckDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3vh;
`;

const SgBoxDiv = styled.div`
    width: 100%;
    background-color: #ffffff;
    border: 2px solid #7393A7;
    border-radius: 10px;
    display: flex;
    z-index: 7;
    position: absolute;
    top: 70px;
    left: 0;
    padding: 1vh 1vw;
    @media (max-width:800px){
        flex-direction: column;
    }
`;

const EditProp = () => {
    const navigate = useNavigate();
    const path = useLocation();
    console.log(path)
    const propId = path.pathname.split("/")[3];
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [property, setProperty] = useState({
        title: "",
        type: "Residential",
        purpose: "Buy",
        location: "",
        price: 5000,
        area: "",
        description: "",
        bed: 1,
        bath: 1,
        tfloors: 1,
        age: 1,
        floor: 1,
        wash: 1,
        lift: 1,
        wall: false,
        built: false,
        opens: 1,
    })


    const [selectedFiles, setSelectedFiles] = useState([]);
    const [oldImgs, setOldImgs] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [coordinates, setCoordinates] = useState({ lat: 28.6139, lng: 77.2090 })

    const [box, setBox] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [page, setPage] = useState(1);

    const handleFirst = () => {
        if (property.title === '' || property.type === ''
            || property.purpose === '' || property.location === '') {
            notify("Title, Type, Purpose and Location are required")
            return;
        }
        setPage(2);
    }

    const handleSecond = () => {
        setPage(3)
    }

    const handleSelect = (sgn) => {
        setBox(false)
        setProperty((prev) => ({ ...prev, location: sgn.name }))
        getData(sgn.mapbox_id);
    }

    const handlelocation = (e) => {
        setBox(true)
        setProperty((prev) => ({ ...prev, location: e.target.value }))
    }

    const getData = async (id) => {
        await axios.get(`https://api.mapbox.com/search/searchbox/v1/retrieve/${id}?session_token=${123}&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
            .then((res) => {
                console.log(res.data)
                console.log(res.data.features)
                console.log(res.data.features[0].geometry.coordinates)
                console.log(res.data.features[0].properties.name)
                const coords = res.data.features[0].geometry.coordinates;
                console.log(coords)
                setCoordinates({ lat: coords[1], lng: coords[0] });

            })
            .catch((err) => {
                console.log(err)
            })
    }

    const suggest = async () => {
        await axios.get(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${property.location}
        &session_token=${123}&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
            .then((res) => {
                console.log(res)
                console.log(res.data)
                setSuggestions(res.data.suggestions)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        console.log(property.location)
        suggest()
    }, [property.location])

    const getProperty = async () => {
        await axiosInstance.get(`/getproperty/${propId}`)
            .then((response) => {
                const fetchedData = response.data;
                console.log(fetchedData.images);
                setProperty((prev) => ({ ...prev, ...fetchedData }))

                fetchedData.coordinates && setCoordinates(fetchedData.coordinates)
                fetchedData.images && setOldImgs(fetchedData.images);
            })
            .catch((err) => {
                console.log(err)

            })
    }

    useEffect(() => {

        getProperty();

    }, [propId])


    const handleFileChange = (event) => {
        event.preventDefault();
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;

        for (const file of files) {
            if (!allowedExtensions.exec(file.name)) {
                notify('Invalid file format. Only JPG, JPEG, PNG, or Webp images are allowed.');
                return;
            }
        }
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(previewUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;

        if (property.title === '' || property.type === '' || property.purpose === '' || property.location === '') {
            notify("Title, Type, Purpose and Location are required")
            return;
        }

        if (property.price < 1000 || property.area === '') {
            notify("Enter a valid price and Area")
            return;
        }

        const formData = new FormData();
        for (const file of selectedFiles) {
            if (!allowedExtensions.exec(file.name)) {
                notify('Invalid file format. Only JPG, JPEG, PNG, or Webp images are allowed.');
                return;
            }
            formData.append('images', file)
        }

        formData.append('title', property.title)
        formData.append('type', property.type)
        formData.append('purpose', property.purpose)
        formData.append('location', property.location)
        formData.append('price', property.price)
        formData.append('area', property.area)
        formData.append('description', property.description)
        formData.append('coordinates', JSON.stringify(coordinates))

        if (property.type === "Residential") {
            formData.append('bed', property.bed)
            formData.append('bath', property.bath)
            formData.append('tfloors', property.tfloors)
            formData.append('age', property.age)

        } else if (property.type === "Commercial") {
            formData.append('floor', property.floor)
            formData.append('wash', property.wash)
            formData.append('lift', property.lift)

        } else if (property.type === "Plot") {
            formData.append('wall', property.wall)
            formData.append('built', property.built)
            formData.append('opens', property.opens)

        }

        await axiosInstance.post(`/updateproperty/${propId}`, formData)
            .then((response) => {
                console.log(response.data);
                navigate("/admin/propmng");
            }).catch((err) => {
                console.log(err)

            })
    }
    console.log(selectedFiles);
    console.log(oldImgs);

    const notify = (msg) => toast(msg);

    const imgremover = async (filename) => {
        await axiosInstance.delete(`/deleteimg/${propId}?filename=${filename}`)
            .then((response) => {
                const updatedArray = response.data.updatedArray;
                setOldImgs(updatedArray);
                notify(response.data.msg);
            })
            .catch((err) => {
                console.log(err.response.data.msg);
                notify(err.response.data.msg);

            })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [page])

    return (
        <AdminLayout>
            <MainBox>
                <Edit>

                    <Title>Edit Property</Title>

                    {
                        page === 1 &&

                        <Form style={{ marginTop: "1rem" }}>


                            <Form.Group controlId='title'>
                                <Form.Label>Title</Form.Label>
                                <Form.Control type='text' name='title' value={property.title}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, title: e.target.value }))
                                    } />
                            </Form.Group>
                            <Form.Group controlId='type'>
                                <Form.Label>Type</Form.Label>
                                <Form.Select type='text' name='type' value={property.type}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, type: e.target.value }))
                                    }>
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Plot">Plot</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId='purpose'>
                                <Form.Label>Purpose</Form.Label>
                                <Form.Select type='text' name='purpose' value={property.purpose}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, purpose: e.target.value }))
                                    }>
                                    <option value="Buy">Buy</option>
                                    <option value="Rent">Rent</option>
                                </Form.Select>
                            </Form.Group>

                            <LocDiv >
                                <Form.Group controlId='location' >
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control type='text' name='location' value={property.location} onChange={handlelocation} />
                                    {box &&
                                        suggestions?.length > 0 &&
                                        <SgBoxDiv>
                                            <Ul>
                                                {
                                                    suggestions?.map((sgn) => (
                                                        <Li onClick={() => handleSelect(sgn)}>{sgn.name}</Li>
                                                    ))
                                                }
                                            </Ul>
                                            <Close onClick={() => setBox(false)} style={{ cursor: "pointer", color: "#444" }} />

                                        </SgBoxDiv>
                                    }
                                </Form.Group>

                            </LocDiv>

                            <Btns>

                                <Button onClick={() => navigate("/admin/propmng")} variant='secondary'>Cancel</Button>
                                <Button type='button' onClick={handleFirst}>Next</Button>

                            </Btns>

                        </Form>

                    }

                    {page === 2 &&
                        property.type === "Residential"
                        &&
                        <Form>
                            <Form.Group controlId='bed'>
                                <Form.Label>Bedrooms</Form.Label>
                                <Form.Control type='number' name='bed' value={property.bed} min={0}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, bed: e.target.value }))}
                                />
                            </Form.Group>
                            <Form.Group controlId='bath'>
                                <Form.Label>Bathrooms</Form.Label>
                                <Form.Control type='number' name='bath' value={property.bath} min={0}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, bath: e.target.value }))}

                                />
                            </Form.Group>
                            <Form.Group controlId='tfloors'>
                                <Form.Label>Total floors</Form.Label>
                                <Form.Control type='number' name='tfloors' value={property.tfloors} min={0}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, tfloors: e.target.value }))}

                                />
                            </Form.Group>
                            <Form.Group controlId='age'>
                                <Form.Label>Property Age</Form.Label>
                                <Form.Control type='number' name='age' value={property.age} min={0}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, age: e.target.value }))}

                                />
                            </Form.Group>

                            <Btns>

                                <Button onClick={() => setPage(1)} variant='secondary'>Back</Button>
                                <Button type='button' onClick={handleSecond}>Next</Button>

                            </Btns>
                        </Form>
                    }

                    {page === 2 &&
                        property.type === "Commercial"
                        &&
                        <Form>
                            <Form.Group controlId='floor'>
                                <Form.Label>Floor</Form.Label>
                                <Form.Control type='number' name='floor' value={property.floor} min={0}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, floor: e.target.value }))}

                                />
                            </Form.Group>
                            <Form.Group controlId='wash'>
                                <Form.Label>Washrooms</Form.Label>
                                <Form.Control type='number' name='wash' value={property.wash} min={0}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, wash: e.target.value }))}

                                />
                            </Form.Group>
                            <Form.Group controlId='lift'>
                                <Form.Label>Lifts</Form.Label>
                                <Form.Control type='number' name='lift' value={property.lift} min={0}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, lift: e.target.value }))}

                                />
                            </Form.Group>

                            <Btns>

                                <Button onClick={() => setPage(1)} variant='secondary'>Back</Button>
                                <Button type='button' onClick={handleSecond}>Next</Button>

                            </Btns>
                        </Form>
                    }

                    {page === 2 &&
                        property.type === "Plot"
                        &&
                        <Form>
                            <Form.Group controlId='openSides'>
                                <Form.Label>Open Sides</Form.Label>
                                <Form.Control type='number' name='openSides' value={property.opens} min={0}
                                    onChange={(e) => setProperty((prev) => ({ ...prev, opens: e.target.value }))}

                                />
                            </Form.Group>

                            <Form.Group controlId='wall'>
                                <CheckDiv>
                                    <Form.Label>Boundary wall</Form.Label>
                                    <Form.Check type='checkbox' name='wall' checked={property.wall}
                                        onChange={(e) => setProperty((prev) => ({ ...prev, wall: e.target.checked }))}

                                    />

                                </CheckDiv>
                            </Form.Group>
                            <Form.Group controlId='built'>
                                <CheckDiv>
                                    <Form.Label>Any Construction done</Form.Label>
                                    <Form.Check type='checkbox' name='built' checked={property.built}
                                        onChange={(e) => setProperty((prev) => ({ ...prev, built: e.target.checked }))}

                                    />
                                </CheckDiv>
                            </Form.Group>


                            <Btns>

                                <Button onClick={() => setPage(1)} variant='secondary'>Back</Button>
                                <Button type='button' onClick={handleSecond}>Next</Button>

                            </Btns>
                        </Form>
                    }

                    {page === 3 &&
                        <>

                            {[...oldImgs, ...previewUrls].length > 0 &&
                                <ImageBox>

                                    <Carousel >

                                        {
                                            [...oldImgs, ...previewUrls].map((elem, i) => {
                                                return (
                                                    <CarouselDiv key={i}>
                                                        <Img src={elem.filename ? PF + elem.filename : elem} alt="" />
                                                        {elem.filename &&
                                                            <>


                                                                <DeleteIcon onClick={() => imgremover(elem.filename)}
                                                                    style={{ color: "red", cursor: "pointer", position: "absolute", right: "35px", top: "10px" }} />
                                                            </>

                                                        }
                                                    </CarouselDiv>
                                                )
                                            })}


                                    </Carousel>

                                </ImageBox>
                            }

                            <Form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
                                <Form.Group controlId="ControlFile">
                                    <Form.Control
                                        type="file"
                                        name="images"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId='price'>
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type='number' name='price'
                                        value={property.price} min={0}
                                        onChange={(e) => setProperty((prev) => ({ ...prev, price: e.target.value }))}
                                    />
                                </Form.Group>

                                <Form.Group controlId='area'>
                                    <Form.Label>Area</Form.Label>
                                    <Form.Control type='text' name='area'
                                        value={property.area}
                                        onChange={(e) => setProperty((prev) => ({ ...prev, area: e.target.value }))}
                                    />
                                </Form.Group>

                                <Form.Group controlId='description'>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as='textarea' rows={4} style={{ maxHeight: "15vh" }}
                                        name='description' value={property.description}
                                        onChange={(e) => setProperty((prev) => ({ ...prev, description: e.target.value }))}
                                    />
                                </Form.Group>

                                <Btns>

                                    <Button onClick={() => setPage(2)} variant='secondary'>Back</Button>
                                    <Button type='submit'>Submit</Button>

                                </Btns>
                            </Form>
                        </>

                    }

                </Edit>



                <ToastContainer />
            </MainBox>

        </AdminLayout>
    )
}

export default EditProp