/* eslint-disable no-unused-vars */
import React from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'

const UserPage = () => {
  return (
    <div>
      <UserHeader/>
      <UserPost likes={1200} replies={481} postImg="/vite.svg" postTitle="Let's Talk!" />
      <UserPost likes={17890} replies={78} postImg="/vite.svg" postTitle="i don't no what to talk!" />
      <UserPost likes={1990} replies={48} postImg="/vite.svg" postTitle="Anything is there to say??" />
      <UserPost likes={15434} replies={701} postTitle="Let's Talk!" />
    </div>
  )
}

export default UserPage
