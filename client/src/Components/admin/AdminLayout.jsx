import React, { useState } from 'react';
import { styled } from 'styled-components';
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
import AdminContent from './AdminContent';


const AdminLayout = ({children}) => {
  const [showSBar, setShowSBar] = useState(false)
  return (
    <>
        <AdminHeader setShowSBar={setShowSBar}/>
        {showSBar && <Sidebar setShowSBar={setShowSBar}/>}
        <AdminContent children ={children} />
    </>
  )
}

export default AdminLayout