/* eslint-disable no-unused-vars */
import { Button, Flex, Text } from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
const HomePage = () => {
  const user = useRecoilValue(userAtom);
  return (
    <>
      <Link to={`/${user.user.username}`}>
        <Flex w={"full"} justifyContent={"center"}>
            <Button mx={"auto"} >Visit profile page</Button>
        </Flex>
      </Link>
      <Link to={"/feed"}>
      <Flex w={"full"} padding={3} justifyContent={"center"}>
          <Button mx={"auto"} >Home page</Button>
      </Flex>
      </Link>
    </>
  )
}

export default HomePage
