import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UserLayout from '../../Components/user/UserLayout';
import axiosInstance from '../../axios/axiosInstance';
import LocationMap from '../../Components/LocationMap';
import axios from 'axios';
import { Close } from '@mui/icons-material';

const MainBox = styled.div`
  width: 100%;
  min-height: 150vh;
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
  border-radius: 10px;
  box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
  background-color: #B5CFD8;
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
border: 2px solid #7393A7;
background-color: #ffffff;
color: #777;
list-style: none;
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

const SgBoxDiv = styled.div`
width: 100%;
background-color: #ffffff;
border: 2px solid grey ;
border-radius: 10px;
    display: flex;
    z-index: 7;
  position: absolute;
  top: 70px;
  left: 0;
  @media (max-width:800px){
    flex-direction: column;
  }
`;

const UpdateProp = () => {
  const navigate = useNavigate();
  const path = useLocation();
  console.log(path)
  const propId = path.pathname.split("/")[2];
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const titleRef = useRef();
  const typeRef = useRef();
  const purposeRef = useRef();
  const locationRef = useRef();
  const priceRef = useRef();
  const areaRef = useRef();
  const descriptionRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [oldImgs, setOldImgs] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 28.6139, lng: 77.2090 })

  const [query, setQuery] = useState("");
  const [box, setBox] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSelect = (sgn) => {
    setBox(false)
    setQuery(sgn.name);
    getData(sgn.mapbox_id);
  }

  const handleQuery = (e) => {
    setBox(true)
    setQuery(e.target.value)
  }

  const getData = async (id) => {
    await axios.get(`https://api.mapbox.com/search/searchbox/v1/retrieve/${id}?session_token=${123}&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
      .then((res) => {
        console.log(res.data)
        console.log(res.data.features)
        console.log(res.data.features[0].geometry.coordinates)
        console.log(res.data.features[0].properties.name)
        const name = res.data.features[0].properties.name;
        const coords = res.data.features[0].geometry.coordinates;
        // setPlace({ name: name, coords: coords })
        console.log(coords)
        setCoordinates({ lat: coords[1], lng: coords[0] });

      })
      .catch((err) => {
        console.log(err)
      })
  }

  const suggest = async () => {
    await axios.get(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}
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
    console.log(query)
    suggest()
  }, [query])

  const getProperty = async () => {
    await axiosInstance.get(`/getproperty/${propId}`)
      .then((response) => {
        const property = response.data;
        console.log(property.images);

        titleRef.current.value = property.title;
        typeRef.current.value = property.type;
        purposeRef.current.value = property.purpose;
        // locationRef.current.value = property.location;
        setQuery(property.location)
        priceRef.current.value = property.price;
        areaRef.current.value = property.area;
        descriptionRef.current.value = property.description;
        property.coordinates && setCoordinates(property.coordinates)
        property.images && setOldImgs(property.images);
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
    const title = titleRef.current.value;
    const type = typeRef.current.value;
    const purpose = purposeRef.current.value;
    // const location = locationRef.current.value;
    const location = query;
    const price = priceRef.current.value;
    const area = areaRef.current.value;
    const description = descriptionRef.current.value;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;


    if (title === '' || type === '' || purpose === '' || location === '') {
      notify("Title, Type, Purpose and Location are required")
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

    formData.append('title', title)
    formData.append('type', type)
    formData.append('purpose', purpose)
    formData.append('location', location)
    formData.append('price', price)
    formData.append('area', area)
    formData.append('description', description)
    formData.append('coordinates', JSON.stringify(coordinates))
    console.log(title)
    await axiosInstance.post(`/updateproperty/${propId}`, formData)
      .then((response) => {
        console.log(response.data);
        navigate("/userprops");
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

      })
  }


  return (
    <UserLayout>
      <MainBox>

        <Edit>

          <Title>Edit Property</Title>

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

            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control type='text' name='title' ref={titleRef} />
            </Form.Group>

            <Form.Group controlId='type'>
              <Form.Label>Type</Form.Label>
              <Form.Select type='text' name='type' ref={typeRef}>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Plot">Plot</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='purpose'>
              <Form.Label>Purpose</Form.Label>
              <Form.Select type='text' name='purpose' ref={purposeRef}>
                <option value="Rent">Rent</option>
                <option value="Buy">Buy</option>
              </Form.Select>
            </Form.Group>


            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control type='number' name='price' ref={priceRef} min={0} />
            </Form.Group>
            <Form.Group controlId='area'>
              <Form.Label>Area</Form.Label>
              <Form.Control type='text' name='area' ref={areaRef} />
            </Form.Group>


            <LocDiv >
              <Form.Group controlId='location' >
                <Form.Label>Location</Form.Label>
                <Form.Control type='text' name='location' value={query} onChange={handleQuery} />
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
                    <Close onClick={() => setBox(false)} style={{ cursor: "pointer" }} />

                  </SgBoxDiv>
                }
              </Form.Group>

            </LocDiv>

            {/* <LocationMap coordinates={coordinates} setCoordinates={setCoordinates} edit={true} /> */}

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control as='textarea' rows={4} style={{ maxHeight: "15vh" }}
                name='description' ref={descriptionRef} />
            </Form.Group>

            <Btns>

              <Button type='submit'>Submit</Button>
              <Button onClick={() => navigate("/userprops")} variant='secondary'>Cancel</Button>
            </Btns>

          </Form>
        </Edit>



        <ToastContainer />
      </MainBox>

    </UserLayout>
  )
}

export default UpdateProp