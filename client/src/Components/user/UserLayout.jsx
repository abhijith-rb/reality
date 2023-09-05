import React, { useState } from 'react'
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import UserSidebar from './UserSidebar';

const Layout = styled.div`
    

`;

const UserLayout = ({children}) => {
  const [sidebar,setSidebar] = useState(false)
  return (
    <Layout>
        <Header setSidebar={setSidebar}/>
        {sidebar && <UserSidebar setSidebar={setSidebar}/>}
        <Content children={children}/>
        <Footer/>
    </Layout>
  )
}

export default UserLayout