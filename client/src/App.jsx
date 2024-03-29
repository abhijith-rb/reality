import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useDispatch} from 'react-redux';
import UserProtectedRoute from './utils/UserProtectedRoute';
import Home from './Pages/User/Home';
import Login from './Pages/User/Login'
import Register from './Pages/User/Register';
import Profile from './Pages/User/Profile';
import AdminProtectedRoute from './utils/AdminProtectedRoute.jsx';
import Dashboard from './Pages/Admin/Dashboard';
import CreateUser from './Pages/Admin/CreateUser';
import EditUser from './Pages/Admin/EditUser';
import Usermng from './Pages/Admin/Usermng';
import Propmng from './Pages/Admin/Propmng';
import CreateProp from './Pages/Admin/CreateProp';
import EditProp from './Pages/Admin/EditProp';
import AuthRoute from './utils/AuthRoute';
import Notfound from './Pages/Notfound';
import { updateUser } from './redux/userReducer';
import styled from 'styled-components';
import UserProps from './Pages/User/UserProps';
import PostProp from './Pages/User/PostProp';
import UpdateProp from './Pages/User/UpdateProp';
import Detail from './Pages/User/Detail';
import Messenger from './Pages/User/Messenger';
import Listing from './Pages/User/Listing';
import Forgotpwd from './Pages/User/Forgotpwd';
import ChangePwd from './Pages/User/ChangePwd';
import Subscribe from './Pages/User/Subscribe';
import SubscribedRoute from './utils/SubscribedRoute';
import Write from './Pages/Blog/Write';
import Blogs from './Pages/Blog/Blogs';
import SingleBlog from './Pages/Blog/SingleBlog';
import Blogmng from './Pages/Admin/Blogmng';
import CreateBlog from './Pages/Admin/CreateBlog';
import CreateBanner from './Pages/Admin/CreateBanner';
import AdminSingleBlog from './Pages/Admin/AdminSingleBlog';
import Favorites from './Pages/User/Favorites';
import RoomPage from './Pages/User/RoomPage';
import Bannermng from './Pages/Admin/Bannermng';
import EditBanner from './Pages/Admin/EditBanner';
import { useEffect } from 'react';
import axiosInstance from './axios/axiosInstance';
import Bookings from './Pages/Seller/Bookings.jsx';
import VcProtect from './utils/VcProtect.jsx';


const Container = styled.div`
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: 'Roboto', sans-serif;
  font-weight:500;
`;


function App() {
  // const dispatch = useDispatch()

  // const getData = async () => {
  //   console.log("calling getdata");

  //   await axiosInstance.get(`/getdetails`)
  //     .then((response) => {
  //       console.log(response.data)
  //       dispatch(updateUser(response.data));
        
  //     })
  //     .catch(async(err) => {
  //       console.log(err)
      
  //     })
  // }

  // useEffect(()=>{
  //   getData()
  // },[])

  return (
    <Container >
      <BrowserRouter>
    
      <Routes>

         
          <Route element={<AdminProtectedRoute />}>
            <Route path='/admin/dashboard' element={<Dashboard/>}/>
            <Route path='/admin/usermng' element={<Usermng/>}/>
            <Route path='/admin/propmng' element={<Propmng/>}/>
            <Route path='/admin/blogmng' element={<Blogmng/>}/>
            <Route path='/admin/bannermng' element={<Bannermng/>}/>
            <Route path='/admin/createuser' element={<CreateUser/>}/>
            <Route path='/admin/createbanner' element={<CreateBanner/>}/>
            <Route path='/admin/createblog' element={<CreateBlog/>}/>
            <Route path='/admin/blog/:id' element={<AdminSingleBlog/>}/>
            <Route path='/admin/edituser/:id' element={<EditUser/>}/>
            <Route path='/admin/editbanner/:id' element={<EditBanner/>}/>
            <Route path='/admin/createproperty' element={<CreateProp/>}/>
            <Route path='/admin/editproperty/:id' element={<EditProp/>}/>
          </Route>
         

        <Route path='/' element={ <Home /> }/>
        <Route path='/post-detail/:id' element={<Detail/>}/>
        <Route path='/list' element={<Listing/>}/>

        <Route element={<UserProtectedRoute />}>
          <Route path='/profile' element={ <Profile/>}/>
          <Route path='/messenger' element={<Messenger/>}/>
          <Route path='/favorites' element={<Favorites/>}/>
          <Route path='/room/:roomId' element={<RoomPage/>}/>
          {/* <Route path='/room/:roomId' element={<VcProtect/>}/> */}
          <Route path='/subscribe' element={<Subscribe/>}/>
        </Route>

        <Route element={<SubscribedRoute/>}>
          <Route path='/userprops' element={<UserProps/>}/>
          <Route path='/postproperty' element={<PostProp/>}/>
          <Route path='/updateproperty/:id' element={<UpdateProp/>}/>
          <Route path='/bookings' element={<Bookings/>}/>
        </Route>

        
        <Route element={<AuthRoute />}>
          <Route path='register' element={<Register/>} />
          <Route path='login' element={<Login/>} />
          <Route path='forgotpwd' element={<Forgotpwd/>} />
          <Route path='changepwd' element={<ChangePwd/>} />
          
        </Route>

        <Route path='write' element={<Write/>}/>
        <Route path='blogs' element={<Blogs/>}/>
        <Route path='blog/:id' element={<SingleBlog/>}/>

        <Route path='*' element={<Notfound/>}/>

      </Routes>

      </BrowserRouter>
    </Container>
  );
}

export default App;