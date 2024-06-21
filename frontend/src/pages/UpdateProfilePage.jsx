'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from '../hooks/useShowToast';

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.user.name || '',
    username: user.user.username || '',
    email: user.user.email || '',
    password: '',
    bio: user.user.bio || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const showToast = useShowToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/update/${user.user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl })
      });
      const data = await res.json();
      if (data.message) {
        showToast("Error", data.message, "error");
        return;
      }
      setUser(data);
      showToast("Update", "Profile updated successfully", "success");
      localStorage.setItem("user-threads", JSON.stringify(data));
    } catch (error) {
      showToast("Error", error.message, 'error');
    }
  };

  const fileRef = useRef(null);
  const { handleImageChange, imgUrl } = usePreviewImg();

  return (
    <form onSubmit={handleSubmit}>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
        my={4}
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <FormLabel>User Icon</FormLabel>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" src={user.user.profilePic} />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>Change Profile</Button>
                <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
              </Center>
            </Stack>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName"
              name="username"
              value={inputs.username}
              onChange={handleChange}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="Full name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              _placeholder={{ color: 'gray.500' }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="write anything about You!!"
              name="bio"
              value={inputs.bio}
              onChange={handleChange}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl >
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              _placeholder={{ color: 'gray.500' }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}
              onClick={() => console.log("Cancel button clicked")}
            >
              Cancel
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500',
              }}
              type="submit"
            >
              Update Profile
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
