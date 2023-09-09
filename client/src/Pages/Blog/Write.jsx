import React from "react"
import { useState } from "react";
import { styled } from "styled-components";
import { useSelector } from "react-redux";
import UserLayout from "../../Components/user/UserLayout";
import { AddCircle, Image } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = styled.div`
width: 90vw;
    /* padding-top: 2vh;
    padding-bottom: 2vh; */
    padding: 2vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    /* align-items: center; */
`;
const WriteImg = styled.img`
    /* margin-left: 150px; */
    width: 40vw;
    height: 40vh;
    border-radius: 10px;
    object-fit: cover;
`;
const WriteForm = styled.form`
    position: relative;
    
`;

const WriteFormGroup = styled.div`
    /* margin-left: 150px; */
    display: flex;
    align-items: center;
    flex-direction: column;
`;


const WriteInput = styled.input`
    &:focus{
        outline: none;
    }
    font-size: 30px;
    border: none;
    padding: 20px;
    width: 70vw;
`;

const WriteSubmit = styled.button`
    position: absolute;
    top: 140px;
    right: 50px;
    background-color: teal;
    color: aliceblue;
    padding: 10px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
`;

const FixedTextareaContainer = styled.div`
  width: 80%; 
  max-width: 500px; 
  height: auto; 
  border: 3px solid #ccc; 
  padding: 10px; 
  display: flex;
  flex-direction: column; 

  @media (min-width: 768px) {
    max-width: 40vw; 
  }
`;

const FixedTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
`;

export default function Write() {
    const [title, setTitle] = useState("");
    const [tag1, setTag1] = useState("");
    const [tag2, setTag2] = useState("");
    const user = useSelector((state) => state.user.user)
    console.log(user)
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const navigate = useNavigate();
    const notify = (msg)=> toast(msg)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
        if (title === '' || description === '' ) {
            notify("Title and Description are required")
            return;
        }

        if (file && !allowedExtensions.exec(file.name)) {
            notify('Invalid file format. Only JPG, JPEG, PNG, or Webp images are allowed.');
            return;
          }

        const formData = new FormData();

        formData.append("image", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("username", user.username);
        formData.append("tag1", tag1);
        formData.append("tag2", tag2);
        formData.append("userId", user._id);

        try {
            await axiosInstance.post("/blog", formData)
                .then((res) => {
                    // window.location.replace("/blog/" + res.data._id);
                    navigate("/blogs")
                }
                )
                .catch(err => {
                    console.log(err)
                })

        } catch (err) {

        }

    }

    return (
        <UserLayout>
            <Wrapper>
                {file && (
                    <WriteImg
                        src={URL.createObjectURL(file)}
                        alt="" />
                )

                }

                <WriteForm onSubmit={handleSubmit}>
                    <WriteFormGroup>
                        <label htmlFor="fileInput">
                            Add Image <AddCircle />
                        </label>
                        <input type="file" id="fileInput" style={{ display: "none" }}
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <WriteInput type="text" placeholder="Title" autoFocus={true}
                            onChange={(e) => setTitle(e.target.value)} />

                        <WriteInput type="text" placeholder="tag 1" autoFocus={true}
                            onChange={(e) => setTag1(e.target.value)} />

                        <WriteInput type="text" placeholder="tag 2" autoFocus={true}
                            onChange={(e) => setTag2(e.target.value)} />

                    </WriteFormGroup>
                    <WriteFormGroup>


                        <FixedTextareaContainer>
                            <FixedTextarea
                                rows="4"
                                cols="50"
                                placeholder='write something'
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            />
                        </FixedTextareaContainer>
                    </WriteFormGroup>
                    <WriteSubmit type="submit">Publish</WriteSubmit>
                </WriteForm>
            </Wrapper>
                <ToastContainer/>
        </UserLayout>
    )
}