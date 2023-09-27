import React from 'react';
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react";
import { Link } from "react-router-dom"
import DeleteConfirmation from '../../utils/DeleteConfirmation';
import axiosInstance from '../../axios/axiosInstance';
import { useSelector } from 'react-redux';
import UserLayout from '../../Components/user/UserLayout';
import { styled } from 'styled-components';
import { Delete,Edit } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = styled.div`
    height: fit-content;
`;
const SinglePostWrapper = styled.div`
width: 100%;
    display: flex;
    flex-direction: column;
`;

const ImgContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 2px solid red; */
`;

const SinglePostImg = styled.img`
    width: 50vw;
    height:50vh;
    border-radius: 5px;
    object-fit: cover;

`;
const SinglePostTitle = styled.h1`
    text-align: center;
    margin: 10px;
    font-size: 20px;
    font-family: 'Lora', serif;

`;
const SinglePostTitleInput = styled.input`
    &:focus{
    outline:none;

    }
    text-align: center;
    margin: 10px;
    font-size: 20px;
    font-family: 'Lora', serif;
    border: none;
    border-bottom: 1px solid lightgray;
    color: gray;

`;

const SinglePostEdit = styled.div`
    margin-left: 10px;
    cursor: pointer;
    float: right;
    font-size: 16px;
`;


const SinglePostInfo = styled.div`
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-family: 'Varela Round', sans-serif;
    color: #79AC78;
`;
const SinglePostDesc = styled.p`
    &::first-letter{
        margin-left: 20px;
    font-size: 30px;
    font-weight: 600;
    }
    color:#666;
    font-size: 18px;
    line-height: 25px;
`;


const SinglePostDescInput = styled.textarea`
    &:focus{
    outline: none;

    }
    border: none;
    color:#666;
    font-size: 18px;
    line-height: 25px;
`;

const SinglePostButton = styled.button`
    width: 100px;
    border: none;
    background-color: teal;
    color: white;
    padding: 5px;
    border-radius: 10px;
    cursor: pointer;
    align-self: flex-end;
    margin-top: 20px;
`;
const SinglePostAuthor = styled.span`
    flex: 35%;
`;
const Categories = styled.div`
    flex: 50%;
    display: flex;
    justify-content: first baseline;
    
`;

const SinglePostDate = styled.span`
    flex: 15%;
    
`;
const UpdateImg = styled.div`
    display: flex;
    margin-left: 20px;
    margin-top: 5px;
`;
const UpdIconDiv = styled.div`
    width: fit-content;
`;
const UpdImgDiv = styled.div`
    width: fit-content;
    margin-left: 10px;
`;
const UpdIcon = styled.i`
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 1px solid;
    display:flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: rgb(12, 54, 54);
    cursor: pointer;
`;
const UpdImg = styled.img`
    width: 120px;
    height: 80px;
`;


const SingleBlog = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const location = useLocation();
    console.log(location)
    const blogId = location.pathname.split("/")[2];
    console.log(blogId)
    const [post, setPost] = useState({})   
    const user = useSelector((state) => state.user.user)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [updateMode, setUpdateMode] = useState(false)
    const [tag1, setTag1] = useState("")
    const [tag2, setTag2] = useState("")
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [file, setFile] = useState(null);
    const navigate = useNavigate()
    const notify = (msg)=> toast(msg)


    const showDeleteModal = () => {
        setDeleteMessage(`Are you sure you want to delete ${post.title} ?`)
        setDisplayConfirmationModal(true);
    }
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };
    const submitDelete = () => {
        handleDelete()
        setDisplayConfirmationModal(false)
    }

    useEffect(() => {
        const getPost = async () => {
            const res = await axiosInstance.get(`/blog/${blogId}`)
            setPost(res.data)
            setTitle(res.data.title)
            setDescription(res.data.description)
            setTag1(res.data.tags[0])
            setTag2(res.data.tags[1])
        }
        getPost()
    }, [blogId]);

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/blog/${blogId}` , { data: { username: user.username, userId: user._id } });
            navigate("/blogs");
        } catch (err) {
            console.log(err)
        }
    }

    const handleUpdate = async () => {

        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
        if (title === '' || description === '' ) {
            notify("Title and Description are required")
            return;
        }

        if (file && !allowedExtensions.exec(file?.name)) {
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
            await axiosInstance.put(`/blog/${blogId}`  , formData)
                .then((res) => {
                    window.location.reload();
                })
            //setUpdateMode(false);
        } catch (err) {
            console.log(err)
        }
    }

    console.log(post)
    
    return (
        <UserLayout>
            <Wrapper>
                <SinglePostWrapper>

                    <ImgContainer>
                        <SinglePostImg
                            src={post?.image ? PF + post.image : "/images/noPropImg.png"}
                            alt="" />
                    </ImgContainer>

                    <UpdateImg>
                        <UpdIconDiv>
                            {updateMode && <label htmlFor="fileInput">
                                <UpdIcon className="updIcon fas fa-plus"></UpdIcon>Add/Update Pic</label>}
                            {updateMode && <input type="file" id="fileInput" style={{ display: "none" }}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            }
                        </UpdIconDiv>
                        <UpdImgDiv>
                            {file && (
                                <UpdImg
                                    src={URL.createObjectURL(file)}
                                    alt="" />
                            )}
                        </UpdImgDiv>
                    </UpdateImg>
                    {updateMode ? <SinglePostTitleInput type="text" value={title}
                        autoFocus onChange={(e) => setTitle(e.target.value)} /> : (
                        <SinglePostTitle>
                            {title}
                            {post.userId === user?._id &&
                                <SinglePostEdit>
                                    <Edit onClick={() => setUpdateMode(true)} style={{color:"teal"}}/>
                                    <Delete onClick={showDeleteModal} style={{color:"tomato"}}/>
                                </SinglePostEdit>}
                        </SinglePostTitle>
                    )}

                    <SinglePostInfo>
                        <SinglePostAuthor>
                            Author:{' '}
                            <Link to={`/?uId=${post.userId}`} className="link">
                                <b>{post.username}</b>
                            </Link>
                        </SinglePostAuthor>
                        <Categories>
                            <div className='catHead'>
                                {!updateMode && <span>Tags:</span>}
                            </div>
                            <div className='cate1'>
                                {updateMode ? <input type="text" value={tag1}
                                    className="cate1" autoFocus
                                    onChange={(e) => setTag1(e.target.value)} /> : (
                                    <Link to={`/?tag=${tag1}`} className='link' >
                                        <b>{tag1 + ","}</b>
                                    </Link>
                                )
                                }
                            </div>
                            <div className='cate2'>
                                {updateMode ? <input type="text" value={tag2}
                                    className="cate2" autoFocus
                                    onChange={(e) => setTag2(e.target.value)} /> : (
                                    <Link to={`/?tag=${tag2}`} className='link' >
                                        <b>{tag2}</b>
                                    </Link>
                                )
                                }
                            </div>
                        </Categories>

                        <SinglePostDate>{new Date(post.createdAt).toDateString()}</SinglePostDate>
                    </SinglePostInfo>
                    {updateMode ? (
                        <SinglePostDescInput value={description}
                            onChange={(e) => setDescription(e.target.value)} />
                    ) : (
                        <SinglePostDesc>
                            {description}
                        </SinglePostDesc>
                    )}
                    {updateMode &&
                        (<SinglePostButton onClick={handleUpdate}>Update</SinglePostButton>)}

                </SinglePostWrapper>

                <div className='delt'>

                    <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} message={deleteMessage} />
                </div>
            </Wrapper>
        </UserLayout>

    )
}

export default SingleBlog