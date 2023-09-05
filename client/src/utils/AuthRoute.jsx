import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthRoute = () => {
  // const location = useLocation();
  const user = useSelector((state) => state.user.user)

  return (
    user?.role === "admin"
      ? <Navigate to="/admin/dashboard"  replace />
      : (
        user?.role === "user"
          ? <Navigate to="/"  replace />
          : <Outlet />
      )
  )
}

export default AuthRoute