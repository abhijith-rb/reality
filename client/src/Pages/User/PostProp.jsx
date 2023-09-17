import React, { useRef, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import UserLayout from '../../Components/user/UserLayout';
import axiosInstance from '../../axios/axiosInstance';
import LocationMap from '../../Components/LocationMap';

const MainBox = styled.div`
  width: 100%;
  min-height: 150vh;
  /* background-color: yellow; */
`;


const Title = styled.h1`
  text-align: center;
`;

const Create = styled.div`
  width: 100%;
  padding-top: 3vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 2px solid red; */
`;

const ImageBox = styled.div`
    width: 50%;
    height:40vh;
    /* background-color: aquamarine; */
`;

const Img = styled.img`
  height: 40vh;
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

const PostProp = () => {
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate();
  const titleRef = useRef();
  const typeRef = useRef();
  const purposeRef = useRef();
  const locationRef = useRef();
  const priceRef = useRef();
  const areaRef = useRef();
  const descriptionRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [previewUrls, setPreviewUrls] = useState([]);
  const [coordinates,setCoordinates] = useState({lat:28.6139, lng:77.2090})


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
    const location = locationRef.current.value;
    const price = priceRef.current.value;
    const area = areaRef.current.value;
    const description = descriptionRef.current.value;
    const ownerId = user._id;
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
    formData.append('ownerId', ownerId)
    formData.append('coordinates', JSON.stringify(coordinates))
    console.log(formData)

    await axiosInstance.post('/addproperty', formData)
      .then((response) => {
        console.log(response.data.msg);
        navigate("/userprops");
      }).catch((err) => {
        console.log(err)

      })
  }

  const notify = (msg) => toast.warn(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  return (
    <UserLayout>
      <MainBox>

        <Create>

          <Title>Add Property</Title>

          {previewUrls.length > 0 &&
            <ImageBox>

              <Carousel >

                {
                  [...previewUrls].map((elem, i) => {
                    return (
                      <CarouselDiv key={i}>
                        <Img src={elem} alt="" />

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


            <Form.Group controlId='location'>
              <Form.Label>Location</Form.Label>
              <Form.Control type='text' name='location' ref={locationRef} />
            </Form.Group>

            <LocationMap coordinates={coordinates} setCoordinates={setCoordinates} edit={true}/>

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
        </Create>


        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

      </MainBox>

    </UserLayout>
  )
}

export default PostProp