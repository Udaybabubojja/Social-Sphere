// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Flex, Avatar, Box, Text, Image } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';

const UserPost = ({likes, replies, postImg, postTitle}) => {
    const [liked, setLiked] = useState(false);

    // Example user_id and pid (these would normally be passed as props or derived from state/context)
    const userId = "user123";
    const postId = "post456";

    return (
        <Flex gap={3} mb={4} py={5} p={4} mt={2}>
            <Flex flexDirection={'column'} alignItems={"center"}>
                <Avatar size={"md"} name="Uday Babu" src='/vite.svg' />
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
                <Link as={RouterLink} to={`/${userId}/${postId}`} cursor={"pointer"}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"small"} fontWeight={"bold"}>name of the account you follow</Text>
                            <Image src='/vite.svg' w={4} h={4} ml={1} />
                    </Flex>
                </Link>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
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
                        {likes +(liked ?1:0)}likes
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default UserPost;
