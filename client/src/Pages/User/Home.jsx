import React from 'react'
import Posts from '../../Components/posts/Posts';
import UserLayout from '../../Components/user/UserLayout';

const Home = () => {

  return (
    <UserLayout>
         <Posts title="Recommended Properties"/>
         <Posts title="Trending Properties"/>
         <Posts title="Properties in High Demand"/>
    </UserLayout>

  )
}

export default Home