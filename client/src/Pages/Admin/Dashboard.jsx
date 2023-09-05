import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import AdminHeader from '../../Components/admin/AdminHeader';
import styled from 'styled-components';
import Sidebar from '../../Components/admin/Sidebar';
import AdminLayout from '../../Components/admin/AdminLayout';

const MainBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  text-align: center;
`;

const Dashboard = () => {

  return (
    <AdminLayout>
    <MainBox>
        <Title>Dashboard</Title>
    </MainBox>

    </AdminLayout>
  )
}

export default Dashboard