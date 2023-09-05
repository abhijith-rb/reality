import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';


const AdminProtectedRoute = () => {
  // const location = useLocation();
  const user = useSelector((state)=> state.user.user)
  
  return (
    user?.role === "admin" ? <Outlet/> : <Navigate to='/login' replace/>
  )
}

export default AdminProtectedRoute