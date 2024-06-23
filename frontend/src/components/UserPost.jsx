// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Flex, Avatar, Box, Text, Image } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';
import { formatDistanceToNow } from 'date-fns';
const UserPost = ({ likes, replies, postImg, postTitle, postedBy, createdAt }) => {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Example user_id and pid (these would normally be passed as props or derived from state/context)
  const userId = postedBy;
  const postId = "post456"; // Ideally, this should also be passed as a prop

  useEffect(() => {
    const fetchUserDetails = async () => {
    setLoadingUser(true)
      try {
        const res = await fetch(`/api/users/${userId}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
            }
        });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserDetails();
  }, [userId]);
  const daysSincePosted = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  return (
    <Flex gap={3} mb={4} py={5} p={4} mt={2}>
      <Flex flexDirection={'column'} alignItems={"center"}>
        <Avatar size={"md"} name={user ? user.username : "Loading..."} src={user ? user.profilePic : ''} />
        <Box w={"1px"} h={"full"} bg="gray.light" my={2}></Box>
        <Box position={"relative"} w={"full"} display={"flex"} justifyContent={"center"} mt={2}>
          <Avatar
            name='Ramarao'
            size={"xs"}
            src='/vite.svg'
            position={"relative"}
            ml={1}
            zIndex={3}
            border="2px solid white"
          />
          <Avatar
            name='NTR'
            size={"xs"}
            src='/vite.svg'
            position={"relative"}
            ml={-2}
            zIndex={2}
            border="2px solid white"
          />
          <Avatar
            name='RaJini'
            size={"xs"}
            src='/vite.svg'
            position={"relative"}
            ml={-2}
            zIndex={1}
            border="2px solid white"
          />
        </Box>
      </Flex>
      <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex justifyContent={"space-between"} w={"full"}>
          {user && (<Link as={RouterLink} to={`/${user.username}`} cursor={"pointer"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"small"} fontWeight={"bold"}>{user ? user.username : "Loading..."}</Text>
            </Flex>
          </Link>)}
          <Flex gap={4} alignItems={"center"}>
            <Text fontStyle={"sm"} color={"gray.light"}>{daysSincePosted}</Text>
            <BsThreeDots />
          </Flex>
        </Flex>
        {
          postImg &&
          (
            <Box
              position={"relative"}
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid gray"}
            >
              <Link as={RouterLink} to={`/${userId}/${postId}`}>
                <Image src={postImg} w={"full"} />
              </Link>
            </Box>
          )
        }

        <Text fontSize={"sm"}>{postTitle}</Text>
        <Flex gap={3} my={1}>
          <Actions liked={liked} setLiked={setLiked} />
        </Flex>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"} fontSize='sm'>
            {replies} replies
          </Text>
          <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
          <Text color={"gray.light"} fontSize='sm'>
            {likes + (liked ? 1 : 0)} likes
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserPost;
