import React, { useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../Components/admin/AdminLayout';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
// import axiosInstance from '../../axios/axiosInstance';


const MainBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4vh;
`;


const Title = styled.h1`
  text-align: center;
  color:#36454F;

`;

const Create = styled.div`
  min-width: 40vw;
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
    height:auto;
`;

const Img = styled.img`
  height: 40vh;
`;

const Btns = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 5vh;
`;


const CreateBanner = () => {
  const axiosInstance = useAxiosPrivate()

  const navigate = useNavigate();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState([]);


  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setSelectedFile(file);
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;

      if (!allowedExtensions.exec(file.name)) {
        notify('Invalid file format. Only JPG, JPEG, PNG, or Webp images are allowed.');
        return;
      }

    const previewUrl =  URL.createObjectURL(file);
    setPreviewUrl(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;


    if (title === '' ) {
      notify("Title required")
      return;
  }

    const formData = new FormData();
      if (!allowedExtensions.exec(selectedFile.name)) {
        notify('Invalid file format. Only JPG, JPEG, PNG, or Webp images are allowed.');
        return;
      }
      formData.append('image', selectedFile)
    formData.append('title', title)
    
    formData.append('description', description)
    console.log(formData)

    await axiosInstance.post('/admin/addbanner', formData)
      .then((response) => {
        console.log(response.data.msg);
        navigate("/admin/bannermng");
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
    <AdminLayout>
      <MainBox>

        <Create>

          <Title>Add Banner</Title>

            <ImageBox>
                <Img src={previewUrl} alt="" />
                      
            </ImageBox>


          <Form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <Form.Group controlId="ControlFile">
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control type='text' name='title' ref={titleRef} />
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control as='textarea' rows={4} style={{ maxHeight: "15vh" }}
                name='description' ref={descriptionRef} />
            </Form.Group>


            <Btns>

              <Button type='submit'>Submit</Button>
              <Button onClick={() => navigate("/admin/bannermng")} variant='secondary'>Cancel</Button>

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

    </AdminLayout>
  )
}

export default CreateBanner