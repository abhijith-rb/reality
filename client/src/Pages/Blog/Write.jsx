import React from "react"
import { useState } from "react";
import { styled } from "styled-components";
import { useSelector } from "react-redux";
import UserLayout from "../../Components/user/UserLayout";
import { AddCircle, Image } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../axios/axiosInstance";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "react-bootstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Wrapper = styled.div`
    width: 90vw;
    padding: 2vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
`;
const WriteImg = styled.img`
    width: 40vw;
    height: 40vh;
    border-radius: 10px;
    object-fit: cover;
    @media (max-width: 800px){
        width: 90vw;
    }
`;
const WriteForm = styled.form`
    position: relative;
    
`;

const WriteFormGroup = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
`;

const DescNPublish = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
`;

const WriteInput = styled.input`
    &:focus{
        outline: none;
    }
    font-size: 18px;
    border: 1px solid grey;
    padding: 20px;
    width: 30vw;
    border-radius: 5px;
    @media (max-width: 800px){
        width: 80vw;
    }
`;

const WriteSubmit = styled.button`
    background-color: #6C737E;
    color: aliceblue;
    padding: 10px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
`;

const FixedTextareaContainer = styled.div`
  width: 80%; 
  max-width: 40vw; 
 border-radius: 5px;
  height: auto; 
  padding: 10px; 
  display: flex;
  flex-direction: column; 

  @media (max-width: 1000px) {
    max-width: 85vw;
  }
`;

const FixedTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  outline: none;
  padding: 1vh 2vw;
  margin: 0;
  border-radius: 10px;
  border: 3px solid #777; 

`;

const Btns = styled.div`
    margin-top: 2vh;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

export default function Write() {
    const axiosInstance = useAxiosPrivate()

    const [title, setTitle] = useState("");
    const [tag1, setTag1] = useState("");
    const [tag2, setTag2] = useState("");
    const user = useSelector((state) => state.user.user)
    console.log(user)
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const navigate = useNavigate();
    const notify = (msg) => toast(msg)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
        if (title === '' || description === '') {
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

                <WriteForm onSubmit={handleSubmit}>
                    <WriteFormGroup>
                        {file && (
                            <WriteImg
                                src={URL.createObjectURL(file)}
                                alt="" />
                        )

                        }
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
                    
                    <DescNPublish>


                        <FixedTextareaContainer>
                            <FixedTextarea
                                rows="7"
                                cols="55"
                                placeholder='write something'
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            />
                        </FixedTextareaContainer>

                        <Btns>
                            <Button variant="outline-primary" type="submit">Publish</Button>
                            <Button variant="outline-secondary" onClick={()=>navigate("/blogs")}>Cancel</Button>

                        </Btns>
                    </DescNPublish>
                </WriteForm>

            </Wrapper>
            <ToastContainer />
        </UserLayout>
    )
}