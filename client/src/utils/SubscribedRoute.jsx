import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const SubscribedRoute = () => {
    const user = useSelector((state)=> state.user.user)

    return user?.role === "user" ? (
        user.subscribed ? (
          <Outlet />
        ) : (
          <Navigate to="/subscribe" replace />
        )
      ) : (
        <Navigate to="login" replace />
      );
}

export default SubscribedRoute