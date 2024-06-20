/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Flex, Avatar, Text, Box, Image, Divider, Button } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
const ProfilePage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex direction="column" p={4}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Flex alignItems="center" gap={3}>
            <Avatar src="/vite.svg" size="md" />
            <Text fontWeight="bold">User Name</Text>
          </Flex>
          <Flex alignItems="center" gap={4}>
            <Text fontSize="md" color="gray.500">
              2d
            </Text>
            <BsThreeDots />
          </Flex>
        </Flex>

        <Box position="relative" borderRadius={6} overflow="hidden" border="1px solid gray" mb={3}>
          <Image src="/vite.svg" w="full" />
        </Box>
        <Text>This is my first Post</Text>
        <Flex gap={3} alignItems={"center"}>
          <Actions liked={liked} setLiked={setLiked}/>
        </Flex>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>200 replies</Text>
          <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
          <Text color={"gray.light"} >{289+(liked === true? 1: 0)} likes</Text>
        </Flex>
      </Flex>
      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"} >
          <Text fontSize={"2xl"}>👍</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />
      <Comment
        comment="this is Good"
        createdAt="3d"
        likes={23}
        username="james_267"
        userAvatar='/vite.svg'
      />
      <Comment
        comment="tfjosdjo"
        createdAt="1d"
        likes={769}
        username="kdfsl_823"
        userAvatar='/vite.svg'
      />
      <Comment
        comment="Ohh nastyy! one"
        createdAt="3 hours ago"
        likes={45}
        username="james_267"
        userAvatar='/vite.svg'
      />
    </>
  );
};

export default ProfilePage;
