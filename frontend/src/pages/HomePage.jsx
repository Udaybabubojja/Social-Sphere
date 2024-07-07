/* eslint-disable no-unused-vars */
import React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { FaUser, FaCompass } from 'react-icons/fa';
import userAtom from '../atoms/userAtom';
import Header from '../components/Header'; // Import Header

const HomePage = () => {
  const user = useRecoilValue(userAtom);
  console.log(user);

  return (
    <>
      {/* Add Header component */}
      <Link to={`/${user.user.username}`}>
        <Flex w={"full"} justifyContent={"center"} alignItems={"center"} mt={4}>
          <Button leftIcon={<FaUser />} mx={"auto"}>Visit Profile Page</Button>
        </Flex>
      </Link>
      <Link to={"/feed"}>
        <Flex w={"full"} padding={3} justifyContent={"center"} alignItems={"center"} mt={4}>
          <Button leftIcon={<FaCompass />} mx={"auto"}>Feed (Home) Page</Button>
        </Flex>
      </Link>
    </>
  );
}

export default HomePage;
