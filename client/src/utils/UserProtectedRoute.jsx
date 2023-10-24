import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet} from 'react-router-dom';

const UserProtectedRoute = () => {
  const user = useSelector((state)=> state.user.user)
  console.log(user)
  return (

    user?.role === "user"
    ? <Outlet/> 
    : <Navigate to='login'  replace/>
   
  )
}

export default UserProtectedRoute